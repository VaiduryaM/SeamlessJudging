const express = require('express');
const router = express.Router();
const controller = require('./../controllers/judge');
const { auth ,accessValidator, validateReference } = require("../middleware");
const db = require("../models");


router.post('/', 
    [auth.verifyToken ,
    accessValidator.access([db.UserRoles.Admin]),
    accessValidator.mandatoryFields(["email","last_name","first_name"])],
    controller.createJudge);

router.get('/', [auth.verifyToken,
    accessValidator.access([db.UserRoles.Admin])],
    controller.getJudges);

router.put('/:judgeId', 
    [auth.verifyToken, 
    accessValidator.access([db.UserRoles.Admin])], 
    controller.updateJudge);

router.delete('',
    [auth.verifyToken, 
    accessValidator.access([db.UserRoles.Admin]),
    accessValidator.mandatoryFields(["ids"]),
    validateReference.validateJudgeDeletion],
    controller.deleteJudge);

router.get('/projects',
    [auth.verifyToken,
    accessValidator.access([db.UserRoles.Judge])],
    controller.getProjects);

router.put('/:judgeId/event/:eventId/code-regenerate',
    [auth.verifyToken, 
    accessValidator.access([db.UserRoles.Admin])], 
    controller.regenerateCode);

module.exports = router;