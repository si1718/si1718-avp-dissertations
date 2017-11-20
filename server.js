// entry point to the web server
// structure taken from https://github.com/adnanrahic/nodejs-restful-api 
var app = require('./app');
var port = process.env.PORT || 3000

var server = app.listen(port, function() {
    console.log("Magic is happening in port " + port);
});


