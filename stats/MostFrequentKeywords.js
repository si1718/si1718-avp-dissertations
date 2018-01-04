// for further help about mongoose schemas, please refer to http://mongoosejs.com/docs/schematypes.html
var mongoose = require("mongoose");

var MostFrequentKeywordsSchema = new mongoose.Schema({
    keyword: { type: String, required: true },
    count: { type: Number, required: true },
}, {collection: "mostFrequentKeywords"});

MostFrequentKeywordsSchema.index({'$**': 'text'});

mongoose.model("MostFrequentKeywords", MostFrequentKeywordsSchema);

module.exports = mongoose.model("MostFrequentKeywords");
