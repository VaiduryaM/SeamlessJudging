const utils = require("../controllers/utils.js");

module.exports = (sequelize, Sequelize) => {
  const Project = sequelize.define(
    "project",
    {
      projectId: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
      },
      teamSize: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 5,
      },
      courseCodeId: {
        type: Sequelize.DataTypes.INTEGER,
      },
      parentProjectID: {
        type: Sequelize.DataTypes.INTEGER,
      },
      getBasicInfo: {
        type: Sequelize.DataTypes.VIRTUAL,
        get() {
          let info = {};
          info.project_id = this.projectId;
          info.name = this.name;
          info.description = this.description;
          info.project_types = []
          this.projectTypes != undefined
              ? this.projectTypes.forEach(project_type=>info.project_types.push({name : project_type.projectType, Id: project_type.projectTypeId  }))
              : undefined;
          info.course_code_id = this.courseCodeId;
          info.course_code_name =
            this.courseCode != undefined ? this.courseCode.name : undefined;
          info.course_code =
            this.courseCode != undefined ? this.courseCode.code : undefined;
          info.year =
            this.courseCode != undefined ? this.courseCode.year : undefined;
          info.semester =
            this.courseCode != undefined ? this.courseCode.semester : undefined;
          info.primary_attachments = [];
          info.attachments = [];
          info.team_size = this.teamSize;
          info.parentProjectId = this.parentProjectID;
          if (this.projectContents != undefined) {
            this.projectContents.forEach((pC) => {
              if (
                pC.contentType == "PROJECT_FILES" ||
                pC.contentType == "LINKS"
              ) {
                if (
                  pC.name == "Slack" ||
                  pC.name == "Repo" ||
                  pC.name == "Shared folder" ||
                  pC.name == "Zoom"
                ) {
                  info.primary_attachments.push({
                    name: pC.name,
                    content: pC.content,
                  });
                } else {
                  info.attachments.push({
                    name: pC.name,
                    content: pC.content,
                  });
                }
              }
            });
          }
          info.team = [];
          if (this.userRoles != undefined) {
            this.userRoles.forEach(function (userrole) {
              info.team.push({
                role: userrole.role.name,
                user: userrole.user.getParticipantInfo,
                status: userrole.userRoleCourse
                  ? userrole.userRoleCourse.status
                  : "N/A",
              });
            });
          }

          info.key = `project_${this.projectId}`;
          return info;
        },
      },
      getPublicInfo: {
        type: Sequelize.DataTypes.VIRTUAL,
        get() {
          let info = {};
          info.name = this.name;
          info.description = this.description;
          info.project_types = []
          this.projectTypes != undefined
              ? this.projectTypes.forEach(project_type=>info.project_types.push({name : project_type.projectType, Id: project_type.projectTypeId  }))
              : undefined;
          info.course_code_name =
            this.courseCode != undefined ? this.courseCode.name : undefined;
          info.year =
            this.courseCode != undefined ? this.courseCode.year : undefined;
          info.semester =
            this.courseCode != undefined ? this.courseCode.semester : undefined;
          info.parentProjectId = this.parentProjectID;
          info.team = [];
          if (this.userRoles != undefined) {
            this.userRoles.forEach(function (userrole) {
              info.team.push({
                role: userrole.role.name,
                user: userrole.user.getPublicInfo,
                status: userrole.userRoleCourse
                  ? userrole.userRoleCourse.status
                  : "N/A",
              });
            });
          }
          return info;
        },
      },
      getDetail: {
        type: Sequelize.DataTypes.VIRTUAL,
        get() {
          let info = this.getBasicInfo;
          info.content = [];
          if (
            this.projectContents != undefined &&
            this.projectContents.length > 0
          ) {
            let videoFound = false;
            let posterFound = false;
            this.projectContents
              .sort((d1, d2) => d1.createdAt.getTime() - d2.createdAt.getTime())
              .reverse();
            this.projectContents.forEach((pC) => {
              if (pC.contentType != "PROJECT_FILES") {
                if (
                  (pC.contentType == "VIDEO" && !videoFound) ||
                  (pC.contentType == "POSTER" && !posterFound)
                ) {
                  info.content.push({
                    name: pC.name,
                    content: pC.content,
                    content_type: pC.contentType,
                    created_at: pC.createdAt,
                    uploaded_by: pC.uploadedBy.getBasicInfo,
                  });
                  videoFound =
                    pC.contentType == "VIDEO" || videoFound ? true : false;
                  posterFound =
                    pC.contentType == "POSTER" || posterFound ? true : false;
                }
              }
            });
          }
          return info;
        },
      },
    },
    {
      paranoid: true,
    }
  );
  Project.add = async function (
    name,
    description,
    courseCodeId,
    projectTypeId,
    userId,
    teamSize,
    parentProjectID
  ) {
    const obj = await this.create({
      name: name,
      description: description,
      courseCodeId: courseCodeId,
      projectTypeId: projectTypeId,
      createdBy: userId,
      teamSize: teamSize,
      parentProjectID: parentProjectID,
    });
    return obj;
  };

  return Project;
};
