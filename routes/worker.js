const kue = require('kue');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const uuidv4=require('uuid/v4');
let queue = kue.createQueue({
    redis: {
        host: '127.0.0.1',
        port: 6379
    }
});


let newJob=function (data,callback) {
    let job = queue.create('new_job',data);
    job.on('complete', (err) => {
        if ((err.errText===''))
        {
            err.transactionDetails.state='Completed';
            const newTransaction=new Transaction(err.transactionDetails);
            newTransaction.save().then(callback(err))

        }
        else{
            err.transactionDetails.state='Failed';
            err.transactionDetails.errMessage=err.errText;
            const newTransaction=new Transaction(err.transactionDetails);
            newTransaction.save().then(callback(err))
        }

    });
    job.save();
}

queue.process('new_job', function (job, done) {

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

