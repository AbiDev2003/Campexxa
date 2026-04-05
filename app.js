if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
} 
const apiRoutes = require('./routes/api');
const path = require('path'); 
const express = require('express')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override')
const passport = require('passport')
const helmet = require('helmet');
const sanitizeV5 = require('./utils/mongoSanitizeV5'); 
const compression = require('compression'); 

const app = express(); 
app.set('query parser', 'extended');

const userRoutes = require('./routes/users')
const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')
const dashboardRoutes = require('./routes/dashboard')

const { MongoStore } = require('connect-mongo'); 

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/campexxa';

mongoose.connect(dbUrl); 

const db = mongoose.connection; 
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', () => {
    console.log("database connected !")
})

app.engine('ejs', ejsMate)

app.set('query parser', 'extended');
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs'); 

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(compression()); //for better LCP and website loading

app.use((req, res, next) => {
  if (req.skipSanitize) return next();
  sanitizeV5({ replaceWith: '_' })(req, res, next);
});

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SESSION_SECRET
    }
});

store.on("error", function(e){
  console.log("SESSION STORE ERROR !")
})

app.set('trust proxy', 1);

const sessionConfig = {
    store, 
    name: 'session', 
    secret: process.env.SESSION_SECRET, //secret key
    resave: false, 
    saveUninitialized: false, 
    cookie: {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",  // only send over HTTPS (will uncomment it while production)
        sameSite: 'lax',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,  //in ms, authentication expires after 7 days, have to authenticate again !
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash()); 
app.use(helmet());

const scriptSrcUrls = [
  "https://cdn.jsdelivr.net/",
  "https://cdn.jsdelivr.net/npm/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
];

const styleSrcUrls = [
  "https://cdn.jsdelivr.net/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];

const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'", 
          ...connectSrcUrls, 
          "https://cdn.jsdelivr.net/", 
        ], 
        scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: ["'none'"],
        imgSrc: [
          "'self'",
          "blob:",
          "data:",
          `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
          "https://images.unsplash.com/",
          "https://encrypted-tbn0.gstatic.com/"
          
        ],
        fontSrc: ["'self'", "data:", "https://fonts.gstatic.com/", "https://cdn.jsdelivr.net"],
      },
    },
    crossOriginEmbedderPolicy: false, // needed for some CDNs
  })
);


app.use(passport.initialize())
app.use(passport.session())
const configurePassport = require("./config/passport");
configurePassport(passport);

// app.use((req, res, next) => {
//   if (req.skipSanitize) return next();
//   sanitizeV5({ replaceWith: '_' })(req, res, next);
// });

// flash middleware
app.use((req, res, next) => { 
    res.locals.currentUser = req.user; 
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    // meta dynamic tags
    res.locals.meta = {
        title: "Campexxa | Home page",
        description: "Discover campgrounds, hiking trails and food spots with Campexxa",
        canonical: "https://campexxa.onrender.com"
    };
    next(); 
})

app.use('/', userRoutes)
app.use('/api', apiRoutes);
app.use('/campgrounds', campgroundsRoutes) //campgrounds route
app.use('/campgrounds/:campId/reviews', reviewsRoutes) //review route
app.use('/dashboard', dashboardRoutes) //dashboard route


app.get('/', (req, res) => {
    res.render('home'); 
})

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    // const { statusCode = 500 } = err;
    // if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    // res.status(statusCode).render('error', { err })

    console.error("🔥 ERROR START ==========");
    console.error(err.stack || err);
    console.error("🔥 ERROR END ==========");

    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'

    res.status(statusCode).render('error', { err });
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Serving on port ${PORT} !`)
})