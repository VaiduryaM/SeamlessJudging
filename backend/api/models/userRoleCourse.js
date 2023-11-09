module.exports = (sequelize, Sequelize) => {
  const userRoleCourse = sequelize.define(
    "userRoleCourse",
    {
      Id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          "WAITLIST",
          "FINALIZED",
          "ENROLLED",
          "UNENROLLED"
        ),
        defaultValue: "UNENROLLED"
      },
      enrolledAt: {
        type: Sequelize.DataTypes.DATE(6),
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );
  return userRoleCourse;
};
