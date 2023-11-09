
module.exports = (sequelize, Sequelize) => {
	const Notes = sequelize.define('notes', {
		noteId: {
			type: Sequelize.DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		instructorId: {
			type: Sequelize.DataTypes.INTEGER
		},
		clientId: {
			type: Sequelize.DataTypes.INTEGER
		},
        text:{
            type: Sequelize.DataTypes.TEXT
        }

	},
	{
		paranoid: true
	});
	
	Notes.add = async function (instructorId, clientId, text) {
		const obj = await this.create({
			instructorId: instructorId,
			clientId: clientId,
			text: text
		});
		return obj;
	};

	return Notes;
};
