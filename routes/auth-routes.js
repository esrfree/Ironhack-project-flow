const express = require("express");
const authCtrl = require('../controllers/auth-controllers')

const router = express.Router()

router.route('/auth/signin')
  .get(authCtrl.signinForm)
  .post(authCtrl.signin)
//
//router.route('/auth/signout')
//  .get(authCtrl.signout)
//
module.exports = router;

