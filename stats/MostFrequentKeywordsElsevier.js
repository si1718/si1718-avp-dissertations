// for further help about mongoose schemas, please refer to http://mongoosejs.com/docs/schematypes.html
var mongoose = require("mongoose");

var MostFrequentKeywordsElsevierSchema = new mongoose.Schema({
    keyword: { type: String, required: true },
    count: { type: Number, required: true },
}, {collection: "mostFrequentKeywordsElsevier"});

MostFrequentKeywordsElsevierSchema.index({'$**': 'text'});

mongoose.model("MostFrequentKeywordsElsevier", MostFrequentKeywordsElsevierSchema);

module.exports = mongoose.model("MostFrequentKeywordsElsevier");
