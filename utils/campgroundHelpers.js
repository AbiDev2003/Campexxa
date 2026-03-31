// utils/campgroundHelpers.js

// 🔥 Single campground
function computeRating(camp) {
  const reviews = camp.reviews || [];
  const totalReviews = reviews.length;

  const avgRating = totalReviews
    ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1)
    : 0;

  return {
    ...camp.toObject?.() || camp,
    avgRating,
    totalReviews
  };
}

// 🔥 Multiple campgrounds
function attachRatings(campgrounds) {
  return campgrounds.map(computeRating);
}

module.exports = {
  computeRating,
  attachRatings
};