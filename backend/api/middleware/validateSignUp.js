const db = require("../models");
const User = db.user;
const bcrypt = require("bcrypt");
const { judgeEventMap } = require("../models");
checkEmailExistence = (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (user) {
        res.status(400).json({
          error: {
            message: "Email already in use. Proceed to Login",
          },
        });
        return;
      }
      next();
    })
    .catch((err) => {
      console.log("checkEmailExistence-middleware error - ", err);
      res.status(500).json({
        error: {
          message: "Internal server error!!",
        },
      });
      return;
    });
};


// No idea what the functions does below. possible deprecation in future
accessUser = (req, res, next) => {
  User.findOne({
    where: {
      userId: req.params.userId,
    },
  })
    .then((user) => {
      if (!user) {
        res.status(400).json({
          error: {
            message: "User not found!",
          },
        });
        return;
      }
      if (
        req.body.status == db.ParticipantStatus.Blocked &&
        ! (user.roles.includes(db.UserRoles.Student) || user.roles.includes(db.UserRoles.Student))
      ) {
        res.status(400).json({
          error: {
            message:
              "Invalid. Only Participant users can be blocked from accessing the dashboard!!",
          },
        });
        return;
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log("checkEmailExistence-middleware error - ", err);
      res.status(500).json({
        error: {
          message: "Internal server error!!",
        },
      });
      return;
    });
};

checkUserExistence = async(req, res, next) => {
  let body = req.body;
  console.log("req.body",req.body);
  console.log("at 79");
  let judgeId=null;
		let judgeEventObj;
		if (req.body.passwordType == 'Token') {
			judgeEventObj = await judgeEventMap.findOne({
				where: {
					code: req.body.token
				}
			});
		}
		  if(judgeEventObj){
			judgeId=judgeEventObj.dataValues.judgeId;
		  }
		console.log("judgeId at 92",judgeId);

  User.findOne({
    where: 
      judgeId?{userId:judgeId}:{email:req.body.email?req.body.email:""}
    ,
  })
    .then((user) => {
      if (!user) {
        res.status(400).json({
          error: {
            message: `No user with email-id: ${body.email}. Please sign-up or contact instructor.`,
          },
        });
        return;
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log("checkUserExistence-middleware error - ", err);
      res.status(500).json({
        error: {
          message: "Internal server error!!",
        },
      });
      return;
    });
};

validateUserPassword = (req, res, next) => {
  try {
    let body = req.body;
    let user = req.user;

    let passwordIsValid = false;

    if (user.password) {
      passwordIsValid = bcrypt.compareSync(body.password, user.password);
    } else {
      passwordIsValid = user.tokenNo === body.password;
    }

    if (!passwordIsValid) {
      res.status(400).json({
        error: {
          message: "Password/Token is Incorrect.",
        },
      });
      return;
    }
    next();
  } catch (err) {
    console.log("validateUserPassword-middleware error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!!",
      },
    });
    return;
  }
};

const validateSignUp = {
  checkEmailExistence: checkEmailExistence,
  checkUserExistence: checkUserExistence,
  accessUser: accessUser,
  validateUserPassword: validateUserPassword,
};

module.exports = validateSignUp;
