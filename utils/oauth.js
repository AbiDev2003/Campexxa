const passport = require('passport');

// 🔐 START HANDLER
function handleOAuthStart(strategy, scope) {
  return (req, res, next) => {

    // Note : 1:
    // When user tries a protected route → we store it in `req.session.returnTo`
    // But OAuth redirect creates a new request cycle and may overwrite session
    // So we manually preserve it in a separate key BEFORE redirect
    if (req.session.returnTo) {
      req.session.oauthReturnTo = req.session.returnTo;
    }

    // Note: 2 (critical)
    // Session must be saved BEFORE redirecting to Google
    // Otherwise oauthReturnTo might not persist
    req.session.save((err) => {
      if (err) return next(err);

      passport.authenticate(strategy, { scope })(req, res, next);
    });
  };
}


// 🔁 CALLBACK HANDLER
function handleOAuthCallback(strategy) {
  return [
    // Note: 3 : Middleware before passport.authenticate:
    // We extract redirect target from session and store in res.locals
    // because session may change after authentication
    (req, res, next) => {
      res.locals.oauthReturnTo = req.session.oauthReturnTo || '/campgrounds';
      next();
    },

    // Note: 4: Passport handles Google authentication response here
    passport.authenticate(strategy, {
      failureRedirect: "/login",
      failureFlash: true
    }),

    // Note:5 : final redirect handler
    (req, res) => {
        //Note: 6:  CleanUp: Remove temporary session values to avoid stale redirects later
        delete req.session.oauthReturnTo;
        delete req.session.returnTo;

        // Note: 7: Redirect user back to original page (or fallback)
        res.redirect(res.locals.oauthReturnTo);
    }
  ];
}

module.exports = {
  handleOAuthStart,
  handleOAuthCallback
};