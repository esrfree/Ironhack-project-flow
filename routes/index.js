const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/profile', (req, res, next) => {
 res.render('profile');
});

router.get('/profile-edit', (req, res, next) => {
  res.render('profile-edit');
 });

 router.get('/timeline-test', (req, res, next) => {
  res.render('timeline-test');
 });

// router.get('/profile', (req, res, next) => {
//   res.render('profile');
// });

// router.get('/news', (req, res, next) => {
//   res.render('news');
// });

module.exports = router;
