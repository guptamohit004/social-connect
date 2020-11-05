const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const router = express.Router();
var bcryptjs = require("bcryptjs");

const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "906572405275-23tms981q28r0ru4v0ujmop4ikn6023b.apps.googleusercontent.com",
      clientSecret: "Q9Th6YxKLMhsAk9aKx7fHnsd",
      callbackURL: "/auth/google/callback",
    },
    (acessToken, refreshToken, profile, done) => {
      console.log(profile.emails[0].value);
      User.findOne({ email: profile.emails[0].value }).then(async (user) => {
        if (user) {
          console.log("Already Present. Logged In");
          done(null, user);
        } else {
          profile.photos[0].value = profile.photos[0].value.replace(
            /50$/,
            "200"
          );
          var username = profile.displayName
            .trim()
            .toLowerCase()
            .replace(" ", "-");
          username = username + Math.floor(Math.random() * 90000);
          const userData = await new User({
            name: profile.displayName,
            googleid: profile.id,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            username: username,
            password: "mohit",
          });
          await User.register(userData, "mohit", (err, useruserData2) => {
            if (err) {
              console.log(err.message);
            }
            if (useruserData2) {
              cosnsole.log(useruserData2);
              done(null, useruserData2);
            }
          });
        }
      });
    }
  )
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/plus.login",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/404",
  })
);

module.exports = router;
