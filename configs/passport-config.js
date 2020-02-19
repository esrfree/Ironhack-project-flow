const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const session      = require('express-session')


// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.

passport.use(
  new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password', 
    passReqToCallback: true 
  }, 
  ( req, username, password, callback ) => {
    User.findOne({ userName: username })
    .then( user => {
      if (!user) {
        return callback( null, false, { errorMessage: 'Incorrect username' });
      }
      if (!bcryptjs.compareSync( password, user.password )) {
        return callback(null, false, { errorMessage: 'Incorrect password' });
      } 
      callback(null, user);
    })
    .catch( error => { 
      callback(error); 
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