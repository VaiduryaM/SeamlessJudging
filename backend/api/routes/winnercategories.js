const express = require('express');
const router = express.Router();
const controller = require('../controllers/winnercategories');
const { auth, accessValidator, validateReference } = require("../middleware");
const db = require("../models");

router.post('/', 
    [auth.verifyToken,
    accessValidator.mandatoryFields(["name"]),
    accessValidator.access([db.UserRoles.Admin])],
    controller.createWinnerCategory);

router.get('/', [auth.verifyToken], controller.getWinnerCategories);

router.put('/:winnerCategoryId', 
    [auth.verifyToken, 
    accessValidator.access([db.UserRoles.Admin])], 
    controller.updateWinnerCategory);

router.delete('', 
    [auth.verifyToken, 
    accessValidator.access([db.UserRoles.Admin]),
    accessValidator.mandatoryFields(["ids"]),
    validateReference.validateWinnerCategoryDeletion], 
    controller.deleteWinnerCategory);

module.exports = router;