const mongoose = require("mongoose");
const { Schema, model } = mongoose;


const postSchema = new Schema(
  {
    // the user that created the board
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    // the title for the board that will be displayed to users
    title: {
      type: String
    },
    image: {
      type: String
    },
    text: {
      type: String
    },
    // the comments that belong to this board
    comments: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Comment.model"
        }
      ]
    },
    likes: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User"
        }
      ]
    },

    // the users that are following this board
    followers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User"
        }
      ]
    }
  },
  { timestamps: true }
);

const Post = model("Post", postSchema);
module.exports = Post;
