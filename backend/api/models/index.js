const config = require("../config/db.js");

const Sequelize = require("sequelize");
const { DB } = require("../config/db.js");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
  logging: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.js")(sequelize, Sequelize);
db.refreshToken = require("../models/refreshToken.js")(sequelize, Sequelize);
db.event = require("../models/event.js")(sequelize, Sequelize);
db.project = require("../models/project.js")(sequelize, Sequelize);
db.projectType = require("../models/projectType.js")(sequelize, Sequelize);
db.projectTypeMap = require("../models/ProjectTypeMap.js")(sequelize, Sequelize);
db.projectContent = require("../models/projectContent.js")(
  sequelize,
  Sequelize
);
db.sponsor = require("../models/sponsor.js")(sequelize, Sequelize);
db.scoreCategory = require("../models/scoreCategory.js")(sequelize, Sequelize);
db.request = require("../models/request.js")(sequelize, Sequelize);
db.score = require("../models/score.js")(sequelize, Sequelize);
db.winnerCategory = require("../models/winnerCategory.js")(
  sequelize,
  Sequelize
);
db.eventProjectMap = require("../models/eventProjectMap.js")(
  sequelize,
  Sequelize
);
db.judgeProjectMap = require("../models/judgeProjectMap.js")(
  sequelize,
  Sequelize
);
db.courseCode = require("../models/courseCode.js")(sequelize, Sequelize);
db.judgeEventMap = require("../models/judgeEventMap.js")(sequelize, Sequelize);
db.notes = require("../models/notes.js")(sequelize, Sequelize);
db.emailTemplates = require("../models/emailTemplates.js")(sequelize, Sequelize);
db.emailLogs = require("../models/emailLogs.js")(sequelize, Sequelize);
db.role = require("../models/role.js")(sequelize, Sequelize);
db.userRole = require("./userRole.js")(sequelize, Sequelize);
db.userRoleCourse = require("../models/userRoleCourse.js")(sequelize, Sequelize);
// onetoone relation b/w refreshToken and user
db.refreshToken.belongsTo(db.user, { foreignKey: "userId" });
db.user.hasOne(db.refreshToken, { foreignKey: "userId" });

// onetoone relation b/w refreshToken and event
db.refreshToken.belongsTo(db.event, { foreignKey: "eventId" });
db.event.hasOne(db.refreshToken, { foreignKey: "eventId" });

// manytomany relationship b/w events and projects
db.event.belongsToMany(db.project, {
  through: db.eventProjectMap,
  foreignKey: "eventId",
});
db.project.belongsToMany(db.event, {
  through: db.eventProjectMap,
  foreignKey: "projectId",
});

// foreignKey b/w project and projectType
db.project.hasMany(db.projectTypeMap, {foreignKey: "projectId"});
db.projectType.belongsToMany(db.project, {through: db.projectTypeMap, foreignKey: "projectTypeId" });
db.project.belongsToMany(db.projectType, {through: db.projectTypeMap, foreignKey: "projectId" });

// foreignKey b/w project and projectType
db.user.hasMany(db.project, { foreignKey: "createdBy" });
db.project.belongsTo(db.user, { foreignKey: "createdBy" });

// foreignKey b/w project and courseCode
db.courseCode.hasMany(db.project, { foreignKey: "courseCodeId" });
db.project.belongsTo(db.courseCode, { foreignKey: "courseCodeId" });

// manytomany relationship b/w users and projects to identify judges of the project
db.user.belongsToMany(db.eventProjectMap, {
  through: db.judgeProjectMap,
  foreignKey: "judgeId",
});
db.eventProjectMap.belongsToMany(db.user, {
  through: db.judgeProjectMap,
  foreignKey: "eventProjectId",
});

// manytomany relationship b/w users and projects to identify judges of the project
db.user.belongsToMany(db.event, {
  through: db.judgeEventMap,
  foreignKey: "judgeId",
});
db.event.belongsToMany(db.user, {
  through: db.judgeEventMap,
  foreignKey: "eventId",
});

// foreignKey b/w project and projectContent
db.project.hasMany(db.projectContent, { foreignKey: "projectId" });
db.projectContent.belongsTo(db.project, { foreignKey: "projectId" });

// foreignKey b/w user and projectContent to identify the user who has uploaded
db.user.hasMany(db.projectContent, { foreignKey: "uploadedBy" });
db.projectContent.belongsTo(db.user, { foreignKey: "uploadedBy" });

// manytomany relationship b/w sponsors and events
db.sponsor.belongsToMany(db.event, {
  through: "sponsorEventMaps",
  foreignKey: "sponsorId",
});
db.event.belongsToMany(db.sponsor, {
  through: "sponsorEventMaps",
  foreignKey: "eventId",
});

// manytomany relationship b/w scoreCategory and projectType
db.scoreCategory.belongsToMany(db.projectType, {
  through: "projectTypeScoreCategoryMaps",
  foreignKey: "scoreCategoryId",
});
db.projectType.belongsToMany(db.scoreCategory, {
  through: "projectTypeScoreCategoryMaps",
  foreignKey: "projectTypeId",
});

// foreignKey b/w user and request to identify the user who has raised the request
db.user.hasMany(db.request, { foreignKey: "userId" });
db.request.belongsTo(db.user, { foreignKey: "userId" });

// foreignKey b/w project and request to identify the project for which it has been raised
db.project.hasMany(db.request, { foreignKey: "projectId" });
db.request.belongsTo(db.project, { foreignKey: "projectId" });

// foreignKey b/w user and request to identify who has actioned on the request
db.user.hasMany(db.request, { foreignKey: "actionBy" });
db.request.belongsTo(db.user, { foreignKey: "actionBy" });

// foreignKey b/w scoreCategory and score to identify on which category the score is given
db.scoreCategory.hasMany(db.score, { foreignKey: "categoryId" });
db.score.belongsTo(db.scoreCategory, { foreignKey: "categoryId" });

// foreignKey b/w score and project to identify for which project score has been given
db.judgeProjectMap.hasMany(db.score, { foreignKey: "judgeProjectId" });
db.score.belongsTo(db.judgeProjectMap, { foreignKey: "judgeProjectId" });

// winnerCategory-event manytomany to map event to categories
db.winnerCategory.belongsToMany(db.event, {
  through: "winnerCategoryEventMaps",
  foreignKey: "winnerCategoryId",
});
db.event.belongsToMany(db.winnerCategory, {
  through: "winnerCategoryEventMaps",
  foreignKey: "eventId",
});

// winnerCategory-project manytomany to identify winner
db.winnerCategory.belongsToMany(db.eventProjectMap, {
  through: "winners",
  foreignKey: "winnerCategoryId",
});
db.eventProjectMap.belongsToMany(db.winnerCategory, {
  through: "winners",
  foreignKey: "eventProjectId",
});


db.user.belongsToMany(db.role, {through: db.userRole, foreignKey : {name: "userId"}});
db.role.belongsToMany(db.user, {through: db.userRole, foreignKey : {name: "roleId"}});
db.user.hasMany(db.userRole, {foreignKey: {name:"userId"}});
db.userRole.belongsTo(db.user, {foreignKey: {name:"userId"}});
db.role.hasMany(db.userRole);
db.userRole.belongsTo(db.role);

db.project.belongsToMany(db.userRole, {through: db.userRoleCourse, foreignKey: 'projectId'});
db.userRole.belongsToMany(db.project, {through: db.userRoleCourse});
db.project.hasMany(db.userRoleCourse, {foreignKey: {name:"projectId"}});
db.userRoleCourse.belongsTo(db.project, {foreignKey: {name:"projectId"}});
db.userRoleCourse.belongsTo(db.courseCode, {foreignKey: {name:"courseCodeId"}});
db.userRole.hasMany(db.userRoleCourse);
db.userRoleCourse.belongsTo(db.userRole);

db.courseCode.hasMany(db.userRoleCourse, {foreignKey: 'courseCodeId'});

// foreignkey b/w instructorId and notes. one-to-many relationship
db.user.hasMany(db.notes, {foreignKey: "instructorId"});
db.notes.belongsTo(db.user, {foreignKey: "instructorId"});

// foreignkey b/w clientId and notes. one-to-many relationship
db.user.hasMany(db.notes, {foreignKey: "clientId"});
db.notes.belongsTo(db.user, {foreignKey: "clientId"});

// foreignkey b/w instructorId and notes. one-to-many relationship
db.user.hasMany(db.emailLogs, {foreignKey: "senderId"});
db.emailLogs.belongsTo(db.user, {foreignKey: "senderId"});

// foreignkey b/w clientId and notes. one-to-many relationship
db.user.hasMany(db.emailLogs, {foreignKey: "receiverId"});
db.emailLogs.belongsTo(db.user, {foreignKey: "receiverId"});


db.UserRoles = {
  Admin: "ADMIN",
  Judge: "JUDGE",
  Instructor: "INSTRUCTOR",
  Client: "CLIENT",
  Student: "STUDENT"
};

db.ContentTypes = {
  ProjectFile: "PROJECT_FILES",
  Video: "VIDEO",
  Poster: "POSTER",
  Links: "LINKS",
};

db.RequestTypes = {
  TeamSize: "TEAM_SIZE_EXCEEDED",
  MultipleProject: "JOIN_MULTIPLE_PROJECT",
};

db.RequestStatus = {
  Requested: "REQUESTED",
  Approved: "APPROVED",
  Rejected: "REJECTED",
  Approve: "APPROVE",
  Reject: "REJECT",
};

db.EventUpdateTypes = {
  Attach: "ATTACH",
  Detach: "DETACH",
};

db.EventFilters = {
  Include: "INCLUDE",
  Exclude: "EXCLUDE",
};

db.ParticipantStatus = {
  Active: "ACTIVE",
  Blocked: "BLOCKED",
};

db.EnrollmentStatus = {
  Ongoing: "ONGOING",
  Completed: "COMPLETED",
  Unenrolled: "UNENROLLED",
};

db.StudentEnrollmentPosition = {
  Waitlist: "WAITLIST",
  Enrolled: "ENROLLED",
  Finalised: "FINALIZED",
  Unenrolled: "UNENROLLED",
};

db.Semesters = {
  "Spring": 0,
  "Summer": 1,
  "Fall": 2, 
  "Winter": 3
};

db.SequelizeUniqueConstraintError = "SequelizeUniqueConstraintError";
db.SequelizeValidationErrorItem = "SequelizeValidationError";

module.exports = db;
