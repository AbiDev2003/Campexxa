const Campground = require('../models/campground')
const User = require('../models/user')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mapBoxToken})
const { cloudinary } = require('../cloudinary');
const Fuse = require('fuse.js'); 
const { attachRatings } = require('../utils/campgroundHelpers');
const { computeRating } = require('../utils/campgroundHelpers');
const { getPagination, getHasMore } = require('../utils/paginate');
const { sendPaginatedResponse } = require('../utils/sendPaginatedResponse');

let campCache = null;
let campCacheTime = null;
const CACHE_TTL = 30 * 1000; // 30 seconds

module.exports.index = async (req, res) => {
    const search = req.query.search?.trim() || "";
    const selectedLocations = req.query.location
        ? req.query.location.split(",")
        : [];
    const sort = req.query.sort || "";

    let mongoQuery = {};
    if (selectedLocations.length) {
        mongoQuery.location = { $in: selectedLocations };
    }
    if (search) {
        mongoQuery.title = new RegExp(search, "i");
    }

    // 🔹 GEOMETRY-BASED LOCATION FILTER
    if (req.query.bbox) {
        const boxes = req.query.bbox.split("|");

        mongoQuery.$or = boxes.map(box => {
            const [minLng, minLat, maxLng, maxLat] = box.split(",").map(Number);
            return {
                geometry: {
                    $geoWithin: {
                        $box: [
                            [minLng, minLat],
                            [maxLng, maxLat]
                        ]
                    }
                }
            };
        });
    }

    // 💰 PRICE FILTER (MULTI RANGE)
    if (req.query.price) {
    const ranges = req.query.price.split("|");

    mongoQuery.$or = mongoQuery.$or || [];

    ranges.forEach(range => {
        const [min, max] = range.split("-").map(Number);
        if (!isNaN(min) && !isNaN(max)) {
        mongoQuery.$or.push({
            price: { $gte: min, $lte: max }
        });
        }
    });
    }

    // 🕒 DATE POSTED FILTER (seconds-based, LinkedIn style)
    if (req.query.postedWithin) {
        const seconds = parseInt(req.query.postedWithin);
        if (!isNaN(seconds)) {
            const fromDate = new Date(Date.now() - seconds * 1000);
            mongoQuery.createdAt = { $gte: fromDate };
        }
    }

    // fetch data once
    let camps = [];
    if (req.query.lat && req.query.lng) {
        const lat = parseFloat(req.query.lat);
        const lng = parseFloat(req.query.lng);
        const radius = parseFloat(req.query.radius) || 50;
        const radiusMeters = radius * 1000;
        const geoResults = await Campground.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [lng, lat] },
                    distanceField: "distance",
                    maxDistance: radiusMeters,
                    spherical: true, 
                    key: "geometry"
                }
            }
        ]);
        const ids = geoResults.map(r => r._id)
        camps = await Campground.find({
            _id: { $in: ids }, ...mongoQuery
        })
        .populate({ path: "reviews", select: "rating" })
        .lean({virtuals: true});

    } else {
        const isDefaultQuery = !search && !selectedLocations.length && 
                       !req.query.bbox && !req.query.price && 
                       !req.query.lat && !req.query.postedWithin;
        if(isDefaultQuery && campCache && (Date.now() - campCacheTime < CACHE_TTL)){
            camps = campCache;
        } else {
            camps = await Campground.find(mongoQuery)
                .populate({ path: "reviews", select: "rating" })
                // .select("title location description images createdAt geometry")
                .lean({virtuals: true});

            if (isDefaultQuery) {
                campCache = camps;
                campCacheTime = Date.now();
            }
        }
    }

    let campgroundsWithRatings = attachRatings(camps);

    // ⭐ RATING FILTER (single-select)
    const ratingFilter = req.query.rating;
    if (ratingFilter) {
        const rule = ratingFilter;
        campgroundsWithRatings = campgroundsWithRatings.filter(c => {
            const r = Number(c.avgRating);
            if (rule === "5") return r === 5;
            if (rule === "4") return r >= 4;
            if (rule === "3") return r >= 3;
            if (rule === "lt3") return r < 3;
            return true;
        });
    }

    if(search){
        // ✅ Exact match first (clicked suggestion)
        const exactMatches = campgroundsWithRatings.filter(c =>
            c.title.toLowerCase() === search.toLowerCase()
        );

        if (exactMatches.length) {
            return res.render("campground/index", {
                campgrounds: exactMatches,
                search, 
                selectedLocations,
                sort,
                page: 1,
                hasMore: false 
            });
        }

        // ✅ Fuzzy fallback
        const fuse = new Fuse(campgroundsWithRatings, {
            keys: ["title"],
            threshold: 0.35,
            ignoreLocation: true,
            minMatchCharLength: 2
        });

        campgroundsWithRatings = fuse.search(search).map(r => r.item);
    }
    
    // sort the campgrounds
    // sort logic
    // const { sort } = req.query;
        if (sort) {
            switch (sort) {
                case "newest":
                    campgroundsWithRatings.sort((a, b) =>
                        b._id.getTimestamp() - a._id.getTimestamp()
                    );
                    break;
                case "oldest":
                    campgroundsWithRatings.sort((a, b) =>
                        a._id.getTimestamp() - b._id.getTimestamp()
                    );
                    break;
                case "priceLowHigh":
                    campgroundsWithRatings.sort((a, b) => a.price - b.price);
                    break;
                case "priceHighLow":
                    campgroundsWithRatings.sort((a, b) => b.price - a.price);
                    break;
                case "ratingHighLow":
                    campgroundsWithRatings.sort(
                        (a, b) => Number(b.avgRating) - Number(a.avgRating)
                    );
                    break;
                case "ratingLowHigh":
                    campgroundsWithRatings.sort(
                        (a, b) => Number(a.avgRating) - Number(b.avgRating)
                    );
                    break;
                case "distanceNear":
                    campgroundsWithRatings.sort(
                        (a, b) => (a.distance || Infinity) - (b.distance || Infinity)
                    );
                    break;
                case "distanceFar":
                    campgroundsWithRatings.sort(
                        (a, b) => (b.distance || 0) - (a.distance || 0)
                    );
                    break;
            }
        }

    // load more infinity scroll 
    const { page, limit, skip } = getPagination(req);

    const total = campgroundsWithRatings.length;

    const paginatedCampgrounds = campgroundsWithRatings.slice(
        skip,
        skip + limit
    );

    const hasMore = getHasMore(total, paginatedCampgrounds.length, skip);

    const response = await sendPaginatedResponse({
        req,
        res,
        view: 'partials/campCardList',
        dataKey: 'campgrounds',
        data: paginatedCampgrounds,
        hasMore
    });

    if (response) return response;
    
    // for dynamic meta tag
    res.locals.meta = {
        title: "All Campgrounds | Campexxa",
        description: "Browse all campgrounds, hiking trails and food spots on Campexxa.",
        canonical: "https://campexxa.onrender.com/campgrounds"
    };
    // render once
    return res.render("campground/index", {
        campgrounds: paginatedCampgrounds,
        search, 
        selectedLocations, 
        sort,
        page, 
        hasMore
    });
};


module.exports.renderNewForm = async (req, res) => {
    res.render("campground/new");
}

module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const feature = geoData.body.features[0];
    let countryCode = null;
    if (feature.context) {
        const countryContext = feature.context.find(c => c.id.startsWith("country"));
        if (countryContext?.short_code) {
            countryCode = countryContext.short_code.toUpperCase();
        }
    }


    // 1️⃣ Read seller-selected currency from dropdown
    const currencyCode = "INR";
    const currencySymbol = "₹";
    // 2️⃣ Generate symbol safely
    try {
        const formatter = new Intl.NumberFormat("en", {
            style: "currency",
            currency: currencyCode
        });

        currencySymbol = formatter
            .formatToParts(1)
            .find(p => p.type === "currency").value;
    } catch (err) {
        console.log("Currency symbol fallback → ₹");
    }

    // price should be positive
    let price = parseFloat(req.body.campground.price)
    if(!price || price < 0){
        req.flash("error", "Price must be 0 or positive !")
        return req.redirect('back')
    }
    price = Math.round(price * 100) / 100; 
    req.body.campground.price = price; 

    const campground = new Campground(req.body.campground);
    campground.geometry = feature.geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.auther = req.user._id;

    campground.country = countryCode; //from location geoLocation data
    campground.currency = currencyCode; //from dropdown
    campground.currencySymbol = currencySymbol;
    await campground.save();
    console.log("New campground saved"); 
    
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: { path: 'auther' }
        })
        .populate('auther');

    if (!campground) {
        req.flash('error', 'Campground not found!');
        return res.redirect('/campgrounds');
    }

    let isSaved = false; 

    // Reviews summary
    
    const ratedCamp = computeRating(campground);

    // NEW → Formatted Created Date (29 March 2025)
    const createdAt = campground.createdAt;
    const formattedDate = createdAt
        ? new Date(createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
        : "";

    if(req.user){
        isSaved = req.user.savedCampgrounds.some(id => id.equals(campground._id))
    }

    // for dynamic meta tags
    res.locals.meta = {
        title: `${campground.title} | Campexxa`,
        description: campground.description?.slice(0, 150) || "Explore this amazing place on Campexxa",
        canonical: `https://campexxa.onrender.com/campgrounds/${campground._id}`
    };
    res.render("campground/show", { 
        campground,
        avgRating: ratedCamp.avgRating,
        totalReviews: ratedCamp.totalReviews,
        formattedDate,
        isSaved
    });
};


module.exports.renderEditForm = async(req, res) => {
    const {id} = req.params; 
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error', 'Campground not found !')
        return res.redirect('/campgrounds')
    }
    res.render('campground/edit', { campground }); 
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(
        id,
        { ...req.body.campground },
        { new: true }
    );
    if (!campground) {
        req.flash("error", "Campground not found!");
        return res.redirect("/campgrounds");
    }
    // 2️⃣ Recalculate geometry + country + currency from NEW location
    try {
        const geoData = await geocoder.forwardGeocode({
            query: req.body.campground.location,
            limit: 1
        }).send();
        const feature = geoData.body.features[0];

        if(feature){
            campground.geometry = feature.geometry; //update geometry

            // Extract country code
            let countryCode = null;
            if (feature.context) {
                const countryContext = feature.context.find(c =>
                    c.id.startsWith("country")
                );
                if (countryContext?.short_code) {
                    countryCode = countryContext.short_code.toUpperCase();
                }
            }

            campground.country = countryCode; 
        }
        campground.currency = "INR";
        campground.currencySymbol = "₹";
    } catch (err) {
        console.log("Currency/Geo update failed:", err);
        // Keep existing values if detection fails
    }

    // 3️⃣ Handle new uploaded images
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);

    // 4️⃣ Handle image deletion
    if (req.body.deleteImages) {
        // Delete from Cloudinary
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        // Delete from MongoDB
        await campground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } }
        });
    }

    // 5️⃣ Save everything
    await campground.save();

    req.flash("success", "Campground updated successfully!");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id, { ...req.body.campground }, { new: true });
    // const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully!');
    res.redirect(`/campgrounds`);
}

module.exports.saveCampground = async(req, res) => {
    const user = await User.findById(req.user._id); 
    const campId = req.params.id; 
    if(!user.savedCampgrounds.includes(campId)){
        user.savedCampgrounds.push(campId); 
        await user.save(); 
    }
    req.flash('success', 'Campground saved successfully!');
    res.redirect(`/campgrounds/${campId}`);
}
module.exports.unsaveCampground = async(req, res) => {
    const user = await User.findById(req.user._id)
    const campId = req.params.id; 
    user.savedCampgrounds = user.savedCampgrounds.filter((id) => {
        id.toString() !== campId; 
    })
    await user.save(); 
    req.flash('success', 'Campground successfully removed from saved!');
    res.redirect(`/campgrounds/${campId}`);
}

