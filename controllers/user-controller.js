const User      = require('../models/User');
const _         = require('lodash');

// BCrypt to encrypt passwords
const bcryptjs = require('bcryptjs');
const bcryptSalt = 10;

// Signup view
const signup = ( req, res, next ) => {
  res.render('./auth/signup');
}

// Create a new user
const create = ( req, res, next ) => {  
  const { firstName, lastName, userName, email, password } = req.body;
  
  // no empty fields
  if( !firstName || !lastName || !userName || !email || !password ) {
    res.render('./auth/signup', {
      errorMessage: 'All fields are mandatory. Please, provide all the information'
    })
  }

  User.findOne({ userName })
    .then( user => {
      if (user) {
      res.render('./auth/signup', { errorMessage: "User already exists"});
      return;
      }

      bcryptjs
      .genSalt(bcryptSalt)
      .then( salt => bcryptjs.hash( password, salt ))
      .then( hashedPass => User.create({
        firstName,
        lastName,
        userName,
        email,
        password: hashedPass
      }))
      .then( userFromDB => {
        console.log('Newly created user: ', userFromDB);
        res.redirect('/login')
      })
      .catch( err => {
        console.log(err);
        res.send({ errorMessage: err.message })
      })
    })
    .catch( err => {
      console.log(err);
      res.send({ errorMessage: err.message })
    })
}

/* The User is vailable through req.user after Passport authentication at signin */

// Reading
/* This function retrieves the user details from req.profile and removes
sensitive information before sending the user object in the response
to the requesting client.
*/
const read = (req, res) => {
  console.log(req.user)
  res.render('./auth/userView')
}

// Updating
/* The update function retrieves the user details from req.profile, then
uses the lodash module to extend and merge the changes that came in the
request body to update the user data.
*/
const update = (req, res, next) => {
  let loggedUser = req.user;
  loggedUser = _.extend(loggedUser, req.body);
  loggedUser.save()
  .then( (err, updatedUser) => {
    if (err) {
      return res.status(400).send({ errorMessage: err })
    }
    updatedUser.password = undefined;
    res.send({ updatedUser }); // req.user = updatedUser ????
  })
}

// Deleting
/* The remove function retrieves the user from req.profile and uses the
remove() query to delete the user from the database.
*/
const remove = (req, res, next) => {
  let loggedUser = req.user;
  loggedUser.remove()
  .then( (err, deletedUser) => {
    if (err) {
      return res.status(400).send({ errorMessage: err })
    }
    deletedUser.password = undefined;
    res.send({ deletedUser })
  })
}



module.exports = {signup, create, read, update, remove };
