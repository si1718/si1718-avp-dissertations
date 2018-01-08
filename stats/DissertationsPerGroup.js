// for further help about mongoose schemas, please refer to http://mongoosejs.com/docs/schematypes.html
var mongoose = require("mongoose");

var DissertationsPerGroupSchema = new mongoose.Schema({
    group: { type: String, required: true },
    count: { type: Number, required: true },
}, {collection: "dissertationsPerGroup"});

DissertationsPerGroupSchema.index({'$**': 'text'});

mongoose.model("DissertationsPerGroup", DissertationsPerGroupSchema);

module.exports = mongoose.model("DissertationsPerGroup");
