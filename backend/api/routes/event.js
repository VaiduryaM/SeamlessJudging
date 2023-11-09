const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: process.env.FILES_UPLOAD_PATH });

const db = require("../models");
const { auth, accessValidator, validateEvent } = require("../middleware");
const controller = require("../controllers/event.js");

router.get('',
	[auth.verifyToken,
	accessValidator.access([db.UserRoles.Admin])],
	controller.getEvents);

router.post('', 
	upload.single("logo"),
	[auth.verifyToken,
	accessValidator.access([db.UserRoles.Admin]),
	accessValidator.mandatoryFields(["name", "date"]),
	validateEvent.checkEventByNameExistence,
	validateEvent.validateJudges,
	validateEvent.validateSponsors,
	validateEvent.validateWinnerCategories,
	validateEvent.validateProjects], 
	controller.addEvent);

router.get('/:eventId',
	[auth.verifyToken,
	accessValidator.access([db.UserRoles.Admin])],
	controller.getEventDetail);

router.put('/:eventId', 
	upload.single("logo"),
	[auth.verifyToken,
	accessValidator.access([db.UserRoles.Admin]),
	accessValidator.mandatoryFields(["date"]),
	validateEvent.checkEventExistence], 
	controller.updateEvent);

router.put('/:eventId/attach-detach', 
	[auth.verifyToken,
	accessValidator.access([db.UserRoles.Admin]),
	accessValidator.mandatoryFields(["update_type"]),
	accessValidator.validKey("update_type", db.EventUpdateTypes),
	validateEvent.checkEventExistence,
	validateEvent.validateJudges,
	validateEvent.validateSponsors,
	validateEvent.validateWinnerCategories,
	validateEvent.validateProjects], 
	controller.updateEventReferences);

router.post('/:eventId/auto-assign-judges', 
	[auth.verifyToken,
	accessValidator.access([db.UserRoles.Admin])], 
	accessValidator.mandatoryFields(["judges_size"]),
	controller.autoAssignJudges);

module.exports = router;