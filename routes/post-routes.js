const express = require("express");
const router = express.Router();
const Post = require("../models/Post.model");
const User = require("../models/User");
const Comment = require("../models/Comment.model")
const Reply = require('../models/Reply.model')

//Display all Post
router.get("/timeLine", (req, res, next) => {
  Post.find({})
    .populate([
      { path: "comments", populate: [{ path: "replies" }, { path: "author" }] },
      { path: 'author' }
    ])
    .populate("followers")
    .then((allPost) => {
      console.log(allPost + "***********all post");
      console.log(allPost[0].comments[0].replies[0].reply + "************************replyyyyyyyyy")

      const reversedPosts = allPost.reverse();
      console.log(reversedPosts + "**************reversed");
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
      console.log(data + "*******************************passing to the view");
      res.render('testTimeLine', data);

    })
    .catch((err) => { next(err) })
});

//display user's Post
router.get("/profile/:userId", (req, res, next) => {
  console.log(req.params.userId + "******************user")
  User.findById(req.params.userId)
    .populate({
      path: "userPost",
      populate: [{ path: 'comments', populate: [{ path: 'replies' }, { path: 'author' }] }, { path: 'author' }]
    })
    //.populate("followers")
    .then((user) => {
      //console.log(allPost + "*******************************returning from db ");
      //console.log(allPost.userPost[1].comments[1].replies[0].reply + "************************replyyyyyyyyy")
      //console.log({ allPost: allPost })

      const postArray = user.userPosts.map(post => {
        let commentNo, replyNo;
        if (post.comments.length === 0) {
          commentNo = false;
          replyNo = false;
        }
        else {
          commentNo = true;
          replyNo = true;
          const commentArray = post.comments.map(com => {
            const commentObj = {
              ...com._doc,
              noReply: com.replies.length === 0 ? true : false,
              isOwner: req.user ? com.author._id.toString() === req.user._id.toString() : false
            }
            return commentObj;
          })

        }
        let newPost = [...post._doc];
        newPost.comments = commentArray;

        const obj = {
          post: newPost,
          noComments: commentNo,
          noReply: replyNo,
          isOwner: req.user ? req.params.userId.toString() === req.user._id.toString() : false
        };

        return obj;
      });
      const data = {
        posts: postArray,
        noPost: postArray.length === 0
      };
      console.log(data + "*******************************passing to the view");
      res.render('profile');

    })
    .catch((err) => { next(err) })
});





//create Post
router.post('/createPost', (req, res, next) => {

  if (!req.user) {
    //redirec to Home Page
    res.redirect("/");
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
router.post("/deletePost/:postId", (req, res, next) => {
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