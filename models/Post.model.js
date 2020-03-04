const mongoose = require("mongoose");
const { Schema, model } = mongoose;


const postSchema = new Schema(
  {
    // the user that created the board
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
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
          ref: "Comment"
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

// const deleteComment = next => {
//   this.update({ $set: { comments: [] } });
//   next();
// };

// postSchema
//   .post("findOneAndRemove", deleteComment)
//   .post("findByIdAndDelete", deleteComment);



const Post = model("Post", postSchema);
module.exports = Post;
