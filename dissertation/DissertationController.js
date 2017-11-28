var express = require("express");
var router = express.Router();
var helmet = require("helmet");
var bodyParser = require("body-parser");
var utils = require("./../utils.js");

router.use(bodyParser.json()); //configura dentro de express el middleware bodyparser json
router.use(helmet()); //improve security

var Dissertation = require("./Dissertation");

// RETRIEVE all dissertations
router.get('/', function(req, res) {
    var offset = 0;
    var limit = 5;
    var query = {};
    if (req.query.offset)
        offset = parseInt(req.query.offset);
    if (req.query.limit)
        limit = parseInt(req.query.limit);
    if (req.query.search)
        query.$text = { $search: req.query.search };

    Dissertation.paginate(query, { offset: offset, limit: limit }, (err, elements) => {
        if (err) {
            console.error('WARNING: Error getting data from DB => ' + err);
            res.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: New GET request to /dissertations . Offset " + offset + ". Query: " + JSON.stringify(query));
            res.send(elements);
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
        Dissertation.findOne({ "idDissertation": idDissertation }, (err, element) => {
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


// CREATE a dissertation
router.post('/', function(req, res) {
    var thisDissertation = req.body;
    if (!thisDissertation) {
        console.log("WARNING: New POST request to /dissertations/ without dissertation, sending 400...");
        res.sendStatus(400);
    }
    else {
        console.log("INFO: New POST request to /dissertations with body: " + JSON.stringify(thisDissertation, 2, null));
        // we NEED to verify that we have author and year
        if (!thisDissertation.author || !thisDissertation.year) {
            console.log("WARNING: The dissertation " + JSON.stringify(thisDissertation, 2, null) + " is not well-formed, sending 422...");
            res.sendStatus(422); // unprocessable entity
        }
        else {
            var idDissertation = utils.generateDissertationId(req.body.author, req.body.year);
            Dissertation.create({
                tutors: thisDissertation.tutors,
                author: thisDissertation.author,
                title: thisDissertation.title,
                year: thisDissertation.year,
                idDissertation: idDissertation
            }, (err, dissertation) => {
                if (err) {
                    if (err.name == "ValidationError") {
                        console.log("WARNING: The dissertation " + JSON.stringify(thisDissertation, 2, null) + " is not well-formed, sending 422...");
                        res.sendStatus(422); // unprocessable entity
                    }
                    else if (err.name == "MongoError") {
                        console.log("WARNING: The dissertation " + JSON.stringify(thisDissertation, 2, null) + " already extis, sending 409...");
                        res.sendStatus(409); // conflict
                    }
                    else {
                        console.error('WARNING: Error inserting data in DB ' + err.name);
                        res.sendStatus(500); // internal server error
                    }
                }
                else {
                    console.log("INFO: Adding dissertation " + JSON.stringify(thisDissertation, 2, null));
                    res.sendStatus(201);
                }
            });
        }
    }
});

// UPDATE a specific dissertation
router.put('/:idDissertation', function(req, res) {
    var thisDissertation = req.body;
    var idDissertation = req.params.idDissertation;
    if (!thisDissertation) {
        console.log("WARNING: New PUT request to /dissertations/ without dissertation, sending 400...");
        res.sendStatus(400); // bad request
    }
    else {
        if (thisDissertation.idDissertation && thisDissertation.idDissertation != idDissertation) {
            res.sendStatus(400); // modifying the idDissertation is not allowed
        }
        else {
            console.log("INFO: New PUT request to /dissertations with body: " + JSON.stringify(thisDissertation, 2, null));
            Dissertation.findOneAndUpdate({ idDissertation: idDissertation }, { $set: thisDissertation }, { new: true, runValidators: true }, function(err, element) {
                if (err) {
                    console.error('WARNING: Error inserting data in DB ' + err.name);
                    if (err.name == "ValidationError") {
                        console.log("WARNING: The dissertation " + JSON.stringify(thisDissertation, 2, null) + " is not well-formed, sending 422...");
                        res.sendStatus(422); // unprocessable entity
                    }
                    else {
                        res.sendStatus(500); // internal server error    
                    }
                }
                else {
                    res.send(element);
                }

            });
        }
    }
});

// DELETE all dissertations
router.delete('/', function(req, res) {
    console.log("INFO: New DELETE request to /dissertations");
    Dissertation.remove({}, (err, output) => {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            res.sendStatus(500);
        }
        else {
            if (output.result.n > 0) {
                console.log("INFO: All the dissertations (" + output.result.n + ") have been succesfully deleted, sending 204...");
                res.sendStatus(204); // no content
            }
            else {
                console.log("WARNING: There are no dissertations to delete");
                res.sendStatus(404)
            }
        }
    });
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
        Dissertation.deleteOne({ idDissertation: idDissertation }, (err, output) => {
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

// NOT ALLOWED OPERATIONS

// POST a specific dissertaiton
router.post("/:idDissertation", function(req, res) {
    var idDissertation = req.params.idDissertation;
    console.log("WARNING: New POST request to /dissertations/" + idDissertation + ", sending 405...");
    res.sendStatus(405); // method not allowed
});

// PUT over a collection
router.put("/", function(req, res) {
    console.log("WARNING: New PUT request to /dissertations, sending 405...");
    res.sendStatus(405); // method not allowed
});


module.exports = router;
