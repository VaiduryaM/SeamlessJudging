const { Op } = require("sequelize");
const db = require("../models");
const Project = db.project;
const Event = db.event;
const ScoreCategory = db.scoreCategory;
const EventProjectMap = db.eventProjectMap;

checkProjectByNameExistence = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: {
        name: req.body.name.trim(),
      },
    });
    if (project) {
      res.status(400).json({
        error: {
          message: `Invalid. Project - ${req.body.name} is already available.`,
        },
      });
      return;
    }
    next();
  } catch (err) {
    console.log("checkProjectByNameExistence-middleware error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!!",
      },
    });
    return;
  }
};

checkProjectTeamSizeExceed = async (req, res, next) => {
  try {
    const project = req.project;
    const role = await db.role.findOne({
      where: { name: db.UserRoles.Student },
    });
    project
      .countUserRoles({
        include: [
          {
            model: db.role,
            where: {
              Id: role.Id,
            },
          },
        ],
      })
      .then((count) => {
        if (count + req.body.students.length > project.teamSize) {
          res.status(400).json({
            error: {
              message:
                "Enrollment request failed. Some or all of the team members may get added to the waitlist. Do you wish to proceed?",
              code: db.RequestTypes.TeamSize,
            },
          });
          return;
        }
        next();
      });
  } catch (err) {
    console.log("checkTeamSizeExceed-middleware error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!!",
      },
    });
    return;
  }
};

checkStudentMultipleProject = async (req, res, next) => {
  try {
    let multipleEnrollmentStudents = [];
    let nonCourseStudents = [];
    const students = req.body.students;
    const project = req.project;
    for (const studentEmail of students) {
      const userRoleObj = await db.userRole.findOne({
        attributes: ["Id"],
        include: [
          {
            model: db.user,
            where: { email: studentEmail },
          },
          {
            model: db.role,
            where: { name: db.UserRoles.Student },
          },
        ],
      });

      await db.userRoleCourse
        .findAndCountAll({
          where: {
            userRoleId: userRoleObj.Id,
            courseCodeId: project.courseCodeId,
          },
        })
        .then(({ count, rows }) => {
          if (count == 0) {
            // student not in this course
            nonCourseStudents.push(studentEmail);
          } else {
            if (rows[0].status != db.StudentEnrollmentPosition.Unenrolled) {
              // student enrolled in some other project in same course
              multipleEnrollmentStudents.push(studentEmail);
            }
          }
        });
    }

    if (nonCourseStudents.length > 0) {
      res.status(400).json({
        error: {
          message: "These students are not in course: " + nonCourseStudents,
          code: db.RequestTypes.MultipleProject,
        },
      });
      return;
    }

    if (multipleEnrollmentStudents.length > 0) {
      res.status(400).json({
        error: {
          message:
            "Enrollment in multiple projects is not allowed. Following students are enrolled elsewhere: " +
            multipleEnrollmentStudents,
          code: db.RequestTypes.MultipleProject,
        },
      });
      return;
    }

    next();
  } catch (err) {
    console.log("checkStudentMultipleProject-middleware error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!!",
      },
    });
    return;
  }
};

checkEmailsForRole = (emailKey, roleToCheck) => {
  return async function (req, res, next) {
    try {
      if (!req.body[emailKey] || req.body[emailKey].length == 0) {
        req.body.userRoleIds = [];
        next();
        return;
      }
      //const emailData = req.body[emailKey].map((email) => email.trim()); //this line throws this error checkEmailsForRole-middleware error -  TypeError: req.body[emailKey].map is not a function
      const emailData = Array.isArray(req.body[emailKey])
        ? req.body[emailKey].filter((email) => typeof email === 'string').map((email) => email.trim())
        : [];
      let nonExistingUsers = [];
      let nonRoleUsers = [];
      let existingUserRoles = [];
      for (const email of emailData) {
        await db.user
          .findOne({
            where: { email: email },
            include: [
              {
                model: db.userRole,
                include: db.role,
              },
            ],
          })
          .then(async (user) => {
            if (!user) {
              nonExistingUsers.push(email);
            } else {
              const clientUserRole = await user.userRoles.find(
                (userrole) => userrole.role.name == roleToCheck
              );
              if (!clientUserRole) {
                nonRoleUsers.push(user.email);
              } else {
                existingUserRoles.push(clientUserRole);
              }
            }
          });
      }
      if (nonExistingUsers.length) {
        return res.status(400).json({
          error: {
            message: "User(s) not in system",
            data: nonExistingUsers,
          },
        });
      }

      if (nonRoleUsers.length) {
        return res.status(400).json({
          error: {
            message: `User(s) are not associated with ${roleToCheck} role`,
            data: nonRoleUsers,
          },
        });
      }
      req.body.userRoleIds = existingUserRoles.map((userrole) => userrole.Id);
      next();
    } catch (err) {
      console.log("checkEmailsForRole-middleware error - ", err);
      res.status(500).json({
        error: {
          message: "Internal server error!!",
        },
      });
      return;
    }
  };
};

allowUpdate = (req, res, next) => {
  Project.findByPk(req.body.projectId)
    .then(async (project) => {
      if (!project) {
        res.status(400).json({
          error: {
            message: "Invalid ProjectId.",
          },
        });
        return;
      }
      const role = await db.role.findOne({
        where: { name: db.UserRoles.Student },
      });

      project
        .countUserRoles({
          include: [
            {
              model: db.role,
              where: {
                Id: role.Id,
              },
            },
          ],
        })
        .then((count) => {
          if (count > req.body.size) {
            return res.status(400).json({
              error: {
                message: `Invalid. Project already has more students enrolled than specified team-size!`,
              },
            });
          }
        });

      if (req.body.name != undefined && req.body.name.trim() != project.name) {
        const existingProject = await Project.findOne({
          where: {
            name: req.body.name.trim(),
          },
        });
        if (existingProject) {
          res.status(400).json({
            error: {
              message: `Invalid. Project - ${req.body.name} is already available.`,
            },
          });
          return;
        }
      }
      req.project = project;
      next();
    })
    .catch((err) => {
      console.log("allowUpdate-middleware error error - ", err);
      res.status(500).json({
        error: {
          message: "Internal server error!!",
        },
      });
      return;
    });
};

checkProjectExistence = (req, res, next) => {
  const projectId = req.params.projectId;
  Project.findOne({
    where: {
      projectId: projectId,
    },
  })
    .then(async (project) => {
      if (!project) {
        res.status(400).json({
          error: {
            message: "Invalid ProjectId.",
          },
        });
        return;
      }
      req.project = project;
      next();
    })
    .catch((err) => {
      console.log("checkProjectExistence-middleware error error - ", err);
      res.status(500).json({
        error: {
          message: "Internal server error!!",
        },
      });
      return;
    });
};

addScoringCategory = (req, res, next) => {
  const scoringCategoryIds = req.body.scoring_categories;
  ScoreCategory.findAll({
    where: {
      scoreCategoryId: {
        [db.Sequelize.Op.in]: scoringCategoryIds,
      },
    },
  })
    .then((categories) => {
      if (categories.length != scoringCategoryIds.length) {
        res.status(400).json({
          error: {
            message: "Invalid ScoringCategoryIds passed!!",
          },
        });
        return;
      }
      req.scoreCategories = categories;
      next();
    })
    .catch((err) => {
      console.log("addScoringCategory-middleware error error - ", err);
      res.status(500).json({
        error: {
          message: "Internal server error!!",
        },
      });
      return;
    });
};

accessProject = (req, res, next) => {
  projectId = req.params.projectId;
  Project.findOne({
    where: {
      projectId: projectId,
    },
  })
    .then((project) => {
      if (!project) {
        res.status(400).json({
          error: {
            message: "Invalid ProjectId.",
          },
        });
        return;
      }
      req.project = project;
      next();
    })
    .catch((err) => {
      console.log("accessProject-middleware error error - ", err);
      res.status(500).json({
        error: {
          message: "Internal server error!!",
        },
      });
      return;
    });
};

validateEventProjectExistence = (req, res, next) => {
  EventProjectMap.findOne({
    where: {
      eventId: req.params.eventId,
      projectId: req.params.projectId,
    },
  })
    .then((ep) => {
      if (!ep) {
        res.status(400).json({
          error: {
            message: "Invalid ProjectId.",
          },
        });
        return;
      }
      req.eventProject = ep;
      next();
    })
    .catch((err) => {
      console.log(
        "validateEventProjectExistence-middleware error error - ",
        err
      );
      res.status(500).json({
        error: {
          message: "Internal server error!!",
        },
      });
      return;
    });
};

const validateProject = {
  checkProjectTeamSizeExceed: checkProjectTeamSizeExceed,
  checkStudentMultipleProject: checkStudentMultipleProject,
  allowUpdate: allowUpdate,
  checkProjectExistence: checkProjectExistence,
  addScoringCategory: addScoringCategory,
  accessProject: accessProject,
  validateEventProjectExistence: validateEventProjectExistence,
  checkProjectByNameExistence: checkProjectByNameExistence,
  checkEmailsForRole: checkEmailsForRole,
};

module.exports = validateProject;
