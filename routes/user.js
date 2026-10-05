const express = require("express");
const Router = express.Router();
const passport = require("passport");

// GET SIGNUP FORM
Router.get("/signup", (req, res) => {

    res.render("./user/signup.ejs", {
        error: req.query.error || null,
        message: req.query.message || null
    });

});

// HANDLE SIGNUP
Router.post("/signup", async (req, res) => {

    try {

        const { username, email, password } = req.body;

        // Check admin username
        if (username.trim().toLowerCase() === "admin") {

            return res.redirect(
                "/somnath/user/signup?error=This username cannot be used."
            );

        }

        // Create user
        const newUser = new User({
            username: username.trim(),
            email: email.trim()
        });

        // Register user
        await User.register(newUser, password);

        // Signup successful
        res.redirect(
            "/somnath/user/login?message=Signup successful! Please login."
        );

    } catch (err) {

        console.log(err);

        res.redirect(
            "/somnath/user/signup?error=Username already exists or signup failed."
        );

    }

});

// GET LOGIN FORM
Router.get("/login", (req, res) => {

    res.render("./user/login.ejs", {
        error: req.query.error,
        message: req.query.message
    });

});

Router.post("/login", (req, res, next) => {

    const { username, password } = req.body;

    // ADMIN LOGIN
    if (username.trim().toLowerCase() === "admin" && password === process.env.ADMIN_PASS) {
        req.session.isAdmin = true;
        req.session.adminUsername = "admin";
        return res.redirect(
            "/somnath/home?message=Login successful!"
        );
    }


    // NORMAL USER LOGIN
    passport.authenticate("local", {
        failureRedirect:
            "/somnath/user/login?error=Invalid username or password."
    })(req, res, next);

}, (req, res) => {

    res.redirect(
        "/somnath/home?message=Login successful!"
    );

});


//handle logout
Router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        res.redirect("/somnath/home");
    });
});

module.exports = Router;
