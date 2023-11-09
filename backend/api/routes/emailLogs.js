const express = require('express');
const router = express.Router();
const formidableMiddleware = require('express-formidable');

const db = require("../models");
const { auth, accessValidator, validateProject } = require("../middleware");
const controller = require("../controllers/emailLogs.js");
const validateRequest = require('../middleware/validateRequest');

router.get('/get',
[auth.verifyToken],
controller.getEmailLogs);

router.delete('/:userId/delete',
[auth.verifyToken],
controller.deleteEmailLog);

module.exports = router;
