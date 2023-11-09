const express = require("express");
const router = express.Router();
const formidableMiddleware = require("express-formidable");

const db = require("../models");
const { auth, accessValidator, validateProject } = require("../middleware");
const controller = require("../controllers/notes.js");
const validateRequest = require("../middleware/validateRequest");

router.post("/", [auth.verifyToken], controller.getNotes);

router.post("/add", [auth.verifyToken], controller.addNote);

router.put("/update", [auth.verifyToken], controller.updateNote);

router.delete("/delete", [auth.verifyToken], controller.deleteNote);

module.exports = router;
