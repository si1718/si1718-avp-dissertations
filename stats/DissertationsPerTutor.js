// for further help about mongoose schemas, please refer to http://mongoosejs.com/docs/schematypes.html
var mongoose = require("mongoose");

var DissertationsPerTutorSchema = new mongoose.Schema({
    tutor: { type: String, required: true },
    count: { type: Number, required: true },
}, {collection: "dissertationsPerTutor"});

DissertationsPerTutorSchema.index({'$**': 'text'});

mongoose.model("DissertationsPerTutor", DissertationsPerTutorSchema);

module.exports = mongoose.model("DissertationsPerTutor");
