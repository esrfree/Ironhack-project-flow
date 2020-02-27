const express = require("express");
const router = express.Router();
const Post = require("../models/Post.model");
const User = require("../models/User");
const Comment = require('../models/Comment.model')
const Reply = require('../models/Reply.model')


//create comment
router.post("/createComment/:postId", (req, res, next) => {
  // Logged in user is set as the messages author and the message is grabbed from the body
  const theComment = req.body;
  theComment.author = req.user._id;

  // create a new comment and send it back in json format
  Comment.create(theComment)
    .then(newlyCreatedComment => {
      // find the post we comment to from params and update it with the reference to the reply
      Post.findByIdAndUpdate(
        req.params.postId,
        { $push: { comments: newlyCreatedComment._id } },
        { new: true }
      )
        .then(updatedPost => {
          //res.status(200).json(updatedPost);
          res.redirect('/timeLine');
        })
        .catch(err => next(err));
    })

    //   .then(newlyCreatedMessage => {
    //     res.status(200).json({ newlyCreatedMessage });
    //   })
    .catch(err => next(err));
});


//delete comment
router.post("/deleteComment/:commentId/:postId", (req, res, next) => {
  // find the post and remove the reference to the comment that is being deleted
  Post.findByIdAndUpdate(
    req.params.postId,
    { $pull: { comments: req.params.commentId } },
    { new: true }
  )
    .then(() => {
      // remove the message itself and redirect user to the previous page
      Comment.findByIdAndDelete(req.params.commentId)
        .then(() => {
          res.redirect("back");
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});


module.exports = router;