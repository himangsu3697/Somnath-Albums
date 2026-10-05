const express = require("express");
const Router = express.Router();
const Asset = require("../models/asset.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const uploade = multer({storage});


//all assets
Router.get("/", async (req, res) => {
    const assets = await Asset.find();
    res.render("./asset/index.ejs", {assets});
});

//specific asset by id
Router.get("/:id/single", async(req, res) => {
    const {id} = req.params;
    const asset = await Asset.findById(id);
    res.render("./asset/view.ejs",{asset});
});

//specific assets by name 
Router.get("/:name/group", async (req, res) => {
    const { name } = req.params;
    const assets = await Asset.find({ name: name });
    res.render("./asset/viewGroup.ejs", {assets});
});

//get add asset form
Router.get("/new", (req, res) => {
    const {name} = req.query;
    res.render("./asset/new.ejs", {name});
});

//add asset
Router.post("/",uploade.single("url") , async(req, res) => {
    const {name} = req.query;
    const url = req.file.path;
    await Asset.insertOne({name, url});
    res.redirect(`/somnath/store/${name}/group`);
});

//Buy assets
Router.get("/:name/buy", (req, res) => {
    const { name } = req.params;
    const message = `Hi! I’d like to know more about your available design assets.,\nAsset code: ${name}`;
    const whatsappUrl = `https://wa.me/9608869923?text=${encodeURIComponent(message)}`;
    res.redirect(whatsappUrl);
});

//delete asset
Router.delete("/:id", async(req, res) => {
    const {id} = req.params;
    const asset = await Asset.findByIdAndDelete(id);
    res.redirect(`/somnath/store/${asset.name}/group`)
});

module.exports = Router;
