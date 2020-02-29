const User = require('../models/User');
const _ = require('lodash');
const passport = require("passport");
//const io = require('socket.io')(server);
//const socket = io(http);

// BCrypt to encrypt passwords
const bcryptjs = require('bcryptjs');
const bcryptSalt = 10;

// Signup view
const signup = (req, res, next) => {
  res.render('index');
}

// Create a new user
const create = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // no empty fields
  if (!firstName || !lastName || !email || !password) {
    res.render('index', {
      errorMessage: 'All fields are mandatory. Please, provide all the information'
    })
    return;
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        res.render('index', { errorMessage: "User already exists" });
        return;
      }

      bcryptjs
        .genSalt(bcryptSalt)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPass => User.create({
          firstName,
          lastName,
          email,
          password: hashedPass
        }))
        .then(userFromDB => {
          console.log('Newly created user: ', userFromDB);
          next();       // this next takes you to the next route to login
        })
        .catch(err => {
          console.log(err);
          res.send({ errorMessage: err.message })
        })
    })
    .catch(err => {
      console.log(err);
      res.send({ errorMessage: err.message })
    })
}

/* The User is vailable through req.user after Passport authentication at signin */

// Reading - for profile page
const read = (req, res) => {
  console.log(req.user)
  //socket.on('connection', (socket => {
  //  socket.emit('message', `User ${req.user.name} connected`);
  //}))
  res.render('profile');
}

// Updating
/* The update function retrieves the user details from req.profile, then
uses the lodash module to extend and merge the changes that came in the
request body to update the user data.
*/
const readForUpdate = (req, res) => {
  res.render('edit-profile');
}

const update = (req, res, next) => {
  const updatedUser = req.body;

  User.findById(req.user.id)
    .then(user => {
      if (req.file.url && req.file.originalname) {
        const imgPath = req.file.url;
        const imgName = req.file.originalname;
        updatedUser.profilePicture = { imgPath, imgName }
      }
      if (updatedUser.firstName) user.firstName = updatedUser.firstName;
      if (updatedUser.lastName) user.lastName = updatedUser.lastName;
      if (updatedUser.age) user.age = updatedUser.age;
      if (updatedUser.street) user.address.street = updatedUser.street;
      if (updatedUser.city) user.address.city = updatedUser.city;
      if (updatedUser.state) user.address.state = updatedUser.state;
      if (updatedUser.zip) user.address.zip = updatedUser.zip;
      user.save();
      console.log(user)
      res.redirect('/profile')
    })
    .catch(err => {
      res.send(err)
    })
}

// Deleting
/* The remove function retrieves the user from req.profile and uses the
remove() query to delete the user from the database.
*/
const remove = (req, res, next) => {
  let loggedUser = req.user;
  loggedUser.remove()
    .then((err, deletedUser) => {
      if (err) {
        return res.status(400).send({ errorMessage: err })
      }
      deletedUser.password = undefined;
      res.send({ deletedUser })
    })
}



module.exports = { signup, create, read, readForUpdate, update, remove };
