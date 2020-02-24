const express = require("express");
const router = express.Router();
const Post = require("../models/Post.model");
const User = require("../models/User");
const Comment = require('../models/Comment.model')


//create message
router.post("/create/comment/:postId", (req, res, next) => {
  // Logged in user is set as the messages author and the message is grabbed from the body
  const theComment = req.body;
  theComment.author = req.session.user._id;
  theComment.parentPost = req.params.postId;

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
          res.status(200).json(updatedPost);
        })
        .catch(err => next(err));






  //   .then(newlyCreatedMessage => {
  //     res.status(200).json({ newlyCreatedMessage });
  //   })
    .catch (err => next(err));
});