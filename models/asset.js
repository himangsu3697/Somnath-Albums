const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
    name : {
        type : String,
    },
    url : {
        type : String,
    }
});

const Asset = mongoose.model("Asset", assetSchema);

module.exports = Asset;

