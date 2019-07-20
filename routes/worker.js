/*
 The Worker module
 i used kue to create a list of jobs that uses the FCFS algorithm
 kue works with redis so you should have redis installed in order to test
*/

// main Queue library
const kue = require('kue');

//data models
const User = require('../models/User');
const Transaction = require('../models/Transaction');

//unic uid for transactions
const uuidv4=require('uuid/v4');


let queue = kue.createQueue({
    //redis server address
    redis: {
        host: '127.0.0.1',
        port: 6379
    }
});

/*
 This function will create a job and assign it to the Queue
 on the process if job finishes with out error it just returns the transaction details but
 if job finishes with error it will returns the transaction details and error message
*/
let newJob=function (data,callback) {
    let job = queue.create('new_job',data);
    job.on('complete', (err) => {
        if ((err.errText===''))  //transaction finished with no errors
        {
            err.transactionDetails.state='Completed';
            const newTransaction=new Transaction(err.transactionDetails);
            newTransaction.save().then(callback(err))

        }
        else{                   //transaction finished with errors
            err.transactionDetails.state='Failed';
            err.transactionDetails.errMessage=err.errText;
            const newTransaction=new Transaction(err.transactionDetails);
            newTransaction.save().then(callback(err))
        }

    });
    job.save();
}

queue.process('new_job', function (job, done) {
    /*
        the body of every single job
        it consist of some conditionals about the job like
        is Sender a valid user?
        is Receiver exist?
        sender has Bitcoins to send?
        etc...
        if any of conditions is false the job will ended with an error on the
        contrary it will does the transaction inside the DB and returns the reference
    */
    const {res,srcUser,dstUser,currencyType,amount,timeStampCreated}=job.data;
    let transactionDetails={
         uid:uuidv4()
        ,timeStampCreated
        ,srcUid:''
        ,srcEmail:srcUser
        ,dstUid:''
        ,dstEmail:dstUser
        ,amount
        ,currencyType
        ,state:'just started'
    };
    let srcUid='';
    let dstUid='';
    let srcMaxTransferLimit='';
    let srcUserBalance='';
    let dstUserBalance='';
    let Amount=parseFloat(amount);
    User.findOne({
        email: srcUser
    }).then(user => {
        if (user) {
            srcUid = user.uid;
            transactionDetails.srcUid=srcUid;
            srcMaxTransferLimit=parseFloat(user.maxTransferLimit);
            if (currencyType==='B') srcUserBalance=parseFloat(user.bitcoinBalance);
            if (currencyType==='E') srcUserBalance=parseFloat(user.ethereumBalance);
            if (srcUserBalance-Amount<0){
                done(null,{errText:'You dont have that much Crypto currency!',transactionDetails});
            }else{
                if (Amount>srcMaxTransferLimit){
                    done(null,{errText:`You cannot transfer more than ${srcMaxTransferLimit} in one transaction`,transactionDetails});
                }
                else {
                    User.findOne({
                        email: dstUser
                    }).then(user => {
                        if (user) {
                            dstUid = user.uid;
                            transactionDetails.dstUid=dstUid;
                            if (currencyType==='B') dstUserBalance=parseFloat(user.bitcoinBalance);
                            if (currencyType==='E') dstUserBalance=parseFloat(user.ethereumBalance);
                            if (dstUserBalance+Amount>1){
                                done(null,{errText:'The other user cannot accept this transaction (his balance will be more than 1)',transactionDetails});
                            }else{
                                if (currencyType==='B') {
                                    User.updateOne({uid: srcUid}, {bitcoinBalance: srcUserBalance-Amount})
                                        .then(()=>{
                                            User.updateOne({uid: dstUid}, {bitcoinBalance: dstUserBalance+Amount})
                                                .then(()=>done(null,{errText:'',transactionDetails}));
                                        });

                                }
                                if (currencyType==='E') {
                                    User.updateOne({uid: srcUid}, {ethereumBalance: srcUserBalance-Amount})
                                        .then(()=>{
                                            User.updateOne({uid: dstUid}, {ethereumBalance: dstUserBalance+Amount})
                                                .then(()=>done(null,{errText:'',transactionDetails}));
                                        });
                                }

                            }
                        }
                        else {
                            done(null,{errText:'We can not find the Receiver details in database!',transactionDetails});
                        }
                    });

                }
            }
        }
        else {
            done(null,{errText:'We can not find the Sender details in database!'},transactionDetails);
        }
    });

});

module.exports = newJob;

