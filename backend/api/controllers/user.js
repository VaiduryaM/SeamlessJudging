const fs = require("fs");
const bcrypt = require("bcrypt");
const db = require("../models");
const config = require("../config/jwt.js");
const utils = require("../controllers/utils.js");
const {
  user: User,
  refreshToken: RefreshToken,
  project: Project,
  event: Event,
  role: Role,
  userRole: UserRole,
  userRoleCourse: UserRoleCourse,
  courseCode: CourseCode,
} = db;

const Op = db.Sequelize.Op;
const Roles = db.UserRoles;
const jwt = require("jsonwebtoken");
const { user, courseCode, UserRoles, judgeEventMap } = require("../models");

exports.signup = async (req, res) => {
  try {
    let imagePath = "";
    if (req.file) {
      let fileType = "." + req.file.originalname.split(".").pop().trim();
      imagePath = utils.uploadFile(req.file.path, fileType);
    }

    User.create({
      email: req.body.email,
      password: req.body.password,
      image: imagePath,
    })
      .then(async (user) => {
        req.user = user;
        let jwtObj = {
          userId: user.userId,
          email: req.body.email,
          role: req.body.role,
        };
        const userRole = await Role.findOne({
          where: {
            name: db.UserRoles[req.body.role],
          },
        });

        // if (req.body.role === Roles.Judge) {
        //   jwtObj.eventId = req.user.events[0].eventId;
        // }

        const accessToken = jwt.sign(jwtObj, config.secret, {
          expiresIn: config.jwtExpiration,
        });
        let refreshToken = await RefreshToken.createToken(req.user);

        let { semester } = utils.getSemester(new Date());

        await user.addRole(userRole);

        res.status(200).json({
          response_str: "User registered successfully!",
          response_data: {
            user_id: user.userId,
            email: req.body.email,
            access_token: accessToken,
            refresh_token: refreshToken,
            role: req.body.role,
            semester: semester,
          },
        });
        return;
      })
      .catch((err) => {
        console.log("signup error - ", err);
        if (err.name === db.SequelizeValidationErrorItem) {
          res.status(400).json({
            error: {
              message: `Invalid email-id given.`,
            },
          });
          return;
        }
        res.status(500).json({
          error: {
            message: "Internal server error!",
          },
        });
        return;
      });
  } catch (err) {
    console.log("signup error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.signupAdmin = (req, res) => {
  try {
    if (req.headers["admin-creation-code"] != process.env.ADMIN_CREATION_CODE) {
      res.status(400).json({
        error: {
          message: `Invalid value of header: "admin-creation-code".`,
        },
      });
      return;
    }
    for(const [key, value] of Object.entries(db.UserRoles)){
      db.role.findOrCreate({where: {name: value}});
    }
    User.create({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      middleName: utils.getdefaultValue(req.body.middle_name, ""),
      image: "",
    }).then(async (user) => {
      let { semester, year } = utils.getSemester(new Date());
      if (user) {
        const user_role = await Role.findOne({
          where: { name: db.UserRoles.Admin },
        });
        await user.addRole(user_role);
      }
      res.status(201).json({
        response_str: "User registered successfully!",
        response_data: {
          user_id: user.userId,
          role: user.Role,
        },
      });
      return;
    });
  } catch (err) {
    console.log("signup error - ", err);
    if (err.name === db.SequelizeValidationErrorItem) {
      res.status(400).json({
        error: {
          message: `Invalid email-id given. User email already exists`,
        },
      });
      return;
    }
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.login = async (req, res) => {
  try {
    const roles = await utils.getRolesArray(req.user);

    req.user.roles = roles;
    let judgeId = null;
    let judgeEventObj;
    if (req.body.passwordType == 'Token') {
      judgeEventObj = await judgeEventMap.findOne({
        where: {
          code: req.body.token
        }
      });
    }
    if (judgeEventObj) {
      judgeId = judgeEventObj.dataValues.judgeId;
    }
    if (req.body.passwordType == "Password") {
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        req.user.password
      );
      if (!passwordIsValid) {
        res.status(401).json({
          error: {
            message: "UnAuthorized! Wrong password.",
          },
        });
        return;
      }
    } else {
      // following block checks for judge role, token validation by value compare and date compare. Could do this in a better way or in a different middleware function.

      const tokenIsValid = req.body.token === req.user.tokenNo;
      if (!tokenIsValid && !roles.includes(UserRoles.Judge)) {
        res.status(401).json({
          error: {
            message: "UnAuthorized! Token is invalid. Check with instructor.",
          },
        });
        return;
      }

      if (
        !(
          new Date() <= new Date(String(req.user.tokenEnd)) ||
          new Date(String(req.user.tokenStart)) <= new Date()
        ) &&
        !roles.includes(UserRoles.Judge)
      ) {
        res.status(401).json({
          error: {
            message: "UnAuthorized! Token expired. Check with instructor",
          },
        });
        return;
      }
    }

    let jwtObj = {
      userId: req.user.userId,
      email: req.body.email,
      total_roles: roles,
    };

    if (roles.includes(Roles.Judge)) {
      if (req.user?.events) jwtObj.eventId = req.user.events[0]?.eventId;
    }
    const accessToken = jwt.sign(jwtObj, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    if (req.user.image != null) {
      imageLink = req.user.image.replace(
        "./db",
        "http://localhost:" + process.env.PORT + "/images"
      );
    } else {
      imageLink = "";
    }

    let refreshToken = await RefreshToken.createToken(req.user);

    response_data = {
      access_token: accessToken,
      refresh_token: refreshToken,
      user_id: req.user.userId,
      email: req.user.email,
      roles: roles,
      image: imageLink,
    };
    if (req.user.events != null)
      response_data["eventId"] = req.user.events[0]?.eventId;
    res.status(200).json({
      response_str: "User successfully loggedIn!",
      response_data: response_data,
    });
    return;
  } catch (err) {
    console.log("login error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.refreshToken = async (req, res) => {
  const requestToken = req.query.refresh_token;
  try {
    let refreshToken = await RefreshToken.findOne({
      where: {
        token: requestToken,
      },
    });

    if (!refreshToken) {
      res.status(403).json({
        error: {
          message:
            "Refresh token was expired. Please make a new signin request",
        },
      });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({
        where: {
          refreshTokenId: refreshToken.refreshTokenId,
        },
      });
      res.status(403).json({
        error: {
          message:
            "Refresh token was expired. Please make a new signin request",
        },
      });
      return;
    }

    const user = await refreshToken.getUser();
    const allRoles = await utils.getRolesArray(user);
    // user.roles = allRoles;
    let jwtObj = {
      userId: user.userId,
      email: user.email,
      roles: allRoles,
    };
    if (allRoles.includes(Roles.Judge)) {
      jwtObj.eventId = refreshToken.eventId;
    }

    let newAccessToken = jwt.sign(jwtObj, config.secret, {
      expiresIn: config.jwtExpiration,
    });
    res.status(200).json({
      response_str: "RefreshToken generated successfully!",
      response_data: {
        access_token: newAccessToken,
        refresh_token: refreshToken.token,
        user_id: user.userId,
        role: user.role,
        email: user.email,
      },
    });
    return;
  } catch (err) {
    console.log("refreshToken error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.editUserProfilePic = async(req, res) => {
  console.log("new request = ", req);
  let tempFilePath = "";
  var image = "";
    if (req.file) {
      console.log("got file: ", req.file);
      tempFilePath = req.image;
      let fileType = "." + req.file.originalname.split(".").pop().trim();
      image = utils.uploadFile(req.file.path, fileType);
    }
      imageLink = image != "" ? image: "";
    try {
      await User.findOne({
        where: {
          userId: req.body.user_id,
        },
      }).then(async (user) => {
        if (user) {
          user.image = imageLink;
          user.save().then((user) => {
            res.status(200).json({
              response_str: "Profile pic updated successfully!"
            });
            return;
          })
        }
      });
    } catch (err) {
      console.log("editUserProfilePic error - ", err);
      res.status(500).json({
        error: {
          message: "Internal server error!",
        },
      });
      return;
    }
}
exports.getProfile = (req, res) => {
  try {
    // console.log("Inside getprofile");
    if (req.user.image != null)
      imageLink = req.user.image.replace(
        "./db",
        `http://${process.env.MYSQL_HOST}:${process.env.PORT}/images/`
      );
    else imageLink = "";

    res.status(200).json({
      response_str: "Profile retrieved successfully!",
      response_data: {
        body: req.user.getBasicInfo,
        image: utils.getdefaultValue(
          imageLink,
          ""
        ),
      },
    });
    return;
  } catch (err) {
    console.log("getProfile error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.getUserDetail = async (req, res) => {
  try {
    let uid = req.params.userId;
    console.log("uid=",uid);
    console.log(" from = ",req.params)
    await User.findOne({
      where: {
        userId: uid,
      },
      include: [
        {
          model: db.userRole,
          include: [
            { model: db.role },
            { model: db.userRoleCourse,
              include: [
                { model: db.courseCode },
                { model: db.project },
              ], },
          ],
        }
      ]
    }).then(async (user) => {
      result = [];
          let info = user.getBasicInfo;
          if (user.image != null)
            imageLink = user.image.replace(
              "./db",
              `http://${process.env.MYSQL_HOST}:${process.env.PORT}/images/`
            );
          else imageLink = "";
          info.isStudent = false;
          info.isonlyClient = false;
          info.hasProjectAssoc = false;
          let enrollmentDetails = {}; // to do: change to uniform team array format
          enrollmentDetails.courseName = [];
          enrollmentDetails.projectName = [];
          enrollmentDetails.position = ""
          let roles = [];
          if (user.userRoles.length == 0) {
            roles=[]
          } else {
            if(user.userRoles.length==1 && user.userRoles[0].userRoleCourses.length==1){
              enrollmentDetails.position = user.userRoles[0].userRoleCourses[0].status;
            }
            user.userRoles.forEach(uRole=>{
              roles.push(uRole.role.name);
              uRole.userRoleCourses.forEach(uCourse=>{
                enrollmentDetails.courseName.push(uCourse.courseCode.name);
                if(uCourse.project != null){
                  enrollmentDetails.projectName.push(uCourse.project.name);
                }
              });
            });
              if (roles.includes(Roles.Student)) {
                info.isStudent = true;
              }
              if (roles.includes(Roles.Client) || roles.includes(Roles.Instructor) || roles.includes(Roles.Judge)) {
                info.hasProjectAssoc = true;
              }
            info.roles = roles;
            }
            info.displayproject = false;
            info.title = "User Details";
            info.enrollmentDetails = enrollmentDetails;
            if (req.params.from == "clientlistpage"){
              info.title = "Client Details";
              info.displayproject = true;
            }else if (req.params.from == "studentlistpage"){
              info.title = "Student Details";
              info.displayproject = true;
            }
        info.image = utils.getdefaultValue(
        imageLink,
            ""
        );
          result = info;
      res.status(200).json({
        response_str: "Users retrieved successfully!",
        response_data: result,
      });
      return;
    });
  } catch (err) {
    console.log("error while retrieving users - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.deleteProfilePic = async(req, res) => {
  console.log("new request = ", req);
  try {
    await User.findOne({
      where: {
        userId: req.body.user_id,
      },
    }).then(async (user) => {
      if (user) {
        user.image = null;
        user.save().then((user) => {
          res.status(200).json({
            response_str: "Profile pic deleted successfully!"
          });
          return;
        })
      }
    });
  } catch (err) {
    console.log("deleteProfilePid error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};


exports.updateProfile = async (req, res) => {
  try {
    let user = req.user;
    user.firstName = utils.getdefaultValue(req.body.first_name, "");
    user.lastName = utils.getdefaultValue(req.body.last_name, "");
    user.middleName = utils.getdefaultValue(req.body.middle_name, "");
    user.PrefferedName = utils.getdefaultValue(req.body.PrefferedName, "");
    user.Github = utils.getdefaultValue(req.body.Github, user.Github);
    user.SocialLinks = utils.getdefaultValue(req.body.SocialLinks, "");
    user.Phone = utils.getdefaultValue(req.body.Phone, "");
    // lines 400-405
    let tempFilePath = "";
    if (req.file) {
      console.log("got file: ", req.file);
      tempFilePath = user.image;
      let fileType = "." + req.file.originalname.split(".").pop().trim();
      user.image = utils.uploadFile(req.file.path, fileType);
    }else if(req.body.image==undefined){
      user.image = null;
    }

    if (user.image != null)
      imageLink = user.image.replace(
        "./db",
        "http://localhost:" + process.env.PORT + "/images"
      );
    else imageLink = "";

    user
      .save()
      .then((user) => {
        // lines 433-441
        if (tempFilePath != "") {
          try {
            fs.unlinkSync(tempFilePath); //remove old file from server
          } catch (err) {
            console.log(
              `Failed to delete file from folder - ${tempFilePath} - ${err}`
            );
          }
        }
        res.status(200).json({
          response_str: "Profile updated successfully!",
          response_data: {
            user_id: user.userId,
            first_name: user.firstName,
            middle_name: user.middleName,
            last_name: user.lastName,
            email: user.email,
            image: user.image,
            imageLink: imageLink,
          },
        });
        return;
      })
      .catch((err) => {
        console.log("updateProfile error - ", err);
        res.status(500).json({
          error: {
            message: "Internal server error!",
          },
        });
        return;
      });
  } catch (err) {
    console.log("updateProfile error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.createUser = async (req, res) => {
  try {
    const roles = req.body.roles;
    const tokenDetails = utils.generateTokenDetails();
    const result = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (result) {
      return res.status(400).json({
        error: {
          message: "User is already registered",
        },
      });
    }

    await User.create({
      email: req.body.email,
      ...tokenDetails,
    })
      .then(async (user) => {
        if (roles.includes("Judge")) {
          await judgeEventMap.create({
            judgeId: user.userId,
          });
        }
        roles.forEach(async (role) => {
          if (role != "Judge") {
            await Role.findOne({
              where: {
                name: role,
              },
            })
              .then(async (roleObj) => {
                user.addRole(roleObj).then(async (addroleobj) => {
                  if (req.body.courseCodeId) {
                    await UserRoleCourse.create({
                      userRoleId: addroleobj[0].dataValues.Id,
                      courseCodeId: req.body.courseCodeId,
                    })
                  }
                })
              })
              .catch((err) => {
                console.log("Error while adding role: ", err);
              });
          }
        });

        if (!(roles.includes("Judge") && roles.length === 1)) {
          const content =
            "Hello " +
            req.body.email +
            ",<br>Your account has been created on the Capstone Portal on " +
            process.env.LINK +
            " <br>Please Note that the portal can be accessed only through connecting through University at Buffalo's network or using a VPN to connect to University at Buffalo's network. <br> Please use credentials: <br>Email: " +
            req.body.email +
            "<br>Token: " +
            tokenDetails.tokenNo +
            "<br><br>Thanks and Regards, <br>Capstone Team";
          utils.sendEmail(
            "Welcome to Capstone Project Management",
            content,
            req.body.email
          );
        }
      })
      .catch((err) => {
        console.log(`Error while creating a new user: ${err}`);
      });

    return res.status(201).json({
      response_str: "User added succesfully",
      response_data: {
        email: req.body.email,
        role: req.body.roles,
      },
    });
  } catch (err) {
    console.log("error while creating user - ", err);
    if (err.name === db.SequelizeUniqueConstraintError) {
      res.status(400).json({
        error: {
          message: `Invalid. User - ${req.body.email} is already available.`,
        },
      });
      return;
    }
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

// FIXME []: test and delete
exports.getUser = async (req, res) => {
  console.log("running to-be-deprecated getUser function");
  try {
    await User.findAll({
      where: {
        role: {
          [db.Sequelize.Op.in]: [db.UserRoles.Admin, db.UserRoles.Participant],
        },
      },
      order: [["createdAt", "DESC"]],
    }).then(async (users) => {
      const projects = await Project.findAll({
        include: [db.event, db.user],
      });
      let userProjectMap = {};
      projects.forEach((project) => {
        project.users.forEach((user) => {
          if (!userProjectMap.hasOwnProperty(user.userId)) {
            userProjectMap[user.userId] = [];
          }
          userProjectMap[user.userId].push(project);
        });
      });

      result = [];
      users.forEach((user) => {
        if (user.userId != req.user.userId) {
          let info = user.getParticipantInfo;
          if (userProjectMap.hasOwnProperty(user.userId)) {
            info.enrollment_status = db.EnrollmentStatus.Completed;
            for (const project of userProjectMap[user.userId]) {
              if (
                project.events.length == 0 ||
                project.events.find(
                  (event) => event.endDate.getTime() > new Date().getTime()
                )
              ) {
                info.enrollment_status = db.EnrollmentStatus.Ongoing;
                break;
              }
            }
          } else {
            info.enrollment_status =
              user.role == db.UserRoles.Admin
                ? ""
                : db.EnrollmentStatus.Unenrolled;
          }
          result.push(info);
        }
      });

      res.status(200).json({
        response_str: "Users retrieved successfully!",
        response_data: result,
      });
      return;
    });
  } catch (err) {
    console.log("error while retrieving users - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

// FIXME: merge updateProfile and updateUser ?
exports.updateUser = async (req, res) => {
  try {
    let user = req.user;
    user.status = req.body.status;
    user.firstName = utils.getdefaultValue(req.body.first_name, user.firstName);
    user.lastName = utils.getdefaultValue(req.body.last_name, user.lastName);
    user.middleName = utils.getdefaultValue(
      req.body.middle_name,
      user.middleName
    );
    user.email = utils.getdefaultValue(req.body.email, user.email);
    await user.save();
    res.status(200).json({
      response_str: "User status updated successfully!",
      response_data: {
        user_id: user.userId,
        updated_status: user.status,
      },
    });
    return;
  } catch (err) {
    if (err.name === db.SequelizeValidationErrorItem) {
      res.status(400).json({
        error: {
          message: `Invalid email-id given.`,
        },
      });
      return;
    }
    if (err.name === db.SequelizeUniqueConstraintError) {
      res.status(400).json({
        error: {
          message: `Invalid. User - ${req.body.email} is already available.`,
        },
      });
      return;
    }
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.updatePassword = async (req, res) => {
  try {
    let user = req.user;
    user.password = req.body.confirmPassword;
    await user.save();
    res.status(200).json({
      response_str: "User Password updated successfully!",
      response_data: {
        user_id: user.userId,
      },
    });
    return;
  } catch (err) {
    console.log("error while updating password - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.processCSV = async (req, res) => {
  const { newUsers, addUsers, remUsers, roleId, courseCodeId } = req.body;

  const { tokenNo, tokenStart, tokenEnd } = utils.generateTokenDetails();
  try {
    for (const email of addUsers) {
      const user = await User.findOne({
        attributes: ["userId", "email"],
        where: {
          email: email,
        },
        raw: true,
      });

      const res = await UserRole.findOne({
        attributes: ["Id"],
        where: {
          userId: user.userId,
          roleId: roleId,
        },
      });

      if (courseCodeId) {
        UserRoleCourse.create({
          userRoleId: res.Id,
          courseCodeId: courseCodeId,
        });
      }
    }

    for (const email of newUsers) {
      //generate token and send email
      User.create({
        email: email,
        tokenNo: tokenNo,
        tokenStart: tokenStart,
        tokenEnd: tokenEnd,
      }).then(async (user) => {
        const res = await UserRole.create({
          userId: user.userId,
          roleId: roleId,
        });

        if (courseCodeId) {
          UserRoleCourse.create({
            userRoleId: res.dataValues.Id,
            courseCodeId: courseCodeId,
          });
        }

        const content = `Hello ${user.email}, your account has been created on the Capstone Portal on ${process.env.LINK} <br> Please note that the portal can be accessed through VPN or UB's network only. <br>
        Please use credentails: <br>
        Email: ${email} <br>
        Password: ${tokenNo} <br>
        Your temporary password will expire in 1 day <br>
        Thanks and Regards <br>
        Capstone Team`;

        utils.sendEmail("Capstone Portal Credentails", content, user.email);
      });
    }

    for (const user of remUsers) {
      const userRole = await UserRole.findAll({
        attributes: ["Id"],
        where: {
          roleId: roleId,
          userId: user.userId,
        },
      });

      UserRoleCourse.destroy({
        where: {
          userRoleId: userRole[0].Id,
          courseCodeId: courseCodeId,
        },
      });
    }

    res.status(200);
    return res.json({
      message: "Successfully updated users",
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    return res.json({
      error: {
        message: "Error occured while updating the users",
      },
    });
  }
};

exports.deleteUsers = async (req, res) => {
  const users = req.body.users; //arr of userids
  const roleArr = await Role.findAll({
    where: {
      name: req.body.role ? req.body.role : [],
    },
  });
  const roleIdArr = roleArr.map((roleObj) => roleObj.Id);

  const whereClause = req.body.courseCodeId
    ? { courseCodeId: req.body.courseCodeId }
    : {};
  const userObjs = await User.findAll({
    where: {
      userId: users,
    },
    include: [
      {
        model: UserRole,
        where: {
          roleId: roleIdArr,
        },
        include: [
          {
            model: db.userRoleCourse,
            where: whereClause,
          },
        ],
      },
    ],
  });

  await userObjs.forEach(async (user) => {
    await user.userRoles.forEach(async (userrole) => {
      await userrole.userRoleCourses.forEach((urc) => {
        urc.destroy();
      });
      userrole.destroy();
    });

    if (!req.body.courseCodeId) user.destroy();
  });

  res.status(200).json({
    response_str: "Users are deleted successfully!",
    response_data: {
      user_id: user.userId,
    },
  });
  return;
};

exports.generateToken = async (req, res) => {
  let users = req.body.users;
  const today = new Date();
  let tomorrow = new Date();
  //change later
  tomorrow.setDate(today.getDate() + 1);

  users.forEach(async (user) => {
    const token = utils.generateRandomString(12);
    const result = await User.update(
      {
        tokenNo: token,
        tokenStart: today,
        tokenEnd: tomorrow,
      },
      {
        where: { userId: user.userId },
      }
    );
    if (result) {
      const content =
        "Hello " +
        user.email +
        ",<br>The instructor has regenerated your token for the Capstone Portal on " +
        process.env.LINK +
        " <br>Please Note that the portal can be accessed only through connecting through University at Buffalo's network or using a VPN to connect to University at Buffalo's network. <br> Please use credentials: <br>Email: " +
        user.email +
        "<br>Token: " +
        password +
        "<br> Your token will expire at " +
        (new Date() + 1) +
        "<br><br>Thanks and Regards, <br>Capstone Team";
      utils.sendEmail("Capstone Portal Credentials", content, user.email);
    }
  });
  return res.status(201).json({
    response_str: "User Tokens added succesfully",
  });
};

exports.uploadCSV = async (req, res) => {
  let fileType = "." + req.file.originalname.split(".").pop().trim();
  const { role, courseCodeId } = req.body;

  await utils.uploadFileSync(req.file.path, fileType).then((file) => {
    if (!file) {
      return res.status(500).json({
        error: {
          message: `Error occured while uploading the file`,
        },
      });
    } else {
      fs.readFile(file, "utf-8", async (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            error: {
              message: "Error occured while reading the file",
            },
          });
        }
        const usersRequested = data.toString().trim().split("\n");
        fs.unlinkSync(file);

        //get role id
        const roleId = await Role.findAll({
          attributes: ["Id"],
          where: {
            name: db.UserRoles[role],
          },
          raw: true,
        });

        //get user Id
        const userRoleIds = await UserRoleCourse.findAll({
          attributes: ["userRoleId"],
          where: {
            courseCodeId: courseCodeId,
          },
          raw: true,
        });

        //get users of role id
        let courseUserIds = await UserRole.findAll({
          attributes: ["userId"],
          where: {
            Id: userRoleIds.map((user) => user.userRoleId),
            roleId: 1,
          },
          raw: true,
        });

        courseUserIds = courseUserIds.map((id) => id.userId);

        const allUsers = await User.findAll({
          attributes: ["email", "userId"],
          raw: true,
        });

        const allUserEmails = allUsers.map((user) => user.email);
        let courseUserEmails = allUsers.filter((user) => {
          if (courseUserIds.includes(user.userId)) return user.email;
        });

        courseUserEmails = courseUserEmails.map((user) => user.email);

        const newUsers = usersRequested.filter(
          (email) => !allUserEmails.includes(email)
        );

        const usersToAdd = usersRequested.filter(
          (email) =>
            !courseUserEmails.includes(email) && !newUsers.includes(email)
        );
        const usersToRemove = courseUserEmails.filter(
          (email) => !usersRequested.includes(email)
        );

        res.status(200);
        res.json({
          message: "Successfully parsed the CSV",
          data: {
            newUsers: newUsers,
            usersToAdd: usersToAdd,
            usersToRemove: usersToRemove,
            roleId: roleId[0].Id,
            courseCodeId: courseCodeId,
          },
        });
        return res;
      });
    }
  });
};

exports.editRole = async (req, res) => {
  const { userId, roles } = req.body;

  try {
    const user = await User.findOne({
      where: {
        userId: userId,
      },
      include: [
        {
          model: UserRole,
        },
      ],
    });

    const userRoles = user.userRoles.map((role) => role.roleId);

    let roleIds = await Role.findAll({
      where: {
        name: roles,
      },
      raw: true,
    });

    const roleMap = {};
    roleIds = roleIds.map((role) => {
      roleMap[role.Id] = role.name;
      return role.Id;
    });

    const addRoles = roleIds.filter((role) => !userRoles.includes(role));
    const delRoles = userRoles.filter((role) => !roleIds.includes(role));

    for (const role of addRoles) {
      await user.addRole(role);
    }

    for (const role of delRoles) {
      user.removeRole(role);
    }

    res.status(200);
    return res.json({
      message: "successfully updated roles",
    });
  } catch (err) {
    console.log("Error occured while updating the role", err);
    res.status(500);
    return res.json({
      error: {
        message: `Error occured while updating the role`,
      },
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    let user = req.user;
    const tempPassword = utils.generateRandomString(7);
    user.password = tempPassword;
    await user.save();

    const emailSubject = "Reset Password";
    const emailBody = `Hello ${user.userName}, A request to reset password was receieved. Please use the following temporary password: <h3> ${tempPassword} </h3> to login using this same email-id. For safety reasons, please update your password once logged-in.`;

    utils.sendEmail(emailSubject, emailBody, user.email);

    res.status(200).json({
      response_str:
        "User Password reset. Check Email and login using the password sent.",
      response_data: {
        user_id: user.userId,
      },
    });
    return;
  } catch (err) {
    console.log("error while resetting password - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.getUsers = async (req, res) => {
  const userId = req.user.userId;
  try {
    const insRole = await Role.findOne({
      where: {
        name: db.UserRoles.Instructor,
      },
    });

    const userRoleId = await UserRole.findOne({
      where: {
        userId: userId,
        roleId: insRole.Id,
      },
    });

    const instructorCourses = await UserRoleCourse.findAll({
      attributes: ["courseCodeId"],
      where: {
        userRoleId: userRoleId.Id,
      },
    });

    const userObjs = await User.findAll({
      include: [
        {
          model: UserRole,
          include: [
            {
              model: UserRoleCourse,
              where: {
                courseCodeId: instructorCourses.map(
                  (course) => course.courseCodeId
                ),
              },
            },
          ],
        },
      ],
    });

    const result = [];
    for (const user of userObjs) {
      let roles = await utils.getRolesArray(user);
      result.push({
        ...user.getPublicInfo,
        userId: user.userId,
        roles: roles,
      });
    }

    res.status(200).json({
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (err) {
    console.log("Get Users error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.getClients = async (req, res) => {
  const userId = req.user.userId;
  try {
    const insRole = await Role.findOne({
      where: {
        name: db.UserRoles.Instructor,
      },
    });

    const clientRole = await Role.findOne({
      where: {
        name: db.UserRoles.Client,
      },
    });

    const userRoleId = await UserRole.findOne({
      where: {
        userId: userId,
        roleId: insRole.Id,
      },
    });

    const instructorCourses = await UserRoleCourse.findAll({
      attributes: ["courseCodeId"],
      where: {
        userRoleId: userRoleId.Id,
      },
    });

    const clientObjs = await User.findAll({
      include: [
        {
          model: UserRole,
          where: {
            roleId: clientRole.Id,
          },
          include: [
            {
              model: UserRoleCourse,
              where: {
                courseCodeId: instructorCourses.map(
                  (course) => course.courseCodeId
                ),
              },
            },
            {
              model: Project,
              include: [
                {
                  model: CourseCode,
                },
              ],
            },
          ],
        },
      ],
    });

    const result = clientObjs.map((client) => ({
      ...client.getPublicInfo,
      userId: client.userId,
      projects: client.userRoles[0].projects.map((project) => ({
        ...project.getPublicInfo,
        id: project.projectId
      })),
    }));

    res.status(200).json({
      message: "Clients retrieved successfully",
      data: result,
    });
  } catch (err) {
    console.log("Get Clients error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.getStudents = async (req, res, next) => {
  const userId = req.user.userId;

  try {
    const insRole = await Role.findOne({
      where: {
        name: db.UserRoles.Instructor,
      },
    });

    const studentRole = await Role.findOne({
      where: {
        name: db.UserRoles.Student,
      },
    });

    const userRoleId = await UserRole.findOne({
      where: {
        userId: userId,
        roleId: insRole.Id,
      },
    });

    const instructorCourses = await UserRoleCourse.findAll({
      attributes: ["courseCodeId"],
      where: {
        userRoleId: userRoleId.Id,
      },
    });

    const studentObjs = await User.findAll({
      include: [
        {
          model: UserRole,
          where: {
            roleId: studentRole.Id,
          },
          include: [
            {
              model: UserRoleCourse,
              where: {
                courseCodeId: instructorCourses.map(
                  (course) => course.courseCodeId
                ),
              },
            },
          ],
        },
      ],
    });

    const result = [];
    for (const student of studentObjs) {
      let projects = await student.userRoles[0].getProjects();
      let courses = student.userRoles[0].userRoleCourses;
      let courseInfo = {};

      for (const course of courses) {
        let courseObj = await CourseCode.findOne({
          attributes: ["name", "code"],
          where: {
            courseCodeId: course.courseCodeId,
          },
        });
        let entry = {
          courseCodeId: course.courseCodeId,
          name: courseObj.name,
          code: courseObj.code,
          status: course.status,
        };
        courseInfo[course.courseCodeId] = entry;
      }

      if (projects.length) {
        projects.forEach((project) => {
          let course = courseInfo[project.courseCodeId];
          result.push({
            name: student.userName,
            nameLetters: (student.firstName!=null && student.lastName!=null) ? student.firstName[0]+student.lastName[0]: "",
            userId: student.userId,
            email: student.email,
            image: student.image!=null? student.image.replace(
              "./db",
              `http://${process.env.MYSQL_HOST}:${process.env.PORT}/images/`):student.image,
            project_name: project.getPublicInfo.name,
            project_id: project.projectId,
            course_name: course.name,
            course_code: course.code,
            course_code_id: course.courseCodeId,
            status: course.status,
          });
        });
      } else {
        courses.forEach((course) => {
          result.push({
            name: student.userName,
            nameLetters: (student.firstName!=null && student.lastName!=null) ? student.firstName[0]+student.lastName[0]: "",
            email: student.email,
            userId: student.userId,
            image: student.image!=null? student.image.replace(
              "./db",
              `http://${process.env.MYSQL_HOST}:${process.env.PORT}/images/`):student.image,
            project_name: "N/A",
            course_name: courseInfo[course.courseCodeId].name,
            course_code: courseInfo[course.courseCodeId].code,
            course_code_id: courseInfo[course.courseCodeId].courseCodeId,
            status: courseInfo[course.courseCodeId].status,
          });
        });
      }
    }
    res.status(200).json({
      message: "Students retrieved successfully",
      data: result,
    });
  } catch (err) {
    console.error("getStudent error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};
