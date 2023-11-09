const express = require("express");
const router = express.Router();
const controller = require("./../controllers/user");
const { auth, accessValidator, validateReference } = require("../middleware");
const db = require("../models");

router.delete(
  "/:instructorId/users/delete",
  [
    accessValidator.mandatoryFields(["users"]),
    validateReference.validateUserExistence,
  ],
  controller.deleteUsers
);

router.delete(
  "/:instructorId/clients/delete",
  [
    accessValidator.mandatoryFields(["userIds"]),
    validateReference.validateUserExistence,
  ],
  controller.deleteUsers
);

router.delete(
  "/:instructorId/instructors/delete",
  [
    accessValidator.mandatoryFields(["userIds"]),
    validateReference.validateUserExistence,
  ],
  controller.deleteUsers
);

router.delete(
  "/:instructorId/students/delete",
  [
    accessValidator.mandatoryFields(["userIds"]),
    validateReference.validateUserExistence,
  ],
  controller.deleteUsers
);

router.get(
  "/students",
  [auth.verifyToken, accessValidator.access([db.UserRoles.Instructor])],
  // [accessValidator.mandatoryFields(["userIds"]),
  // validateReference.validateUserExistence],
  controller.getStudents
);

router.get(
  "/users",
  [auth.verifyToken, accessValidator.access([db.UserRoles.Instructor])],
  controller.getUsers
);

router.get(
  "/clients",
  [auth.verifyToken, accessValidator.access([db.UserRoles.Instructor])],
  controller.getClients
);

module.exports = router;
