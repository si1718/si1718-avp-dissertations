var express = require("express");
var router = express.Router();
var helmet = require("helmet");
var bodyParser = require("body-parser");
var utils = require("./../utils.js");
var checkJwt = require("./../auth/auth0.js").checkJwt;
var expressJwtErrorHandling = require("./../auth/auth0.js").expressJwtErrorHandling;

router.use(bodyParser.json()); //configura dentro de express el middleware bodyparser json
router.use(helmet()); //improve security

var Dissertation = require("./Dissertation");
var Recommendation = require("./Recommendation");

// RETRIEVE all dissertations
router.get('/', checkJwt, function(req, res) {
    var query = {};
    var offset = req.query.offset;
    var limit = req.query.limit

    if (req.query.search)
        query.$text = { $search: req.query.search };

    if (offset || limit) {
        if (!offset)
            offset = 0;
        if (!limit)
            limit = 10;
        Dissertation.paginate(query, { offset: parseInt(offset), limit: parseInt(limit) }, (err, elements) => {
            if (err) {
                console.error('WARNING: Error getting data from DB => ' + err);
                res.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: New GET request to /dissertations . Query: " + JSON.stringify(query));
                res.send(elements.docs);
            }
        });
    }
    else {
        Dissertation.find(query, (err, elements) => {
            if (err) {
                console.error('WARNING: Error getting data from DB => ' + err);
                res.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: New GET request to /dissertations . Query: " + JSON.stringify(query));
                res.send(elements);
            }
        });
    }
});

// RETRIEVE stats
router.get('/stats', checkJwt, function(req, res) {
    var query = {};
    if (req.query.search)
        query.$text = { $search: req.query.search };

    Dissertation.count(query, (err, result) => {
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
router.get('/:idDissertation', checkJwt, function(req, res) {
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
router.post('/', checkJwt, function(req, res) {
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
            if (utils.isUrl(req.body.author))
                var idDissertation = utils.generateDissertationId(req.body.authorName, req.body.year);
            else
                var idDissertation = utils.generateDissertationId(req.body.author, req.body.year);
            Dissertation.create({
                tutors: thisDissertation.tutors,
                author: thisDissertation.author,
                authorName: thisDissertation.authorName,
                authorViewURL: thisDissertation.authorViewURL,
                title: thisDissertation.title,
                year: thisDissertation.year,
                idDissertation: idDissertation,
                keywords: thisDissertation.keywords,
                viewURL: "https://si1718-avp-dissertations.herokuapp.com/#!/dissertations/" + idDissertation + "/edit",
                summary: thisDissertation.summary
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
router.put('/:idDissertation', checkJwt, function(req, res) {
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
router.delete('/', checkJwt, function(req, res) {
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
router.delete('/:idDissertation', checkJwt, function(req, res) {
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

// Other endpoints regarding other functional requirements on dissertations

// RETRIEVE a list of recommendations given an idDissertation
router.get("/recommendations/:idDissertation", checkJwt, function(req, res) {
    var idDissertation = req.params.idDissertation;
    if (!idDissertation) {
        console.log("WARNING: New GET request to /dissertations/recommendations/:idDissertation without idDissertation, sending 400...");
        res.sendStatus(400);
    }
    else {
        Recommendation.findOne({ 'idDissertation': idDissertation }, (err, element) => {
            if (err) {
                console.error('WARNING: Error getting data from DB => ' + err);
                res.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: New GET request to /dissertations/recommendations");
                if (element) {
                    res.send(element.recommendations);
                }
                else {
                    res.send([]); // There're not recommendations
                }
            }
        });
    }
});

router.use(expressJwtErrorHandling);

module.exports = router;
