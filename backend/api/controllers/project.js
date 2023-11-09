const db = require("../models");
const { Op } = require("sequelize");
const utils = require("../controllers/utils.js");
const { project, projectType } = require("../models");
const userRoleCourse = require("../models/userRoleCourse");
const courseCode = require("../models/courseCode");

const {
  project: Project,
  judgeProjectMap: JudgeProjectMap,
  projectContent: ProjectContent,
  eventProjectMap: EventProjectMap,
  score: Score,
  ProjectTypeMap: ProjectTypeMap,
  ProjectType: ProjectType,
  winnerCategory: WinnerCategory,
  user: User,
  courseCode: CourseCode,
  role: Role,
  userRole: UserRole,
  userRoleCourse: UserRoleCourse,
} = db;

exports.addProjectsInBulk = async(req, res) => {
  try {
    const clientRoleId = await Role.findOne({
      where: { name: db.UserRoles.Client },
    });
    const courses = await db.courseCode.findAll();
    let courseNameIdMap = {};
    courses.forEach((course) => {
      courseNameIdMap[course.code] = course.courseCodeId;
    });
    let projectTypeIdMap = {};
    const projectTypes = await db.projectType.findAll();
    projectTypes.forEach((pType) => {
      projectTypeIdMap[pType.projectType] = pType.projectTypeId;
    });
    let colFieldMap = req.body.colFieldMap;
    let missedRows = [];
    let all_projects = [];
    let failedProjects = [];
        for (const project of req.body.parsedData) {
          try{
          let courseId = colFieldMap["courseCodeId"] && project[colFieldMap["courseCodeId"]].length>0 ? courseNameIdMap[project[colFieldMap["courseCodeId"]].split(":")[0].trim()] : colFieldMap["defaultcourse"];
          if(colFieldMap["name"]){
            let pTypeIds = []
            if(colFieldMap["projectType"] && project[colFieldMap["projectType"]].length>0){
              let pTypes = project[colFieldMap["projectType"]].split(";");
              for(const pType of pTypes){
                if(projectTypeIdMap.hasOwnProperty(pType)){
                  pTypeIds.push({projectTypeId:projectTypeIdMap[pType]});
                }
              }
            }
            let PContents = [];
            if(colFieldMap["link1"] && project[colFieldMap["link1"]].length>0){
                  PContents.push({name:colFieldMap["link1"],content:project[colFieldMap["link1"]]});
            }
            if(colFieldMap["link2"] && project[colFieldMap["link2"]].length>0){
                PContents.push({name:colFieldMap["link2"],content:project[colFieldMap["link2"]]});
          }
          if(colFieldMap["link3"] && project[colFieldMap["link3"]].length>0){
              PContents.push({name:colFieldMap["link3"],content:project[colFieldMap["link3"]]});
          }
          let userRoleCourses = [];
          if(colFieldMap["clients"] && project[colFieldMap["clients"]].length>0){
            let emailIds = project[colFieldMap["clients"]].split(",");
            for(const email of emailIds){
              let userObj = {email:email};
              let userRoleObj = {roleId: clientRoleId.Id, user: userObj};
              let userRoleCourseObj = {courseCodeId: courseId, userRole: userRoleObj};
              userRoleCourses.push(userRoleCourseObj);
            }
        }
            all_projects.push({
              name: project[colFieldMap["name"]],
              description: colFieldMap["description"] ? project[colFieldMap["description"]]: null,
              courseCodeId: courseId,
              createdBy: req.user.userId,
              ProjectTypeMaps: pTypeIds,
              projectContents: PContents,
              userRoleCourses: userRoleCourses,
            });
          }
        }catch (err) {
          failedProjects.push(project[colFieldMap["name"]]);
        }
        }
    const resp = await Project.bulkCreate(all_projects,{include: [db.projectTypeMap, db.projectContent, {model: db.userRoleCourse, include:[{model: db.userRole, include:db.user}]}]});

      if (resp) {
        return res.status(200).json({
          responseStr: "Projects added successfully !",
          responseData: {
            failedProjects: failedProjects,
          },
        });
      }
      return res.status(500).json({
        error: {
          message: "Projects creation failed",
        },
      });
  } catch (err) {
    console.log("Error while adding projects", err);
    return res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
  }
}

exports.addProject = async (req, res) => {
  try {
    const insRoleId = await Role.findOne({
      where: { name: db.UserRoles.Instructor },
    });
    const clientRoleId = await Role.findOne({
      where: { name: db.UserRoles.Client },
    });
    await Project.create({
      name: req.body.name,
      description: req.body.description,
      courseCodeId: parseInt(req.body.courseCodeId),
      createdBy: req.user.userId,
      teamSize: parseInt(req.body.size),
      parentProjectId: parseInt(req.body.parentProjectId),
    }).then(async (project) => {
      if (req.body.links) {
        let link = req.body.links;
        let all_links = [];
        for (const key in link) {
          all_links.push({
            projectId: project.projectId,
            name: key,
            contentType: "LINKS",
            content: link[key],
            uploadedBy: req.user.userId,
          });
        }
        await ProjectContent.bulkCreate(all_links);
      }
      const allUserRoleIds = [];
      const currUserRoleId = await UserRole.findOne({
        where: {
          userId: req.user.userId,
          roleId:
            req.body.role == "Clients"
              ? clientRoleId.dataValues.Id
              : insRoleId.dataValues.Id,
        },
      });
      allUserRoleIds.push(currUserRoleId.dataValues.Id);
      if (req.body.userRoleIds) {
        allUserRoleIds.push(...req.body.userRoleIds);
      }
      const bulkUserRoleCourseData = [];
      allUserRoleIds.forEach((userRoleId) => {
        bulkUserRoleCourseData.push({
          projectId: project.projectId,
          courseCodeId: project.courseCodeId,
          userRoleId: userRoleId,
        });
      });
      const resp = await UserRoleCourse.bulkCreate(bulkUserRoleCourseData);
      if(req.body.projectTypeIds){
        let bulkProjectTypeMapObjs = [];
        for(const oneProjectTypeId of req.body.projectTypeIds){
          bulkProjectTypeMapObjs.push({
            projectId: project.projectId,
            projectTypeId: oneProjectTypeId
          });
        }
        await db.projectTypeMap.bulkCreate(bulkProjectTypeMapObjs);
      }
      if (resp) {
        return res.status(200).json({
          responseStr: "Project added successfully !",
          responseData: {
            projectId: project.projectId,
          },
        });
      }
      return res.status(500).json({
        error: {
          message: "Project creation failed",
        },
      });
    });
  } catch (err) {
    console.log("Error while adding project", err);
    return res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
  }
};

// get a user {instructor/client} all projects
exports.getUserProject = async (req, res) => {
  const role = req.params.role.toLowerCase();
  const user = req.user;

  if (role === "instructor") {
    // get all projects from courses asssoc to instructor filtered as current and past
    const roleObj = await db.role.findOne({
      where: { name: db.UserRoles.Instructor },
    });
    const courses = await db.courseCode.findAll({
      include: [
        {
          model: db.userRoleCourse,
          include: [
            {
              model: db.userRole,
              where: {
                userId: user.userId,
                roleId: roleObj.Id,
              },
              required: true,
            },
          ],
          required: true,
        },
      ],
    });
    let courseIds = [];
    courses.forEach((course) => {
      courseIds.push(course.courseCodeId);
    });
    console.log(" courses = ", courseIds);
    await db.project
      .findAll({
        where: {
          courseCodeId: courseIds,
        },
        include: [
          {
            model: db.userRole,
            include: [db.role, db.user]
          },
          db.courseCode, db.projectContent, db.projectType],
        order: [["createdAt", "DESC"]],
      })
      .then((projects) => {
        let response = {};
        let currentProjects = [];
        let pastProjects = [];
        const currentSemester = utils.getSemester(new Date());
        for (let project of projects) {
          if (project.courseCode.year === currentSemester.year) {
            if (
              db.Semesters[project.courseCode.semester] ===
              db.Semesters[currentSemester.semester]
            ) {
              currentProjects.push(project.getBasicInfo);
            } else if (
              db.Semesters[project.courseCode.semester] <
              db.Semesters[currentSemester.semester]
            ) {
              pastProjects.push(project.getBasicInfo);
            }
          } else if (project.courseCode.year < currentSemester.year) {
            pastProjects.push(project.getBasicInfo);
          }
        }
        response.currentProjects = currentProjects;
        response.pastProjects = pastProjects;

        res.status(200).json({
          response_str: "Projects retrieved",
          response_data: response,
        });
        return;
      });
  } else if (role === "clients") {
    // get all project as a client filtered as current and past
    Project.findAll({
      include: [
        {
          model: db.userRole,
          include: [
            {
              model: db.role,
              where: { name: db.UserRoles.Client },
            },
            {
              model: db.user,
              where: { userId: user.userId },
            },
          ],
          required: true,
        },
        { model: db.projectType },
        { model: db.courseCode },
      ],
      order: [["createdAt", "DESC"]],
    })
      .then(async (projects) => {
        if (projects == null || projects.length == 0) {
          return res.status(400).json({
            error: {
              message: "No Projects assigned to client!",
            },
          });
        }
        let response = {};
        response.currentProjects = [];
        response.pastProjects = [];
        const currentSemester = utils.getSemester(new Date());

        for (let project of projects) {
          if (project.courseCode.year === currentSemester.year) {
            if (
              db.Semesters[project.courseCode.semester] ===
              db.Semesters[currentSemester.semester]
            ) {
              response.currentProjects.push(project.getBasicInfo);
            } else if (
              db.Semesters[project.courseCode.semester] <
              db.Semesters[currentSemester.semester]
            ) {
              response.pastProjects.push(project.getBasicInfo);
            }
          } else if (project.courseCode.year < currentSemester.year) {
            response.pastProjects.push(project.getBasicInfo);
          }
        }

        res.status(200).json({
          response_str: "Projects retrieved",
          response_data: response,
        });
        return;
      })
      .catch((err) => {
        console.log("getUserProjects error - ", err);
        res.status(500).json({
          error: {
            message: "Internal server error!",
          },
        });
        return;
      });
  } else {
    res.status(400).json({
      error: {
        message: `Invalid Role ${role}`,
      },
    });
    return;
  }
};

// see if used. otherwise remove
exports.joinProject = (req, res) => {
  try {
    req.project.addUser(req.user);
    res.status(200).json({
      response_str: "Project joined successfully!",
      response_data: {
        project_id: req.project.ProjectId,
      },
    });
    return;
  } catch (err) {
    console.log("joinProject error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.deleteProject = async (req, res) => {
  try {
    let project = req.project;
    let currentProjectAssociations = await db.userRoleCourse.findAll({
      where: {
        projectId: project.projectId,
      },
      include: [
        {
          model: db.userRole,
          include: [db.user, db.role],
          required: true,
        },
      ],
    });
    for (let record of currentProjectAssociations) {
      record.projectId = null;
      record.status = db.StudentEnrollmentPosition.Unenrolled;
      record.save();
      const emailBody = `Hello ${record.userRole.user.userName},<br> Project ${project.name} is deleted. You receieved this email because you are ${record.userRole.role.name} for this project. Please re-check your status on the capstone web portal.`;
      utils.sendEmail(
        "Update on Project Deletion",
        emailBody,
        record.userRole.user.email
      );
    }
    project.destroy().then(() => {
      res.status(200).json({
        response_str: "Project deleted !",
        response_data: {},
      });
      return;
    });
  } catch (err) {
    console.log("deleteProject error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.allocateStudentProject = async (req, res, next) => {
  try {
    let project = req.project;
    let courseId = project.courseCodeId;
    exports.unenrollProjectCall(req,res);
    exports.enrollProjectCall(req,res,project, courseId);
    res.status(200).json({
      response_str: "Project allocated successfully!",
      response_data: {
        project_id: project.projectId,
      },
    });
    return;
  } catch (err) {
    console.log("allocateStudentProject error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};
exports.enrollProjectCall = async (req, res, project, courseId) => {
  const studentsEmails = req.body.students.map((Email) => Email.trim());
    const usersToEnroll = await db.user.findAll({
      attributes: ["userId", "email", "PrefferedName", "firstName", "lastName"],
      where: {
        email: studentsEmails,
      },
    });
   console.log("usersToEnroll = ", usersToEnroll);
    const role = await db.role.findOne({
      where: { name: db.UserRoles.Student },
    });
  console.log("project.projectId = ", project.projectId);
    await usersToEnroll.forEach(async (oneUser) => {
      db.userRole
        .findOne({
          where: {
            userId: oneUser.userId,
            roleId: role.Id,
          },
        })
        .then(async (userrole) => {
          await db.userRoleCourse
            .update(
              {
                status: db.StudentEnrollmentPosition.Enrolled,
                enrolledAt: new Date().toISOString().replace("T", " "),
                projectId: project.projectId,
              },
              {
                where: {
                  userRoleId: userrole.Id,
                  courseCodeId: courseId,
                },
              }
            )
            .then(() => {
              let name = utils.getdefaultValue(
                oneUser.PrefferedName,
                oneUser.userName
              );
              sendEmailProjectStatus(
                oneUser.email,
                "Enrolled",
                project.name,
                name
              );
            });
        });
    });
    return;
};
exports.enrollProject = async (req, res, next) => {
  try {
    let project = req.project;
    let courseId = project.courseCodeId;
    exports.enrollProjectCall(req, res, project, courseId);

    res.status(200).json({
      response_str: "Project enrolled successfully!",
      response_data: {
        project_id: project.projectId,
      },
    });
    return;
  } catch (err) {
    console.log("enrollProject error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

async function sendEmailProjectStatus(email, position, project_name, name) {
  let content =
    "Hello " +
    name +
    ",<br> you have been " +
    position +
    " for project " +
    project_name +
    ". If you have any questions, please contact your instructor. <br><br> Thank you, <br> PM Tool Team";
  utils.sendEmail("Update Regarding Project Status", content, email);
  return;
}


exports.unenrollProjectCall = async (req, res) => {
  const unenrollments = req.body.unenrollments;
  const role = await db.role.findOne({
    where: { name: db.UserRoles.Student },
  });
  let projectStudentsDict = {};
  for (let item of unenrollments) {
    if(item.projectId){
      if (item.projectId in projectStudentsDict) {
        projectStudentsDict[item.projectId].push(...item.students);
      } else {
        projectStudentsDict[item.projectId] = [...item.students];
      }
    }
  }

  for (const [projectId, emails] of Object.entries(projectStudentsDict)) {
    const usersToUnenroll = await db.user.findAll({
      attributes: [
        "userId",
        "email",
        "PrefferedName",
        "firstName",
        "lastName",
      ],
      where: { email: emails },
    });
    console.log("usersToUnenroll = ", usersToUnenroll);
    usersToUnenroll.forEach(function (oneUser) {
      console.log(" oneUser.userId = ", oneUser.userId);
      console.log(" role.Id = ", role.Id);
      db.userRole
        .findOne({
          where: {
            userId: oneUser.userId,
            roleId: role.Id,
          },
        })
        .then(async (userrole) => {
          console.log("userrole = ", userrole);
          await db.userRoleCourse
            .update(
              {
                status: db.StudentEnrollmentPosition.Unenrolled,
                projectId: null,
              },
              {
                where: {
                  userRoleId: userrole.Id,
                  projectId: projectId,
                },
              }
            )
            .then(() => {
              const numUsersToBump = usersToUnenroll.length;
              db.userRoleCourse
                .findAndCountAll({
                  where: {
                    projectId: projectId,
                    status: db.StudentEnrollmentPosition.Waitlist,
                  },
                  order: [["enrolledAt", "ASC"]],
                  limit: numUsersToBump,
                })
                .then((res) => {
                  const { count, rows } = res;
                  rows.forEach(async (record) => {
                    record.status = db.StudentEnrollmentPosition.Enrolled;
                    record.enrolledAt = new Date().toISOString().replace("T", " ");
                    await record.save();
                  });
                });
              let name = utils.getdefaultValue(
                oneUser.PrefferedName,
                oneUser.userName
              );
              sendEmailProjectStatus(
                oneUser.email,
                "Unenrolled",
                project.name,
                name
              );
            });
        });
    })
    // TODO: implement sending email to users bumped from waitlist to enrolled
  }
  return;
};
exports.unenrollProject = async (req, res, next) => {
  try {
    
    exports.unenrollProjectCall(req, res);
    res.status(200).json({
      response_str: "Projects unenrolled successfully!",
      response_data: {
        project_id: req.body.projectId,
      },
    });
    return;
  } catch (err) {
    console.log("unenrollProject error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.waitlistProject = async (req, res) => {
  try {
    const project = req.project;
    const students = await db.user.findAll({
      where: { email: req.body.students },
    });

    const alloted_students_count = await db.userRoleCourse.count({
      where: {
        projectId: project.projectId,
      },
    });
    const role = await db.role.findOne({
      where: { name: db.UserRoles.Student },
    });
    const seatsRemaining =
      project.teamSize - alloted_students_count > 0
        ? project.teamSize - alloted_students_count
        : 0;
    const toEnroll = students.slice(0, seatsRemaining);
    const toWaitlist = students.slice(seatsRemaining);

    toEnroll.forEach((oneUser) => {
      db.userRole
        .findOne({
          where: {
            userId: oneUser.userId,
            roleId: role.Id,
          },
        })
        .then(async (userrole) => {
          await db.userRoleCourse
            .update(
              {
                status: db.StudentEnrollmentPosition.Enrolled,
                enrolledAt: new Date().toISOString().replace("T", " "),
                projectId: project.projectId,
              },
              {
                where: {
                  userRoleId: userrole.Id,
                  courseCodeId: project.courseCodeId,
                },
              }
            )
            .then(() => {
              let name = utils.getdefaultValue(
                oneUser.PrefferedName,
                oneUser.userName
              );
              sendEmailProjectStatus(
                oneUser.email,
                "Enrolled",
                project.name,
                name
              );
            });
        });
    });

    toWaitlist.forEach((oneUser) => {
      db.userRole
        .findOne({
          where: {
            userId: oneUser.userId,
            roleId: role.Id,
          },
        })
        .then(async (userrole) => {
          await db.userRoleCourse
            .update(
              {
                status: db.StudentEnrollmentPosition.Waitlist,
                enrolledAt: new Date().toISOString().replace("T", " "),
                projectId: project.projectId,
              },
              {
                where: {
                  userRoleId: userrole.Id,
                  courseCodeId: project.courseCodeId,
                },
              }
            )
            .then(() => {
              let name = utils.getdefaultValue(
                oneUser.PrefferedName,
                oneUser.userName
              );
              sendEmailProjectStatus(
                oneUser.email,
                "Waitlisted",
                project.name,
                name
              );
            });
        });
    });

    res.status(200).json({
      response_str: "Project waitlisted successfully !",
      response_data: {
        project_id: project.projectId,
      },
    });
    return;
  } catch (err) {
    console.log("waitListProject error - ");
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.finaliseProject = async (req, res) => {
  try {
    const allocations = req.body.allocations;
    const role = await db.role.findOne({
      where: { name: db.UserRoles.Student },
    });

    let response = {};
    response.successfulUpdate = [];
    response.failedUpdate = [];
    for (let itr = 0; itr < allocations.length; itr++) {
      let studentsEmails = allocations[itr].students;
      let projectID = allocations[itr].projectId;
      let project = await Project.findByPk(projectID);

      const oneUser = await db.user.findOne({
        attributes: [
          "userId",
          "email",
          "PrefferedName",
          "firstName",
          "lastName",
        ],
        where: {
          email: studentsEmails,
        },
      });

      await db.userRole
        .findOne({
          where: {
            userId: oneUser.userId,
            roleId: role.Id,
          },
        })
        .then(async (userrole) => {
          await db.userRoleCourse
            .update(
              {
                status: db.StudentEnrollmentPosition.Finalised,
              },
              {
                where: {
                  userRoleId: userrole.Id,
                  courseCodeId: project.courseCodeId,
                },
              }
            )
            .then((isUpdated) => {
              if (isUpdated) {
                response.successfulUpdate.push(oneUser.userId);
              } else {
                response.failedUpdate.push(oneUser.userId);
              }
            })
            .finally((res) => {
              let name = utils.getdefaultValue(
                oneUser.PrefferedName,
                oneUser.userName
              );
              sendEmailProjectStatus(
                oneUser.email,
                "Finalized",
                project.name,
                name
              );
            });
        });
    }

    res.status(200).json({
      response_str: "Projects finalised successfully!",
      response_data: response,
    });
    return;
  } catch (err) {
    console.log("finaliseProject error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.uploadContent = async (req, res) => {
  try {
    const projectId = utils.getdefaultValue(req.params.projectId, "");
    if (req.body.links) {
      let link = req.body.links;
      let all_links = [];
      for (const key in link) {
        all_links.push({
          projectId: projectId,
          name: key,
          contentType: "LINKS",
          content: link[key],
          uploadedBy: req.user.userId,
        });
      }

      await ProjectContent.bulkCreate(all_links);
      res.status(201).json({
        response_str: "Content posted successfully!",
        // response_data: cont,
      });
      return;
    } else {
      if (!req.file) {
        res.status(400).json({
          error: {
            message: "Invalid content cannot be empty!",
          },
        });
        return;
      }
      let fileType = "." + req.file.originalname.split(".").pop().trim();
      ProjectContent.add(
        projectId,
        req.file.originalname,
        req.body.content_type,
        utils.uploadFile(req.file.path, fileType),
        req.user.userId
      )
        .then(() => {
          res.status(201).json({
            response_str: "Content posted successfully!",
            response_data: {},
          });
          return;
        })
        .catch((err) => {
          console.log("uploadContent error - ", err);
          res.status(500).json({
            error: {
              message: "Internal server error!",
            },
          });
          return;
        });
    }
  } catch (err) {
    console.log("uploadContent error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.updateProject = async (req, res) => {
  try {
    
    let project = req.project;
    project.name = utils.getdefaultValue(req.body.name, project.name);
    project.description = utils.getdefaultValue(
      req.body.description,
      project.description
    );
    project.courseCodeId = utils.getdefaultValue(
      req.body.courseCodeId,
      project.courseCodeId
    );
    project.teamSize = utils.getdefaultValue(
      req.body.size,
      project.teamSize
    );
    project.parentProjectID = utils.getdefaultValue(
      req.body.parent_project_id,
      project.parentProjectID
    );
    project.save().then(async () => {
      if (req.body.links) {
        await ProjectContent.destroy({
          where: {
            projectID: project.dataValues.projectId,
          },
        });
        let link = req.body.links;
        let all_links = [];
        for (const key in link) {
          all_links.push({
            projectId: project.dataValues.projectId,
            name: key,
            contentType: "LINKS",
            content: link[key],
            uploadedBy: req.user.userId,
          });
        }
        await ProjectContent.bulkCreate(all_links);
      }
      const clientRoleId = await Role.findOne({
        where: { name: db.UserRoles.Client },
      });
      let oldClientEntries = await UserRoleCourse.findAll({
        where: {
          projectId: req.body.projectId,
        },
        attributes: ["userRoleId"],
        raw: true,
        include: [
          {
            model: db.userRole,
            where: {
              roleId: clientRoleId.dataValues.Id,
            },
          }
        ],
      });
      oldClientEntries = oldClientEntries.map((item) => item.userRoleId);

      await UserRoleCourse.destroy({
        where: {
          projectId: req.body.projectId,
          userRoleId: oldClientEntries,
        },
      });
      const bulkUserRoleCourseData = [];
      let clientUserRoleIds = [], clientUserRoleEntries = [];
      if(req.body.clients.length>0){
        clientUserRoleEntries = await UserRole.findAll({
          where: {
            roleId: clientRoleId.dataValues.Id,
          },
          include: [{
            model: User,
            where: { 
              "email": {
                    [db.Sequelize.Op.in]: req.body.clients,
              } 
            }
          }]
        });
        console.log("clientUserRoleEntries = ", clientUserRoleEntries);
        clientUserRoleIds = clientUserRoleEntries.map((item) => item.Id);
      }

      if (clientUserRoleIds.length>0) {
        clientUserRoleIds.forEach((clientUserRoleId) => {
          bulkUserRoleCourseData.push({
            projectId: project.projectId,
            courseCodeId: project.courseCodeId,
            userRoleId: clientUserRoleId,
          });
        });
      }
      const resp = await UserRoleCourse.bulkCreate(bulkUserRoleCourseData);
      if(req.body.projectTypeIds){
        db.projectTypeMap.destroy({where:{projectId: project.projectId}});
        let bulkProjectTypeMapObjs = [];
        for(const oneProjectTypeId of req.body.projectTypeIds){
          bulkProjectTypeMapObjs.push({
            projectId: project.projectId,
            projectTypeId: oneProjectTypeId
          });
        }
        await db.projectTypeMap.bulkCreate(bulkProjectTypeMapObjs);
      }
      if (resp) {
        return res.status(200).json({
          responseStr: "Project updated successfully !",
          responseData: {
            projectId: req.body.projectId,
          },
        });
      }
      return res.status(500).json({
        error: {
          message: "Project updation failed",
        },
      });
    });
  } catch (err) {
    console.log("updateProject error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.getProjects = (req, res) => {
  try {
    // filter on project's name
    const name = utils.getdefaultValue(req.query.name, "");
    let query = {};
    if (name != "") {
      query.name = {
        [db.Sequelize.Op.like]: `%${name}%`,
      };
    }

    // filters on event-detail page to get projects that are attached n not-attached to event
    let excludeEventId = "";
    let includeEventId = "";
    if (req.query.event_id != undefined) {
      if (
        req.query.event_filter == undefined ||
        ![db.EventFilters.Include, db.EventFilters.Exclude].includes(
          req.query.event_filter
        )
      ) {
        res.status(400).json({
          error: {
            message: "Invalid filters passed!",
          },
        });
        return;
      }
      if (req.query.event_filter === db.EventFilters.Include) {
        includeEventId = req.query.event_id;
      } else {
        excludeEventId = req.query.event_id;
      }
    }

    // filter using course-ids on project
    let courseCodeIds = utils.getdefaultValue(req.query.course_codes, []);
    courseCodeIds =
      courseCodeIds instanceof Array
        ? courseCodeIds
        : JSON.parse(courseCodeIds);
    if (courseCodeIds.length > 0) {
      query.courseCodeId = {
        [db.Sequelize.Op.in]: courseCodeIds,
      };
    }

    Project.findAll({
      where: query,
      include: [
        {
          model: db.projectType,
        },
        {
          model: db.courseCode,
        },
        {
          model: db.userRole,
          through: {
            attributes: ["status"],
          },
          include: [
            { model: db.role },
            {
              model: db.user,
              attributes: ["userId", "email", "firstName", "lastName"],
            },
          ],
        },
        {
          model: db.projectContent,
        },
        {
          model: db.event,
          where: includeEventId ? { eventId: includeEventId } : {},
          required: includeEventId ? true : false, //make inner join if include query is used
        },
      ],
      order: [["createdAt", "DESC"]],
    })
      .then(async (projects) => {
        let response = {
          ongoing_projects: [],
          all_projects: [],
          my_projects: [],
        };

        if (includeEventId && projects.length > 0) {
          // identify all projects that are attached to a judge
          let eventProjectIds = [];
          projects.forEach((project) =>
            eventProjectIds.push(
              project.events[0].eventProjectMap.eventProjectId
            )
          );
          const results = await db.sequelize.query(
            `select ep.projectId, jp.judgeId, jp.judgeProjectId from eventProjectMaps ep  
          join judgeProjectMaps jp on jp.eventProjectId = ep.eventProjectId 
          where ep.eventProjectId IN (:eventProjectIds)`,
            {
              replacements: { eventProjectIds },
              type: db.Sequelize.QueryTypes.SELECT,
            }
          );

          const winnerMap = await EventProjectMap.getWinners(eventProjectIds);
          let projectWinnerMap = {};
          for (const key in winnerMap) {
            winnerMap[key].forEach((winner) => {
              if (!projectWinnerMap.hasOwnProperty(winner.project_id)) {
                projectWinnerMap[winner.project_id] = [];
              }
              projectWinnerMap[winner.project_id].push({
                winner_category_id: winner.winner_category_id,
                winner_category_name: winner.winner_category_name,
              });
            });
          }

          // check if atleast one of the project is attached to judge
          if (results.length > 0) {
            // maintain relationship between project and judge
            let projectMap = {};
            let judgeIds = new Set();
            results.forEach((result) => {
              judgeIds.add(result.judgeId);
              if (!projectMap.hasOwnProperty(result.projectId)) {
                projectMap[result.projectId] = [];
              }
              projectMap[result.projectId].push({
                judgeProjectId: result.judgeProjectId,
                judgeId: result.judgeId,
              });
            });

            // maintain map b/w judge_id and its objs
            let judgeMap = {};
            const judges = await User.findAll({
              where: {
                userId: {
                  [db.Sequelize.Op.in]: Array.from(judgeIds),
                },
              },
            });
            judges.forEach((judge) => (judgeMap[judge.userId] = judge));

            let projectObjMap = {};
            // get aggregated scores of the projects evaluated
            const scores = await Score.getAggScores(includeEventId);
            if (scores.length > 0) {
              projects.forEach(
                (project) => (projectObjMap[project.projectId] = project)
              );
            }

            // give priority for the projects for which score has been given
            let scoredProjectIds = [];
            scores.forEach((score) => {
              const project = projectObjMap[score.projectId];
              scoredProjectIds.push(score.projectId);
              let projectInfo = project.getBasicInfo;
              projectInfo.winners =
                projectWinnerMap[project.projectId] != undefined
                  ? projectWinnerMap[project.projectId]
                  : [];
              projectInfo.judges = [];
              if (projectMap.hasOwnProperty(project.projectId)) {
                let projJudgeIds = new Set();
                projectMap[project.projectId].forEach((obj) =>
                  projJudgeIds.add(obj.judgeId)
                );
                Array.from(projJudgeIds).forEach((judgeId) =>
                  projectInfo.judges.push(judgeMap[judgeId].getBasicInfo)
                );
              }
              projectInfo.table_number =
                project.events[0].eventProjectMap.tableNumber;
              projectInfo.avg_score = +score.avg_score.toFixed(2);
              response.ongoing_projects.push(projectInfo);
            });
            projects.forEach((project) => {
              if (!scoredProjectIds.includes(project.projectId)) {
                let projectInfo = project.getBasicInfo;
                projectInfo.judges = [];
                if (projectMap.hasOwnProperty(project.projectId)) {
                  let projJudgeIds = new Set();
                  projectMap[project.projectId].forEach((obj) =>
                    projJudgeIds.add(obj.judgeId)
                  );
                  Array.from(projJudgeIds).forEach((judgeId) =>
                    projectInfo.judges.push(judgeMap[judgeId].getBasicInfo)
                  );
                }
                projectInfo.winners =
                  projectWinnerMap[project.projectId] != undefined
                    ? projectWinnerMap[project.projectId]
                    : [];
                projectInfo.table_number =
                  project.events[0].eventProjectMap.tableNumber;
                projectInfo.avg_score = 0;
                response.ongoing_projects.push(projectInfo);
              }
            });
          } else {
            // no projects are attached to judges
            projects.forEach((project) => {
              let projectInfo = project.getBasicInfo;
              projectInfo.judges = [];
              projectInfo.table_number =
                project.events[0].eventProjectMap.tableNumber;
              projectInfo.avg_score = 0;
              projectInfo.winners =
                projectWinnerMap[project.projectId] != undefined
                  ? projectWinnerMap[project.projectId]
                  : [];
              response.ongoing_projects.push(projectInfo);
            });
          }
        } else {
          projects.forEach(function (project) {
            if (
              project.events.length == 0 ||
              (project.events.find(
                (event) => event.endDate.getTime() > new Date().getTime()
              ) &&
                (!excludeEventId ||
                  !project.events.find(
                    (event) => event.eventId == excludeEventId
                  )))
            ) {
              response.ongoing_projects.push(project.getBasicInfo);
            } else {
              response.all_projects.push(project.getBasicInfo);
            }
          });
        }

        let downloadPath = "";
        if (req.query.download_excel === "TRUE") {
          exportProjectData = [];
          excelInput = {};
          ongoingProjects = [];
          all_projects = [];
          excelInput.ongoingProjects = response.ongoing_projects;
          excelInput.allProjects = response.all_projects;
          if (excelInput.ongoingProjects.length > 0) {
            excelInput.ongoingProjects.map((project) => {
              project.judge_list = extractEmail(
                req.query.event_id ? project.judges : []
              );
              project.team_list = extractEmail(project.team);
            });
          }
          if (excelInput.allProjects.length > 0) {
            excelInput.allProjects.map((project) => {
              project.judge_list = extractEmail(
                req.query.event_id ? project.judges : []
              );
              project.team_list = extractEmail(project.team);
            });
          }
          const eventName = req.query.event_id
            ? projects.length > 0
              ? projects[0].events[0].name
              : "All Projects"
            : null;
          const eventId = req.query.event_id ? req.query.event_id : null;
          downloadPath = utils.exportProjectData(
            excelInput.ongoingProjects,
            excelInput.allProjects,
            eventId,
            eventName
          );
        }
        res.status(200).json({
          response_str: "Projects retrieved successfully!",
          response_data: response,
          download_path: downloadPath,
        });
        return;
      })
      .catch((err) => {
        console.log("getProjects error - ", err);
        res.status(400).json({
          error: {
            message: "No projects available!",
          },
        });
        return;
      });
  } catch (err) {
    console.log("getProjects error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error",
      },
    });
    return;
  }
};

exports.getProjectLineage = async (req, res) => { // Need to change according to hierarchy changes
  try {
    let current_project = req.project;

    let response = {
      project_history: [],
    };
    courseCodeAttr = ["name", "code", "semester", "year"];
    projectTypeAttr = ["projectTypeId","projectType"];
    current_project = await Project.findOne({
      where: { projectId: req.params.projectId },
      include: [
        {
          model: db.courseCode,
          attributes:courseCodeAttr,
        },
        {
          model: db.projectType,
          attributes:projectTypeAttr,
        }
      ]
    });
    response.project_history.push(current_project);
    while (current_project.parentProjectID != null) {
      current_project = await Project.findOne({
        where: { projectId: current_project.parentProjectID },
        include: [
          {
            model: db.courseCode,
            attributes:courseCodeAttr,
          },
          {
            model: db.projectType,
            attributes:projectTypeAttr,
          }
        ]
      });
      response.project_history.push(current_project);
    }

    res.status(200).json({
      response_str: "Project Lineage retrieved successfully!",
      response_data: response,
    });
    return;
  } catch (err) {
    console.log("getProjectLineage error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }

};

function extractEmail(projectTeam) {
  emails = "";
  projectTeam.forEach((obj) => {
    emails = emails + obj.user.email + ", ";
  });
  return emails;
}

exports.getProjectDetail = (req, res) => {
  try {
    const projectId = utils.getdefaultValue(req.params.projectId, "");

    Project.findOne({
      where: {
        projectId: projectId,
      },
      include: [
        {
          model: db.userRole,
          through: {
            attributes: ["status"],
          },
          include: [
            { model: db.role },
            { model: db.userRoleCourse },
            {
              model: db.user,
              attributes: ["userId", "email", "firstName", "lastName", "image"],
            },
          ],
        },
        {
          model: db.userRoleCourse,
        },
        {
          model: db.courseCode,
        },
        {
          model: db.projectType,
        },
        {
          model: db.projectContent,
          include: [
            {
              model: db.user,
            },
          ],
        },
        {
          model: db.event,
          include: [
            {
              model: db.sponsor,
            },
            {
              model: db.winnerCategory,
            },
            {
              model: db.user,
            },
          ],
        },
      ],
    })
      .then(async (project) => {
        if (project == null || project.length == 0) {
          return res.status(400).json({
            error: {
              message: "Invalid Project ID!",
            },
          });
        }
        let response = [];
        response = project.getBasicInfo;
        Clients = [];
        project.userRoles.forEach((uRole) => {
          let uId = uRole.Id; 
          if(uRole.role.name == db.UserRoles.Student && req.user.userId == uRole.userId){
                var projectFilteredRecord = uRole.userRoleCourses.filter(a => (a.projectId == project.projectId && a.userRoleId == uId));
                if(projectFilteredRecord.length>0){
                  response.isMyProject = true;
                  response.status = projectFilteredRecord[0].status;
                }
          }else if(uRole.role.name == db.UserRoles.Client){
            Clients.push(uRole.user.email);
          }
        });
        
        response.Clients = Clients;
        eventIds = [];
        project.events.forEach((event) => eventIds.push(event.eventId));
        const eventProjMaps = await EventProjectMap.findAll({
          where: {
            eventId: {
              [db.Sequelize.Op.in]: eventIds,
            },
          },
        });
        let eventProjectIds = [];
        eventProjMaps.forEach((ep) => eventProjectIds.push(ep.eventProjectId));
        const eventWinnerMap = await EventProjectMap.getWinners(
          eventProjectIds
        );
        response.events = [];
        project.events.forEach((event) => {
          let eventResp = event.getDetail;
          eventResp.judges = [];
          eventResp.table_number = event.eventProjectMap.tableNumber;
          event.users.forEach((judge) =>
            eventResp.judges.push(judge.getBasicInfo)
          );
          eventResp.winners =
            eventWinnerMap[event.eventId] != undefined
              ? eventWinnerMap[event.eventId]
              : [];
          response.events.push(eventResp);
        });
        res.status(200).json({
          response_str: "Projects retrieved successfully!",
          response_data: response,
        });
        return;
      })
      .catch((err) => {
        console.log("getProjectDetail error - ", err);
        res.status(400).json({
          error: {
            message: "Invalid Project ID!",
          },
        });
        return;
      });
  } catch (err) {
    console.log("getProjectDetail error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.getCourseProjects = (req, res) => {
  try {
    console.log("inside req.params = ", req.params);
    const courseCodeId = req.params.courseCodeId;
    Project.findAll({
      where: {
        courseCodeId: courseCodeId,
      },
      include: [
        {
          model: db.userRole,
          include: [
            { model: db.role },
            {
              model: db.user,
              attributes: ["email", "firstName", "lastName"],
            },
          ],
        },
        {
          model: db.courseCode,
        },
        {
          model: db.projectType,
        },
      ],
      order: [["createdAt", "DESC"]],
    })
      .then(async (projects) => {
        if (projects == null || projects.length == 0) {
          return res.status(400).json({
            error: {
              message: "No Projects for given Course!",
            },
          });
        }
        let response = {};
        response.currentProjects = [];
        response.pastProjects = [];
        let currentSemester = utils.getSemester(new Date());

        for (let project of projects) {
          if (project.courseCode.year === currentSemester.year) {
            if (
              db.Semesters[project.courseCode.semester] ===
              db.Semesters[currentSemester.semester]
            ) {
              response.currentProjects.push(project.getDetail);
            } else if (
              db.Semesters[project.courseCode.semester] <
              db.Semesters[currentSemester.semester]
            ) {
              response.pastProjects.push(project.getDetail);
            }
          } else if (project.courseCode.year < currentSemester.year) {
            response.pastProjects.push(project.getDetail);
          }
        }

        const course = await db.courseCode.findByPk(courseCodeId);

        const userRoleCourseObj = await course.getUserRoleCourses({
          include: [
            {
              model: db.userRole,
              where: {
                userId: req.user.userId,
              },
            },
          ],
        });

        // response.enrolledProjectId must be the projectid req.user is associated with in this course
        response.enrolledProjectId =
        userRoleCourseObj.length>0 ? (userRoleCourseObj[0].status == db.StudentEnrollmentPosition.Unenrolled
            ? 0
            : userRoleCourseObj[0].projectId) : 0;
        // response.status = stat.length ? stat[0]?.position : null;
        res.status(200).json({
          response_str: "Projects retrieved successfully!",
          response_data: response,
        });
        return;
      })
      .catch((err) => {
        console.log("getCourseProjects error - ", err);
        res.status(500).json({
          error: {
            message: "Internal server error!",
          },
        });
        return;
      });
  } catch (err) {
    console.log("getCourseProjects error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.getProjectEventScores = async (req, res) => {
  try {
    const judgeScoreMap = await Score.getByEventProject(
      req.params.eventId,
      req.params.projectId
    );

    let response = [];
    if (Object.keys(judgeScoreMap).length > 0) {
      const users = await User.findAll({
        where: {
          userId: {
            [db.Sequelize.Op.in]: Object.keys(judgeScoreMap),
          },
        },
      });
      let judgeMap = {};
      users.forEach((user) => (judgeMap[user.userId] = user));

      for (const judgeId in judgeScoreMap) {
        let scoreDetail = judgeMap[judgeId].getBasicInfo;
        scoreDetail.scores = judgeScoreMap[judgeId];
        scoreDetail.key = judgeId;
        response.push(scoreDetail);
      }
    }

    res.status(200).json({
      response_str: "Scores retrieved successfully!",
      response_data: response,
    });
    return;
  } catch (err) {
    console.log("getProjectEventScores error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.assignJudgesProject = async (req, res) => {
  try {
    const event = await db.event.findByPk(req.params.eventId);
    if (event.endDate.getTime() < new Date().getTime()) {
      res.status(400).json({
        error: {
          message:
            "Invalid. Event is already completed, cannot assign judges now.",
        },
      });
      return;
    }
    const judgeProjects = await JudgeProjectMap.findAll({
      where: {
        eventProjectId: req.eventProject.eventProjectId,
      },
    });

    let existingJudges = [];
    judgeProjects.forEach(async (jp) => {
      if (!req.body.judges.includes(jp.judgeId)) {
        await jp.destroy();
      } else {
        existingJudges.push(jp.judgeId);
      }
    });

    let judgeProjectObjs = [];
    req.judges.forEach((judge) => {
      if (!existingJudges.includes(judge.userId)) {
        judgeProjectObjs.push({
          eventProjectId: req.eventProject.eventProjectId,
          judgeId: judge.userId,
        });
      }
    });

    await JudgeProjectMap.bulkCreate(judgeProjectObjs);

    res.status(201).json({
      response_str: "Judges assigned successfully!",
      response_data: {},
    });
    return;
  } catch (err) {
    console.log("assignJudgesProject error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.updateProjectEvent = async (req, res) => {
  try {
    const event = await db.event.findByPk(req.params.eventId);
    if (event.endDate.getTime() < new Date().getTime()) {
      res.status(400).json({
        error: {
          message:
            "Invalid. Event is already completed, cannot update table-number now.",
        },
      });
      return;
    }
    req.body.table_number = utils.getdefaultValue(req.body.table_number, 0);
    if (req.body.table_number != 0) {
      const ep = await EventProjectMap.findOne({
        where: {
          tableNumber: req.body.table_number,
          eventId: req.params.eventId,
        },
      });
      if (ep && ep.eventProjectId != req.eventProject.eventProjectId) {
        const project = await Project.findByPk(ep.projectId);
        const tableNumberStr = req.body.table_number.toString();
        res.status(400).json({
          error: {
            message: `TableNumber - ${tableNumberStr} is already assigned to ${project.name}`,
          },
        });
        return;
      }
    }
    req.eventProject.tableNumber = req.body.table_number;
    await req.eventProject.save();
    res.status(200).json({
      response_str: "EventProject updated successfully!",
      response_data: {},
    });
    return;
  } catch (err) {
    console.log("updateProjectEvent error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.assignWinner = async (req, res) => {
  try {
    const winnerCategory = await WinnerCategory.findOne({
      where: {
        winnerCategoryId: req.body.winner_category_id,
      },
      include: [
        {
          model: db.event,
          where: {
            eventId: req.params.eventId,
          },
          required: true,
        },
      ],
    });

    if (!winnerCategory) {
      res.status(400).json({
        error: {
          message: "Invalid winner-category-id for event!",
        },
      });
      return;
    }

    const result = await db.sequelize.query(
      `select projects.name from winners join eventProjectMaps as ep on winners.eventProjectId = ep.eventProjectId 
			join projects on ep.projectId = projects.projectId 
			where ep.eventId = :eventId and winners.winnerCategoryId = :winnerCategoryId`,
      {
        replacements: {
          eventId: req.params.eventId,
          winnerCategoryId: req.body.winner_category_id,
        },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );
    if (result.length > 0) {
      res.status(400).json({
        error: {
          message: `${winnerCategory.name} is already assigned to ${result[0].name}!`,
        },
      });
      return;
    }

    await req.eventProject.addWinnerCategory(winnerCategory);

    res.status(201).json({
      response_str: "Winner posted successfully!",
      response_data: {},
    });
    return;
  } catch (err) {
    console.log("assignWinner error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.deleteWinner = async (req, res) => {
  try {
    const result = await db.sequelize.query(
      `DELETE FROM winners where eventProjectId = :eventProjectId`,
      {
        replacements: { eventProjectId: req.eventProject.eventProjectId },
        type: db.Sequelize.QueryTypes.DELETE,
      }
    );
    res.status(200).json({
      response_str: "Winner deleted successfully!",
      response_data: {},
    });
    return;
  } catch (err) {
    console.log("deleteWinner error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};
