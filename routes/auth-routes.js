const express = require("express");
const authCtrl = require('../controllers/auth-controllers')

const router = express.Router()

router.route('/login')
  //.get(authCtrl.login)
  .post(authCtrl.authenticated)


router.route('/signout')
  .get(authCtrl.signout)


module.exports = router;

