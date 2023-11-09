
module.exports = (sequelize, Sequelize) => {
	const emailLogs = sequelize.define('emailLogs', {
		emailLogId: {
			type: Sequelize.DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		senderId: {
			type: Sequelize.DataTypes.INTEGER
		},
		receiverId: {
			type: Sequelize.DataTypes.INTEGER
		},
        emailSubject:{
            type: Sequelize.DataTypes.TEXT
        },
        emailBody:{
            type: Sequelize.DataTypes.TEXT
        },
        dateSent:{
            type: Sequelize.DataTypes.DATE,
            allowNull: true
        }

	},
	{
		paranoid: true
	});
	
	emailLogs.add = async function (senderId, receiverId, emailSubject, emailBody, dateSent) {
		const obj = await this.create({
			senderId: senderId,
			receiverId: receiverId,
			emailSubject: emailSubject,
            emailBody : emailBody,
            dateSent : dateSent
		});
		return obj;
	};

	return emailLogs;
};
