var express = require("express");
var router = express.Router();
var helmet = require("helmet");
var bodyParser = require("body-parser");
var utils = require("./../utils.js");
var keyword_extractor = require("keyword-extractor");
var LanguageDetect = require('languagedetect');
var lngDetector = new LanguageDetect();
var tf = require('wordfrequenter');

router.use(bodyParser.json()); //configura dentro de express el middleware bodyparser json
router.use(helmet()); //improve security


// CREATE a dissertation
router.post('/', function(req, res) {
    var text = req.body.text;
    if (!text) {
        console.log("WARNING: New POST request to /keywordsExtractor/ without text, sending 400...");
        res.sendStatus(400);
    }
    else {
        var lang = lngDetector.detect(text)[0][0];

        var languageConfig = 'english';
        if (lang === 'spanish')
            languageConfig = 'spanish';

        var results = keyword_extractor.extract(text, {
            language: languageConfig,
            remove_digits: true,
            return_changed_case: true,
            remove_duplicates: false
        });

        var counts = utils.compressArray(results);
        
        counts = counts.sort(function(a, b) { return (a.count > b.count) ? -1 : ((b.count > a.count) ? 1 : 0); }).slice(0, 15).map(x => x.value);
        
        res.send(counts);
    }
});

module.exports = router;
