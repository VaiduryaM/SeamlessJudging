
module.exports = (sequelize, Sequelize) => {
	const ScoreCategory = sequelize.define('scoreCategory', {
		scoreCategoryId: {
			type: Sequelize.DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false,
			unique: false
		},
		scale: {
			type: Sequelize.DataTypes.INTEGER
		},
		getBasicInfo: {
			type: Sequelize.DataTypes.VIRTUAL,
			get() {
				let info = {};
				info.score_category_id = this.scoreCategoryId;
				info.name = this.name;
				info.scale = this.scale;
				info.key = info.score_category_id;
				return info;
			}
		}
	},
	{
		paranoid: true
	});	
	return ScoreCategory;
};