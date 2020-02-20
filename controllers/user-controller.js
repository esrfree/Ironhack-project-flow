const User = require('../models/User');
const _ = require('lodash');

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

  User
    .findOne({ userName })
    .then( user => {
      //console.log(user)
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
        //res.redirect('/...')
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

// Listing all users ( returning first name, last name, email, updated & created )
const list = (req, res) => {
  User.find()
  .then( (err, users) => {
    if (err) {
      return res.status(400).send({ errorMessage: err })
    }
    res.send({ users })
  })
  .select( 'firstName lastName email updated')
}

// Loading a user by ID to Read, Update, or Delete
const userById = (req, res, next, id) => {
  User
    .findById(id)
    .then( (err, user) => {
      if (err || !user) {
        return res.status('400').send({ errorMessage: "User not found" })
      }
      /* If a matching user is found in the database,
      the user object is appended to the request object
      in the profile key */
      req.session.user = user;
      /* Then, the next() middleware is used to propagate
      control to the next relevant controller function */
      next()
    })
}

// Reading
/* This function retrieves the user details from req.profile and removes
sensitive information before sending the user object in the response
to the requesting client.
*/
const read = (req, res) => {
  req.profile.password = undefined
  req.profile.salt = undefined
  return res.send({ userProfile: req.session.user })
}

// Updating
/* The update function retrieves the user details from req.profile, then
uses the lodash module to extend and merge the changes that came in the
request body to update the user data.
*/
const update = (req, res, next) => {
  let user = req.profile;
  user = _.extend(user, req.body);
  user.save( err => {
    if (err) {
      return res.status(400).send({ errorMessage: err })
    }
    user.password = undefined;
    res.send({ user });
  })
}

// Deleting
/* The remove function retrieves the user from req.profile and uses the
remove() query to delete the user from the database.
*/
const remove = (req, res, next) => {
  let user = req.profile;
  user.remove()
  .then( (err, deletedUser) => {
    if (err) {
      return res.status(400).send({ errorMessage: err })
    }
    deletedUser.password = undefined;
    res.send({ deletedUser })
  })

}



module.exports = {signup, create, list, userById, read, update, remove};
