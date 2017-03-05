var localStrategy = require('passport-local').Strategy;
var User = require('./models/users');

module.exports = function(passport){
    passport.use(new localStrategy(function(credential, password, done){
    User.findOne({username: credential}, function(err, user){
        console.log("Looking by username");
        if(err) return done(err);
        if (!user) {
            console.log("Not found...");
            return User.findOne({email: credential}, function(err, user){
                console.log("Looking by email");
                if(err) return done(err);
                if(!user) {
                    console.log("Not found...");
                    return done(null, false, {message: "No such username and email"});
                }
                console.log("Comparing password");
                user.comparePassword(password, function(err, match){
                    if(err) return done(err);
                    if (!match) return done(null, false, {message: "Incorrect password"});
                    return done(null, user);
                });
            });
        }
        user.comparePassword(password, function(err, match){
            if(err) return done(err);
            if (!match) return done(null, false, {message: "Incorrect password"});
            return done(null, user);
        });
    });
}));
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
});
};

