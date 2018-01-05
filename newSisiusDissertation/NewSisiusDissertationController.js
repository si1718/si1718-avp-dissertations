var express = require("express");
var router = express.Router();
var helmet = require("helmet");
var bodyParser = require("body-parser");
var utils = require("./../utils.js");

router.use(bodyParser.json()); //configura dentro de express el middleware bodyparser json
router.use(helmet()); //improve security

var NewSisiusDissertation = require("./NewSisiusDissertation");

// RETRIEVE a list of new dissertations added to sisius
router.get('/', function(req, res) {
    var query = {};
    var offset = req.query.offset;
    var limit = req.query.limit

    if (offset || limit) {
        if (!offset)
            offset = 0;
        if (!limit)
            limit = 10;
        NewSisiusDissertation.paginate(query, { offset: parseInt(offset), limit: parseInt(limit) }, (err, elements) => {
            if (err) {
                console.error('WARNING: Error getting data from DB => ' + err);
                res.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: New GET request to /dissertations/newSisiusDissertations .");
                res.send(elements.docs);
            }
        });
    }
    else {
        NewSisiusDissertation.find(query, (err, elements) => {
            if (err) {
                console.error('WARNING: Error getting data from DB => ' + err);
                res.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: New GET request to /dissertations/newSisiusDissertations .");
                res.send(elements);
            }
        });
    }
});

// RETRIEVE stats
router.get('/stats', function(req, res) {
    var query = {};
    if (req.query.search)
        query.$text = { $search: req.query.search };

    NewSisiusDissertation.count(query, (err, result) => {
        if (err) {
            console.error('WARNING: Error getting count from DB => ' + err);
            res.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: New GET request to /dissertations/stats . Total: " + result);
            res.status(200).send({ total: result });
        }
    });
});

// RETRIEVE a specific dissertation
router.get('/:idDissertation', function(req, res) {
    var idDissertation = req.params.idDissertation;
    if (!idDissertation) {
        console.log("WARNING: New GET request to /dissertations/:idDissertation without idDissertation, sending 400...");
        res.sendStatus(400);
    }
    else {
        console.log("INFO: New GET request to /dissertations/" + idDissertation);
        NewSisiusDissertation.findOne({ "idDissertation": idDissertation }, (err, element) => {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                res.sendStatus(500);
            }
            else {
                if (element) {
                    console.log("INFO: Sending dissertation: " + JSON.stringify(element, 2, null));
                    res.send(element);
                }
                else {
                    console.log("WARNING: There is not any dissertation with idDissertation " + idDissertation);
                    res.sendStatus(404);
                }
            }
        });
    }
});


// DELETE a specific dissertation
router.delete('/:idDissertation', function(req, res) {
    var idDissertation = req.params.idDissertation;
    if (!idDissertation) {
        console.log("WARNING: New DELETE request to /dissertations/:idDissertation without idDissertation, sending 400...");
        res.sendStatus(400);
    }
    else {
        console.log("INFO: New DELETE request to /dissertations/" + idDissertation);
        NewSisiusDissertation.deleteOne({ idDissertation: idDissertation }, (err, output) => {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                res.sendStatus(500); // internal server error
            }
            else {
                if (output.result.n > 0) {
                    console.log("INFO: The dissertation with idDissertation " + idDissertation + " has been succesfully deleted, sending 204...");
                    res.sendStatus(204); // no content
                }
                else {
                    console.log("WARNING: There are no dissertations to delete");
                    res.sendStatus(404)
                }
            }
        });
    }
});


module.exports = router;