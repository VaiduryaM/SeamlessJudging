
module.exports = (sequelize, Sequelize) => {
	const CourseCode = sequelize.define('courseCode', {
		courseCodeId: {
			type: Sequelize.DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: Sequelize.DataTypes.STRING
		},
		code: {
			type: Sequelize.DataTypes.STRING,
			unique: false
		},
		semester:{
			type: Sequelize.DataTypes.STRING
		},
		year: {
			type: Sequelize.DataTypes.STRING
		},
		getBasicInfo: {
			type: Sequelize.DataTypes.VIRTUAL,
			get() {
				let info = {};
				info.course_code_id = this.courseCodeId;
				info.name = this.name;
				info.code = this.code;
				info.key = info.course_code_id;
				return info;
			}
		}
	},
	{
		paranoid: true
	});
	return CourseCode;
};