const express = require("express");
const router = express.Router();
const Post = require("../models/Post.model");
const User = require("../models/User");
const Comment = require("../models/Comment.model");
const Reply = require('../models/Reply.model');
const isLoggedIn    = require('../configs/route-guard-config');
const uploadCloud = require("../configs/cloudinary-config");

//Display all Post
router.get("/timeline", isLoggedIn, (req, res, next) => {
  // console.log('inside route***********************************************************');
  Post.find({})
    .populate([
      { path: "comments", populate: [{ path: "replies" }, { path: "author" }] },
      { path: 'author' }
    ])
    .populate("followers")
    .then((allPost) => {
      // console.log(allPost + "***********all post");
      // console.log(allPost[0].comments[0].replies[0].reply + "************************replyyyyyyyyy")

      const reversedPosts = allPost.reverse();
      // console.log(reversedPosts + "**************reversed");
      const postArray = reversedPosts.map(post => {
        const obj = {
          ...post._doc,
          noComments: post.comments.length === 0 ? true : false,
          isOwner: req.user ? post.author._id.toString() === req.user._id.toString() : false
        };
        return obj;
      });
      const data = {
        posts: postArray,
        noPost: postArray.length === 0
      };
      // console.log(data + "*******************************passing to the view");
      res.render('timeline', data);

    })
    .catch((err) => { next(err) })
});

//display user's Post
router.get("/profile/:userId", (req, res, next) => {

  User.findById(req.params.userId)
    .populate({
      path: "userPost",
      populate: [{ path: 'comments', populate: [{ path: 'replies' }, { path: 'author' }] }, { path: 'author' }]
    })
    //.populate("followers")
    .then((user) => {
      // console.log(user.userPost.length + "  numero de post**************************************")
      // console.log(user)
      const postArray = user.userPost.map((post, i) => {
        //   // console.log(post.comments[0].author + "****************************post.comments")
        let updatedComments = post._doc.comments.map(comment => {
          // console.log(req.user._id, comment.author._id, req.user && comment.author._id === req.user._id)
          // console.log(comment.comment);
          return {
            ...comment,
            isOwner: req.user && comment.author._id.toString() === req.user._id.toString()
          }
        }
        )
        // console.log(updatedComments)
        const obj = {
          ...post._doc,
          noComments: post.comments.length === 0 ? true : false,
          comments: updatedComments,
          isOwner: req.user ? post.author._id.toString() === req.user._id.toString() : false
        };
        // console.log(obj.comments[0])
        return obj;
      });
      const data = {
        posts: postArray,
        noPost: postArray.length === 0
      };

      res.render('profile', data);

    })
    .catch((err) => { next(err) })
});





//create Post
router.post('/createPost', uploadCloud.single("image"), (req, res, next) => {

  if (!req.user) {
    //redirec to Home Page
    res.redirect("/");
    // here we will add a return to stop the rest of the route from running otherwise we may get errors for not finding req.session.user or possibly create blank boards.
    return;
  }
  const newPost = req.body;
  newPost.author = req.user._id;
  if(req.file)
  newPost.image = req.file.url;

  Post.create(newPost)
    .then(createdPost => {
      //update user post
      User.findByIdAndUpdate(
        req.user._id,
        { $push: { userPost: createdPost._id } },
        { new: true }
      )
        .then(() => {
          // res.redirect(`/profile/${req.user._id}`);
          res.redirect('back')
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));

})
//update post for followers
router.post("/updateFollowers/:postId", (req, res, next) => {
  // let newParam = req.params.postId.toString().slice(0, -1);
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
router.post("/updateLikes/:postId", (req, res, next) => {
  Post.findById(req.params.postId)
    .then(postFromDB => {
      console.log("*************************************found")
      if (postFromDB.likes.includes(req.user._id)) {
        postFromDB.likes.pull(req.user._id);
        console.log("*************************************incluides")
      } else {
        postFromDB.likes.push(req.user._id);
        console.log("***********No**************************incluides")
      }
      postFromDB
        .save()
        .then(updatedPost => {
          // res.redirect(`/profile/${req.user._id}`);
          res.redirect("back");
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

//delete post
router.post("/deletePost/:postId", (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/login");
  }
  Post.findById(req.params.postId)
    .populate({
      path: "comments", populate: { path: 'replies' }
    })
    .then(post => {
      let a = post.comments[0].reply[0]
      console.log("inside post" + a)
      post.comments.map(com => {
        console.log("inside comment")
        com.reply.map(reply => {
          console.log("inside reply")
          Reply.findByIdAndDelete(reply._id)
            .then((value) => { console.log(deleted) })
            .catch(err => next(err))
        })
        Comment.findByIdAndDelete(com._id)
          .then((value) => { console.log(deleted) })
          .catch(err => next(err))
      })
    })
    .catch(err => next(err));

  Post.findByIdAndDelete(req.params.postId)
    .then(() => {

      User.findByIdAndUpdate(
        req.user._id,
        { $pull: { userPost: req.params.postId } },
        { new: true }
      )
        .then(() => {
          // res.redirect(`/profile/${req.user._id}`);
          res.redirect("back");
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});








module.exports = router;