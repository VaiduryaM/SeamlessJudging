
module.exports = (sequelize, Sequelize) => {
	const Request = sequelize.define('request', {
		requestId: {
			type: Sequelize.DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		requestType: {
			type: Sequelize.DataTypes.STRING,
			status: {
				type: Sequelize.ENUM("TEAM_SIZE_EXCEEDED", "JOIN_MULTIPLE_PROJECT"),
				defaultValue: "TEAM_SIZE_EXCEEDED"
			}
		},
		requestStatus: {
			type: Sequelize.DataTypes.STRING,
			status: {
				type: Sequelize.ENUM("REQUESTED", "APPROVED", "REJECTED"),
				defaultValue: "REQUESTED"
			}
		},
		requestorRemarks: {
			type: Sequelize.DataTypes.TEXT,
		},
		actorRemark: {
			type: Sequelize.DataTypes.TEXT
		},
	},
	{
		paranoid: true
	});
	
	Request.add = async function (type, remarks, projectId, userId, status) {
		const obj = await this.create({
			requestType: type,
			requestorRemarks: remarks,
			projectId: projectId,
			userId: userId,
			requestStatus: status
		});
		return obj;
	};

	return Request;
};
