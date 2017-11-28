var express = require("express");
var app = express();
var db = require("./db");
var argv = require('minimist')(process.argv.slice(2));
var swagger = require("swagger-node-express");
var bodyParser = require( 'body-parser' );
var path = require("path");


var BASE_API_PATH = "/api/v1";

// API controllers
var DissertationController = require("./dissertation/DissertationController");
app.use(BASE_API_PATH + "/dissertations", DissertationController);

// frontend
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;