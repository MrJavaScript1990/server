//express framework and router
const express = require('express');
const router = express.Router();

//library to generate Gravatar URLs
const gravatar = require('gravatar');

//library to Encrypt the passwords
const bcrypt = require('bcryptjs');

//library to work with JSON Web Tokens
const jwt = require('jsonwebtoken');

//Main Library for Auth
const passport = require('passport');

//library to create unic ID's
const uuidv4 = require('uuid/v4');

//helper functions to validate data
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

const User = require('../models/User');

router.post('/register', function (req, res) {

    /*
        this function checks if the email is not already in the database and
        create new hashcode based on password that user provided and add it to the database
        after that it returns the user object to the client
    */
    const email = req.body.email.trim().toLowerCase();

    /*
        Check if the data from client is valid
    */
    const {errors, isValid} = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({
        email: email
    }).then(user => {
        if (user) {
            return res.status(400).json({
                email: 'Email already exists'
            });
        }
        else {
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            const newUser = new User({
                uid:uuidv4(),
                name: req.body.name,
                email: email,
                password: req.body.password,
                avatar,
                ethereumWalletId:req.body.ethereumWalletId,
                bitcoinWalletId:req.body.bitcoinWalletId,
                bitcoinBalance:req.body.bitcoinBalance,
                ethereumBalance:req.body.ethereumBalance,
                maxTransferLimit:req.body.maxTransferLimit,
                description:req.body.description,
            });

            bcrypt.genSalt(10, (err, salt) => {
                if (err) console.error('There was an error', err);
                else {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) console.error('There was an error', err);
                        else {
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    res.json(user)
                                });
                        }
                    });
                }
            });
        }
    });
});

router.post('/login', (req, res) => {

    /*
        this function checks if the email is  in the database and
        create new JWT Token and make it valid for 3600 seconds and
        send it back to the the client
    */
    const {errors, isValid} = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            if (!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = {
                            id: user.id,
                            uid:user.uid,
                            email:user.email,
                            name: user.name,
                            avatar: user.avatar
                        }
                        jwt.sign(payload, 'secret', {
                            expiresIn: 3600
                        }, (err, token) => {
                            if (err) console.error('There is some error in token', err);
                            else {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                });
                            }
                        });
                    }
                    else {
                        errors.password = 'Incorrect Password';
                        return res.status(400).json(errors);
                    }
                });
        });
});

// router.get('/me', passport.authenticate('jwt', {session: false}), (req, res) => {
//     return res.json({
//         id: req.user.id,
//         name: req.user.name,
//         email: req.user.email
//     });
// });

module.exports = router;
