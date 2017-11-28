var express = require('express');
// tutorial: https://medium.freecodecamp.org/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52

var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require("config-yml").auth;

var VerifyToken = require('./VerifyToken');

router.post('/register', function(req, res) {

    var hash = bcrypt.hashSync(req.body.password, 8);

    User.create({
            name: req.body.name,
            email: req.body.email,
            password: hash
        },
        function(error, user) {
            if (error) return res.status(500).send("There was a problem registering the user.")
            // create a token
            var token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        });
});

router.get('/me', VerifyToken, function(req, res, next) {
    User.findById(req.userId, { password: 0 }, function(err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        res.status(200).send(user);
    });
});

router.post('/login', function(req, res) {
    User.findOne({ email: req.body.email }, function(err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
    });
});

// AuthController.js
router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
});

module.exports = router;
