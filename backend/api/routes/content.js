const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: process.env.FILES_UPLOAD_PATH });

const db = require("../models");
const { auth, accessValidator } = require("../middleware");
const controller = require("../controllers/content.js");

router.get('/download', controller.downloadFile);

router.get('/bulk-upload',
    [auth.verifyToken,
    accessValidator.access([db.UserRoles.Admin])],
    controller.getTemplate);

router.get('/bulk-upload/types',
    [auth.verifyToken,
    accessValidator.access([db.UserRoles.Admin])],
    controller.getTemplateTypes);

router.post('/bulk-upload', 
    upload.single("file"),
    [auth.verifyToken,
    accessValidator.access([db.UserRoles.Admin])],
    controller.bulkUpload);

module.exports = router;
