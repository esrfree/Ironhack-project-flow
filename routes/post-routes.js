const express = require("express");
const router = express.Router();
const Post = require("../models/Post.model");
const User = require("../models/User");

//Display Post
router.get("/timeLine", (req, res, next) => {
  Post.find()
    .then((allPost) => {
      const postArray = allPost.map(post => {
        const obj = {
          ...post._doc,
          isOwner: req.session.user
            ? post.author._id.toString() ===
            req.session.user._id.toString()
            : false
        };
        return obj;
      });
      const data = {
        posts: postArray,
        noPost: postArray.length === 0
      };
      res.render('/timeline', data);

    })
    .catch((err) => { next(err) })
});

//create Post
router.post('/createPost', (req, res, next) => {

  if (!req.session.user) {
    //redirec to Home Page
    res.redirect("auth/signin");
    // here we will add a return to stop the rest of the route from running otherwise we may get errors for not finding req.session.user or possibly create blank boards.
    return;
  }

})



module.exports = router;