// schemas.js
const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().min(1).max(30),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    description: Joi.string().required().max(500),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().max(500),
  }).required(),
  deleteReviewImages: Joi.array() 
});

module.exports.userSchema = Joi.object({
  username: Joi.string().min(3).required(),
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  terms: Joi.string().valid('on').required(),
});
