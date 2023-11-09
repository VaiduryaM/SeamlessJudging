
module.exports = (sequelize, Sequelize) => {
	const ProjectType = sequelize.define("projectType", {
		projectTypeId: {
			type: Sequelize.DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		projectType: {
			type: Sequelize.DataTypes.STRING,
			unique: false,
			allowNull: true
		},
		getBasicInfo: {
			type: Sequelize.DataTypes.VIRTUAL,
			get() {
				let info = {};
				info.project_type_id = this.projectTypeId;
				info.project_type = this.projectType;
				info.key = info.project_type_id;
				return info;
			}
		}
	},
	{
		paranoid: true
	});
	return ProjectType;
};
