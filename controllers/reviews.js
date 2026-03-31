const Campground = require('./../models/campground');
const Review = require('./../models/review');
const { cloudinary } = require('../cloudinary');

module.exports.createReview = async (req, res) => {
    const { campId } = req.params; 
    const campground = await Campground.findById(campId);
    const newReview = new Review(req.body.review);
    newReview.auther = req.user._id;
    newReview.campground = campId; 
    // ⭐ add uploaded images
    if (req.files) {
        newReview.images = req.files.map(f => ({
            url: f.path,
            filename: f.filename
        }));
    }
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'Successfully added review!');
    res.redirect(`/campgrounds/${campground._id}/reviews`);
};


module.exports.deleteReview = async (req, res, next) => {
    const {campId, reviewId} = req.params; 
    const currCampground = await Campground.findByIdAndUpdate(campId, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId); 
    const redirectURL = req.body.redirectTo || `/campgrounds/${currCampground._id}/reviews`
    req.flash('success', 'Successfully deleted review !');
    res.redirect(redirectURL); 
}

// Render full reviews dashboard
module.exports.showAllReviews = async (req, res) => {
    const { campId } = req.params;

    const campground = await Campground.findById(campId)
        .populate({
            path: "reviews",
            populate: { path: "auther" }
        })

    if (!campground) {
        req.flash("error", "Campground not found!");
        return res.redirect("/campgrounds");
    }

    // QUERY PARAMS (page, limit, sort)
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 5;
    let sort = req.query.sort || "newest";

    // FULL REVIEW LIST (used for summary)
    const allReviews = campground.reviews || [];
    const totalReviews = allReviews.length;

    // CAP LIMIT | Prevent limit > totalReviews
    limit = Math.min(limit, totalReviews || limit);

    // SORTING LOGIC
    let sortedReviews = [...allReviews];

    switch (sort) {
        case "oldest":
            sortedReviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case "highest":
            sortedReviews.sort((a, b) => b.rating - a.rating);
            break;
        case "lowest":
            sortedReviews.sort((a, b) => a.rating - b.rating);
            break;
        default: // newest
            sortedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }

    
    // PAGINATION CALCULATION
   
    const totalPages = Math.max(1, Math.ceil(totalReviews / limit));
    page = Math.max(1, Math.min(page, totalPages));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedReviews = sortedReviews.slice(startIndex, endIndex);

   
    // SUMMARY CALCULATIONS (ALWAYS BASED ON ALL REVIEWS)
    
    const avgRating = totalReviews
        ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
        : 0;

    const starCounts = [1, 2, 3, 4, 5].map(star =>
        allReviews.filter(r => r.rating === star).length
    );

    const starPercentages = starCounts.map(count =>
        totalReviews ? Math.round((count / totalReviews) * 100) : 0
    );

    const aboveFourCount = allReviews.filter(r => r.rating >= 4).length;

    const aboveFourPercentage = totalReviews
        ? Math.round((aboveFourCount / totalReviews) * 100)
        : 0;

    // DATE RANGE (first → last)
    let dateRange = "No reviews yet";

    if (totalReviews > 0) {
        const dates = allReviews
            .map(r => new Date(r.createdAt))
            .filter(d => !isNaN(d))
            .sort((a, b) => a - b);

        const opts = { month: "long", year: "numeric" };

        dateRange =
            `${dates[0].toLocaleDateString("en-US", opts)} – ` +
            `${dates[dates.length - 1].toLocaleDateString("en-US", opts)}`;
    }

    //  SEND TO FRONTEND
    
    res.render("reviews/index", {
        campground,
        reviews: paginatedReviews,
        totalReviews,
        avgRating,
        starCounts,
        starPercentages,
        aboveFourPercentage,
        dateRange,
        page,
        limit,
        sort,
        totalPages
    });
};


// Render the addReview form (moved here)
module.exports.renderAddReview = async (req, res) => {
    const { campId } = req.params;
    const campground = await Campground.findById(campId);
    if (!campground) {
        req.flash('error', 'Campground not found!');
        return res.redirect('/campgrounds');
    }
    res.render('reviews/addReview', { campground });
};

// edit a review
module.exports.renderEditReview = async (req, res) => {
    const { campId, reviewId } = req.params;

    const campground = await Campground.findById(campId);
    const review = await Review.findById(reviewId);

    if (!campground || !review) {
        req.flash('error', 'Review or Campground not found!');
        return res.redirect(`/campgrounds/${campId}/reviews`);
    }

    res.render('reviews/editReview', { campground, review, redirectTo: req.query.redirectTo });
};

module.exports.updateReview = async (req, res) => {
    const { campId, reviewId } = req.params;
    const review = await Review.findByIdAndUpdate(reviewId, req.body.review, { new: true });
    // Add new images
    if (req.files && req.files.length > 0) {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        review.images.push(...imgs);
    }
    // Delete selected images
    if (req.body.deleteReviewImages) {
        for (let filename of req.body.deleteReviewImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await review.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteReviewImages } } }
        });
    }
    await review.save();
    const redirectURL = req.body.redirectTo || `/campgrounds/${campId}/reviews`
    req.flash('success', 'Successfully updated review!');
    res.redirect(redirectURL);
};



