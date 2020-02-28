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
    .route('/profile')
    .get(isLoggedIn, userCtrl.read)
//  .put(userCtrl.update)
//  .delete(userCtrl.remove)

router
    .route('/profile/edit')
    .get(userCtrl.readForUpdate)
    .post(userCtrl.update)



module.exports = router;
