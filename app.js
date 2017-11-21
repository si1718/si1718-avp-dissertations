var express = require("express");
var app = express();
var db = require("./db");

var argv = require('minimist')(process.argv.slice(2));
var swagger = require("swagger-node-express");
var bodyParser = require( 'body-parser' );



var BASE_API_PATH = "/api/v1";

var DissertationController = require("./dissertation/DissertationController");
app.use(BASE_API_PATH + "/dissertations", DissertationController);


//var subpath = express();
app.use(bodyParser());
//app.use("/docs", subpath);
//swagger.setAppHandler(subpath);
swagger.setAppHandler(app);

app.use("/docs/v1", express.static('docs/dist'));
swagger.setApiInfo({
    title: "example API",
    description: "API to do something, manage something...",
    termsOfServiceUrl: "",
    contact: "yourname@something.com",
    license: "",
    licenseUrl: ""
});
/*
subpath.get('/docs/v1', function (req, res) {
    res.sendfile(__dirname + '/docs/dist/index.html');
});
swagger.configureSwaggerPaths('', 'api-docs', '');
*/
var domain = 'localhost';
if(argv.domain !== undefined)
    domain = argv.domain;
else
    console.log('No --domain=xxx specified, taking default hostname "localhost".');
var applicationUrl = 'http://' + domain;
swagger.configure(applicationUrl, '1.0.0');





module.exports = app;