const express = require('express')
const router = express.Router(); 
const catchAsync = require('./../utils/catchAsync');
const {isLoggedIn, isAuther, validateCampground} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer  = require('multer')
const {storage} = require('../cloudinary'); 
const upload = multer({storage})
const csurf = require('csurf');
const csrfProtection = csurf();

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), csrfProtection,validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.post('/:id/save', isLoggedIn, csrfProtection,catchAsync(campgrounds.saveCampground))
router.post('/:id/unsave', isLoggedIn, csrfProtection, catchAsync(campgrounds.unsaveCampground))

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, upload.array('image'), csrfProtection,validateCampground, isAuther, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, csrfProtection, isAuther, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn,csrfProtection, isAuther, catchAsync(campgrounds.renderEditForm))

module.exports = router; 