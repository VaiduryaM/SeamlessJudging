const validateSignUp = require("./validateSignUp");
const validateLogin = require("./validateLogin");
const auth = require("./auth");
const accessValidator = require("./accessValidator");
const validateProject = require("./validateProject");
const validateEvent = require("./validateEvent");
const sponsor = require("./sponsor");
const validateReference = require("./validateReference");

module.exports = {
  validateSignUp,
  validateLogin,
  auth,
  accessValidator,
  validateProject,
  validateEvent,
  sponsor,
  validateReference
};
