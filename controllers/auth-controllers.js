const User = require('../models/User');

const signinForm = (req, res) => {
  res.render('./auth/signin')
}

const signin = ( req, res, next ) => {
  User.findOne({ username: req.body.username })
      .then( userFromDB => {
        if( !userFromDB ) {
          res.rende('./auth/signin', {
          message: "This username was not found in the system"
          })
          return;
        }
        
      })
}


module.exports = {signinForm, signin};