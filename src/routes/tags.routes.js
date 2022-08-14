const router = require("express").Router();
const tagsController = require("../controllers/tags.js");

router.get("/getTags/:category", tagsController.getTags);
router.get("/getSuggestions/:tag", tagsController.getSuggestions);

module.exports = router;
