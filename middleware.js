const Campground = require('./models/campground');
const Review = require('./models/review');
const {campgroundSchema, reviewSchema} = require('./schemas')
const ExpressError = require('./utils/ExpressError')

// under debug and review
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl; 
        
        // Save session before redirecting
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return next(err);
            }
            req.flash('error', 'Please sign in first !');
            return res.redirect('/login');
        });
    } else {
        next(); 
    }
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    } else {
        next(); 
    }
}

module.exports.isAuther = async (req, res, next) => {
    const { id } = req.params; 
    const campground = await Campground.findById(id); 
    if(!campground.auther.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that.')
        return res.redirect(`/campgrounds/${id}`)
    }
    next(); 
}

module.exports.isReviewAuther = async (req, res, next) => {
    const { campId, reviewId } = req.params; 
    const review = await Review.findById(reviewId); 
    if(!review.auther.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that.')
        return res.redirect(`/campgrounds/${campId}`)
    }
    next(); 
}

module.exports.validateReview = (req, res, next) => {
    const { review } = req.body;
    const { error } = reviewSchema.validate({ review });
    // const {error} = reviewSchema.validate(req.body, { allowUnknown: true }); 
    if(error){
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400); 
    } else {
        next(); 
    }
}



