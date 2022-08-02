const router = require("express").Router();
const { validateAddResourceInput } = require("../middlewares/validate");
const resourceController = require("../controllers/resource");

router.post("/add", validateAddResourceInput, resourceController.addResource);
router.post("/edit", resourceController.editResource);
router.post("/getResources", resourceController.getResources);

module.exports = router;
