const express = require('express');
const router = express.Router();
const controller = require("../controllers/event.js");

router.get('/event/:eventId', controller.getPublicEventDetail);

router.get('/event', controller.getPublicEvents);

module.exports = router;