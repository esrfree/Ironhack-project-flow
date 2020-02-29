const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const pictureSchema = new Schema({
  imgName: String,
  imgPath: String,
  // the user that created the board
  uploader: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
},
{
  timestamps: { 
    createdAt: "createdAt",
    updatedAt: "updatedAt" }
});

var Picture = mongoose.model("Picture", pictureSchema);
module.exports = Picture;