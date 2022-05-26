const express = require("express");
const controller = require("../controllers/userController");
const router = express.Router();
const catchAsync = require("../middlewares/catchAsync");
const validateJWT = require("../middlewares/jwtAuth");
router.route("/login").post(catchAsync(controller.login));

router.route("/addSakai").post(validateJWT, catchAsync(controller.addSakai));
router.route("/updateSakai").put(validateJWT, catchAsync(controller.updateSakai));
router.route("/deleteSakai").delete(validateJWT, catchAsync(controller.deleteSakai));

router.route("/getSakaiToken").get(validateJWT, catchAsync(controller.getSessionToken));

router.route("/updateUser").put(validateJWT, catchAsync(controller.updateUser));
router.route("/register").post(catchAsync(controller.register));
router.route("/logout").get(catchAsync(controller.logout));
router.route("/getUser").get(validateJWT, catchAsync(controller.getUserData));

router.route("/announcement").get(validateJWT, catchAsync(controller.getAnnouncements));
router.route("/announcement/:id").get(validateJWT, catchAsync(controller.announcementDetails));

router.route("/assignment").get(validateJWT, catchAsync(controller.getAssignments));
router.route("/assignment/:id").get(validateJWT, catchAsync(controller.assignmentDetails));

router.route("/meeting").get(validateJWT, catchAsync(controller.getMeetings));
// router.route("/meeting/:id").post(controller.meetingDetails);

module.exports = router;
