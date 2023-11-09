const db = require("../models");
const utils = require("../controllers/utils.js");
const { projectType } = require("../models");
const {
	sponsor: Sponsor,
	user: User,
	winnerCategory: WinnerCategory,
	project: Project,
	projectType: ProjectType,
	event: Event,
	eventProjectMap: EventProjectMap,
	scoreCategory: ScoreCategory,
} = db;

checkEventByNameExistence = async (req, res, next) => {
	try {
		const event = await Event.findOne({
			where: {
				name: req.body.name.trim()
			}});
		if (event) {
			res.status(400).json({
				error: {
					message: `Invalid. Event - ${req.body.name} is already available.`,
				},
			});
			return;
		}
		next();
	} catch (err) {
		console.log("checkEventByNameExistence-middleware error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!!"
			}
		});
		return;
	}
};

 
validateJudges = (req, res, next) => {
	try {
		req.body.judges = utils.getdefaultValue(req.body.judges, []);
		req.body.judges = req.body.judges instanceof Array ? req.body.judges : JSON.parse(req.body.judges);
		if (req.body.judges.length > 0) {
			User.findAll({
				where: {
					userId: {
						[db.Sequelize.Op.in]: req.body.judges,
					}
				},
			}).then((judges) => {
				if (!judges || judges.length != req.body.judges.length) {
					res.status(400).json({
						error: {
							message: "Some Judges are invalid Judges passed.",
						},
					});
					return;
				}
				req.judges = judges;
				next();
			})
			.catch (err => {
				console.log("validateJudges-middleware error - ", err);
				res.status(500).json({ 
					error: {
						message: "Internal server error!!"
					}
				});
				return;
			});
		} else {
			req.judges = [];
			next();
		}
	} catch (err) {
		console.log("validateJudges-middleware error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!!"
			}
		});
		return;
	}
};

validateSponsors = (req, res, next) => {
	try {
		req.body.sponsors = utils.getdefaultValue(req.body.sponsors, []);
		req.body.sponsors = req.body.sponsors instanceof Array ? req.body.sponsors : JSON.parse(req.body.sponsors);
		if (req.body.sponsors.length > 0) {
			Sponsor.findAll({
				where: {
					sponsorId: {
						[db.Sequelize.Op.in]: req.body.sponsors,
					},
				},
			}).then((sponsors) => {
				if (!sponsors || sponsors.length != req.body.sponsors.length) {
					res.status(400).json({
						error: {
							message: "Invalid Sponsors passed.",
						},
					});
					return;
				}
				req.sponsors = sponsors;
				next();
			})
			.catch (err => {
				console.log("validateSponsors-middleware error - ", err);
				res.status(500).json({ 
					error: {
						message: "Internal server error!!"
					}
				});
				return;
			});
		} else {
			req.sponsors = [];
			next();
		}
	} catch (err) {
		console.log("validateSponsors-middleware error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!!"
			}
		});
		return;
	}
};

validateWinnerCategories = (req, res, next) => {
	try {
		req.body.winner_categories = utils.getdefaultValue(req.body.winner_categories, []);
		req.body.winner_categories =
			req.body.winner_categories instanceof Array ? req.body.winner_categories : JSON.parse(req.body.winner_categories);
		if (req.body.winner_categories.length > 0) {
			WinnerCategory.findAll({
				where: {
					winnerCategoryId: {
						[db.Sequelize.Op.in]: req.body.winner_categories,
					},
				},
			}).then((winnerCategories) => {
				if (!winnerCategories || winnerCategories.length != req.body.winner_categories.length) {
					res.status(400).json({
						error: {
							message: "Invalid WinnerCategories passed.",
						},
					});
					return;
				}
				req.winnerCategories = winnerCategories;
				next();
			})
			.catch (err => {
				console.log("validateWinnerCategories-middleware error - ", err);
				res.status(500).json({ 
					error: {
						message: "Internal server error!!"
					}
				});
				return;
			});
		} else {
			req.winnerCategories = [];
			next();
		}
	} catch (err) {
		console.log("validateWinnerCategories-middleware error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!!"
			}
		});
		return;
	}
};

validateProjects = (req, res, next) => {
	try {
		req.body.projects = utils.getdefaultValue(req.body.projects, []);
		req.body.projects =
			req.body.projects instanceof Array ? req.body.projects : JSON.parse(req.body.projects);
		if (req.body.projects.length > 0) {
			Project.findAll({
				where: {
					projectId: {
						[db.Sequelize.Op.in]: req.body.projects,
					},
				},
			}).then((projects) => {
				if (!projects || projects.length != req.body.projects.length) {
					res.status(400).json({
						error: {
							message: "Invalid projects passed.",
						},
					});
					return;
				}
				req.projects = projects;
				next();
			})
			.catch (err => {
				console.log("validateProjects-middleware error - ", err);
				res.status(500).json({ 
					error: {
						message: "Internal server error!!"
					}
				});
				return;
			});
		} else {
			req.projects = [];
			next();
		}
	} catch (err) {
		console.log("validateProjects-middleware error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!!"
			}
		});
		return;
	}
};

checkEventExistence = (req, res, next) => {
	const eventId = req.params.eventId;
	Event.findOne({
		where: {
			eventId: eventId,
		},
		include: [Sponsor, WinnerCategory, Project, User],
	}).then(async (event) => {
		if (!event) {
			res.status(400).json({
				error: {
					message: "Invalid EventId.",
				},
			});
			return;
		}
		if (req.body.name != undefined && (req.body.name.trim() != event.name)) {
			const existingEvent = await Event.findOne({
				where: {
					name: req.body.name.trim()
				}
			});
			if (existingEvent) {
				res.status(400).json({
					error: {
						message: `Invalid. Event - ${req.body.name} is already available.`,
					},
				});
				return;
			}
		}
		req.event = event;
		next();
	})
	.catch (err => {
		console.log("checkEventExistence-middleware error - ", err);
		res.status(500).json({ 
			error: {
				message: "Internal server error!!"
			}
		});
		return;
	});
};

checkJudgingPeriod = async (req, res, next) => {
	try {
		const eventDetails = req.judge_event;
		const eventStartTime = new Date(eventDetails.startDate);
		const eventEndTime = new Date(eventDetails.endDate);
		if (!(eventStartTime <= Date.now() && Date.now() <= eventEndTime)) {
			res.status(400).json({
				error: {
					message: "Invalid. Scoring can be given only once event is started and before it ends!!",
				},
			});
			return;
		} else {
			next();
		}
	} catch (err) {
		console.log("checkJudgingPeriod-middleware error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!!"
			}
		});
		return;
	}
};

checkScoringCategory = async (req, res, next) => {
	try {
		const project = await Project.findOne({
			where: {
				projectId: req.params.projectId,
			},
		});
		const projectType = await ProjectType.findOne({
			where: {
				projectTypeId: project.projectTypeId,
			},
			include: [ScoreCategory],
		});
		if (!(req.body.scoring.length === projectType.scoreCategories.length)) {
			res.status(400).json({
				error: {
					message: "Please select all categories.",
				},
			});
			return;
		} else {
			next();
		}
	} catch (err) {
		console.log("checkScoringCategory-middleware error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!!"
			}
		});
		return;
	}
};

const validateEvent = {
	validateJudges: validateJudges,
	validateSponsors: validateSponsors,
	validateWinnerCategories: validateWinnerCategories,
	validateProjects: validateProjects,
	checkEventExistence: checkEventExistence,
	checkJudgingPeriod: checkJudgingPeriod,
	checkScoringCategory: checkScoringCategory,
	checkEventByNameExistence: checkEventByNameExistence
};

module.exports = validateEvent;
