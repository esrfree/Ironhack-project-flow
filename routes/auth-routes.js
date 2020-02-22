const express = require("express");
const passport = require("passport");
const authCtrl = require('../controllers/auth-controllers')

const router = express.Router()

router.route('/login2')
  .get(authCtrl.signinForm)
  .post(authCtrl.signin)


//include this in login susscesfull 
//req.session.currentUser=user

//router.route('/auth/signout')
//  .get(authCtrl.signout)
//
module.exports = router;

