const express = require('express');
const router  = express.Router();

/* GET timeline page */
router.get('/users', (req, res, next) => {
  res.render('user-list');
});

module.exports = router;