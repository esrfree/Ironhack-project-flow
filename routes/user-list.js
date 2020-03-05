const express = require('express');
const router  = express.Router();
const otherUserCtrl = require('../controllers/other-users-controller');
const isLoggedIn    = require('../configs/route-guard-config');

/* GET timeline page */
router
.route('/users')
.get(isLoggedIn, otherUserCtrl.list)

module.exports = router;