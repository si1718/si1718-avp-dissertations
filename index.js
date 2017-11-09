var express = require('express');
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');
var MongoClient = require("mongodb").MongoClient;
var utils = require("./utils.js");

var port = (process.env.PORT || 10000);

// Database initialization
var db;
var mdbURL = "mongodb://user:user@ds255455.mlab.com:55455/si1718-avp-dissertations";

MongoClient.connect(mdbURL, { native_parser: true }, function(err, database) {
    if (err) {
        console.log("CAN NOT CONNECT TO DB: " + err);
        process.exit(1);
    }

    db = database.collection("dissertations");

    app.listen(port, () => {
        console.log("Magic is happening on port " + port);
    });
});


// API stuffs
var BASE_API_PATH = "/api/v1";

var app = express();

app.use(bodyParser.json()); //configura dentro de express el middleware bodyparser json
app.use(helmet()); //improve security

// RETRIEVE all dissertations
app.get(BASE_API_PATH + '/dissertations', function(req, res) {
    db.find({}).toArray((err, elements) => {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            res.sendStatus(500); // internal server error
        }
        else {
            res.send(elements);
        }
    });
});

// RETRIEVE a specific dissertation
app.get(BASE_API_PATH + '/dissertations/:id', function(req, res) {
    var id = req.params.id;
    if (!id) {
        console.log("WARNING: New GET request to /dissertations/:id without id, sending 400...");
        res.sendStatus(400);
    }
    else {
        console.log("INFO: New GET request to /dissertations/" + id);
        db.findOne({ "id": id }, (err, element) => {
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
                    console.log("WARNING: There is not any dissertation with id " + id);
                    res.sendStatus(404);
                }
            }
        });
    }
});

// CREATE a dissertation
app.post(BASE_API_PATH + '/dissertations', function(req, res) {
    var thisDissertation = req.body;
    if (!thisDissertation) {
        console.log("WARNING: New POST request to /dissertations/ without dissertation, sending 400...");
        res.sendStatus(400);
    }
    else {
        console.log("INFO: New POST request to /dissertations with body: " + JSON.stringify(thisDissertation, 2, null));
        if (!thisDissertation.author || !thisDissertation.year || !thisDissertation.title || !thisDissertation.tutor) {
            console.log("WARNING: The dissertation " + JSON.stringify(thisDissertation, 2, null) + " is not well-formed, sending 422...");
            res.sendStatus(422); // unprocessable entity
        }
        else {
            var id = utils.generateDissertationId(req.body.author, req.body.year);
            thisDissertation.id = id;
            db.findOne({ "id": id }, function(err, element) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    res.sendStatus(500); // internal server error
                }
                else {
                    if (element) {
                        console.log("WARNING: The dissertation " + JSON.stringify(thisDissertation, 2, null) + " already extis, sending 409...");
                        res.sendStatus(409); // conflict
                    }
                    else {
                        db.insertOne(req.body, (err, result) => {
                            if (err) {
                                console.error('WARNING: Error inserting data in DB');
                                res.sendStatus(500); // internal server error
                            }
                            else {
                                console.log("INFO: Adding dissertation " + JSON.stringify(thisDissertation, 2, null));
                                res.sendStatus(201);
                            }
                        });
                    }
                }
            });

        }

    }
});

// UPDATE a specific dissertation
app.put(BASE_API_PATH + '/dissertations/:id', function(req, res) {
    var thisDissertation = req.body;
    var id = req.params.id;
    if (!thisDissertation) {
        console.log("WARNING: New PUT request to /dissertations/ without dissertation, sending 400...");
        res.sendStatus(400); // bad request
    }
    else {
        db.findOne({ "id": id }, function(err, element) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                res.sendStatus(500); // internal server error
            }
            else {
                if (!element) {
                    console.log("WARNING: There is not any dissertation with id " + id);
                    res.sendStatus(404);
                }
                else {
                    db.updateOne({ "id": id }, { $set: thisDissertation }, (err, result) => {
                        if (err) {
                            console.error('WARNING: Error inserting data in DB');
                            res.sendStatus(500); // internal server error 
                        }
                        else {
                            res.send(result);
                        }
                    });
                }
            }
        });
    }
});

// DELETE all dissertations
app.delete(BASE_API_PATH + '/dissertations', function(req, res) {
    console.log("INFO: New DELETE request to /dissertations");
    db.deleteMany({}, (err, output) => {

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
app.delete(BASE_API_PATH + '/dissertations/:id', function(req, res) {
    var id = req.params.id;
    if (!id) {
        console.log("WARNING: New DELETE request to /dissertations/:id without id, sending 400...");
        res.sendStatus(400);
    }
    else {
        console.log("INFO: New DELETE request to /dissertations/" + id);
        db.deleteOne({ "id": id }, (err, output) => {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                res.sendStatus(500); // internal server error
            }
            else {
                if (output.result.n > 0) {
                    console.log("INFO: The dissertation with id " + id + " has been succesfully deleted, sending 204...");
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
app.post(BASE_API_PATH + "/dissertations/:id", function(req, res) {
    var id = req.params.id;
    console.log("WARNING: New POST request to /dissertations/" + id + ", sending 405...");
    res.sendStatus(405); // method not allowed
});

// PUT over a collection
app.put(BASE_API_PATH + "/dissertations", function(req, res) {
    console.log("WARNING: New PUT request to /dissertations, sending 405...");
    res.sendStatus(405); // method not allowed
});
