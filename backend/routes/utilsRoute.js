const express = require("express");
const controller = require("../controllers/utilsController");
const router = express.Router();

router.get("/foodList", controller.getFoodList);

module.exports = router;
