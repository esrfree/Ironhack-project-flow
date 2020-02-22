
const User = require('../models/User')
//const passport = require("passport");

const signinForm = (req, res) => {
  res.render('auth/signin')
}

const signin = (req, res, next) => {
  User.findOne({ userName: req.body.username })
    .then(userFromDB => {
      if (!userFromDB) {
        res.render('./auth/signin', { errorMessage: "This username was not found in the system" });
      }
      else {
        req.session.user = userFromDB;
        res.locals.user = req.session.user;
        res.render('/timeLine')

      };

    })
    .catch((err) => { next(err) });
}


/* After successful authentication, Passport will establish a persistent login session.
This is useful for the common scenario of users accessing a web application via a browser.
*/
// const signin = passport.authenticate('local', {
//   successRedirect: '/timeLine',
//   failureRedirect: '/login',
//   failureFlash: true
// })

module.exports = { signinForm, signin };