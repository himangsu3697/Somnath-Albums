
const mongoose = require("mongoose");

const passportLocalMongooseModule = require("passport-local-mongoose");

const passportLocalMongoose =
    passportLocalMongooseModule.default || passportLocalMongooseModule;

const userSchema = new mongoose.Schema({
     email : {
        type : String,
        required : true
    }
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
module.exports = User;
