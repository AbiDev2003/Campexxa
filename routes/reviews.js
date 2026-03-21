const express = require('express')
const router = express.Router({mergeParams: true});  
const catchAsync = require('./../utils/catchAsync');
const {isLoggedIn, validateReview, isReviewAuther} = require('./../middleware')
const reviews = require('../controllers/reviews')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


// show all reviews page
router.get('/', catchAsync(reviews.showAllReviews));

// save review in /campground/:id route
router.post( '/', isLoggedIn, upload.array('reviewImages', 5), validateReview, catchAsync(reviews.createReview));


// show add review form (moved here)
router.get('/addReview', isLoggedIn, catchAsync(reviews.renderAddReview));

// delete a review
router.delete('/:reviewId', isReviewAuther, catchAsync(reviews.deleteReview))

// SHOW EDIT FORM
router.get('/:reviewId/edit', isReviewAuther, catchAsync(reviews.renderEditReview));

// UPDATE REVIEW (PUT)
router.put( '/:reviewId', isReviewAuther, upload.array('reviewImages', 5), validateReview, catchAsync(reviews.updateReview) );

module.exports = router; 