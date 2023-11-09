const express = require('express');
const router = express.Router();
const formidableMiddleware = require('express-formidable');

const db = require("../models");
const { auth, accessValidator, validateProject } = require("../middleware");
const controller = require("../controllers/emailTemplates.js");
const validateRequest = require('../middleware/validateRequest');

router.post('/add',
    [auth.verifyToken],
    controller.addEmailTemplate);

router.post('/update',
[auth.verifyToken],
controller.updateEmailTemplate);

router.get('/get',
[auth.verifyToken],
controller.getEmailTemplates);

router.delete('/delete',
[auth.verifyToken],
controller.deleteEmailTemplate);

router.post('/sendEmail',
    [auth.verifyToken],
    controller.sendEmailByTemplate);

module.exports = router;
