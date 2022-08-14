const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      default: ["programming"],
      required: true,
      // "programming", "web development", "mobile development", "data science", "machine learning", "artificial intelligence", "blockchain", "game development", "web design", "other"
    },
    tags: {
      type: [String],
      default: ["technology"],
    },
    thumbnail: {
      type: String,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
);

const Resource = mongoose.model("Resource", resourceSchema);
module.exports = Resource;
