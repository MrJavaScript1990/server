const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    uid:{
        type:String,
        required:true
    },
    srcUid: {
        type: String,
        required: true
    },
    dstUid: {
        type: String,
        default: '-'
    },
    srcEmail: {
        type: String,
        required: true
    },
    dstEmail: {
        type: String,
        required: true
    },
    currencyType: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    timeStampCreated: {
        type: Date,
        required: true
    },
    timeStampProcessed: {
        type: Date,
        required: true,
        default:Date.now()
    },
    errMessage: {
        type: String,
    },
    state: {
        type: String,
        required: true
    },

});

const Transaction = mongoose.model('transactions', TransactionSchema);

module.exports = Transaction;
