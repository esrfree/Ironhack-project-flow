const express = require("express");
const router = express.Router();
const userCtrl = require('../controllers/user-controllers')
const authCtrl = require('../controllers/auth-controllers')

router.route('api/users')
  .get(userCtrl.lis)
  .post(userCtrl.create)


router.route('/api/users/:userId')
  .get(authCtrl.update)
  .put(authCtrl.update)
  .delete(authCtrl.remove)

router.param('userId', userCtrl.userById)

module.exports = router;
