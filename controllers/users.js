const User = require('./../models/user');
const {userSchema} = require('./../schemas');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports.renderRegister = (req, res) => {
    res.render('users/register'); 
}

module.exports.register = async (req, res, next) => {
    try{
        const { username, email, fullName, password } = req.body; 

        const { error } = userSchema.validate(req.body);
        if (error) {
          req.flash("error", error.details.map(el => el.message).join(", "));
          return res.redirect("/register");
        }

        // very weak password like {password : 'a'} will be rejected
        const strongPw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;
        if (!strongPw.test(password)) {
          req.flash("error", "Password too weak.");
          return res.redirect("/register");
        }

        const exists = await User.findOne({ email });
        if (exists) {
            req.flash("error", "Email already in use.");
            return res.redirect("/register");
        }

        const user = new User({ email, username, fullName }); 
        const registeredUser = await User.register(user, password); 

        // login the user too
        req.login(registeredUser, err => {
            if(err) return next(err); 
            req.flash('success', 'Sign up is successful !')
            res.redirect('/campgrounds'); 
        })
    } catch(e){
        req.flash('error', e.message); 
        res.redirect('register')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login'); 
}

module.exports.login = (req, res) => {
  console.log('=== login controller ===');
    req.flash('success', 'Welcome back !')
    const redirectUrl = res.locals.returnTo || req.session.returnTo || '/campgrounds'; 
    delete req.session.returnTo; 
    delete res.locals.returnTo; 
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err){
        if(err){ return next(err); }
        // ✅ flash BEFORE destroying session
        req.flash('success', 'GoodBye ! Please visit again !');
        req.session.save(() => {           // save flash to session first
            req.session.destroy((err) => { // then destroy
                if(err) console.log('Session destroy error:', err);
                res.clearCookie('connect.sid');
                res.redirect('/campgrounds');
            });
        });
    }); 
}

// FORGOT PASSWORD FLOW
// SECURITY-FORCED FORGOT/RESET (hashed tokens, non-enumeration)
// Render forgot page
module.exports.renderForgot = (req, res) => {
  res.render('users/forgot');
};

// Handle forgot: create hashed token, save, email raw token link (raw token sent by email)
module.exports.handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  const genericMsg = 'If an account with that email exists, we have sent a reset link.';

  try {
    const user = await User.findOne({ email });

    if (!user) {
      req.flash('success', genericMsg);
      return res.redirect('/login');
    }

    const rawToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 10;
    await user.save(); 

    const protocol = req.protocol;
    const host = req.get('host');
    const resetURL = `${protocol}://${host}/reset/${rawToken}`;

    // send mail using nodemailer ************************************************************

    const sendMail = async (email) => {
      return await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Password Campexxa",
        // text: "Hi, msg for nodemailer",
        html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        
        <h2 style="color: #333;">Hello 👋</h2>
        
        <p style="font-size: 16px; color: #555;">
          Click the button below to continue,
          <br/>
          or click on the link below.
        </p>

        <a href="${resetURL}" 
          style="
            display: inline-block;
            padding: 12px 24px;
            margin: 20px 0;
            background-color: orange;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            font-size: 16px;
          ">
          Click here
        </a>

        <p style="font-size: 14px; color: #777; word-break: break-all;">
          ${resetURL}
        </p>

      </div>
    `
      });
    }
    const info = await sendMail(user.email)
    req.flash('success', genericMsg); 
    res.redirect('/login'); 
    
  } 
  catch (err) {
    console.error("FORGOT-PASSWORD ERROR:", err);
    req.flash('success', genericMsg);
    res.redirect('/login');
  }
};
  
// Render reset page — look up hashed token
module.exports.renderResetForm = async (req, res) => {
  try {
    const token = req.params.token;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.flash('error', 'Invalid or expired token.');
      return res.redirect('/forgot-password');
    }

    res.render('users/reset', { token });
  } catch (err) {
    console.error('renderResetForm error:', err);
    req.flash('error', 'Something went wrong. Try again.');
    return res.redirect('/forgot-password');
  }
};

// Handle reset submit
module.exports.handleResetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.flash('error', 'Invalid or expired token.');
      return res.redirect('/forgot-password');
    }

    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect(`/reset/${token}`);
    }

    // very weak password like {password : 'a'} will be rejected
    const strongPw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;
    if (!strongPw.test(password)) {
      req.flash("error", "Password too weak.");
      return res.redirect(`/reset/${token}`);
    }

    // set new password via passport-local-mongoose method
    await user.setPassword(password);

    // invalidate token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // auto-login the user
    req.login(user, function(err) {
      if (err) {
        console.error('Auto-login after reset failed:', err);
        req.flash('success', 'Password updated! Please log in.');
        return res.redirect('/login');
      }
      req.flash('success', 'Password updated and you are logged in!');
      return res.redirect('/campgrounds');
    });

  } catch (err) {
    console.error('handleResetPassword error:', err);
    req.flash('error', 'Something went wrong. Try again.');
    return res.redirect('/forgot-password');
  }
};

module.exports.skipResetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.flash('error', 'Invalid or expired token.');
      return res.redirect('/login');
    }

    // Invalidate the token (optional - prevents reuse)
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Auto-login the user without changing password
    req.login(user, function(err) {
      if (err) {
        console.error('Auto-login failed:', err);
        req.flash('error', 'Something went wrong. Please log in.');
        return res.redirect('/login');
      }
      req.flash('success', 'Logged in successfully!');
      return res.redirect('/campgrounds');
    });

  } catch (err) {
    console.error('skipResetPassword error:', err);
    req.flash('error', 'Something went wrong.');
    return res.redirect('/login');
  }
};

