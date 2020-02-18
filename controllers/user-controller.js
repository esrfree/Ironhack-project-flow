const User = require('../models/User');

// BCrypt to encrypt passwords
const bcryptjs = require('bcryptjs');
const bcryptSalt = 10;

const create = ( req, res, next ) => {
  
  const { firstName, lastName, userName, email, password } = req.body;

  if( !firstName || !lastName || !userName || !email || !password ) {
    res.send({ errorMessage: 'All fields are mandatory. Please, provide all the information' })
  }

  User
    .findOne({ userName })
    .then( user => {

      if (user) {
      res.send({ errorMessage: "User already exists"});
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

module.exports = { create };
