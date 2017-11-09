var express = require('express');
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');
var MongoClient = require("mongodb").MongoClient;
var utils = require("./utils.js");

var app = express();

app.use(bodyParser.json()); //configura dentro de express el middleware bodyparser json

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

// RETRIEVE all dissertations
app.get(BASE_API_PATH + '/dissertations', function(req, res) {
    db.find({}).toArray((err, elements) => {
        if (err)
            res.send(err);
        else
            res.send(elements);
    });
});

// RETRIEVE a specific dissertation
app.get(BASE_API_PATH + '/dissertations/:id', function(req, res) {
    var id = req.params.id;

    db.findOne({ "id": id }, (err, elements) => {
        if (err)
            res.send(err);
        else
            res.send(elements);
    });
});

// CREATE a dissertation
app.post(BASE_API_PATH + '/dissertations', function(req, res) {
    var id = utils.generateDissertationId(req.body.author, req.body.year);
    req.body.id = id;

    db.insertOne(req.body, (err, result) => {
        if (err)
            res.send(err)
        else {
            res.sendStatus(201);
        }
    });
});

// UPDATE a specific dissertation
app.put(BASE_API_PATH + '/dissertations/:id', function(req, res) {
    var id = req.params.id;

    db.updateOne({ "id": id }, { $set: req.body }, (err, result) => {
        if (err)
            res.send(err);
        else
            res.sendStatus(200);
    });
});

// DELETE all dissertations
app.delete(BASE_API_PATH + '/dissertations', function(req, res) {
    db.deleteMany({}, (err, result) => {
        if (err)
            res.send(err)
        else {
            res.sendStatus(200);
        }
    });
});

// DELETE a specific dissertation
app.delete(BASE_API_PATH + '/dissertations/:id', function(req, res) {
    var id = req.params.id;

    db.deleteOne({ "id": id }, (err, result) => {
        if (err)
            res.send(err);
        else
            res.sendStatus(200);
    });
});