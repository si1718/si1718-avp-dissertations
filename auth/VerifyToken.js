var jwt = require('jsonwebtoken');
var config = require("config-yml").auth;

function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err)
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });
}

function checkAccessToken(req, res, next) {
    var request = require("request");
    var token = req.query.token;

    var options = {
        method: 'GET',
        url: 'https://si1718-avp-dissertations.eu.auth0.com/',
        headers: {
            authorization: 'Bearer ' + token,
            'content-type': 'application/json'
        }
    };

    request(options, function(error, response, body) {

        if (body == "Unauthorized") {
            return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        else {
            next();
        }

        console.log(body);
    });
}

module.exports = checkAccessToken;
