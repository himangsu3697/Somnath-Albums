const mongoose = require("mongoose");
const Asset = require("../models/asset.js");
const assetData = require("./assetsData.js");
require("dotenv").config();

//databsse connection
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}
main().then((res) => {
    console.log("connection successfull");
});

async function initDB() {
    await Asset.deleteMany();
    await Asset.insertMany(assetData);
}

initDB().then((res) => {
    console.log("data insertd successfully");
});

