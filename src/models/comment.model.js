const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    by: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: false, versionKey: false }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
