// for further help about mongoose schemas, please refer to http://mongoosejs.com/docs/schematypes.html
var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate');

var DissertationSchema = new mongoose.Schema({
    tutors: { type: [String], required: true },
    author: { type: String, required: true },
    title: { type: String, required: true },
    year: { type: Number, required: true },
    idDissertation: { type: String, required: true, unique: true },
    keywords: { type: [String], required: false }
});

DissertationSchema.plugin(mongoosePaginate);
DissertationSchema.index({ author: 'text', title: 'text', year: 'text', tutors: 'text', idDissertation: 'text' });
//DissertationSchema.index({'$**': 'text'});


mongoose.model("Dissertation", DissertationSchema);

module.exports = mongoose.model("Dissertation");
