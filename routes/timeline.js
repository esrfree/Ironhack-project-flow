const express = require('express');
const router  = express.Router();

/* GET timeline page */
router.get('/timeline', (req, res, next) => {
  res.render('timeline');
});

module.exports = router;
