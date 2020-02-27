const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;


// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.

passport.use(
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  ( username, password, done ) => {
    User.findOne({ email: username })
    .then( user => {
      if (!user) {
        return done( null, false, { errorMessage: 'Incorrect email' });
      }
      if (!bcryptjs.compareSync( password, user.password )) {
        return done(null, false, { errorMessage: 'Incorrect password' });
      } 
      done(null, user);
    })
    .catch( error => {
      done(error) 
    });
  })
);


  // Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.

passport.serializeUser( (user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser( (id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});