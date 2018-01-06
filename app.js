var express = require("express");
var app = express();
var db = require("./db");
var argv = require('minimist')(process.argv.slice(2));
var swagger = require("swagger-node-express");
var bodyParser = require('body-parser');
var path = require("path");
var cors = require("cors");

var BASE_API_PATH = "/api/v1";
var BASE_AUTH_API_PATH = "/api/v1.1";

app.use(cors());

// API controllers
var DissertationController = require("./dissertation/DissertationController");
app.use(BASE_API_PATH + "/dissertations", DissertationController);

var StatsController = require("./stats/StatsController");
app.use(BASE_API_PATH + "/stats", StatsController);

var NewSisiusDissertationController = require("./newSisiusDissertation/NewSisiusDissertationController");
app.use(BASE_API_PATH + "/newSisiusDissertations", NewSisiusDissertationController);

// API v1.1 controllers
var DissertationAuthController = require("./dissertation/DissertationAuthController");
app.use(BASE_AUTH_API_PATH + '/dissertations', DissertationAuthController);

// frontend
app.use('/', express.static(path.join(__dirname, "public")));

//secure frontend
app.use('/secure', express.static(path.join(__dirname, "publicSecure")));

module.exports = app;
