// config/passport.js
const LocalStrategy = require("passport-local");
const User = require("../models/user");
const handleOauthUser = require("./../utils/oauthHandler")
const GoogleStrategy = require("passport-google-oauth20").Strategy; //added for o auth google
const GitHubStrategy = require("passport-github2").Strategy; //added for o auth github
const FacebookStrategy = require("passport-facebook").Strategy;

module.exports = function (passport) {
  // CUSTOM LOCAL STRATEGY
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Decide whether user entered username or email
        const user = username.includes("@")
          ? await User.findOne({ email: username })
          : await User.findOne({ username });

        if (!user) {
          return done(null, false, {
            message: "Invalid username/email or password",
          });
        }

        // Use passport-local-mongoose method to authenticate
        const auth = await user.authenticate(password);
        if (!auth.user) {
          return done(null, false, {
            message: "Invalid username/email or password",
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  // google strategy (create client id and client secret code in "https://console.cloud.google.com/" and save in env)
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const user = await handleOauthUser(profile, "google")
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      },
    ),
  );

  // github strategy (create client id and client secret code in "https://github.com/settings/developers" and save in env)
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback",
        scope: ["user:email"],
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const user = await handleOauthUser(profile, "github")
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      },
    ),
  );


  // facebook strategy (create client id and client secret code in "https://developers.facebook.com/apps/" and save in env)
  // This is complex for localhost testing it require deployed app, so use ngrok "https://dashboard.ngrok.com/get-started/setup/windows", then setup everything in facebook developer/app page. 
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "/auth/facebook/callback",
        profileFields: ["id", "displayName", "emails"]
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const user = await handleOauthUser(profile, "facebook")
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      },
    ),
  );

  // SESSION HANDLERS
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};
