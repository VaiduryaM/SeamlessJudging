const jwt = require("jsonwebtoken");
const config = require("../config/jwt.js");
const db = require("../models");
const fs = require("fs");
const path = require("path");
const User = db.user;
const Event = db.event;
const utils = require("../controllers/utils.js");

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({
      error: {
        message: "Unauthorized! Access Token was expired!",
      },
    });
  }
  return res.sendStatus(401).send({ message: "Unauthorized!" });
};

verifyToken = (req, res, next) => {
  try {
    let token = req.headers["access-token"];
    if (!token) {
      return res.status(403).send({
        error: {
          message: "No token provided!",
        },
      });
    }
    jwt.verify(token, config.secret, async (err, decoded) => {
      if (err) {
        return catchError(err, res);
      }
      req.user = await User.findByPk(decoded.userId);
      if (req.user.status == db.ParticipantStatus.Blocked) {
        res.status(400).json({
          error: {
            message:
              "Invalid your account is currently blocked. Please contact admin.",
          },
        });
        return;
      }

      const roles = await utils.getRolesArray(req.user);
      req.user.roles = roles;
      if (roles.includes(db.UserRoles.Judge)) {
        req.judge_event = await Event.findByPk(decoded.eventId);
      }

      try {
        const tempDir = process.env.FILES_UPLOAD_PATH + "/temp";
        // remove all files that are older than 30 secs from temp.
        fs.readdir(tempDir, (err, files) => {
          files.forEach((file, idx) => {
            fs.stat(path.join(tempDir, file), function (err, stat) {
              let endTime, now;
              if (!err) {
                now = new Date().getTime();
                endTime = new Date(stat.ctime).getTime() + 30000;
                if (now > endTime) {
                  try {
                    fs.unlinkSync(path.join(tempDir, file));
                  } catch (err) {}
                }
              }
            });
          });
        });
      } catch (err) {
        console.log("failed to delete files - ", err);
      }

      next();
    });
  } catch (err) {
    console.log("verifyToken-middleware error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!!",
      },
    });
    return;
  }
};

const auth = {
  verifyToken: verifyToken,
};

module.exports = auth;
