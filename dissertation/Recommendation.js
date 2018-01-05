// for further help about mongoose schemas, please refer to http://mongoosejs.com/docs/schematypes.html
var mongoose = require("mongoose");

var RecommendationSchema = new mongoose.Schema({
    idDissertation: { type: String, required: true },
    recommendations: { type: [String], required: false },
}, {collection: "recommendations"});

mongoose.model("Recommendation", RecommendationSchema);

module.exports = mongoose.model("Recommendation");
