module.exports = (sequelize, Sequelize) => {
	const ProjectTypeMap = sequelize.define("ProjectTypeMap", {
		project_type_mapId: {
			type: Sequelize.DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
	},{
        tableName: 'project_type_map',
		timestamps: false
	});
	ProjectTypeMap.add = async function (projectID, projectTypeId) {
		const obj = await this.create({
			projectID: projectID,
			projectTypeId: projectTypeId
		});
		return obj;
	};
    // ProjectTypeMap.beforeBulkCreate((types, options) => {
    //     for (const type of types) {
    //       if (type.isMember) {
    //         type.memberSince = new Date();
    //       }
    //     }
      
    //     // Add `memberSince` to updateOnDuplicate otherwise it won't be persisted
    //     if (options.updateOnDuplicate && !options.updateOnDuplicate.includes('memberSince')) {
    //       options.updateOnDuplicate.push('memberSince');
    //     }
    //   });

	return ProjectTypeMap;
};