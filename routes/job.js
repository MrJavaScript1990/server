/*
        end point to get the jobs from user
        and send them back the result

        endpoint to give the authenticated users all the transactions
*/
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const newJob = require('./worker');
const validateTransferInput = require('../validation/transfer'); // transaction validator
const Transaction = require('../models/Transaction');   // transaction schema

router.post('/addjob', function (req, res) {
    /*
        this function checks if the new transaction is valid before send it to worker
    */
    const {errors, isValid} = validateTransferInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    let srcUser = req.body.srcUser.trim().toLowerCase();
    let dstUser = req.body.dstUser.trim().toLowerCase();
    let amount = req.body.amount;
    let currencyType = req.body.currencyType;
    let timeStampCreated = Date.now();
    newJob({        //send the job to worker
            srcUser,
            dstUser,
            amount,
            currencyType,
            timeStampCreated,
        }, (err) => {
            if ((err.errText === '')) {
                res.status(200).json({refNumber: err.transactionDetails.uid}); //job completed successfully
            }
            else {

                res.status(400).json({errText: err.errText, refNumber: err.transactionDetails.uid}); //job failed
            }
        }
    );

});
router.post('/transactions', function (req, res) {

    /*
    this function checks if the user is in DB and then give back all the transactions
    */
    let srcEmail = req.body.srcEmail.trim().toLowerCase();
    User.findOne({
        email: srcEmail,
        uid: req.body.Uid,
    }).then(user => {
        if (user) {
            Transaction.find({})
                .then(data => {
                    res.status(200).json(data);
                });
        } else {
            res.status(400).json({errText: 'Wrong request pattern!'});
        }

    }).catch(err => {
        res.status(400).json({errText: 'Wrong request pattern!'});
    })

});

module.exports = router;
