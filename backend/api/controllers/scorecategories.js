const db = require("../models");
const fs = require('fs');
const { scoreCategory: ScoreCategory } = db;

const Op = db.Sequelize.Op;


exports.createScoreCategory = async (req, res, next) => {
    try {
        const body = req.body;
        const score = await ScoreCategory.create({
            name: body.name,
            scale: body.scale
        })
        return res.status(201).json({
            response_str: "ScoreCategory added succesfully",
            response_data: {
                id: score.scoreCategoryId,
            }
        })
    }
    catch (err) {
        console.log("createScoreCategory error - ", err);
        if (err.name === db.SequelizeUniqueConstraintError) {
            res.status(400).json({
                error: {
                    message: `Invalid. Scoring Category - ${req.body.name} is already available.`
                }
            });
            return;
        }
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
}


exports.getScoreCategories = async (req, res, next) => {
    try {
        const name = req.query.name;
        let response = [];
        const scores = await ScoreCategory.findAll({
            attributes: ['scoreCategoryId', 'name', 'scale'],
            where: {
                ...(req.query.name && { name: req.query.name })
            }
        });
        scores.forEach(function (score) {
            response.push(score.getBasicInfo)
        });
        return res.status(200).json({
            response_str: "ScoreCategory details retrieved successfully",
            response_data: response
        });
    }
    catch (err) {
        console.log("getScoreCategories error - ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
}


exports.updateScoreCategory = async (req, res, next) => {
    try {

        const scoringCategoryId = req.params.scoringCategoryId;

        const body = req.body;

        const scoreById = await ScoreCategory.findOne({
            where: {
                scoreCategoryId: scoringCategoryId,
            }
        });
        if (!scoreById) {
            res.status(400).json({
                error: {
                    message: "Scoring Category not found to Update!"
                }
            });
            return;
        }
        const score = await ScoreCategory.update({
            ...(body.name && { name: body.name }),
            ...(body.scale && { scale: body.scale })
        }, {
            where: {
                scoreCategoryId: scoringCategoryId
            }
        }
        );

        return res.status(200).json({
            response_str: "Scoring Category updated successfully",
            response_data: score
        });

    }
    catch (err) {
        console.log("updateScoreCategory error - ", err);
        if (err.name === db.SequelizeUniqueConstraintError) {
            res.status(400).json({
                error: {
                    message: `Invalid. Scoring Category - ${req.body.name} is already available.`
                }
            });
            return;
        }
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
}


exports.deleteScoreCategory = async (req, res, next) => {
    try {
        await ScoreCategory.destroy({
            where: {
                scoreCategoryId: {
                    [db.Sequelize.Op.in]: req.scoreCategoryIds
                }
            },
            force: true
        });
        return res.status(200).json({
            response_str: "scoreCategory deleted successfully",
            response_data: {}
        });
    } catch (err) {
        console.log("deleteScoreCategory error - ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
}
