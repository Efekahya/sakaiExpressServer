const express = require("express");
const controller = require("../controllers/userController");
const router = express.Router();

router.route("/login").post(controller.login);
router.route("/addSakai").post(controller.addSakai);
router.route("/getSakai").post(controller.getSessionToken);
router.route("/register").post(controller.register);
router.route("/logout").get(controller.logout);

router.route("/announcement").post(controller.getAnnouncements);
router.route("/announcement/:id").post(controller.announcementDetails);

router.route("/assignment").post(controller.getAssignments);
router.route("/assignment/:id").post(controller.assignmentDetails);

router.route("/meeting").post(controller.getMeetings);
// router.route("/meeting/:id").post(controller.meetingDetails);

module.exports = router;
