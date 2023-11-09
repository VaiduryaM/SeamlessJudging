
module.exports = (sequelize, Sequelize) => {
	const JudgeEventMap = sequelize.define("judgeEventMap", {
		judgeEventId: {
			type: Sequelize.DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		code: {
			type: Sequelize.DataTypes.STRING,
			unique: false
		}
	},{
		paranoid: true
	});
	return JudgeEventMap;
};