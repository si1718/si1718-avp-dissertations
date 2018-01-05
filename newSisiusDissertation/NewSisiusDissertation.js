// for further help about mongoose schemas, please refer to http://mongoosejs.com/docs/schematypes.html
var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate');

var NewSisiusDissertationSchema = new mongoose.Schema({
    tutors: { type: [{}], required: true },
    author: { type: String, required: true },
    authorName: { type: String, required: false },
    authorViewURL: { type: String, required: false },
    title: { type: String, required: true },
    year: { type: Number, required: true },
    idDissertation: { type: String, required: true, unique: true },
    keywords: { type: [String], required: false },
    viewURL: { type: String, required: true }
}, {collection: "newDissertations"});

NewSisiusDissertationSchema.plugin(mongoosePaginate);

mongoose.model("NewSisiusDissertation", NewSisiusDissertationSchema);

module.exports = mongoose.model("NewSisiusDissertation");
