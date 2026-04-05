const mongoose = require('mongoose')
const Schema = mongoose.Schema; 

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const opts = {
    toJSON: { virtuals: true }, //include virtuals when converted to json
    toObject: {virtuals: true}, //include virtuals when converted to object
    timestamps: true, 
}

const reviewSchema = new Schema({
    body: String, 
    rating: Number, 
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }, 
    images: [ImageSchema], 
    campground: {
        type: Schema.Types.ObjectId,
        ref: 'Campground'
    }
}, opts)

reviewSchema.index({ auther: 1, createdAt: -1 }); // reviews tab
reviewSchema.index({ campground: 1 }); // dashboard reviews populate

module.exports = mongoose.model('Review', reviewSchema)