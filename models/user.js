const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const leanVirtuals = require('mongoose-lean-virtuals');
const { Schema } = mongoose; 


const opts = {
    toJSON: { virtuals: true }, 
    toObject: {virtuals: true}, 
    timestamps: true, 
}

const UserSchema = new Schema({
    email: {
        type: String, 
        required: true, 
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    profileImage: {
        url: {
            type: String,
        },
        filename: String
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date, 
    // the below two is for google/github oauth login
    googleId: {
        type: String
    },
    githubId: String, 
    facebookId: String,
    authProvider: {
        type: [String],
        default: ["local"]
    }, 
    savedCampgrounds: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campground"
    }, 
]
}, opts);

UserSchema.virtual('firstName').get(function(){
    return this.fullName?.split(" ")[0] || this.fullName || this.username;
});

// profile pic, later gonna use as fallback, when we setup real profile pic
UserSchema.virtual('profileInitial').get(function() {
    if (!this.fullName) return this.username?.[0]?.toUpperCase() || '?';
    return this.fullName.trim()[0].toUpperCase();
})

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(leanVirtuals); 
module.exports = mongoose.model('User', UserSchema);
