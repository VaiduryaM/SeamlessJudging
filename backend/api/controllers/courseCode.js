const db = require("../models");
const fs = require("fs");
const { sequelize} = require("../models");
const { courseCode: CourseCode, user: User, userRoleCourse: UserRoleCourse } = db;


exports.createCourseCode = async (req, res, next) => {
  try {
    
    const body = req.body;
    const user = req.user;
    const role = await db.role.findOne({where:{name:db.UserRoles.Instructor}});
    const userRoleObj = await user.getUserRoles({where:{roleId: role.Id}});
    const code = await CourseCode.create({
      name: body.name,
      code: body.code,
      semester: body.semester,
      year: body.year,
      userRoleCourses:[{
        userRoleId: userRoleObj[0].Id
      }]
    },
    {
      include:[db.userRoleCourse]
    }
    );
    
    return res.status(201).json({
      response_str: "CourseCode added succesfully",
      response_data: {
        id: code.courseCodeId,
      },
    });
  } catch (err) {
    console.log("createCourseCode - ", err);
    if (err.name === db.SequelizeUniqueConstraintError) {
      res.status(400).json({
        error: {
          message: `Invalid. CourseCode - ${req.body.code} is already available.`,
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

exports.getCourseCodes = async (req, res, next) => {
  try {
  const code = req.query.code;
  let response = [];
  // decide if to show courses based on role ?
  const codes = await CourseCode.findAll({
    attributes: ["courseCodeId", "name", "code"],
    where: {
      ...(req.query.semester && { semester: req.query.semester }),
      ...(req.query.code && { name: req.query.code }),
      ...(req.query.year && { year: req.query.year }),
    },
    include: [
      {
        model: db.userRoleCourse,
        required: true,
                include:[
                    {
                        model: db.userRole,
                        where:{
                            userId: req.user.userId
                        }
                    }

                ]
      },
    ],
  });
  codes.forEach(function (code) {
    response.push(code.getBasicInfo);
  });

  if (response.length == 0) {
    return res.status(400).json({
        message: "No courses found!",
    });
  }

  return res.status(200).json({
    response_str: "CourseCode details retrieved successfully",
    response_data: response,
  });
      
    
  } catch (err) {
    console.log("getCourseCodes - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.updateCourseCode = async (req, res, next) => {
  try {
    const courseCodeId = req.params.courseCodeId;

    const body = req.body;

    const code = await CourseCode.findOne({
      where: {
        courseCodeId: courseCodeId,
      },
    });
    if (!code) {
      res.status(400).json({
        error: {
          message: "CourseCode not found to Update!",
        },
      });
      return;
    }
    const updatedCode = await CourseCode.update(
      {
        ...(body.name && { name: body.name }),
        ...(body.code && { code: body.code }),
        ...(body.year && { year: body.year }),
        ...(body.semester && { semester: body.semester }),
      },
      {
        where: {
          courseCodeId: courseCodeId,
        },
      }
    );

    return res.status(200).json({
      response_str: "CourseCode updated successfully",
      response_data: updatedCode,
    });
  } catch (err) {
    console.log("updateCourseCode - ", err);
    if (err.name === db.SequelizeUniqueConstraintError) {
      res.status(400).json({
        error: {
          message: `Invalid. CourseCode - ${req.body.code} is already available.`,
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

exports.deleteCourseCode = async (req, res, next) => {
  try {
    await CourseCode.destroy({
      where: {
        courseCodeId: {
          [db.Sequelize.Op.in]: req.courseCodeIds,
        },
      },
      force: true,
    });
    return res.status(200).json({
      response_str: "CourseCode deleted successfully",
      response_data: {},
    });
  } catch (err) {
    console.log("deleteCourseCode - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.getSemesters = async (req, res, next) => {
  try {
    response = [];
    const semesters = await CourseCode.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("semester")), "semester"],
        "year",
      ],
    });

    semesters.forEach(function (semester) {
      response.push(semester);
    });
    return res.status(200).json({
      response_str: "Semester details retrieved successfully",
      response_data: response,
    });
  } catch (err) {
    console.log("getSemesters - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};
