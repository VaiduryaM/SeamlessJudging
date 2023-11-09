const db = require("../models");
const { Op } = require("sequelize");
const utils = require("../controllers/utils.js");
const { notes: Notes, project: Project, user: User } = db;

// req body = {text: "a string", clientId: 3}
exports.addNote = (req, res) => {
  try {
    Notes.add(req.user.userId, req.body.clientId, req.body.text)
      .then(async (note) => {
        res.status(201).json({
          response_str: "Note created successfully!",
          response_data: {
            noteId: note.noteId,
          },
        });
        return;
      })
      .catch((err) => {
        console.log("addNote error in- ", err);
        res.status(500).json({
          error: {
            message: "Internal server error!",
          },
        });
        return;
      });
  } catch (err) {
    console.log("addNote error out- ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

// req is body : {"noteId": 1, "text": "whatever the updated note is now"}.
exports.updateNote = async (req, res) => {
  try {
    await Notes.update(
      { text: req.body.text },
      {
        where: {
          noteId: req.body.noteId,
        },
      }
    ).then(() => {
      res.status(201).json({
        response_str: "Note updated successfully!",
        response_data: {},
      });
      return;
    });
  } catch (err) {
    console.log("updateRequest error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

// req is body : {"noteId": 1}.
exports.deleteNote = async (req, res) => {
  try {
    await Notes.destroy({
      where: {
        noteId: req.body.noteId,
      },
      force: false,
    }).then(() => {
      res.status(201).json({
        response_str: "Note deleted successfully!",
        response_data: {},
      });
      return;
    });
  } catch (err) {
    console.log("deleteNote error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

// req is body : {"clientId": int}
exports.getNotes = async (req, res) => {
  try {
    const results = await Notes.findAll({
      where: {
        clientId: req.body.clientId,
        instructorId: req.user.userId,
      },
      order: [["createdAt", "DESC"]],
    });
    res.json({
      response_str: "Notes details retrieved successfully",
      response_data: {
        response: results,
      },
    });
    return;
  } catch (err) {
    console.log("getNotes error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};
