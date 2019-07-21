
/*
    A series of validation based on type and length
 */
const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateRegisterInput(data) {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password_confirm = !isEmpty(data.password_confirm) ? data.password_confirm : '';

    if(!Validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = 'Name must be between 2 to 30 chars';
    }
    if(!Validator.isLength(data.description, { min: 0, max: 1024 })) {
        errors.name = 'Description must be less than 1024 characters';
    }


    if(Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }

    if(!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if(Validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    }
    if(!Validator.isLength(data.email, {min: 1, max: 100})) {
        errors.email = 'Email is invalid';
    }
    if(!Validator.isLength(data.password, {min: 6, max: 100})) {
        errors.password = 'Password must have 6 to 100 chars';
    }

    if(Validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }

    if(!Validator.isLength(data.password_confirm, {min: 6, max: 100})) {
        errors.password_confirm = 'Password must have 6 to 100 chars';
    }

    if(!Validator.equals(data.password, data.password_confirm)) {
        errors.password_confirm = 'Password and Confirm Password must match';
    }

    if(Validator.isEmpty(data.password_confirm)) {
        errors.password_confirm = 'Password is required';
    }
    if(!Validator.isLength(data.bitcoinWalletId, { min: 26, max: 35 })) {
        errors.bitcoinWalletId = 'Bitcoin Wallet ID is between 26 and 32 chars';
    }
    if(Validator.isEmpty(data.bitcoinWalletId)) {
        errors.bitcoinWalletId = 'Bitcoin Wallet field is required';
    }
    if(!Validator.isLength(data.ethereumWalletId, { min: 42, max: 42 })) {
        errors.ethereumWalletId = 'Ethereum Wallet ID is 42 chars';
    }
    if(Validator.isEmpty(data.ethereumWalletId)) {
        errors.ethereumWalletId = 'Ethereum Wallet field is required';
    }
    if(!Validator.isNumeric(data.bitcoinBalance)) {
        errors.bitcoinBalance = 'Bitcoin Wallet Balance field is a number';
    }
    if(!Validator.isNumeric(data.ethereumBalance)) {
        errors.ethereumBalance = 'Ethereum Wallet Balance field is a number';
    }
    if(data.bitcoinBalance>1) {
        errors.bitcoinBalance = 'Maximum Bitcoin Wallet Balance should be less than 1';
    }
    if(data.ethereumBalance>1) {
        errors.ethereumBalance = 'Maximum Ethereum Wallet Balance should be less than 1';
    }

    if(!Validator.isNumeric(data.maxTransferLimit)) {
        errors.maxTransferLimit = 'Max Transfer Limit field is a number';
    }
    if(data.maxTransferLimit>0.5) {
        errors.maxTransferLimit = 'Max Transfer Limit should be less than 0.5';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
};
