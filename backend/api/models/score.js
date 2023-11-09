
module.exports = (sequelize, Sequelize) => {
	const Score = sequelize.define('score', {
		scoreId: {
			type: Sequelize.DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		value: {
			type: Sequelize.DataTypes.FLOAT
		},
		feedback: {
			type: Sequelize.DataTypes.TEXT
		},
		getBasicInfo: {
			type: Sequelize.DataTypes.VIRTUAL,
			get() {
				let info = {};
				info.score_id = this.scoreId;
				info.value = this.value;
				info.score_category_id = this.scoreCategory.scoreCategoryId;
				return info;
			}
		}
	},
	{
		paranoid: true
	});

	Score.getByJudgeProjectIds = async function (judgeProjectIds) {
		const db = require("../models");
		let scoreMap = {};
		const scores = await this.findAll({
			where: {
				judgeProjectId: {
					[Sequelize.Op.in]: judgeProjectIds
				}
			},
			include: [db.scoreCategory]
		});
		if (scores) {
			scores.forEach(score => {
				if (!scoreMap.hasOwnProperty(score.judgeProjectId)) {
					scoreMap[score.judgeProjectId] = [];
				}
				scoreMap[score.judgeProjectId].push(score.getBasicInfo);
			});
		}
		return scoreMap;
	};

	Score.getByEventProject = async function (eventId, projectId) {
		const scores = await sequelize.query(
			`select jp.judgeId, scores.value, scores.categoryId, sc.name, scores.feedback from scores 
			join judgeProjectMaps jp on scores.judgeProjectId = jp.judgeProjectId 
			join eventProjectMaps ep on ep.eventProjectId = jp.eventProjectId 
			join scoreCategories sc on sc.scoreCategoryId = scores.categoryId 
			where ep.eventId=:eventId and ep.projectId=:projectId`,
			{
				replacements: { eventId: eventId, projectId: projectId },
				type: Sequelize.QueryTypes.SELECT,
		});
		let judgeScoresMap = {};
		scores.forEach(score => {
			if (!judgeScoresMap.hasOwnProperty(score.judgeId)) {
				judgeScoresMap[score.judgeId] = [];
			}
			judgeScoresMap[score.judgeId].push({
				value: score.value,
				score_category_id: score.categoryId ,
				score_category_name: score.name,
				feedback: score.feedback == null ? "" : score.feedback,
				key: parseInt(`${score.judgeId}${score.categoryId}`)
			});
		});
		return judgeScoresMap;
	};

	Score.add = async function (value, feedback, categoryId, judgeProjectId) {
		const obj = await this.create({
            		value: value,
			feedback: feedback,
			categoryId: categoryId,
			judgeProjectId: judgeProjectId,
		});
		return obj;
	};

	Score.getAggScores = async function (eventId) {
		const scores = await sequelize.query(
			`select ep.projectId, avg(scores.value) as avg_score from scores join judgeProjectMaps as jp 
			on scores.judgeProjectId = jp.judgeProjectId join eventProjectMaps as ep on 
			jp.eventProjectId = ep.eventProjectId where ep.eventId = :eventId group by ep.projectId 
			order by avg_score desc`,
			{
				replacements: {eventId: eventId},
				type: Sequelize.QueryTypes.SELECT
			});
		return scores;
	};

	return Score;
};
