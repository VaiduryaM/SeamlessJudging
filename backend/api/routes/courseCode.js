const express = require("express");
const router = express.Router();
const controller = require("./../controllers/courseCode");
const {
  auth,
  sponsor,
  accessValidator,
  validateReference,
} = require("../middleware");
const db = require("../models");

router.post(
  "/",
  [auth.verifyToken, accessValidator.mandatoryFields(["code"])],
  // accessValidator.access(db.UserRoles.Admin)],
  controller.createCourseCode
);

router.get("/", [auth.verifyToken], controller.getCourseCodes);

router.get("/semesters", [auth.verifyToken], controller.getSemesters);

router.put(
  "/:courseCodeId",
  [auth.verifyToken],
  // accessValidator.access(db.UserRoles.Admin)],
  controller.updateCourseCode
);

router.delete(
  "",
  [
    auth.verifyToken,
    accessValidator.access([db.UserRoles.Admin]),
    accessValidator.mandatoryFields(["ids"]),
    validateReference.validateCourseCodeDeletion,
  ],
  controller.deleteCourseCode
);

module.exports = router;
