const express = require("express");
const passport = require("passport");
const authCtrl = require('../controllers/auth-controllers')

const router = express.Router()

router.route('/login')
  .get(authCtrl.signinForm)
  .post(authCtrl.signin)


//router.route('/auth/signout')
//  .get(authCtrl.signout)
//
module.exports = router;

