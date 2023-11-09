const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../models");
const upload = multer({ dest: process.env.FILES_UPLOAD_PATH });

const {
  validateSignUp,
  validateLogin,
  auth,
  accessValidator,
} = require("../middleware");
const controller = require("../controllers/user.js");
const { mandatoryFields } = require("../middleware/validateLogin");

router.post(
  "/signup",
  upload.single("image"),
  [
    accessValidator.mandatoryFields(["email", "password"]),
    validateSignUp.checkEmailExistence,
  ],
  controller.signup
);

router.post("/signup-admin", upload.single("image"), controller.signupAdmin);

router.post(
  "/login",
  [validateLogin.mandatoryFields, validateSignUp.checkUserExistence],
  controller.login
);

router.get("/refresh-token", controller.refreshToken);
router.get("/profile", [auth.verifyToken], controller.getProfile);

router.post(
  "/process-csv",
  // upload.single("csvfile"),
  [
    auth.verifyToken,
    accessValidator.access([db.UserRoles.Instructor]),
    // accessValidator.mandatoryFields(["fileName"]),
  ],
  controller.processCSV
);

router.post(
  "/profile",
  upload.single("image"),
  [auth.verifyToken],
  controller.updateProfile
);

router.post(
  "/update-password",
  // [auth.verifyToken],
  accessValidator.mandatoryFields(["email", "password", "confirmPassword"]),
  validateSignUp.checkUserExistence,
  validateSignUp.validateUserPassword,
  controller.updatePassword
);

router.post(
  "/addUser",
  [
    auth.verifyToken,
    accessValidator.access([db.UserRoles.Instructor]),
    accessValidator.mandatoryFields(["email", "roles"]),
  ],
  controller.createUser
);
router.get(
  "/",
  [auth.verifyToken, accessValidator.access([db.UserRoles.Admin])],
  controller.getUser
);
router.post(
  "/deleteUserProfilePic",
  [auth.verifyToken, accessValidator.access([db.UserRoles.Admin])],
  controller.deleteProfilePic
);

router.post(
  "/editUserProfilePic",
  upload.single("image"),
  [auth.verifyToken, accessValidator.access([db.UserRoles.Admin])],
  controller.editUserProfilePic
);

router.put(
  "/update/:userId",
  [
    auth.verifyToken,
    accessValidator.access([db.UserRoles.Admin]),
    accessValidator.mandatoryFields(["status"]),
    accessValidator.validKey("status", db.ParticipantStatus),
    // validateSignUp.accessUser,
  ],
  controller.updateUser
);

// router.post(
//   "/delete-user",
//   [auth.verifyToken, accessValidator.access([db.UserRoles.Admin])],
//   controller.deleteUsers
// );

router.post(
  "/delete-users",
  [auth.verifyToken, accessValidator.access([db.UserRoles.Instructor])],
  controller.deleteUsers
);

router.post(
  "/generateToken",
  [auth.verifyToken, accessValidator.access([db.UserRoles.Instructor])],
  controller.generateToken
);

router.post(
  "/upload-csv",
  upload.single("csvfile"),
  [
    auth.verifyToken,
    accessValidator.access([db.UserRoles.Instructor]),
    validateLogin.checkInputFile,
  ],
  controller.uploadCSV
);

router.post(
  "/edit-role",
  [auth.verifyToken, accessValidator.access([db.UserRoles.Instructor])],
  controller.editRole
);

// router.post(
//   "/reactivate",
//   [
//     auth.verifyToken,
//     accessValidator.access([db.UserRoles.Instructor]),
//     accessValidator.mandatoryFields(["email", "addRoles", "delRoles"]),
//   ],
//   controller.reactivate
// );

router.post(
  "/reset-password",
  accessValidator.mandatoryFields(["email"]),
  validateSignUp.checkUserExistence,
  controller.resetPassword
);

router.get(
  "/:from/:userId/detail",
  [auth.verifyToken],
  controller.getUserDetail, accessValidator.access([db.UserRoles.Instructor])
);

module.exports = router;
