const express = require("express");
const router = express.Router();
const Post = require("../models/Post.model");
const User = require("../models/User");

//Display Post
router.get("/timeLine", (req, res, next) => {
  Post.find({})
    .then((allPost) => {
      const reversedPosts = allPost.reverse();
      const postArray = reversedPosts.map(post => {
        const obj = {
          ...post._doc,
          isOwner: req.user
            ? post.author._id.toString() ===
            req.user._id.toString()
            : false
        };
        return obj;
      });
      const data = {
        posts: postArray,
        noPost: postArray.length === 0
      };
      console.log(data);
      res.render('testTimeLine', data);

    })
    .catch((err) => { next(err) })
});

//create Post
router.post('/createPost', (req, res, next) => {

  if (!req.user) {
    //redirec to Home Page
    res.redirect("/users");
    // here we will add a return to stop the rest of the route from running otherwise we may get errors for not finding req.session.user or possibly create blank boards.
    return;
  }
  const newPost = req.body;
  newPost.author = req.user._id;

  Post.create(newPost)
    .then(createdPost => {
      //update user post
      User.findByIdAndUpdate(
        req.user._id,
        { $push: { userPost: createdPost._id } },
        { new: true }
      )
        .then(() => {
          res.redirect('/timeLine');
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));

})
//update post for followers
router.post("/updateFollowers/:postI", (req, res, next) => {
  Post.findById(req.params.postId)
    .then(postFromDB => {
      if (postFromDB.followers.includes(re.user._id)) {
        postFromDB.pull(re.user._id);
      } else {
        postFromDB.push(re.user._id);
      }
      postFromDB
        .save()
        .then(updatedBoard => {
          res.redirect("back");
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});
//update likes
router.post("/updateLikes/:postI", (req, res, next) => {
  Post.findById(req.params.postId)
    .then(postFromDB => {

      if (postFromDB.likes.includes(re.user._id)) {
        postFromDB.pull(re.user._id);
      } else {
        postFromDB.push(re.user._id);
      }
      postFromDB
        .save()
        .then(updatedBoard => {
          res.redirect("back");
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

//delete post
router.post("/delete/:postId", (req, res, next) => {
  if (!re.user) {
    res.redirect("/auth/login");
  }

  Post.findByIdAndDelete(req.params.postId)
    .then(() => {
      User.findByIdAndUpdate(
        re.user._id,
        { $pull: { userPost: req.params.postId } },
        { new: true }
      )
        .then(() => {
          res.redirect("/timeLine");
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});




module.exports = router;