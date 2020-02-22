const User = require('../models/User');

// BCrypt to encrypt passwords
const bcryptjs = require('bcryptjs');
const bcryptSalt = 10;

// Signup view
const signup = (req, res, next) => {
  res.render('./auth/signup');
}

// Create a new user
const create = (req, res, next) => {
  const { firstName, lastName, userName, email, password } = req.body;
  // no empty fields
  if (!firstName || !lastName || !userName || !email || !password) {
    res.render('./auth/signup', {
      errorMessage: 'All fields are mandatory. Please, provide all the information'
    })
  }

  User
    .findOne({ userName })
    .then(user => {
      //console.log(user)
      if (user) {
        res.render('./auth/signup', { errorMessage: "User already exists" });
        return;
      }

      bcryptjs
        .genSalt(bcryptSalt)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPass => User.create({
          firstName,
          lastName,
          userName,
          email,
          password: hashedPass
        }))
        .then(userFromDB => {
          // asing session to req.ssesion.user
          console.log(req.session)
          //req.session.user = userFromDB;
          //res.locals.user = req.session.user
          console.log('Newly created user: ', userFromDB);
          //res.redirect('/...')
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

//Load user and append to req.
const userById = (req, res, next, id) => {
  User
    .findById(id)
    .then((err, user) => {
      if (err || !user) {
        return res.status('400').send({ errorMessage: "User not found" })
      }
      req.profile = user
      next()
    })
}

// Read operation
const read = (req, res) => {
  req.profile.password = undefined
  req.profile.salt = undefined
  return res.send(req.profile)
}

// Update operation


module.exports = { signup, create, userById, read };
