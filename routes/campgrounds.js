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

// this is added for testing route purpose in jest+supertest
const conditionalCSRF = (req, res, next) => {
  if (process.env.NODE_ENV === "test") return next();
  return csrfProtection(req, res, next);
};
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), conditionalCSRF, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.post('/:id/save', isLoggedIn, conditionalCSRF,catchAsync(campgrounds.saveCampground))
router.post('/:id/unsave', isLoggedIn, conditionalCSRF, catchAsync(campgrounds.unsaveCampground))

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, upload.array('image'), conditionalCSRF,validateCampground, isAuther, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, conditionalCSRF, isAuther, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn,conditionalCSRF, isAuther, catchAsync(campgrounds.renderEditForm))

module.exports = router; 