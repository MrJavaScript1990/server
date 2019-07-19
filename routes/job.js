const express = require('express');
const router = express.Router();
const User = require('../models/User');
const newJob = require('./worker');
const validateTransferInput = require('../validation/transfer');
const Transaction = require('../models/Transaction');

router.post('/addjob', function (req, res) {

    const {errors, isValid} = validateTransferInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    let srcUser = req.body.srcUser.trim().toLowerCase();
    let dstUser = req.body.dstUser.trim().toLowerCase();
    let amount = req.body.amount;
    let currencyType = req.body.currencyType;
    let timeStampCreated = Date.now();
    newJob({
            srcUser,
            dstUser,
            amount,
            currencyType,
            timeStampCreated,
        }, (err) => {
        if ((err.errText===''))
            {
                res.status(200).json({refNumber:err.transactionDetails.uid});
            }
           else{

                res.status(400).json({errText:err.errText,refNumber:err.transactionDetails.uid});
            }
        }
    );

});
router.post('/transactions', function (req, res) {


    let srcEmail = req.body.srcEmail.trim().toLowerCase();
    //console.log(req.body);
    User.findOne({
        email: srcEmail,
        uid:req.body.Uid,
    }).then(user => {
        if(user) {
            Transaction.find({})
                .then(data => {
                    res.status(200).json(data);
                });
        }else{
            res.status(400).json({errText:'Wrong request pattern!'});
        }

    }).catch(err=>{
        res.status(400).json({errText:'Wrong request pattern!'});
    })

});

module.exports = router;
