var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var expressSession = require('express-session');
var users = require('./mongoModel.js');


//sessions and Passport
exports.init = function (app) {
  // If you are using sessions, or Passport sessions, include the middleware
  // For more info: https://github.com/expressjs/session
  app.use(expressSession((
    {secret: 'Tartans', // Sessions will be "signed" to prevent tampering
     resave: false,     // Don't resave session if not saved
     saveUninitialized: true }))); // Save uninitialized session
  // Initialize Passport
  app.use(passport.initialize());
  // Include middleware for Passport sessions.
  app.use(passport.session());
  // Return the Passport object configured here.
  return passport;
}


passport.use(new Strategy(
  function(username, password, done) {
    users.findByUsername("users", username, function(err, foundUser) {
      if (err) { return done(err); }
      if (!foundUser) { return done(null, false); }
      if (foundUser.pwd!= password) { return done(null, false); }
      return done(null, foundUser);
    });
  }));



passport.serializeUser(function(user, done) {
  // Pass null for no error, and the user ID as a key to lookup the user
  // upon deserialization.
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  users.findById("users", id, function (err, foundUser) {
    // pass back err (if any) and the user object associated with this ID
    done(err, foundUser);
  });
});





