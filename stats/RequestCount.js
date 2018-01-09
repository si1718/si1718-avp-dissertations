// for further help about mongoose schemas, please refer to http://mongoosejs.com/docs/schematypes.html
var mongoose = require("mongoose");

var RequestCountSchema = new mongoose.Schema({
    date: { type: String, required: true },
    count: { type: Number, required: true }
}, {collection: "requestCount"});

RequestCountSchema.index({'$**': 'text'});

mongoose.model("RequestCount", RequestCountSchema);

module.exports = mongoose.model("RequestCount");
