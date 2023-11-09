const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: process.env.FILES_UPLOAD_PATH });

const controller = require('./../controllers/sponsor');
const { auth , sponsor ,accessValidator } = require("../middleware");
const db = require("../models");

router.post('/', 
    upload.single("logo"),
    [auth.verifyToken,
    accessValidator.mandatoryFields(["name"]),
    accessValidator.access([db.UserRoles.Admin]),
    sponsor.checkRequestBody],
    controller.createSponsor);

router.get('/', [auth.verifyToken], controller.getSponsors);

router.put('/:sponsorId',
    upload.single("logo"), 
    [auth.verifyToken, 
    accessValidator.access([db.UserRoles.Admin]),
    sponsor.checkRequestBody], 
    controller.updateSponsor);

router.delete('', 
    [auth.verifyToken, 
    accessValidator.access([db.UserRoles.Admin]),
    accessValidator.mandatoryFields(["ids"]),
    sponsor.validateSponsorDeletion], 
    controller.deleteSponsor);

module.exports = router;