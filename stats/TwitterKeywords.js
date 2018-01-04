// for further help about mongoose schemas, please refer to http://mongoosejs.com/docs/schematypes.html
var mongoose = require("mongoose");

var TwitterKeywordsSchema = new mongoose.Schema({
    keyword: { type: String, required: true },
    count: { type: Number, required: true },
    date: { type: String, required: true },
}, { collection: "stats" });

TwitterKeywordsSchema.index({ '$**': 'text' });

mongoose.model("TwitterKeywords", TwitterKeywordsSchema);

module.exports = mongoose.model("TwitterKeywords");
