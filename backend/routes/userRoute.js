const express = require("express");
const controller = require("../controllers/userController");
const router = express.Router();
const catchAsync = require("../middlewares/catchAsync");
router.route("/login").post(catchAsync(controller.login));
router.route("/addSakai").post(catchAsync(controller.addSakai));
router.route("/getSakai").get(catchAsync(controller.getSessionToken));
router.route("/register").post(catchAsync(controller.register));
router.route("/logout").get(catchAsync(controller.logout));

router.route("/announcement").get(catchAsync(controller.getAnnouncements));
router
  .route("/announcement/:id")
  .get(catchAsync(controller.announcementDetails));

router.route("/assignment").get(catchAsync(controller.getAssignments));
router.route("/assignment/:id").get(catchAsync(controller.assignmentDetails));

router.route("/meeting").get(catchAsync(controller.getMeetings));
// router.route("/meeting/:id").post(controller.meetingDetails);

module.exports = router;
