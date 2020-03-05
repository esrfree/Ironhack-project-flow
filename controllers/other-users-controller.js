const User          = require('../models/User');
const _             = require('lodash');


/* This controller is to access and manipulate other users' information
and it doesn't use the req.user object created after Passport authentication */

// Listing all users ( returning first name, last name, email, updated & created )
const list = (req, res) => {
  User.find()
  .select( 'profilePicture firstName lastName email' )
  .then( users => {
    console.log(users)
    res.render('user-list', {users} )
  })
  .catch( err => res.status(400).send({ errorMessage: err } )
  )}


// Loading a user by ID to Read, Update, or Delete
const userById = (req, res, next, id) => {
  User.findById(id)
    .then( (user) => {
      /* If a matching user is found in the database,
      the user object is appended to the request object
      in the profile key */
      req.profile = user;
      /* Then, the next() middleware is used to propagate
      control to the next relevant controller function */
      next()
    })
    .catch( err => res.status('400').send({ errorMessage: "User not found" }) )
}


// Reading
/* This function retrieves the user details from req.profile and removes
sensitive information before sending the user object in the response
to the requesting client.
*/
const readOther = (req, res) => {
  let user = req.profile;
  user.password = undefined;
  res.render('profile', { user })
}

// Updating
/* The update function retrieves the user details from req.profile, then
uses the lodash module to extend and merge the changes that came in the
request body to update the user data.
*/
const updateOther = (req, res, next) => {
  let userFound = req.profile;
  userFound = _.extend(userFound, req.body);
  userFound.save( err => {
    if (err) {
      return res.status(400).send({ errorMessage: err })
    }
    userFound.password = undefined;
    res.send({ userFound });
  })
}

// Deleting
/* The remove function retrieves the user from req.profile and uses the
remove() query to delete the user from the database.
*/
const deleteOther = (req, res, next) => {
  let userFound = req.profile;
  userFound.remove()
  .then( (err, deletedUser) => {
    if (err) {
      return res.status(400).send({ errorMessage: err })
    }
    deletedUser.password = undefined;
    res.send({ deletedUser })
  })

}

module.exports = {list, userById, readOther, updateOther, deleteOther};