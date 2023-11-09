const express = require('express');
const router = express.Router();

const db = require("../models");
const { auth, accessValidator, validateEvent} = require("../middleware");
const controller = require("../controllers/judge.js");

router.post('/project/:projectId',
    [auth.verifyToken,
    accessValidator.access([db.UserRoles.Judge]),
    // validateEvent.checkJudgingPeriod, //Temporarily removed
    // validateEvent.checkScoringCategory//Temporarily removed
],
    controller.addScores);

module.exports = router;