var express = require("express");
var router = express.Router();
var helmet = require("helmet");
var bodyParser = require("body-parser");
//var utils = require("./../utils.js");

router.use(bodyParser.json()); //configura dentro de express el middleware bodyparser json
router.use(helmet()); //improve security

var DissertationsPerYear = require("./DissertationsPerYear");
var DissertationsPerTutor = require("./DissertationsPerTutor");
var MostFrequentKeywords = require("./MostFrequentKeywords");
var TwitterKeywords = require("./TwitterKeywords");

// RETRIEVE all dissertationsPerYear stats
router.get('/dissertationsPerYear', function(req, res) {
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
router.get('/dissertationsPerTutor', function(req, res) {
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
router.get('/mostFrequentKeywords', function(req, res) {
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
router.get('/twitterKeywords', function(req, res) {
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

module.exports = router;
