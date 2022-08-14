const Resource = require("../models/resource.model");
const User = require("../models/user.model");
const Tags = require("../models/tags.model");

const addResource = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) return res.json({ success: false, message: "User not found" });
    const user = await User.findById(id);
    if (!user) return res.json({ success: false, message: "User not found" });
    const { title, description, url, categories, tags, thumbnail } = req.body;
    await Resource.create({
      title,
      description,
      url,
      categories,
      tags,
      thumbnail,
      addedBy: user._id,
    });
    await Promise.all(
      categories.map(async (category) => {
        await Promise.all(
          tags.map(async (tag) => {
            const tagExists = await Tags.findOne({ name: tag, category });
            if (tagExists) {
              await Tags.findOneAndUpdate(
                { name: tag, category },
                { $inc: { count: 1 } }
              );
            } else {
              await Tags.create({ name: tag, category, count: 1 });
            }
          })
        );
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
    const { title, description, url, categories, tags, thumbnail } = req.body;
    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(url && { url }),
      ...(categories && { categories }),
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
      categories.map(async (category) => {
        await Promise.all(
          removedTags.map(async (tag) => {
            const tagExists = await Tags.findOne({ name: tag, category });
            if (tagExists) {
              await Tags.findOneAndUpdate(
                { name: tag, category },
                { $inc: { count: -1 } }
              );
            }
          }),
          addedTags.map(async (tag) => {
            const tagExists = await Tags.findOne({ name: tag, category });
            if (tagExists) {
              await Tags.findOneAndUpdate(
                { name: tag, category },
                { $inc: { count: 1 } }
              );
            } else {
              await Tags.create({ name: tag, category, count: 1 });
            }
          })
        );
      })
    );
    res.json({ success: true, message: "Resource updated successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const getResources = async (req, res) => {
  try {
    const { category, tags, page } = req.body;
    const size = 20;
    const resources = await Resource.find({
      ...(category && category !== "all"
        ? { categories: { $in: [category] } }
        : {}),
      ...(tags && tags.length && { tags: { $in: tags } }),
    })
      .sort({ _id: -1 })
      .skip((page - 1) * size)
      .limit(size)
      .populate("addedBy")
      .lean();
    const canFetchMore = resources.length === size;
    res.json({
      success: true,
      resources,
      canFetchMore,
      nextPage: canFetchMore ? page + 1 : null,
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const likeUnlike = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id)
      return res.json({ success: false, message: "Please log in first!" });
    const user = await User.findById(id);
    if (!user)
      return res.json({ success: false, message: "Please log in first!" });
    const { resourceId } = req.body;
    if (!resourceId)
      return res.json({ success: false, message: "Resource not found" });
    const resource = await Resource.findById(resourceId);
    if (!resource)
      return res.json({ success: false, message: "Resource not found" });
    if (resource.likes?.includes(user._id)) {
      resource.likes =
        resource.likes.filter((x) => x.toString() !== user._id.toString()) ||
        [];
    } else if (resource.likes) {
      resource.likes.push(user._id);
    } else {
      resource.likes = [user._id];
    }
    await resource.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const bookmark = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id)
      return res.json({ success: false, message: "Please log in first!" });
    const user = await User.findById(id);
    if (!user)
      return res.json({ success: false, message: "Please log in first!" });
    const { resourceId } = req.body;
    if (!resourceId)
      return res.json({ success: false, message: "Resource not found" });
    const resource = await Resource.findById(resourceId);
    if (!resource)
      return res.json({ success: false, message: "Resource not found" });
    if (user.resources?.includes(resource._id)) {
      user.resources =
        user.resources.filter(
          (x) => x.toString() !== resource._id.toString()
        ) || [];
    } else {
      user.resources.push(resource._id);
    }
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

module.exports = {
  addResource,
  editResource,
  getResources,
  likeUnlike,
  bookmark,
};
