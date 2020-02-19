const express = require("express");
const router = express.Router();
const userCtrl = require('../controllers/user-controller')
const authCtrl = require('../controllers/auth-controllers')

router.route('/api/users')
  .get(userCtrl.list)
  .get(userCtrl.signup)
  .post(userCtrl.create)


router.route('/api/users/:userId')
    .get(userCtrl.read)
//  .put(authCtrl.update)
//  .delete(authCtrl.delete)
//
router.param('userId', userCtrl.userById)

module.exports = router;
