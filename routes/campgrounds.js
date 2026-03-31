const express = require('express')
const router = express.Router(); 
const catchAsync = require('./../utils/catchAsync');
const {isLoggedIn, isAuther, validateCampground} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer  = require('multer')
const {storage} = require('../cloudinary'); 
const upload = multer({storage})

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, upload.array('image'), catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.post('/:id/save', isLoggedIn, catchAsync(campgrounds.saveCampground))
router.post('/:id/unsave', isLoggedIn, catchAsync(campgrounds.unsaveCampground))

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, validateCampground, upload.array('image'), isAuther, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuther, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn, isAuther, catchAsync(campgrounds.renderEditForm))


module.exports = router; 