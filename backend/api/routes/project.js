const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: process.env.FILES_UPLOAD_PATH });

const db = require("../models");
const {
  auth,
  accessValidator,
  validateProject,
  validateEvent,
} = require("../middleware");
const controller = require("../controllers/project.js");
const { access } = require("../middleware/accessValidator");

router.post(
  "/add",
  upload.array("attachments"),
  [
    auth.verifyToken,
    accessValidator.access([
      db.UserRoles.Admin,
      db.UserRoles.Client,
      db.UserRoles.Instructor,
    ]),
    accessValidator.mandatoryFields(["name", "clients", "courseCodeId"]),
    validateProject.checkProjectByNameExistence,
    validateProject.checkEmailsForRole("clients", db.UserRoles.Client),
  ],
  controller.addProject
);
router.post(
  "/addbulk",
  [
    auth.verifyToken,
    accessValidator.access([
      db.UserRoles.Admin,
      db.UserRoles.Instructor,
    ]),
    accessValidator.mandatoryFields(["parsedData","colFieldMap"]),
    // validateProject.checkProjectByNameExistence,
    // validateProject.checkEmailsForRole("clients", db.UserRoles.Client),
  ],
  controller.addProjectsInBulk
);

router.get(
  "",
  [
    auth.verifyToken,
    accessValidator.access([
      db.UserRoles.Admin,
      db.UserRoles.Instructor,
      db.UserRoles.Student,
      db.UserRoles.Client,
    ]),
  ],
  controller.getProjects
);

router.get(
  "/:projectId/history",
  validateProject.checkProjectExistence,
  controller.getProjectLineage
);

router.get(
  "/:projectId/detail",
  [auth.verifyToken],
  accessValidator.access([
    db.UserRoles.Admin,
    db.UserRoles.Instructor,
    db.UserRoles.Student,
    db.UserRoles.Client,
  ]),
  controller.getProjectDetail
);

router.get(
  "/:projectId/event/:eventId/scores",
  [auth.verifyToken, accessValidator.access([db.UserRoles.Admin])],
  controller.getProjectEventScores
);

router.post(
  "/update",
  upload.array("attachments"),
  [
    auth.verifyToken,
    accessValidator.mandatoryFields(["name", "clients", "courseCodeId"]),
    accessValidator.access([
      db.UserRoles.Admin,
      db.UserRoles.Instructor,
      db.UserRoles.Client,
    ]),
    validateProject.allowUpdate,
    validateProject.checkEmailsForRole("clients", db.UserRoles.Client),
  ],
  controller.updateProject
);

router.post(
  "/:projectId/enroll",
  [
    auth.verifyToken,
    accessValidator.mandatoryFields(["students"]),
    accessValidator.access([db.UserRoles.Student]),
    validateProject.checkProjectExistence,
    validateProject.checkEmailsForRole("students", db.UserRoles.Student),
    validateProject.checkStudentMultipleProject,
    validateProject.checkProjectTeamSizeExceed,
  ],
  controller.enrollProject
);

// needs more discussion on functionality
router.post(
  "/:projectId/allocate",
  [
    auth.verifyToken,
    accessValidator.mandatoryFields([
      "students",
      "courseCodeId",
      "unenrollments",
    ]),
    accessValidator.access([db.UserRoles.Admin, db.UserRoles.Instructor]),
    validateProject.checkProjectExistence,
    validateProject.checkProjectTeamSizeExceed,
  ],
  controller.allocateStudentProject,
);

router.delete(
  "/:projectId/delete",
  [auth.verifyToken],
  accessValidator.access([db.UserRoles.Admin, db.UserRoles.Instructor]),
  validateProject.checkProjectExistence,
  controller.deleteProject
);

router.post(
  "/unenroll",
  [auth.verifyToken],
  accessValidator.mandatoryFields(["unenrollments"]), // unenrollments : [{projectId: int, students:[array_of_emails]}]
  accessValidator.access([
    db.UserRoles.Student,
    db.UserRoles.Admin,
    db.UserRoles.Instructor,
  ]),
  controller.unenrollProject
);

router.post(
  "/finalise",
  [auth.verifyToken],
  accessValidator.mandatoryFields(["allocations"]),
  accessValidator.access([db.UserRoles.Admin, db.UserRoles.Instructor]),
  controller.finaliseProject
);

router.get(
  "/:role/UserProject",
  [auth.verifyToken],
  accessValidator.access([
    db.UserRoles.Admin,
    db.UserRoles.Instructor,
    db.UserRoles.Student,
    db.UserRoles.Client,
  ]),
  controller.getUserProject
);

router.get(
  "/:courseCodeId/userCourseProject",
  [auth.verifyToken],
  accessValidator.access([
    db.UserRoles.Admin,
    db.UserRoles.Instructor,
    db.UserRoles.Student,
    db.UserRoles.Client,
  ]),
  controller.getCourseProjects
);

router.post(
  "/:projectId/waitlist",
  [auth.verifyToken],
  accessValidator.mandatoryFields(["students"]),
  accessValidator.access([db.UserRoles.Student]),
  validateProject.checkProjectExistence,
  validateProject.checkEmailsForRole("students", db.UserRoles.Student),
  validateProject.checkStudentMultipleProject,
  controller.waitlistProject
);

router.post(
  "/:projectId/upload-content",
  upload.single("content"),
  [
    auth.verifyToken,
    accessValidator.access([
      db.UserRoles.Admin,
      db.UserRoles.Student,
      db.UserRoles.Client,
    ]),
    validateProject.checkProjectExistence,
  ],
  controller.uploadContent
);

router.post(
  "/:projectId/event/:eventId/assign-judges",
  [
    auth.verifyToken,
    accessValidator.access([db.UserRoles.Admin, db.UserRoles.Instructor]),
    accessValidator.mandatoryFields(["judges"]),
    validateProject.validateEventProjectExistence,
    validateEvent.validateJudges,
  ],
  controller.assignJudgesProject
);

router.post(
  "/:projectId/event/:eventId/winner",
  [
    auth.verifyToken,
    accessValidator.access([db.UserRoles.Admin, db.UserRoles.Instructor]),
    accessValidator.mandatoryFields(["winner_category_id"]),
    validateProject.validateEventProjectExistence,
  ],
  controller.assignWinner
);

router.delete(
  "/:projectId/event/:eventId/winner",
  [
    auth.verifyToken,
    accessValidator.access([db.UserRoles.Admin, db.UserRoles.Instructor]),
    validateProject.validateEventProjectExistence,
  ],
  controller.deleteWinner
);

router.put(
  "/:projectId/event/:eventId",
  [
    auth.verifyToken,
    accessValidator.access([db.UserRoles.Admin, db.UserRoles.Instructor]),
    validateProject.validateEventProjectExistence,
  ],
  controller.updateProjectEvent
);

router.get(
  "/:courseCodeId/projects",
  [auth.verifyToken],
  accessValidator.access([
    db.UserRoles.Admin,
    db.UserRoles.Instructor,
    db.UserRoles.Student,
    db.UserRoles.Client,
  ]),
  controller.getCourseProjects
);

module.exports = router;
