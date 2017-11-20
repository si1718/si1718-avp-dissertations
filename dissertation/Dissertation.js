// for further help about mongoose schemas, please refer to http://mongoosejs.com/docs/schematypes.html
var mongoose = require("mongoose");

var DissertationSchema = new mongoose.Schema({
    tutors: { type: [String], required: true },
    author: { type: String, required: true },
    title: { type: String, required: true },
    year: { type: Number, required: true },
    idDissertation: { type: String, required: true, unique: true }
});

mongoose.model("Dissertation", DissertationSchema);

module.exports = mongoose.model("Dissertation");
