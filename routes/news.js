const express = require('express');
const router  = express.Router();
const isLoggedIn    = require('../configs/route-guard-config');
const userCtrl = require('../controllers/user-controller');

//News
router
  .route('/news')
  .get(isLoggedIn, userCtrl.newsFeed)

module.exports = router;
