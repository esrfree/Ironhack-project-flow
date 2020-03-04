const express = require('express');
const router  = express.Router();

/* GET profile edit page */
router.get('/profile/edit', (req, res, next) => {
  res.render('profile-edit');
});

module.exports = router;