const express = require('express');
const router = express.Router();
const controller = require('./../controllers/scorecategories');
const { auth, sponsor, accessValidator, validateReference } = require("../middleware");
const db = require("../models");

router.post('/', [auth.verifyToken,
    accessValidator.mandatoryFields(["name"]),
    accessValidator.access([db.UserRoles.Admin])],
    controller.createScoreCategory);

router.get('/', [auth.verifyToken], controller.getScoreCategories);

router.put('/:scoringCategoryId', 
    [auth.verifyToken, 
    accessValidator.access([db.UserRoles.Admin])], 
    controller.updateScoreCategory);

router.delete('', 
    [auth.verifyToken, 
    accessValidator.access([db.UserRoles.Admin]),
    accessValidator.mandatoryFields(["ids"]),
    validateReference.validateScoreCategoryDeletion], 
    controller.deleteScoreCategory);

module.exports = router;
