const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');
const { attachRatings } = require('../utils/campgroundHelpers');
const { getPagination, getHasMore } = require('../utils/paginate');
const { sendPaginatedResponse } = require('../utils/sendPaginatedResponse');

module.exports.renderDashboard = async (req, res) => {
    if (!req.user) {
        return res.send('User is not logged in !');
    }

    const tab = req.query.tab || 'campgrounds';
    const { page, limit, skip } = getPagination(req);

    const totalCampgrounds = await Campground.countDocuments({ auther: req.user._id });
    const user = await User.findById(req.user._id).select('savedCampgrounds');
    
    let totalSavedClean = 0; 
    let totalReviewsClean = 0; 
    let campgrounds = [], savedCampgrounds = [], reviews=[];
    let hasMoreCampgrounds = false, hasMoreSaved = false, hasMoreReviews = false;

    if(tab === 'campgrounds'){
        // ✅ MY CAMPGROUNDS (with reviews)
        const campsRaw = await Campground.find({ auther: req.user._id })
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .populate({ path: 'reviews', select: 'rating' })
            .lean();

        campgrounds = attachRatings(campsRaw);
        hasMoreCampgrounds = getHasMore(totalCampgrounds, campgrounds.length, skip);

        const response = await sendPaginatedResponse({
            req,
            res,
            view: 'partials/campCardList',
            dataKey: 'campgrounds',
            data: campgrounds,
            hasMore: hasMoreCampgrounds
        });
        if (response) return response;
    }

    if (tab === 'saved') {
        // ✅ USER + SAVED (with reviews)
        const validSaved = await Campground.find({
            _id: { $in: user.savedCampgrounds }
        }).select('_id'); // only ids

        const validIds = validSaved.map(c => c._id.toString());

        // ✅ 2. find invalid ids
        const invalidIds = user.savedCampgrounds.filter(
            id => !validIds.includes(id.toString())
        );

        // ✅ 3. auto-clean DB
        if (invalidIds.length > 0) {
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { savedCampgrounds: { $in: invalidIds } }
            });
        }

        // ✅ 4. FIX totalSaved (IMPORTANT)
        totalSavedClean = validIds.length;

        // ✅ 5. fetch paginated data
        const savedRaw = await Campground.find({
            _id: { $in: validIds }
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({ path: 'reviews', select: 'rating' })
            .lean();

        // ✅ SAVED CAMPGROUNDS RATING
        savedCampgrounds = attachRatings(savedRaw);
        hasMoreSaved = getHasMore(totalSavedClean, savedCampgrounds.length, skip);

        const response = await sendPaginatedResponse({
            req,
            res,
            view: 'partials/campCardList',
            dataKey: 'campgrounds', // 🔥 IMPORTANT (same key)
            data: savedCampgrounds,
            hasMore: hasMoreSaved, 
        });

        if (response) return response;
    }
    if (tab === 'reviews') {
        const rawReviews = await Review.find({ auther: req.user._id })
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'campground',
                select: 'title location images'
            })
            .populate({
                path: 'auther',
                select: 'username fullName profileImage', 
                options: { lean: { virtuals: true } }
            })
            .lean({virtuals: true}); 
        
        reviews = rawReviews.filter(r => r.campground != null)

        // 🔥 IMPORTANT: get ALL reviews (no pagination)
        const allReviews = await Review.find({ auther: req.user._id })
            .populate('campground')
            .lean({virtuals: true});

        // ✅ only valid ones
        const validReviews = allReviews.filter(r => r.campground != null);

        totalReviewsClean = validReviews.length;

        const invalidReviews = allReviews.filter(r => r.campground == null);

        if (invalidReviews.length > 0) {
            await Review.deleteMany({
                _id: { $in: invalidReviews.map(r => r._id) }
            });
        }
        
        hasMoreReviews = getHasMore(totalReviewsClean, reviews.length, skip);

        const response = await sendPaginatedResponse({
            req,
            res,
            view: 'partials/reviewListPartial',
            dataKey: 'reviews',
            data: reviews,
            hasMore: hasMoreReviews
        });

        if (response) return response;
    }

    res.render('dashboard/index', {
        tab,
        campgrounds,
        savedCampgrounds, 
        reviews, 
        page,
        hasMoreCampgrounds,
        hasMoreSaved,
        hasMoreReviews, 
        totalCampgrounds, 
        totalSaved: tab === 'saved' && totalSavedClean,
        totalReviews: tab === 'reviews' && totalReviewsClean,
        user: req.user
    });
};

module.exports.deleteSelected = async(req, res) => {
    const {selectedIds} = req.body
    const tab = req.query.tab || 'campgrounds';
    await Campground.deleteMany({
        _id: {$in: selectedIds}, 
        auther: req.user._id //safety
    })
    req.flash('success', 'Selected posted campgrounds deleted !')
    res.redirect(`/dashboard?tab=${tab}`)
}
module.exports.deleteAll = async(req, res) => {
    const tab = req.query.tab || 'campgrounds';
    await Campground.deleteMany({
        auther: req.user._id
    })
    req.flash('success', 'All of your posted campgrounds deleted !')
    res.redirect(`/dashboard?tab=${tab}`)
}
module.exports.unsaveSelected = async(req, res) => {
    const {selectedIds} = req.body
    const tab = req.query.tab || 'saved';
    await User.findByIdAndUpdate(req.user._id, {
        $pull: {savedCampgrounds: {$in: selectedIds}}
    })
    req.flash('success', 'Selected campgrounds removed from saved !')
    res.redirect(`/dashboard?tab=${tab}`)
}
module.exports.unsaveAll = async(req, res) => {
    const tab = req.query.tab || 'saved';
    await User.findByIdAndUpdate(req.user._id, {
        $set: {savedCampgrounds: []}
    })
    req.flash('success', 'All saved campground removed !')
    res.redirect(`/dashboard?tab=${tab}`)
}
module.exports.deleteAllReviews = async(req, res) => {
    const userId = req.user._id; 
    // get all user reviews
    const reviews = await Review.find({auther: userId})
    const reviewIds = reviews.map(r => r._id); 
    // remove from campground.reviews array
    await Campground.updateMany(
        {reviews: {$in: reviewIds}},
        {$pull: {reviews: {$in: reviewIds}}} 
    )
    // delete reviews
    await Review.deleteMany({_id: {$in: reviewIds}});
    req.flash('success', 'All your reviews deleted !')
    res.redirect('/dashboard?tab=reviews')
}



module.exports.updateProfile = async (req, res) => {
  try {
    const { username, fullName } = req.body;
    const userId = req.user._id;

    // 🔹 Username uniqueness check
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      req.flash('error', 'Username already taken');
      return res.redirect('/dashboard?tab=profile');
    }

    const user = await User.findById(userId);

    // 🔹 Update fields
    user.username = username.trim();
    user.fullName = fullName.trim();

    // empty username
    if (!username) {
        req.flash('error', 'Username cannot be empty');
        return res.redirect('/dashboard?tab=profile');
    }

    // same username → skip update
    if (username === req.user.username && fullName === req.user.fullName && !req.file) {
        req.flash('success', 'No changes made');
        return res.redirect('/dashboard?tab=profile')
    }

    // 🔹 Profile Image update
    if (req.file) {
      user.profileImage = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await user.save();

    req.flash('success', 'Profile updated successfully');
    req.login(user, (err) => {
        if (err) return next(err);
        req.flash('success', 'Profile updated');
        return res.redirect('/dashboard?tab=profile');
    });

  } catch (err) {
    console.log(err);
    req.flash('error', 'Something went wrong');
    return res.redirect('/dashboard?tab=profile');
  }
};
