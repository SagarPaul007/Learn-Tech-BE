const Tags = require("../models/tags.model");

const getTags = async (req, res) => {
  try {
    let parentTag = req.params.parentTag;
    if (!parentTag || parentTag === "all") {
      parentTag = "";
    }
    const tags = await Tags.aggregate([
      {
        $match: {
          ...(parentTag ? { parentTag } : {}),
        },
      },
      {
        $group: {
          _id: "$name",
          count: { $sum: "$count" },
          name: { $first: "$name" },
        },
      },
    ]);
    res.json({ success: true, tags });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const getSuggestions = async (req, res) => {
  try {
    const tag = req.params.tag;
    let tags = await Tags.find({
      name: { $regex: tag, $options: "i" },
    })
      .limit(5)
      .lean();
    tags = [...new Set(tags.map((tag) => tag.name))];
    res.json({ success: true, tags });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

module.exports = {
  getTags,
  getSuggestions,
};
