const express = require("express");
const authCtrl = require('../controllers/auth-controllers')

const router = express.Router()

router.route('/login')
  //.get(authCtrl.login)
  .post(authCtrl.authenticated)


router.route('/logout')
  .get(authCtrl.logout)


module.exports = router;

