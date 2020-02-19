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
    // the message this reply belongs to (not the reply)
    message: {
      type: Schema.Types.ObjectId,
      ref: "Message"
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
    },
    // the replies to this reply
    // for now we will not add this to our example app. But if you fork and clone this app maybe you can create a route to do so as practice
    replies: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Reply"
        }
      ]
    }
  },
  { timestamps: true }
);

// const autoPopulateAuthor = next => {
//     this.populate("author");
//     next();
// };

// replySchema.pre("findOne", autoPopulateAuthor).pre("find", autoPopulateAuthor);

const Reply = model("Reply", replySchema);
module.exports = Reply;
