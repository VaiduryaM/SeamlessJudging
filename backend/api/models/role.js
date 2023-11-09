module.exports = (sequelize, Sequelize) => {
	const role = sequelize.define("role", {
		Id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name :{
            type: Sequelize.DataTypes.STRING,
            // unique:true
        }

	},
    { timestamps: false }
    );
	return role;
};