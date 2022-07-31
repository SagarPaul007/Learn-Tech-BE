const router = require("express").Router();
const { validateAddResourceInput } = require("../middlewares/validate");
const resourceController = require("../controllers/resource");

router.post("/add", validateAddResourceInput, resourceController.addResource);
router.post("/edit", validateAddResourceInput, resourceController.editResource);

module.exports = router;
