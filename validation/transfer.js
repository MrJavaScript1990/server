
/*
    A series of validation based on type and length
 */
const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateTransferInput(data) {
    let errors = {};
    data.srcUser = !isEmpty(data.srcUser) ? data.srcUser : '';
    data.dstUser = !isEmpty(data.dstUser) ? data.dstUser : '';
    data.currencyType = !isEmpty(data.currencyType) ? data.currencyType : '';
    data.amount = !isEmpty(data.amount) ? data.amount : '';

    if(Validator.isEmpty(data.srcUser)) {
        errors.srcUser = 'Sender field is required';
    }
    if(Validator.isEmpty(data.dstUser)) {
        errors.dstUser = 'Receiver is required';
    }
    if(!Validator.isEmail(data.srcUser)) {
        errors.srcUser = 'Email is invalid';
    }
    if(!Validator.isEmail(data.dstUser)) {
        errors.dstUser = 'Email is invalid';
    }
    if(data.currencyType!=='B' && data.currencyType!=='E') {
        errors.currencyType = 'Currency type is invalid Capital "B" for Bitcoin and Capital "E" for Ethereum';
    }
    if(Validator.isEmpty(data.amount)) {
        errors.amount = 'Amount is required';
    }
    if(!Validator.isNumeric(data.amount)) {
        errors.amount = 'Amount is a number';
    }
    if(0.5<data.amount) {
        errors.amount = 'Maximum transfer amount is less than 0.5';
    }
    if (data.srcUser.trim().toLowerCase()===data.dstUser.trim().toLowerCase()){
        errors.dstUser = 'Receiver email is the same as sender';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
};
