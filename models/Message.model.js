const mongoose = require("mongoose");
const { Schema, model } = mongoose;


const messageSchema = new Schema(
  {
    // the user that generated this message
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    // the message to be viewed by users
    message: {
      type: String
    },
    // add user._id in order to get the length of the likes array and see how many likes the message has
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
    // the message board that this message belongs to
    parentPost: {
      type: Schema.Types.ObjectId,
      ref: "Post"
    }
  },
  { timestamps: true }
);

// const autoPopulateAuthor = next => {
//     this.populate("author");
//     next();
// };

// messageSchema
//     .pre("findOne", autoPopulateAuthor)
//     .pre("find", autoPopulateAuthor);

const Message = model("Message", messageSchema);
module.exports = Message;
