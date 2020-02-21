const express = require("express");
const router = express.Router();
const userCtrl = require('../controllers/user-controller')
const isLoggedIn    = require('../configs/route-guard-config');

router
  .route('/signup')
  //.get(userCtrl.list)
  .get(userCtrl.signup)
  .post(userCtrl.create)


router
    .route('/user', isLoggedIn)
    .get(userCtrl.read)
//  .put(userCtrl.update)
    .delete(userCtrl.remove)



module.exports = router;
