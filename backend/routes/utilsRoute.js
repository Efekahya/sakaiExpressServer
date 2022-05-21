const express = require("express");
const controller = require("../controllers/utilsController");
const router = express.Router();

router.get("/foodList", controller.getFoodList);
router.get("/library", controller.getLibrary);

module.exports = router;
