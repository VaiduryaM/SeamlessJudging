
module.exports = (sequelize, Sequelize) => {
	const EventProjectMap = sequelize.define("eventProjectMap", {
		eventProjectId: {
			type: Sequelize.DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		tableNumber: {
			type: Sequelize.DataTypes.INTEGER
		}
	});

	EventProjectMap.getWinners = async function (eventProjectIds) {
		let eventWinnerResp = {};
		if (eventProjectIds.length == 0) {
			return eventWinnerResp;
		} 
		const winners = await sequelize.query(
			`select winners.winnerCategoryId, projects.name as projectName, ep.eventId, projects.projectId, 
			wc.name as winnerCategoryName from winners join eventProjectMaps as ep on winners.eventProjectId=ep.eventProjectId 
			join winnerCategories wc on wc.winnerCategoryId = winners.winnerCategoryId 
			join projects on projects.projectId=ep.projectId where ep.eventProjectId IN (:eventProjectIds)`,
			{
				replacements: { eventProjectIds },
				type: Sequelize.QueryTypes.SELECT
			}
		);
		if (winners.length > 0) {
			winners.forEach(winner => {
				if (!eventWinnerResp.hasOwnProperty(winner.eventId)) {
					eventWinnerResp[winner.eventId] = [];
				}
				eventWinnerResp[winner.eventId].push({
					winner_category_id: winner.winnerCategoryId,
					winner_category_name: winner.winnerCategoryName,
					project_name: winner.projectName,
					project_id: winner.projectId
				});
			});
		}
		return eventWinnerResp;
	};

	return EventProjectMap;
};