const express = require("express");
const router = express.Router();
const userCtrl = require('../controllers/user-controller');
const authCtrl = require('../controllers/auth-controllers')
const isLoggedIn    = require('../configs/route-guard-config');

router
  .route('/signup')
  //.get(userCtrl.list)
  .get(userCtrl.signup)
  .post(userCtrl.create)
  .post(authCtrl.authenticated)


router
    .route('/profile', isLoggedIn)
    .get(userCtrl.read)
//  .put(userCtrl.update)
    .delete(userCtrl.remove)



module.exports = router;
