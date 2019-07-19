const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./db');
const users = require('./routes/user');
const jobs = require('./routes/job');
const connection='mongodb://cryptoAdmin:8812016881@cluster0-shard-00-00-l9tsd.mongodb.net:27017,cluster0-shard-00-01-l9tsd.mongodb.net:27017,cluster0-shard-00-02-l9tsd.mongodb.net:27017/CryptoDB?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'

mongoose.connect(connection, { useNewUrlParser: true }).then(
    () => {console.log('MongoDB is connected') },
    err => { console.log('MongoDB error'+ err)}
);

const app = express();
app.use(passport.initialize());
require('./passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/users', users);
app.use('/api/jobs', jobs);

app.get('/', function(req, res) {
    res.send('Server Is Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
