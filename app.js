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

// API v1.1 controllers
var AuthController = require('./auth/AuthController');
app.use(BASE_AUTH_API_PATH + '/auth', AuthController);

var DissertationAuthController = require("./dissertation/DissertationAuthController");
app.use(BASE_AUTH_API_PATH + '/dissertations', DissertationAuthController);

// frontend
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
