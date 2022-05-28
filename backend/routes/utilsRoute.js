const express = require("express");
const controller = require("../controllers/utilsController");
const catchAsync = require("../middlewares/catchAsync");
const router = express.Router();
router.get("/library", catchAsync(controller.getLibrary));
router.get("/foodList", catchAsync(controller.getFoodList));
router.get("/getWeather", catchAsync(controller.getWeather));

module.exports = router;
