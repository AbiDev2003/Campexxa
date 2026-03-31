const express = require('express')
const router = express.Router(); 
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuther, validateCampground} = require('../middleware')
const dashboard = require('./../controllers/dashboard')
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });


// dynamic tab display 
router.get('/', isLoggedIn, dashboard.renderDashboard); 

// DELETE (your campgrounds)
router.post('/delete-selected', isLoggedIn, catchAsync(dashboard.deleteSelected));
router.post('/delete-all', isLoggedIn, catchAsync(dashboard.deleteAll));

// UNSAVE
router.post('/unsave-selected', isLoggedIn, catchAsync(dashboard.unsaveSelected));
router.post('/unsave-all', isLoggedIn, catchAsync(dashboard.unsaveAll));

router.post('/reviews/delete-all', isLoggedIn, catchAsync(dashboard.deleteAllReviews));

// // profile update
router.post(
  '/profile/update',
  isLoggedIn,
  upload.single('profileImage'),
  dashboard.updateProfile
);

module.exports = router; 