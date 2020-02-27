const mongoose = require("mongoose");
const { Schema, model } = mongoose;



const replySchema = new Schema(
  {
    // the user that generated this reply
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    // the reply to be viewed by users
    reply: {
      type: String
    },
    // add user._id in order to get the length of the likes array and see how many likes the reply has
    reactionId: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User"
        }
      ]
    },
    //reactions to a reply(emojis)
    reaction: {
      type: [String],
      enum: ["love", "fun", "like", "sad", "amaze", "dislike"]
    }
  },
  { timestamps: true }
);


const Reply = model("Reply", replySchema);
module.exports = Reply;
