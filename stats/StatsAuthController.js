var express = require("express");
var router = express.Router();
var helmet = require("helmet");
var bodyParser = require("body-parser");
//var utils = require("./../utils.js");

var checkJwt = require("./../auth/auth0.js").checkJwt;
var expressJwtErrorHandling = require("./../auth/auth0.js").expressJwtErrorHandling;

router.use(bodyParser.json()); //configura dentro de express el middleware bodyparser json
router.use(helmet()); //improve security

var DissertationsPerYear = require("./DissertationsPerYear");
var DissertationsPerTutor = require("./DissertationsPerTutor");
var MostFrequentKeywords = require("./MostFrequentKeywords");
var TwitterKeywords = require("./TwitterKeywords");
var DissertationsPerGroup = require("./DissertationsPerGroup");
var MostFrequentKeywordsElsevier = require("./MostFrequentKeywordsElsevier");

// RETRIEVE all dissertationsPerYear stats
router.get('/dissertationsPerYear', checkJwt, function(req, res) {
    DissertationsPerYear.find({}, (err, elements) => {
        if (err) {
            console.error('WARNING: Error getting data from DB => ' + err);
            res.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: New GET request to /dissertationsPerYear");
            res.send(elements);
        }
    });
});

// RETRIEVE all dissertationsPerTutor stats
router.get('/dissertationsPerTutor', checkJwt, function(req, res) {
    DissertationsPerTutor.find({}, (err, elements) => {
        if (err) {
            console.error('WARNING: Error getting data from DB => ' + err);
            res.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: New GET request to /dissertationsPerTutor");
            res.send(elements);
        }
    });
});

// RETRIEVE all mostFrequentKeywords stats
router.get('/mostFrequentKeywords', checkJwt, function(req, res) {
    MostFrequentKeywords.find({}, (err, elements) => {
        if (err) {
            console.error('WARNING: Error getting data from DB => ' + err);
            res.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: New GET request to /mostFrequentKeywords");
            res.send(elements);
        }
    });
});

// RETRIEVE all twitterKeywords stats
router.get('/twitterKeywords', checkJwt, function(req, res) {
    TwitterKeywords.find({}, (err, elements) => {
        if (err) {
            console.error('WARNING: Error getting data from DB => ' + err);
            res.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: New GET request to /twitterKeywords");
            res.send(elements);
        }
    });
});

// RETRIEVE all dissertationsPerGroup stats
router.get('/dissertationsPerGroup', checkJwt, function(req, res) {
    DissertationsPerGroup.find({group: {$ne: 'no-group'}}, null,{sort: {count: -1}, limit: 20 }, (err, elements) => {
        if (err) {
            console.error('WARNING: Error getting data from DB => ' + err);
            res.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: New GET request to /dissertationsPerGroup");
            res.send(elements);
        }
    });
});

// RETRIEVE all mostFrequentKeywordsElsevier stats
router.get('/mostFrequentKeywordsElsevier', checkJwt, function(req, res) {
    MostFrequentKeywordsElsevier.find({}, null,{sort: {count: -1}, limit: 20 }, (err, elements) => {
        if (err) {
            console.error('WARNING: Error getting data from DB => ' + err);
            res.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: New GET request to /mostFrequentKeywordsElsevier");
            res.send(elements);
        }
    });
});

router.use(expressJwtErrorHandling);

module.exports = router;