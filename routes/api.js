// routes/api.js
const express = require('express');
const router = express.Router();
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const Campground = require("../models/campground");
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
const Fuse = require('fuse.js'); //fuzzy algrithm for dynamic search
const axios = require('axios'); //for IP address location storing


// get campgrounds from search bar
router.get("/search/suggest", async (req, res) => {
    try {
        const q = req.query.q || "";
        if (!q.trim()) return res.json([]);

        // 1️⃣ Get all campgrounds (select only needed fields)
        const camps = await Campground.find({})
            .select("title location")
            .lean();

        // 2️⃣ Configure Fuse.js fuzzy search
        const fuse = new Fuse(camps, {
            keys: ["title"],
            threshold: 0.4,          // Lower = stricter, higher = more fuzzy
            minMatchCharLength: 2
        });

        // 3️⃣ Perform fuzzy search
        const results = fuse.search(q).slice(0, 6);   // limit 6 suggestions

        // 4️⃣ Return clean items
        res.json(results.map(r => r.item));

    } catch (err) {
        console.log("SUGGEST ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get locations for filter (top + search)
router.get("/filters/locations", async (req, res) => {
    try {
        const q = req.query.q?.trim();
        if (!q) return res.json([]);

        const geoRes = await geocoder.forwardGeocode({
            query: q,
            autocomplete: true,
            limit: 6,
            types: ["country", "region", "district", "place", "locality"]
        }).send();

        const results = geoRes.body.features.map(f => ({
            label: f.place_name,          // full context for UI
            bbox: f.bbox,                 // [minLng, minLat, maxLng, maxLat]
            placeType: f.place_type[0]    // country | region | district | place | locality
        }));

        res.json(results);
    } catch (err) {
        console.error("LOCATION FILTER ERROR:", err);
        res.status(500).json([]);
    }
});


// ✅ Currency rates (we'll use later)
router.get("/currency/rates", async (req, res) => {
  try {
    const response = await axios.get("http://data.fixer.io/api/latest", {
      params: { access_key: process.env.FIXER_API_KEY }
    });

    if (!response.data.success) {
      return res.json({ success: false });
    }

    res.json({
      success: true,
      base: response.data.base,
      rates: response.data.rates
    });
  } catch (err) {
    console.log("Fixer error:", err.message);
    res.json({ success: false });
  }
});

module.exports = router;


