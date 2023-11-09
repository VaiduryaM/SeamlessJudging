
module.exports = (sequelize, Sequelize) => {
	const emailTemplates = sequelize.define('emailTemplates', {
		emailTemplateId: {
			type: Sequelize.DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		title: {
			type: Sequelize.DataTypes.STRING,
            unique: false
		},
		emailSubject: {
			type: Sequelize.DataTypes.STRING
		},
        emailBody:{
            type: Sequelize.DataTypes.TEXT
        }

	});
	
	emailTemplates.add = async function (title, subject, body) {
		const obj = await this.create({
			title: title,
			emailSubject: subject,
			emailBody: body
		});
		return obj;
	};

	return emailTemplates;
};
