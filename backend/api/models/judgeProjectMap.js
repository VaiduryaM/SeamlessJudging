
module.exports = (sequelize, Sequelize) => {
	const JudgeProjectMap = sequelize.define("judgeProjectMap", {
		judgeProjectId: {
			type: Sequelize.DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		}
	});
	return JudgeProjectMap;
};