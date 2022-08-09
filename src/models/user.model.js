const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    resources: {
      type: [mongoose.Schema.Types.ObjectId], // These are bookmarked resources
      ref: "Resource",
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
);

userSchema.virtual("addedResources", {
  ref: "Resource",
  localField: "_id",
  foreignField: "addedBy",
  options: { sort: { _id: -1 } },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
