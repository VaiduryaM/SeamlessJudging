const db = require("../models");
const Project = db.project;
const Request = db.request;
const User = db.user;

checkRequestExistence = (req, res, next) => {
	const requestId = req.params.requestId;
	Request.findOne({
		where: {
			requestId: requestId
		}
	})
	.then(async request => {
		if (!request) {
			res.status(400).json({
				error: {
					message: "Invalid RequestId."
				}
			});
			return;
		}
		req.request = request;
		next();
	})
	.catch (err => {
		console.log("checkRequestExistence-middleware error - ", err);
		res.status(500).json({ 
			error: {
				message: "Internal server error!!"
			}
		});
		return;
	});
};

checkForAnyRequestExistence = (req, res, next) => {
	Request.findOne({
		limit: 1,
		where: {
			userId: req.user.userId
		},
		order: [ [ 'createdAt', 'DESC' ]]
	})
	.then(async request => {
		if (request && request.requestStatus === db.RequestStatus.Requested) {
			res.status(400).json({
				error: {
					message: "There is already an existing open request"
				}
			});
			return;
		}
		req.request = request;
		next();
	})
	.catch (err => {
		console.log("checkForAnyRequestExistence-middleware error - ", err);
		res.status(500).json({ 
			error: {
				message: "Internal server error!!"
			}
		});
		return;
	});
};

accessProject = (req, res, next) => {
	const projectId = req.request.projectId;
	Project.findOne({
		where: {
			projectId: projectId
		}
	})
	.then(async project => {
		if (!project) {
			res.status(400).json({
				error: {
					message: "Invalid ProjectId."
				}
			});
			return;
		}
		req.project = project;
		next();
	})
	.catch (err => {
		console.log("accessProject-middleware error - ", err);
		res.status(500).json({ 
			error: {
				message: "Internal server error!!"
			}
		});
		return;
	});
};

const validateRequest = {
    checkForAnyRequestExistence: checkForAnyRequestExistence,
    checkRequestExistence: checkRequestExistence,
    accessProject: accessProject
};

module.exports = validateRequest;