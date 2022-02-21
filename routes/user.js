const { request } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const passport = require("passport");

router.get("/register", async (req, res) => {
  res.render("register");
});
router.get("/login", async (req, res) => {
  res.render("login");
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, reenterpassword } = req.body;
    const user = new User({ username });
    if (password !== reenterpassword) {
      req.flash("error", "Passwords must be same");
      return res.redirect("/register");
    } else {
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
      });

      res.redirect("/home");
    }
  } catch (e) {
    req.flash("error", "User already exists");
    return res.redirect("/register");
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/home");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
