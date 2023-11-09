const db = require("../models");
const utils = require("../controllers/utils.js");

validateWinnerCategoryDeletion = async (req, res, next) => {
	try {
		req.winnerCategoryIds = utils.getdefaultValue(req.body.ids, []);
        req.winnerCategoryIds = req.winnerCategoryIds instanceof Array ? req.winnerCategoryIds : JSON.parse(req.winnerCategoryIds);
        if (req.winnerCategoryIds.length == 0) {
            res.status(400).json({
                error: {
                    message: "WinnerCategoryIds to delete cannot be empty!!" 
                }
            });
            return;
        }
		const results = await db.sequelize.query(`select * from winnerCategoryEventMaps wc where wc.winnerCategoryId IN (:winnerCategoryIds)`,
		{
			replacements: {winnerCategoryIds: req.winnerCategoryIds},
			type: db.Sequelize.QueryTypes.SELECT,
		});
		if (results.length > 0) {
			res.status(400).json({
				error: {
					message: "WinnerCategories cannot be deleted as they are attached to events!!" 
				}
			});
			return;
		}
		next();
	} catch (err) {
		console.log("validateWinnerCategoryDeletion-middleware error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!!"
			}
		});
		return;
	}
};

validateScoreCategoryDeletion = async (req, res, next) => {
	try {
		req.scoreCategoryIds = utils.getdefaultValue(req.body.ids, []);
        req.scoreCategoryIds = req.scoreCategoryIds instanceof Array ? req.scoreCategoryIds : JSON.parse(req.scoreCategoryIds);
        if (req.scoreCategoryIds.length == 0) {
            res.status(400).json({
                error: {
                    message: "ScoreCategoryIds to delete cannot be empty!!" 
                }
            });
            return;
        }
		const results = await db.sequelize.query(`select * from projectTypeScoreCategoryMaps pt where pt.scoreCategoryId IN (:scoreCategoryIds)`,
		{
			replacements: {scoreCategoryIds: req.scoreCategoryIds},
			type: db.Sequelize.QueryTypes.SELECT,
		});
		if (results.length > 0) {
			res.status(400).json({
				error: {
					message: "ScoreCategory cannot be deleted as they are attached to project-types!!" 
				}
			});
			return;
		}
		next();
	} catch (err) {
		console.log("validateWinnerCategoryDeletion-middleware error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!!"
			}
		});
		return;
	}
};

validateProjectTypeDeletion = async (req, res, next) => {
	try {
		req.projectTypeIds = utils.getdefaultValue(req.body.ids, []);
        req.projectTypeIds = req.projectTypeIds instanceof Array ? req.projectTypeIds : JSON.parse(req.projectTypeIds);
        if (req.projectTypeIds.length == 0) {
            res.status(400).json({
                error: {
                    message: "ProjectTypeIds to delete cannot be empty!!" 
                }
            });
            return;
        }
		const pTypeMaps = await db.projectTypeMap.findAll({
				where: {
					projectTypeId: {
						[db.Sequelize.Op.in]: req.projectTypeIds,
					},
				}
		});
		if(pTypeMaps.length>0){
				res.status(400).json({
					error: {
						message: "ProjectType cannot be deleted as they are attached to projects!!" 
					}
				});
				return;
		}
		next();
	} catch (err) {
		console.log("validateProjectTypeDeletion-middleware error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!!"
			}
		});
		return;
	}
};

validateCourseCodeDeletion = async (req, res, next) => {
	try {
		req.courseCodeIds = utils.getdefaultValue(req.body.ids, []);
        req.courseCodeIds = req.courseCodeIds instanceof Array ? req.courseCodeIds : JSON.parse(req.courseCodeIds);
        if (req.courseCodeIds.length == 0) {
            res.status(400).json({
                error: {
                    message: "CourseCodeIds to delete cannot be empty!!" 
                }
            });
            return;
        }
		const results = await db.sequelize.query(`select * from projects where projects.courseCodeId IN (:courseCodeIds) limit 1`,
		{
			replacements: {courseCodeIds: req.courseCodeIds},
			type: db.Sequelize.QueryTypes.SELECT,
		});
		if (results.length > 0) {
			res.status(400).json({
				error: {
					message: "CourseCodes cannot be deleted as they are attached to projects!!" 
				}
			});
			return;
		}
		next();
	} catch (err) {
		console.log("validateCourseCodeDeletion-middleware error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!!"
			}
		});
		return;
	}
};

validateJudgeDeletion = async (req, res, next) => {
	try {
		req.judgeIds = utils.getdefaultValue(req.body.ids, []);
        req.judgeIds = req.judgeIds instanceof Array ? req.judgeIds : JSON.parse(req.judgeIds);
        if (req.judgeIds.length == 0) {
            res.status(400).json({
                error: {
                    message: "JudgeIds to delete cannot be empty!!" 
                }
            });
            return;
        }
		const results = await db.sequelize.query(`select * from judgeEventMaps je where je.judgeId IN (:judgeIds) and deletedAt is null limit 1 `,
		{
			replacements: {judgeIds: req.judgeIds},
			type: db.Sequelize.QueryTypes.SELECT,
		});
		if (results.length > 0) {
			res.status(400).json({
				error: {
					message: "Judges cannot be deleted as they are attached to events!!" 
				}
			});
			return;
		}
		const projectResults = await db.sequelize.query(`select * from judgeProjectMaps jp where jp.judgeId IN (:judgeIds) limit 1`,
		{
			replacements: {judgeIds: req.judgeIds},
			type: db.Sequelize.QueryTypes.SELECT,
		});
		if (projectResults.length > 0) {
			res.status(400).json({
				error: {
					message: "Judges cannot be deleted as they are attached to projects!!" 
				}
			});
			return;
		}
		next();
	} catch (err) {
		console.log("validateJudgeDeletion-middleware error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!!"
			}
		});
		return;
	}
};

validateUserExistence = async (req, res, next) => {
	try {
		
		const all_users = req.body.users;
		const results = await db.sequelize.query(`select userId from Users u where u.email IN (:useremails)`,
		{
			replacements: {useremails: all_users},
			type: db.Sequelize.QueryTypes.SELECT,
		});
		if(results.length != req.body.users.length){
			res.status(500).json({
				error: {
					message: "Users do not exist"
				}
			});
			return;
		}
		
		next();
	} catch (err) {
		console.log("validateUserExistence-middleware error - ", err);
		res.status(500).json({
			error: {
				message: "Internal server error!!"
			}
		});
		return;
	}
};


const validateReference = {
	validateWinnerCategoryDeletion: validateWinnerCategoryDeletion,
	validateScoreCategoryDeletion: validateScoreCategoryDeletion,
	validateProjectTypeDeletion: validateProjectTypeDeletion,
	validateCourseCodeDeletion: validateCourseCodeDeletion,
	validateJudgeDeletion: validateJudgeDeletion,
	validateUserExistence: validateUserExistence
};

module.exports = validateReference;