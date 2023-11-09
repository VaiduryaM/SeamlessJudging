const db = require("../models");
const moment = require("moment");
const utils = require("../controllers/utils.js");
const { 
	event: Event, 
	judgeProjectMap: JudgeProjectMap, 
	judgeEventMap: JudgeEventMap,
	winnerCategory: WinnerCategory,
	sponsor: Sponsor,
	eventProjectMap: EventProjectMap } = db;

exports.addEvent = (req, res) => {
	try {
		let logoPath = "";
		if (req.file) {
			let fileType = "." + req.file.originalname.split('.').pop().trim();
			logoPath = utils.uploadFile(req.file.path, fileType);
		}

		const dates = JSON.parse(req.body.date);
		const startDate = new Date(dates[0].trim());
		const endDate = new Date(dates[1].trim());
		if (startDate.getTime() > endDate.getTime()) {
			res.status(400).json({ 
				error: {
					message: "Invalid event start-date cannot be greater than end-date."
				}
			});
			return;
		}

		Event.add(
			req.body.name.trim(),
			utils.getdefaultValue(req.body.description, ""),
			logoPath,
			utils.getdefaultValue(req.body.location, ""),
			startDate,
			endDate)
		.then(async event => {

			req.sponsors.forEach(sponsor => event.addSponsor(sponsor));

			req.winnerCategories.forEach(category => 
				event.addWinnerCategory(category));

			let eventProjectObjs = [];
			req.projects.forEach((project, idx) => {
				eventProjectObjs.push({
					eventId: event.eventId,
					projectId: project.projectId,
					tableNumber: idx+1
				});
			});
			if (eventProjectObjs.length > 0) {
				await EventProjectMap.bulkCreate(eventProjectObjs);
			}

			const judgeEvents = await JudgeEventMap.findAll();
			const existingCodes = [];
			judgeEvents.forEach(je => existingCodes.push(je.code));
			const newCodes = utils.myRandomInts(req.judges.length, existingCodes);
			req.judges.forEach(async (judge, idx) => {
				await event.addUser(judge, {through: {code: newCodes[idx]}});
				const emailContent = utils.getEventMailContent(event, judge, newCodes[idx]);
				utils.sendEmail(emailContent.subject, emailContent.htmlBody, judge.email);
			});

			res.status(201).json({
				response_str: "Event added successfully!",
				response_data: {
					event_id: event.eventId
				}
			});
			return;
		})
		.catch(err => {
			console.log("addEvent error - ", err);
			res.status(500).json({ 
				error: {
					message: "Internal server error!"
				}
			});
			return;
		});
	} catch (err) {
		console.log("addEvent error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!"
			}
		});
		return;
	}
};

exports.updateEvent = (req, res) => {

	try {
		let event = req.event;

		event.name = utils.getdefaultValue(req.body.name, event.name).trim();
		event.description = utils.getdefaultValue(req.body.description, event.description);
		event.location = utils.getdefaultValue(req.body.location, event.location);

		const dates = JSON.parse(req.body.date);
		event.startDate = new Date(dates[0].trim());
		event.endDate = new Date(dates[1].trim());
		if (event.startDate.getTime() > event.endDate.getTime()) {
			res.status(400).json({ 
				error: {
					message: "Invalid event start-date cannot be greater than end-date."
				}
			});
			return;
		}

		let tempFilePath = "";
		if (req.file) {
			tempFilePath = event.logo;
			let fileType = "." + req.file.originalname.split('.').pop().trim();
			event.logo = utils.uploadFile(req.file.path, fileType);
		}

		event.save()
		.then(event => {
			if (tempFilePath != "") {
				try {
					fs.unlinkSync(tempFilePath); //remove old file from server
				} catch (err) {
					console.log(`Failed to delete file from folder - ${tempFilePath} - ${err}`);
				}
			}
			res.status(200).json({
				response_str: "Event updated successfully!",
				response_data: {
					event_id: event.eventId
				}
			});
			return;
		})
		.catch(err => {
			console.log("updateEvent error - ", err);
			res.status(500).json({ 
				error: {
					message: "Internal server error!"
				}
			});
			return;
		});
	} catch (err) {
		console.log("updateEvent error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!"
			}
		});
		return;
	}
};

exports.getEvents = (req, res) => {

	try {
		const name = utils.getdefaultValue(req.query.name, "");
		let query = {};
		if (name != "") {
			query.name = {
				[db.Sequelize.Op.like]: `%${name}%`
			};
		}
		const includeQuery = [];
		if(req.query.download_excel === "TRUE") {
			includeQuery.push({
				model: db.sponsor
			},
			{
				model: db.winnerCategory
			})
		}
			
		Event.findAll({
			where: query,
			include: includeQuery,
			order: [ [ 'createdAt', 'DESC' ]]
		})
		.then(async events => {
			let response = {
				upcoming_events: [],
				past_events: []
			};
			events.forEach(event => {
				if (event.endDate.getTime() < new Date().getTime()) {
					response.past_events.push(event.getBasicInfo);
				} else {
					response.upcoming_events.push(event.getBasicInfo);
				}
			});

			let downloadPath = '';
			if(req.query.download_excel==='TRUE') {
				upcomingEvents = [];
				pastEvents = [];
				upcomingExportData = [];
				pastExportData = [];
		
				events.forEach(event => {
					if (event.endDate.getTime() < new Date().getTime()) {
						pastEvents.push(event.getPublicInfo);
					} else {
						upcomingEvents.push(event.getPublicInfo);
					}
				});

				if(upcomingEvents.length > 0) {
					events = {};
					upcomingEvents.map((event) => {
						events.name = event.name;
						events.location = event.location;
						events.startDate = event.date[0];
						events.startTime = formatDate(event.date[0]);
						events.endDate = event.date[1];
						events.endTime = formatDate(event.date[1]);
						events.sponsors = extractData(event.sponsors);
						events.winnerCategory = extractData(event.winner_categories);
						upcomingExportData.push(events);
					})
				}
				if(pastEvents.length > 0) {
					events = {};
					pastEvents.map((event) => {
						events.name = event.name;
						events.location = event.location;
						events.startDate = event.date[0];
						events.startTime = formatDate(event.date[0]);
						events.endDate = event.date[1];
						events.endTime = formatDate(event.date[1]);
						events.sponsors = extractData(event.sponsors);
						events.winnerCategory = extractData(event.winner_categories);
						pastExportData.push(events);
					})
				}
			downloadPath = utils.exportEventData(pastExportData, upcomingExportData);
			}
			res.status(200).json({
				response_str: "Events retrieved successfully!",
				response_data: response,
				download_path: downloadPath
			});
			return;
		})
		.catch(err => {
			console.log("getEvents error - ", err);
			res.status(500).json({ 
				error: {
					message: "Internal server error!"
				}
			});
			return;
		});
	} catch (err) {
		console.log("getEvents error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!"
			}
		});
		return;
	}
};

function extractData(data) {
	result = '';
	data.map((obj) => {
		result = result+obj.name+', ';
	})
	return result;
};

function formatDate(date) {
	return moment(date).tz("America/New_York").format("h:mm A z");
}

exports.getEventDetail = async (req, res) => {

	try {
		Event.findOne({
			where: {
				eventId: req.params.eventId
			},
			include: [db.user],
		}).then(async (event) => {
			if (!event) {
				res.status(400).json({
					error: {
						message: "Invalid EventId!"
					}
				});
				return;
			}
			let response = event.getBasicInfo;
			response.judges = [];
			event.users.forEach(judge => response.judges.push(judge.getBasicInfo));
			response.winners = [];
			const eventProjectMaps = await EventProjectMap.findAll({
				where: {
					eventId: event.eventId
				}
			});
			if (eventProjectMaps.length > 0) {
				let eventProjectIds = [];
				eventProjectMaps.forEach(ep => eventProjectIds.push(ep.eventProjectId));
				const eventWinnerResp = await EventProjectMap.getWinners(eventProjectIds);
				response.winners = eventWinnerResp[event.eventId] != undefined ? eventWinnerResp[event.eventId] : [];
			}
			res.status(200).json({
				response_str: "Event detail retrieved successfully!",
				response_data: response
			});
			return;
		})
		.catch(err => {
			console.log("getEventDetail error - ", err);
			res.status(500).json({ 
				error: {
					message: "Internal server error!"
				}
			});
			return;
		});
	} catch (err) {
		console.log("getEventDetail error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!"
			}
		});
		return;
	}
};

exports.updateEventReferences = async (req, res) => {
	try {
		if (req.event.endDate.getTime() < new Date().getTime()) {
			res.status(400).json({
				error: {
					message: "Invalid. Event is already completed, cannot attach/detach of new references."
				}
			});
			return;
		}
		const updateType = req.body.update_type;
		if (updateType === db.EventUpdateTypes.Attach) {
			if (req.sponsors.length > 0) {
				req.sponsors.forEach(sponsor => req.event.addSponsor(sponsor));
			}
			if (req.winnerCategories.length > 0) {
				req.winnerCategories.forEach(category => req.event.addWinnerCategory(category));
			}
			if (req.projects.length > 0) {
				let curr_val = req.event.projects.length+1;
				let eventProjectObjs = [];
				req.projects.forEach((project, idx) => {
					eventProjectObjs.push({
						eventId: req.event.eventId,
						projectId: project.projectId,
						tableNumber: idx+curr_val
					});
				});
				if (eventProjectObjs.length > 0) {
					await EventProjectMap.bulkCreate(eventProjectObjs);
				}
			}
			if (req.judges.length > 0) {
				const judgeEvents = await JudgeEventMap.findAll();
				const existingCodes = [];
				judgeEvents.forEach(je => existingCodes.push(je.code));
				const newCodes = utils.myRandomInts(req.judges.length, existingCodes);
				req.judges.forEach(async (judge, idx) => {
					await req.event.addUser(judge, {through: {code: newCodes[idx]}});
					const emailContent = utils.getEventMailContent(req.event, judge, newCodes[idx]);
					utils.sendEmail(emailContent.subject, emailContent.htmlBody, judge.email);
				});
			}
		} else {
			if (req.sponsors.length > 0) {
				req.event.sponsors.forEach(async sponsor => {
					if (req.body.sponsors.includes(sponsor.sponsorId)) {
						await sponsor.sponsorEventMaps.destroy();
					}
				});
			}
			if (req.winnerCategories.length > 0) {
				req.event.winnerCategories.forEach(async category => {
					if (req.body.winner_categories.includes(category.winnerCategoryId)) {
						await category.winnerCategoryEventMaps.destroy();
					}
				});
			}
			if (req.projects.length > 0) {
				let idx = 0;
				let delEventProjectMapIds = [];
				for (const project of req.event.projects) {
					if (!(req.body.projects.includes(project.projectId))) {
						project.eventProjectMap.tableNumber = idx+1;
						await project.eventProjectMap.save();
						idx++;
					} else {
						delEventProjectMapIds.push(project.eventProjectMap.eventProjectId);
					}
				}
				if (delEventProjectMapIds.length > 0) {
					await EventProjectMap.destroy({
						where: {
							eventProjectId: {
								[db.Sequelize.Op.in]: delEventProjectMapIds
							}
						}
					});
				}
			}
			if (req.judges.length > 0) {
				let delJudgeIds = [];
				let delJudgeEventIds = [];
				req.event.users.forEach(async judge => {
					if (req.body.judges.includes(judge.userId)) {
						delJudgeEventIds.push(judge.judgeEventMap.judgeEventId);
						delJudgeIds.push(judge.userId);
					}
				});

				if (delJudgeEventIds.length > 0) {
					await JudgeEventMap.destroy({
						where: {
							judgeEventId: {
								[db.Sequelize.Op.in]: delJudgeEventIds
							}
						}
					});
				}

				if (delJudgeIds.length > 0) {
					let eventProjectIds = [];
					req.event.projects.forEach(project => 
						eventProjectIds.push(project.eventProjectMap.eventProjectId));
					if (eventProjectIds.length > 0) {
						await JudgeProjectMap.destroy({
							where: {
								judgeId: {
									[db.Sequelize.Op.in]: delJudgeIds
								},
								eventProjectId: {
									[db.Sequelize.Op.in]: eventProjectIds
								}
							}
						});
					}
				}
			}
		}
		res.status(200).json({
			response_str: `${updateType} action successful`,
			response_data: {
				event_id: req.event.eventId
			}
		});
		return;
	} catch (err) {
		console.log("updateEventReferences error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!"
			}
		});
		return;
	}
};

exports.autoAssignJudges = async (req, res) => {

	try {
		const eventId = req.params.eventId;
		const judgesSize = req.body.judges_size;
		Event.findOne({
			where: {
				eventId: eventId
			},
			include: [db.user, db.project]
		}).then(async event => {
			if (event.endDate.getTime() < new Date().getTime()) {
				res.status(400).json({
					error: {
						message: "Invalid. Event is already completed, cannot assign judges now."
					}
				});
				return;
			}
			if (event.users.length == 0 || event.projects.length == 0) {
				res.status(400).json({ 
					error: {
						message: "Error - No Judges or Projects are attached to the event. \
						Please attach them before proceeding to this step."
					}
				});
				return;
			}

			if (event.users.length < judgesSize) {
				res.status(400).json({
					error: {
						message: "Error - Number of judges avaialble be >= judges to be assigned!"
					}
				});
				return;
			}

			const eventProjectIds = []
			event.projects.forEach(project =>
				eventProjectIds.push(project.eventProjectMap.eventProjectId));
			await JudgeProjectMap.destroy({
				where: {
					eventProjectId: {
						[db.Sequelize.Op.in]: eventProjectIds
					}
				}
			});

			let judgeProjectObjs = [];
			const projectJudgeMap = utils.split(event.projects, event.users, judgesSize);
			for (const projectId in projectJudgeMap) {
				const project = projectJudgeMap[projectId].project;
				const judges = projectJudgeMap[projectId].judges;
				judges.forEach(judge => {
					judgeProjectObjs.push({
						eventProjectId: project.eventProjectMap.eventProjectId,
						judgeId: judge.userId
					})
				});
			}
			
			await JudgeProjectMap.bulkCreate(judgeProjectObjs);

			res.status(200).json({
				response_str: `Judges Auto-Assignment successful`,
				response_data: {}
			});
			return;
		})
		.catch(err => {
			console.log("autoAssignJudges error - ", err);
			res.status(500).json({ 
				error: {
					message: "Internal server error!"
				}
			});
			return;
		});
	} catch (err) {
		console.log("autoAssignJudges error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!"
			}
		});
		return;
	}

};

exports.getPublicEventDetail = async (req, res) => {
	try {
		Event.findOne({
			where: {
				eventId: req.params.eventId
			},
			include: [
			{
				model: db.project,
				include: [
					{
						model: db.projectType
					},
					{
						model: db.courseCode
					},
					{
						model: db.user
					}]
			},
			{
				model: db.sponsor
			},
			{
				model: db.winnerCategory
			},
			{
				model: db.user
			}],
		}).then(async (event) => {
			if (!event) {
				res.status(400).json({
					error: {
						message: "Invalid EventId!"
					}
				});
				return;
			}
			let response = event.getPublicInfo;
			response.judges = [];
			event.users.forEach(judge => response.judges.push(judge.getPublicInfo));
			response.projects = [];
			event.projects.forEach(project => response.projects.push(project.getPublicInfo));
			response.winners = [];
			const eventProjectMaps = await EventProjectMap.findAll({
				where: {
					eventId: event.eventId
				}
			});
			if (eventProjectMaps.length > 0) {
				let eventProjectIds = [];
				eventProjectMaps.forEach(ep => eventProjectIds.push(ep.eventProjectId));
				const eventWinnerResp = await EventProjectMap.getWinners(eventProjectIds);
				const winners = eventWinnerResp[event.eventId] != undefined ? eventWinnerResp[event.eventId] : [];
				console.log("winners - ", winners);
				winners.forEach(winner => response.winners.push({
					winner_category_name: winner.winner_category_name,
					project_name: winner.project_name
				}));
			}
			res.status(200).json({
				response_str: "Event detail retrieved successfully!",
				response_data: response
			});
			return;
		})
		.catch(err => {
			console.log("getPublicEventDetail error - ", err);
			res.status(500).json({ 
				error: {
					message: "Internal server error!"
				}
			});
			return;
		});
	} catch (err) {
		console.log("getPublicEventDetail error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!"
			}
		});
		return;
	}
};

exports.getPublicEvents = async (req, res) => {
	try {
		Event.findAll({
			order: [ [ 'createdAt', 'DESC' ]]
		})
		.then(async events => {
			let response = {
				upcoming_events: [],
				past_events: []
			};
			events.forEach(event => {
				if (event.endDate.getTime() < new Date().getTime()) {
					response.past_events.push(event.getPublicInfo);
				} else {
					response.upcoming_events.push(event.getPublicInfo);
				}
			});
			res.status(200).json({
				response_str: "Events retrieved successfully!",
				response_data: response
			});
			return;
		})
		.catch(err => {
			console.log("getPublicEvents error - ", err);
			res.status(500).json({ 
				error: {
					message: "Internal server error!"
				}
			});
			return;
		});
	} catch (err) {
		console.log("getPublicEvents error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!"
			}
		});
		return;
	}
};