// for further help about mongoose schemas, please refer to http://mongoosejs.com/docs/schematypes.html
var mongoose = require("mongoose");

var DissertationsPerYearSchema = new mongoose.Schema({
    year: { type: Number, required: true },
    count: { type: Number, required: true },
}, {collection: "dissertationsPerYear"});

DissertationsPerYearSchema.index({'$**': 'text'});

mongoose.model("DissertationsPerYear", DissertationsPerYearSchema);

module.exports = mongoose.model("DissertationsPerYear");
