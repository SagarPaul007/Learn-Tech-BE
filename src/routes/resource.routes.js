const router = require("express").Router();
const {
  validateAddResourceInput,
  validateAddCommentInput,
} = require("../middlewares/validate");
const resourceController = require("../controllers/resource");

router.post("/add", validateAddResourceInput, resourceController.addResource);
router.post("/edit", resourceController.editResource);
router.post("/getResources", resourceController.getResources);
router.post("/likeUnlike", resourceController.likeUnlike);
router.post("/bookmark", resourceController.bookmark);
router.get("/getResource/:resourceId", resourceController.getResource);
router.post(
  "/addComment",
  validateAddCommentInput,
  resourceController.addComment
);

module.exports = router;
