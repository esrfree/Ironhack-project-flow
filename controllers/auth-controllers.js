
const passport = require("passport");

const login = (req, res) => {
  res.render('./auth/signin')
}

//const signin = ( req, res, next ) => {
//  User.findOne({ userName: req.body.username })
//      .then( userFromDB => {
//        if( !userFromDB ) {
//          res.render('./auth/signin' , { 
//            errorMessage: "This username was not found in the system"
//          })
//          return;
//        }
//        
//      })
//}


/* After successful authentication, Passport will establish a persistent login session.
This is useful for the common scenario of users accessing a web application via a browser.

Your User object is now available through req.user in an express app route callback
after the user has been authenticated by passport.
*/
const authenticated = passport.authenticate('local', {                  
                  successRedirect: '/',
                  failureRedirect: '/login'
                })


const signout = (req, res) => {
  req.session.destroy();
  res.redirect('/login')
}

module.exports = {login, authenticated, signout};