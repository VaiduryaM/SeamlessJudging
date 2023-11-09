
module.exports = (sequelize, Sequelize) => {
	const Event = sequelize.define("event", {
		eventId: {
			type: Sequelize.DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false
		},
		location: {
			type: Sequelize.DataTypes.STRING
		},
		description: {
			type: Sequelize.DataTypes.TEXT
		},
		logo: {
			type: Sequelize.DataTypes.STRING
		},
		startDate: {
			type: Sequelize.DataTypes.DATE
		},
		endDate: {
			type: Sequelize.DataTypes.DATE
		},
		getBasicInfo: {
			type: Sequelize.DataTypes.VIRTUAL,
			get() {
				let info = {};
				info.event_id = this.eventId;
				info.name = this.name;
				info.logo = this.logo;
				info.location = this.location;
				info.description = this.description;
				info.date = [this.startDate, this.endDate];
				return info;
			}
		},
		getPublicInfo: {
			type: Sequelize.DataTypes.VIRTUAL,
			get() {
				let info = {};
				info.event_id = this.eventId;
				info.name = this.name;
				info.logo = this.logo;
				info.location = this.location;
				info.description = this.description;
				info.date = [this.startDate, this.endDate];
				info.sponsors = [];
				if (this.sponsors != undefined) {
					this.sponsors.forEach(sponsor => {
						info.sponsors.push(sponsor.getPublicInfo);
					});
				}
				info.winner_categories = [];
				if (this.winnerCategories != undefined) {
					this.winnerCategories.forEach(category => {
						info.winner_categories.push(category.getPublicInfo);
					});
				}
				return info;
			}
		},
		getDetail: {
			type: Sequelize.DataTypes.VIRTUAL,
			get() {
				let info = this.getBasicInfo;
				info.sponsors = [];
				if (this.sponsors != undefined) {
					this.sponsors.forEach(sponsor => {
						info.sponsors.push(sponsor.getBasicInfo);
					});
				}
				info.winner_categories = [];
				if (this.winnerCategories != undefined) {
					this.winnerCategories.forEach(category => {
						info.winner_categories.push(category.getBasicInfo);
					});
				}
				return info;
			}
		}
	},
	{
		paranoid: true
	});

	Event.add = async function (name, description, logo, location, startDate, endDate) {
		const obj = await this.create({
			name: name,
			description: description,
			logo: logo,
			location: location,
			startDate: startDate,
			endDate: endDate
		});
		return obj;
	};

	return Event;
};
