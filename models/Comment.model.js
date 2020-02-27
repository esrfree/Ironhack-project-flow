const mongoose = require("mongoose");
const { Schema, model } = mongoose;


const commentSchema = new Schema(
  {
    // the user that generated this comment
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    // the comment to be viewed by users
    comment: {
      type: String
    },
    // add user._id in order to get the length of the likes array and see how many likes the comment has
    reactionId: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User"
        },

      ]
    },
    //reactions to a commen(emojis)
    reaction: {
      type: [String],
      enum: ["love", "fun", "like", "sad", "amaze", "dislike"]
    },
    // the replies that belong to this message
    replies: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Reply"
        }
      ]
    },
  },
  { timestamps: true }
);
module.exports = model("Comment", commentSchema);

