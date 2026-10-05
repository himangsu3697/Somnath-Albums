require("dotenv").config();
const express = require("express");
const port = 8080;
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStratege = require("passport-local");
const assetsRouts = require("./routes/assets.js");
const userRouts = require("./routes/user.js");
const session = require("express-session");
const User = require("./models/user.js");
const mongoStore = require("connect-mongo").default;

//view engin setup
app.set("view engin", "ejs");
app.set("/views", path.join(__dirname, "/views"));
app.engine("ejs", ejsMate);

//public folder setup
app.use(express.static(path.join(__dirname, "public")));

//body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//hande overrided method
app.use(methodOverride("_method"));


//setup session store
const store = mongoStore.create({
    mongoUrl : process.env.MONGO_URL,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24*3600,
});
store.on("error", () => {
    console.log("Error in mongo session store", err);
});

//setup session
const sessionOptions = {
    store : store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        sameSite : "lax",
        httpOnly: true,
    }
}

//session setup
app.use(session(sessionOptions));

//setup pasport 
app.use(passport.initialize());  //initialized the passport
app.use(passport.session());    //informing pasport about the current session
passport.use(new LocalStratege(User.authenticate())); //authenticate the user
passport.serializeUser(User.serializeUser());  // to store user information in the session
passport.deserializeUser(User.deserializeUser());  //to remove user infomarmation from the session


//locals
app.use((req, res, next) => {
    res.locals.currentUser = req.user || null;
    if(req.session.isAdmin) {
        res.locals.isAdmin = true;
        res.locals.currentUser = {
            username : req.session.adminUsername,
        }
    } else {
        res.locals.isAdmin = false;
    }
    next();
});

//databsse connection
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}
main().then((res) => {
    console.log("connection successfull");
});

//health route
app.get("/somnath/health", (req, res) => {
    res.status(200).json({
        status: "OK",
    });
});

//home route
app.get("/somnath/home", (req, res) => {
    res.render("home.ejs");
});

//about route
app.get("/somnath/about", (req, res) => {
    res.render("about.ejs");
});

//contact route
app.get("/somnath/contact", (req, res) => {
    res.render("contact.ejs");
});

//send contact messege
app.post("/somnath/contact", (req, res) => {
    const { name, phone, email, service, message } = req.body;

    const whatsappMessage = `
Hello Somnath Albums,

Name: ${name}
Phone: ${phone}
Email: ${email}
Service: ${service}

Message:
${message}
`;

    const whatsappNumber = "9608869923";

    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    res.redirect(whatsappURL);
});

//assets routs
app.use("/somnath/store", assetsRouts);

//user routs
app.use("/somnath/user", userRouts);

app.listen(port, () => {
    console.log(`App is listning at ${port}`);
});
