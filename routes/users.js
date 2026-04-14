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

// login limiter, to prevent brute force attack
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  handler: (req, res) => {
    req.flash('error', 'Too many login attempts. Please try again in 15 minutes.');
    res.redirect('/login');
  }
});

// conditional login limiter for testing routes in jest + supertest
const conditionalLoginLimiter = (req, res, next) => {
  if (process.env.NODE_ENV === "test") return next();
  return loginLimiter(req, res, next);
};

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync (users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(
        conditionalLoginLimiter,
        // validation to escape sql injection for ZAP testing
        (req, res, next) => {
          let { username, password } = req.body || {};

          username = username?.trim();
          password = password?.trim();

          if (!username || !password) {
            req.flash('error', 'Invalid credentials');
            return res.redirect('/login');
          }

          // limit length (important)
          if (username.length > 100 || password.length > 100) {
            req.flash('error', 'Invalid credentials');
            return res.redirect('/login');
          }

          req.body.username = username;
          req.body.password = password;

          next();
        },
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
  res.render('static/privacy');
});

// delete data, fb oauth
router.get("/data-deletion", (req, res) => {
  res.render('static/privacy');
});

module.exports = router; 