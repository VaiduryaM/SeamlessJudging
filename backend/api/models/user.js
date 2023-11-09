const bcrypt = require("bcrypt");
const utils = require("../controllers/utils.js");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
    {
      userId: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        // unique: true,
        validate: {
          isEmail: true,
        },
        set(value) {
          this.setDataValue("email", value.toLowerCase());
        },
        allowNull: false,
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        set(value) {
          const hash = bcrypt.hashSync(value, 8);
          this.setDataValue("password", hash);
        },
      },
      status: {
        type: Sequelize.DataTypes.STRING,
        status: {
          type: Sequelize.ENUM("ACTIVE", "BLOCKED"),
          defaultValue: "ACTIVE",
        },
        defaultValue: "ACTIVE",
        allowNull: false,
      },
      firstName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      middleName: {
        type: Sequelize.DataTypes.STRING,
      },
      PrefferedName: {
        type: Sequelize.DataTypes.STRING,
      },
      company: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      Github: {
        type: Sequelize.DataTypes.STRING,
      },
      SocialLinks: {
        type: Sequelize.DataTypes.STRING,
      },
      Phone: {
        type: Sequelize.DataTypes.STRING,
      },
      image: {
        type: Sequelize.DataTypes.STRING,
      },
      userName: {
        type: Sequelize.DataTypes.VIRTUAL,
        get() {
          return (this.firstName != null? `${this.firstName} ` : "" ) + (this.lastName != null ? `${this.lastName}` : "");
        },
      },
      tokenNo: {
        type: Sequelize.DataTypes.STRING,
      },
      tokenStart: {
        type: Sequelize.DataTypes.DATE,
      },
      tokenEnd: {
        type: Sequelize.DataTypes.DATE,
      },
      getBasicInfo: {
        type: Sequelize.DataTypes.VIRTUAL,
        get() {
          let info = {};
          info.user_id = this.userId;
          info.first_name = utils.getdefaultValue(this.firstName, "");
          info.middle_name = utils.getdefaultValue(this.middleName, "");
          info.last_name = utils.getdefaultValue(this.lastName, "");
          info.email = this.email;
          info.image = utils.getdefaultValue(this.image, "");
          info.status = utils.getdefaultValue(this.status, "");
          info.PrefferedName = utils.getdefaultValue(this.PrefferedName, "");
          info.Phone = utils.getdefaultValue(this.Phone, "");
          info.Github = utils.getdefaultValue(this.Github, "");
          info.SocialLinks = utils.getdefaultValue(this.SocialLinks, "");
          info.company = utils.getdefaultValue(this.company, "");
          return info;
        },
      },
      getParticipantInfo: {
        type: Sequelize.DataTypes.VIRTUAL,
        get() {
          let info = {};
          info.user_id = this.userId;
          info.role = this.role;
          info.first_name = this.firstName;
          info.middle_name = utils.getdefaultValue(this.middleName, "");
          info.last_name = this.lastName;
          info.email = this.email;
          info.image = this.image!=null ? this.image.replace(
            "./db",
            `http://${process.env.MYSQL_HOST}:${process.env.PORT}/images/`
            ) : "";
          info.status = this.status;
          info.enrollment_status = "";
          info.PrefferedName = utils.getdefaultValue(this.PrefferedName, this.userName);
          info.key = `user_${this.userId}`;
          return info;
        },
      },
      getPublicInfo: {
        type: Sequelize.DataTypes.VIRTUAL,
        get() {
          let info = {};
          info.PrefferedName = utils.getdefaultValue(this.PrefferedName, this.userName);
          info.email = this.email;
          return info;
        },
      },
    },
    {
      paranoid: true,
    }
  );

  return User;
};
