
module.exports = (sequelize, Sequelize) => {
	const WinnerCategory = sequelize.define('winnerCategory', {
		winnerCategoryId: {
			type: Sequelize.DataTypes.INTEGER,
			type: Sequelize.DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: Sequelize.DataTypes.STRING,
			unique: false,
			allowNull: true
		},
		getBasicInfo: {
			type: Sequelize.DataTypes.VIRTUAL,
			get() {
				let info = {};
				info.winner_category_id = this.winnerCategoryId;
				info.name = this.name;
				info.key = `winner_category_${this.winnerCategoryId}`;
				return info;
			}
		},
		getPublicInfo: {
			type: Sequelize.DataTypes.VIRTUAL,
			get() {
				let info = {};
				info.name = this.name;
				return info;
			}
		},
	},
	{
		paranoid: true
	});
	return WinnerCategory;
};