
module.exports = (sequelize, Sequelize) => {
	const ProjectContent = sequelize.define("projectContent", {
		projectContentId: {
			type: Sequelize.DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false
		},
		contentType: {
			type: Sequelize.ENUM("PROJECT_FILES", "VIDEO", "POSTER", "LINKS"),
			defaultValue: "LINKS"
		},
		content: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false
		}
	});

	ProjectContent.add = async function (projectId, name, contentType, content, uploadedBy) {
		const obj = await this.create({
			projectId: projectId,
			name: name,
			contentType: contentType,
			content: content,
			uploadedBy: uploadedBy
		});
		return obj;
	};

	return ProjectContent;
};
