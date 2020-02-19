const express = require("express");
const router = express.Router();
const Post = require("../../models/Post.model");
const User = require("../../models/User");

//Display Post
router.get("/timeLine", (req, res, next) => {
  Post.find()
    .then((allPost) => {

    })
    .catch((err) => { next(err) })

})



module.exports = router;