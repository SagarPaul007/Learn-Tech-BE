const Resource = require("../models/resource.model");
const User = require("../models/user.model");
const Tags = require("../models/tags.model");

const addResource = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) return res.json({ success: false, message: "User not found" });
    const user = await User.findById(id);
    if (!user) return res.json({ success: false, message: "User not found" });
    const { title, description, url, parentTag, tags, thumbnail } = req.body;
    await Resource.create({
      title,
      description,
      url,
      parentTag,
      tags,
      thumbnail,
      addedBy: user._id,
    });
    await Promise.all(
      tags.map(async (tag) => {
        const tagExists = await Tags.findOne({ name: tag });
        if (tagExists) {
          await Tags.findOneAndUpdate({ name: tag }, { $inc: { count: 1 } });
        } else {
          await Tags.create({ name: tag, count: 1 });
        }
      })
    );
    res.json({ success: true, message: "Resource added successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const editResource = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) return res.json({ success: false, message: "User not found" });
    const user = await User.findById(id);
    if (!user) return res.json({ success: false, message: "User not found" });
    const { resourceId } = req.body;
    if (!resourceId)
      return res.json({ success: false, message: "Resource not found" });
    const resource = await Resource.findById(resourceId);
    if (!resource)
      return res.json({ success: false, message: "Resource not found" });
    if (resource.addedBy.toString() !== user._id.toString()) {
      return res.json({
        success: false,
        message: "You are not authorized to edit this resource",
      });
    }
    const { title, description, url, parentTag, tags, thumbnail } = req.body;
    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(url && { url }),
      ...(parentTag && { parentTag }),
      ...(tags && { tags }),
      ...(thumbnail && { thumbnail }),
    };
    await Resource.updateOne(
      { _id: resource._id },
      {
        $set: updateData,
      }
    );
    const removedTags = resource.tags.filter((tag) => !tags.includes(tag));
    const addedTags = tags.filter((tag) => !resource.tags.includes(tag));
    await Promise.all(
      removedTags.map(async (tag) => {
        const tagExists = await Tags.findOne({ name: tag });
        if (tagExists) {
          await Tags.findOneAndUpdate({ name: tag }, { $inc: { count: -1 } });
        }
      }),
      addedTags.map(async (tag) => {
        const tagExists = await Tags.findOne({ name: tag });
        if (tagExists) {
          await Tags.findOneAndUpdate({ name: tag }, { $inc: { count: 1 } });
        } else {
          await Tags.create({ name: tag, count: 1 });
        }
      })
    );
    res.json({ success: true, message: "Resource updated successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

module.exports = {
  addResource,
  editResource,
};
