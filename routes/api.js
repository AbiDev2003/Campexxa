// routes/api.js
const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api');

// get campgrounds from search bar
router.get("/search/suggest", apiController.searchSuggest);

// Get locations for filter (top + search)
router.get("/filters/locations", apiController.locationFilters);

// ✅ Currency rates (we'll use later)
router.get("/currency/rates", apiController.currencyRates);

// for global username checking
router.get('/check-username', apiController.checkUsername);

module.exports = router;


