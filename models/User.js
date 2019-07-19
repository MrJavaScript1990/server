const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    uid:{
        type:String,
        required:true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    bitcoinWalletId: {
        type: String,
        required: true
    },
    bitcoinBalance: {
        type: Number,
        required: true
    },
    ethereumWalletId: {
        type: String,
        required: true
    },
    ethereumBalance: {
        type: Number,
        required: true
    },
    description: {
        type: String,
    },
    maxTransferLimit: {
        type: String,
        required: true
    },

});

const User = mongoose.model('users', UserSchema);

module.exports = User;
