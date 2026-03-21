const mongoose = require('mongoose')
const Schema = mongoose.Schema; 

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const reviewSchema = new Schema({
    body: String, 
    rating: Number, 
    auther: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }, 
    images: [ImageSchema] 
}, { timestamps: true })

module.exports = mongoose.model('Review', reviewSchema)