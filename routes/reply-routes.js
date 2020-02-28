const express = require("express");
const router = express.Router();
const Post = require("../models/Post.model");
const User = require("../models/User");
const Comment = require("../models/Comment.model")
const Reply = require('../models/Reply.model')

//modify route***********************************************
router.post("/createReply/:commentId", (req, res, next) => {

  if (!req.user) {
    res.redirect("/");
    console.log("no user")
    return;
  }
  // create a new reply from our request and set the logged in user to be author of the reply
  const theReply = req.body;
  theReply.author = req.user._id;
  console.log(theReply)
  // create a new reply message, and once we have it push the reference _id of the reply to it onto the original message
  Reply.create(theReply)
    .then(newlyCreatedReply => {
      console.log("created reply" + newlyCreatedReply)
      // find the message we reply to from params and update it with the reference to the reply
      Comment.findByIdAndUpdate(
        req.params.commentId,
        { $push: { replies: newlyCreatedReply._id } },
        { new: true }
      )
        .then(updatedMessage => {
          //res.status(200).json(updatedMessage);
          res.redirect('/timeLine');
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

// deleting the reply message
router.post("/deleteReply/:replyId/:commentId", (req, res, next) => {
  // first find the message reply references to and remove the reference to the reply
  Comment.findByIdAndUpdate(req.params.commentId, {
    $pull: { replies: req.params.replyId }
  })
    .then(() => {
      // find and delete the reply
      Reply.findByIdAndDelete(req.params.replyId)
        .then(() => {
          next();
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});


// Update the reply (findByIdAndUpdate will by default return old(un-updated) message, {new: true} is used to return updated message)
router.post("/updateReply/:replyId", (req, res, next) => {
  Reply.findByIdAndUpdate(req.params.replyId, { new: true })
    .then(() => {
      next();
    })
    .catch(err => next(err));
});


module.exports = router;