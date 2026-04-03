const express = require('express')
const router = express.Router(); 
const catchAsync = require('../utils/catchAsync');
const passport = require('passport')
const users = require('./../controllers/users')
const { handleOAuthStart, handleOAuthCallback } = require('../utils/oauth');

const rateLimit = require('express-rate-limit');
const user = require('../models/user');
const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many password reset requests from this IP, please try again later.'
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  message: "Too many login attempts. Try again later."
});


router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync (users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(
        // Save returnTo to res.locals BEFORE passport.authenticate
        (req, res, next) => {
            if (req.session.returnTo) {
                res.locals.returnTo = req.session.returnTo;
            }
            next();
        },
        passport.authenticate('local', {
            failureFlash: true,
            failureRedirect: '/login',
        }),
        users.login
    );

router.get('/logout', users.logout)

// FORGOT PASSWORD ROUTES

router.route('/forgot-password')
  .get(users.renderForgot)
  .post(forgotLimiter, catchAsync(users.handleForgotPassword));

router.route('/reset/:token/skip').get(catchAsync(users.skipResetPassword));

router.route('/reset/:token')
  .get((req, res, next) => {
    req.skipSanitize = true;
    next();
  }, catchAsync(users.renderResetForm))
  .post((req, res, next) => {
    req.skipSanitize = true;
    next();
  }, catchAsync(users.handleResetPassword));

// routes for google oauth login baby
router.get(
  "/auth/google",
  handleOAuthStart("google", ["profile", "email"])
);

router.get(
  "/auth/google/callback",
  ...handleOAuthCallback("google")
);

// routes for github oauth login baby
router.get(
  "/auth/github",
  handleOAuthStart("github", ["user:email"])
);

router.get(
  "/auth/github/callback",
  ...handleOAuthCallback("github")
);

// routes for facebook oauth login baby
router.get(
  "/auth/facebook",
  handleOAuthStart("facebook", ["email"])
);

router.get(
  "/auth/facebook/callback",
  ...handleOAuthCallback("facebook")
);

// redudant route added for facebook oauth
router.get("/privacy-policy", (req, res) => {
  res.send(`
    <h1>Privacy Policy - Campexxa</h1>
    <p>Campexxa uses authentication providers like Google, GitHub, and Facebook only to log users into the platform.</p>
    <p>We collect basic account information such as name and email address for authentication and account management.</p>
    <p>We do not sell or share personal data with third parties.</p>
    <p>If you wish to remove your data, please see our data deletion instructions.</p>
  `);
});

// delete data, fb oauth
router.get("/data-deletion", (req, res) => {
  res.send(`
    <h1>Data Deletion Instructions - Campexxa</h1>

<p>If you wish to delete your Campexxa account and associated data, follow the steps below:</p>

<ol>
  <li>Log in to your account and go to account settings.</li>
  <li>Request account deletion from the dashboard.</li>
  <li>Or email us at <b>2003abinashdash@gmail.com</b> with your registered email.</li>
</ol>

<p>We will process your request and permanently delete your data within 7 days.</p>

<p>If you have logged in using Facebook, you can also request data deletion through Facebook settings.</p>
    `);
});

module.exports = router; 