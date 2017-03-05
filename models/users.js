var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    OauthId: String,
    OauthToken: String,
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    group: {
        type: String,
    },
    admin: {
        type: Boolean,
        default: false
    }
});
UserSchema.methods.getName = function() {
    return (this.firstname+' '+this.lastname)
}

UserSchema.methods.comparePassword = function(candidate, callback) {
    bcrypt.compare(candidate, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
});
}

UserSchema.pre('save', function(next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        })
    })                   
})

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);