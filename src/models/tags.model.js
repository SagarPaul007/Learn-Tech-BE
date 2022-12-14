const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      default: "programming",
      // "programming", "web development", "mobile development", "data science", "machine learning", "artificial intelligence", "blockchain", "game development", "web design", "other"
    },
    count: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: false, versionKey: false }
);

const Tags = mongoose.model("Tags", tagsSchema);
module.exports = Tags;
