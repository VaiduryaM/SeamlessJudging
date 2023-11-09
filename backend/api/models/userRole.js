
module.exports = (sequelize, Sequelize) => {
	const userRole= sequelize.define("userRole", {
		Id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        userId: {   type: Sequelize.DataTypes.INTEGER,},
        roleId: { type: Sequelize.DataTypes.INTEGER,},
	},
    { 
      timestamps: false 
    }
    );
	return userRole;
};