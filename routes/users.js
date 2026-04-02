const express = require('express')
const router = express.Router(); 
const catchAsync = require('../utils/catchAsync');
const passport = require('passport')
const users = require('./../controllers/users')

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
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }))
router.get("/auth/google/callback", 
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true
  }), 
  (req, res) => {
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  })
module.exports = router; 


// routes for github oauth login baby
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
); 


// routes for facebook oauth login baby
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
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
    <p>If you wish to delete your account and all associated data from Campexxa, please contact support or request deletion from within your account.</p>
    <p>You can also email the developer to request permanent removal of your account data.</p>
  `);
});