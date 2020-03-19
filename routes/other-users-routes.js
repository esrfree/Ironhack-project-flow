const express = require("express");
const router = express.Router();
const isLoggedIn    = require('../configs/route-guard-config');
const otherUserCtrl = require('../controllers/other-users-controller')

/* This routes are gonna use the req.params property
to loock for user's information
*/

router
    .route('/users', isLoggedIn)
    .get(otherUserCtrl.list) 

router
    .route('/users/:userId', isLoggedIn)
    .get(otherUserCtrl.readOther)
    //.put(otherUserCtrl.updateOther)
    //.delete(otherUserCtrl.deleteOther)

router.param('userId', otherUserCtrl.userById)

module.exports = router;