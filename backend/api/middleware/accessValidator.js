const utils = require("../controllers/utils.js");


access = (roles) => {
  return function (req, res, next) {
    try {
      if (!utils.isSubset(roles, req.user.roles)) {
        res.status(400).json({
          error: {
            message: "Invalid Access! Role disallowed",
          },
        });
        return;
      }
      next();
    } catch (err) {
      console.log("access-middleware error - ", err);
      res.status(500).json({
        error: {
          message: "Internal server error!!",
        },
      });
      return;
    }
  };
};

mandatoryFields = (fields) => {
  return function (req, res, next) {
    try {
      const reqBody = req.fields || req.body;

      if (Object.keys(reqBody).length === 0) {
        res.status(400).json({
          error: {
            message: "Invalid. Request-Parameters are empty.",
          },
        });
        return;
      }

      for (let i = 0; i < fields.length; i++) {
        let item = fields[i];
        if (!reqBody[item] || reqBody[item] === "") {
          res.status(400).json({
            error: {
              message: `Invalid. Parameter - ${item} is empty.`,
            },
          });
          return;
        }
      }
      next();
    } catch (err) {
      console.log("mandatoryFields-middleware error - ", err);
      res.status(500).json({
        error: {
          message: "Internal server error!!",
        },
      });
      return;
    }
  };
};

validKey = (key, obj) => {
  return function (req, res, next) {
    try {
      const reqBody = req.fields || req.body;
      if (!Object.values(obj).includes(reqBody[key])) {
        res.status(400).json({
          error: {
            message: `Invalid request-parameter ${reqBody[key]}`,
          },
        });
        return;
      }
      next();
    } catch (err) {
      console.log("validKey-middleware error - ", err);
      res.status(500).json({
        error: {
          message: "Internal server error!!",
        },
      });
      return;
    }
  };
};

const accessValidator = {
  access: access,
  mandatoryFields: mandatoryFields,
  validKey: validKey,
};

module.exports = accessValidator;
