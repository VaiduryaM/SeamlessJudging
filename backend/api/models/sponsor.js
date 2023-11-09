
module.exports = (sequelize, Sequelize) => {
	const Sponsor = sequelize.define('sponsor', {
		sponsorId: {
			type: Sequelize.DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: Sequelize.DataTypes.STRING,
			unique: false
		},
		logo: {
			type: Sequelize.DataTypes.STRING
		},
		getBasicInfo: {
			type: Sequelize.DataTypes.VIRTUAL,
			get() {
				let info = {};
				info.sponsor_id = this.sponsorId;
				info.name = this.name;
				info.logo = this.logo!=null ? this.logo.replace(
					"./db",
					`http://${process.env.MYSQL_HOST}:${process.env.PORT}/images/`
				  ) : "";
				info.key = `sponsor_${this.sponsorId}`;
				return info;
			}
		},
		getPublicInfo: {
			type: Sequelize.DataTypes.VIRTUAL,
			get() {
				let info = {};
				info.name = this.name;
				info.logo = this.logo;
				return info;
			}
		}
	},
	{
		paranoid: true
	});
	return Sponsor;
};
