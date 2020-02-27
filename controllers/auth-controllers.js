
const passport = require("passport");

const login = (req, res) => {
  res.render('./index')
}

/* After successful authentication, Passport will establish a persistent login session.
This is useful for the common scenario of users accessing a web application via a browser.

Your User object is now available through req.user in an express app route callback
after the user has been authenticated by passport.
*/
const authenticated = passport.authenticate('local', {                  
                  successRedirect: '/profile',
                  failureRedirect: '/signup'
                })


const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/')
}

module.exports = {login, authenticated, logout};