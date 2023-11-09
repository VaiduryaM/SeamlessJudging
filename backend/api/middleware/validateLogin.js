const db = require("../models");
const User = db.user;
const UserRoles = db.UserRoles;
const utils = require("../controllers/utils.js");
const { judgeEventMap } = require("../models");

// FIXME: not used anywhere, remove this.
checkUserExistence = async(req, res, next) => {
	try {
		console.log("at 10");
		let query = {};
		let include = [];
		let judgeId=null;
		let judgeEventObj;
		if (req.body.passwordType == 'Token') {
			judgeEventObj = await judgeEventMap.findOne({
				where: {
					code: req.body.token
				}
			});
		}
		  if(judgeEventObj){
			judgeId=judgeEventObj.dataValues.judgeId;
		  }
		console.log("judgeId at 24",judgeId);
		User.findOne({
			where:judgeId?{userId:judgeId}:{email:req.body.email?req.body.email:""}
		}).then(user => {
			if(!user){
				res.status(400).json({
					error: {
						message: "Please sign up or contact instructor"
					}
				});
				return;
			}

		const roles = utils.getRolesArray(user);
		if (roles.includes(UserRoles.Judge)) {
			include.push({
				model: db.event,
				through: {
					where: {
						code: req.body.token
					},
				},
				required: true});
		} else {
			query.email = req.body.email.toLowerCase();
		}
		query.email = req.body.email.toLowerCase();
		User.findOne({
			where: judgeId?{userId:judgeId}:{email:req.body.email?req.body.email:""},
			include: include
		}).then(user => {
			if (!user) {
				let errMsg = "Please SignUp!! User is not registered with us.";
				
				res.status(400).json({
					error: {
						message: errMsg
					}
				});
				return;
			}
			
			if (user.status == db.ParticipantStatus.Blocked) {
				res.status(400).json({
					error: {
						message: "Invalid your account is currently blocked. Please contact admin."
					}
				});
				return;
			}
			req.user = user;
			console.log("Validation successful");
			next();
		})
		.catch (err => {
			console.log("checkUserExistence-middleware error - ", err);
			res.status(500).json({ 
				error: {
					message: "Internal server error!!"
				}
			});
			return;
		});
	})
	} catch (err) {
		console.log("checkUserExistence-middleware error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!!"
			}
		});
		return;
	}
};

mandatoryFields = (req, res, next) => {
	try {
		if (Object.keys(req.body).length === 0) {
			res.status(400).json({
				error: {
					message: "Invalid. Request-Parameters are empty."
				}
			});
			return;
		}
		
		if (req.body.passwordType == "Password"){
			fields  = ["email","password","passwordType"];
		}
		else {
			fields = ["token","passwordType"]
		}
		for (let i=0; i<fields.length; i++) {
			let item = fields[i];
			if (!req.body[item] || req.body[item] === "") {
				res.status(400).json({
					error: {
						message: `Invalid. Parameter - ${item} is empty.`
					}
				});
				return;
			}
		}
		console.log("Mandatory fields check complete");
		next();
	} catch (err) {
		console.log("user-mandatoryFields-middleware error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!!"
			}
		});
		return;
	}
};

checkInputFile = (req,res,next) => {
	
	if (!req.file){
		res.status(400).json({
			error: {
				message: `CSV file not found`
			}
		});
		return;
	}
	if (req.file.mimetype!='text/csv'){
		res.status(400).json({
			error: {
				message: `Invalid File used. Only csv file is accepted`
			}
		});
		return;
		
	}
	next();
};

const validateLogin = {
	checkUserExistence: checkUserExistence,
	mandatoryFields: mandatoryFields,
	checkInputFile: checkInputFile
};

module.exports = validateLogin;