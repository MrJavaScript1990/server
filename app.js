const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//We Use Passport for Authentication
const passport = require('passport');

//Route where api endpoints lives on server
const users = require('./routes/user');
const jobs = require('./routes/job');

//MongoDB DB ConnectionString
const connection='mongodb://cryptoAdmin:8812016881@cluster0-shard-00-00-l9tsd.mongodb.net:27017,cluster0-shard-00-01-l9tsd.mongodb.net:27017,cluster0-shard-00-02-l9tsd.mongodb.net:27017/CryptoDB?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'

mongoose.connect(connection, { useNewUrlParser: true }).then(
    () => {console.log('MongoDB is connected') },
    err => { console.log('MongoDB error'+ err)}
);

const app = express();
app.use(passport.initialize());

//rest of Authentication proccess in  another module
require('./passport')(passport);

//decode the post request to our api correctly
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//end points that client will call to them
app.use('/api/users', users);
app.use('/api/jobs', jobs);

//client can see if server running...
app.get('/', function(req, res) {
    res.send('Server Is Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
