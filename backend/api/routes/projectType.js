const express = require('express');
const router = express.Router();
const db = require("../models");
const controller = require('../controllers/projectType.js');
const { auth , accessValidator, validateProject, validateReference } = require("../middleware");

router.post('', 
    [auth.verifyToken,
    accessValidator.access([db.UserRoles.Admin]),
    accessValidator.mandatoryFields(["project_type", "scoring_categories"]),
    validateProject.addScoringCategory],
    controller.addProjectType);

router.get('', 
    [auth.verifyToken],
    controller.getProjectType);

router.put('/:projectTypeId', 
    [auth.verifyToken,
    accessValidator.access([db.UserRoles.Admin]),
    accessValidator.mandatoryFields(["scoring_categories"]),
    validateProject.addScoringCategory],
    controller.updateProjectType);

router.delete('', 
    [auth.verifyToken,
    accessValidator.access([db.UserRoles.Admin]),
    accessValidator.mandatoryFields(["ids"]),
    validateReference.validateProjectTypeDeletion],
    controller.removeProjectType);

module.exports = router;