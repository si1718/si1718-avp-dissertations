var express = require("express");
var app = express();
var db = require("./db");

var BASE_API_PATH = "/api/v1";

var DissertationController = require("./dissertation/DissertationController");
app.use(BASE_API_PATH + "/dissertations", DissertationController);

module.exports = app;