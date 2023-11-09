const db = require("../models");
const fs = require('fs');
const { winnerCategory: WinnerCategory } = db;

const Op = db.Sequelize.Op;


exports.createWinnerCategory = async (req, res, next) => {
    try {
        const body = req.body;
        const winner = await WinnerCategory.create({
            name: body.name
        })
        return res.status(201).json({
            response_str: "WinnerCategory added succesfully",
            response_data: {
                id: winner.winnerCategoryId,
            }
        })

    }
    catch (err) {
        console.log("createWinnerCategory error - ", err);
        if (err.name === db.SequelizeUniqueConstraintError) {
            res.status(400).json({
                error: {
                    message: `Invalid. Winner Category - ${req.body.name} is already available.`
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


exports.getWinnerCategories = async (req, res, next) => {
    try {
        let response = [];
        let includeQuery = [];
        const name = req.query.name;
        if (req.query.event_id != undefined) {
            if ((req.query.event_filter == undefined) || 
            !([db.EventFilters.Include, db.EventFilters.Exclude].includes(req.query.event_filter))) {
                res.status(400).json({
                    error: {
                        message: "Invalid filters passed!"
                    }
                });
                return;
            }
            includeQuery = [{
                model: db.event,
                where: {
                    eventId: req.query.event_id
                },
                required: false
            }]
        }
        let winninCategoryQuery = {};
        if (req.query.name != undefined) {
            winninCategoryQuery.name = req.query.name;
        }
        const winners = await WinnerCategory.findAll({
            where: winninCategoryQuery,
            include: includeQuery
        });
        if(req.query.event_filter== db.EventFilters.Include) {   
            winners.map((obj) => {
                if(obj.events.length>0){
                    response.push(obj.getBasicInfo);
                }
            });
        } else if (req.query.event_filter== db.EventFilters.Exclude) {
            winners.map((obj) => {
                if(obj.events.length===0){
                    response.push(obj.getBasicInfo);
                }
            });
        } else {
            winners.forEach(function (winner) {
                response.push(winner.getBasicInfo);
            });
        }
         return res.status(200).json({
            response_str: "WinnerCategory details retrieved successfully",
            response_data: response
            });
    }
    catch (err) {
        console.log("getWinnerCategories error - ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
}


exports.updateWinnerCategory = async (req, res, next) => {
    try {

        const winnerCategoryId = req.params.winnerCategoryId;

        const body = req.body;

        const winnerById = await WinnerCategory.findOne({
            where: {
                winnerCategoryId: winnerCategoryId,
            }
        });
        if (!winnerById) {
            res.status(400).json({
                error: {
                    message: "Winner Category not found to Update!"
                }
            });
            return;
        }
        const winner = await WinnerCategory.update({
            ...(body.name && { name: body.name }),
            ...(body.scale && { scale: body.scale })
        }, {
            where: {
                winnerCategoryId: winnerCategoryId
            }
        }
        );

        return res.status(201).json({
            response_str: "Winner Category updated successfully",
            response_data: winner
        });

    }
    catch (err) {
        console.log("updateWinnerCategory error - ", err);
        if (err.name === db.SequelizeUniqueConstraintError) {
            res.status(400).json({
                error: {
                    message: `Invalid. Winner Category - ${req.body.name} is already available.`
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


exports.deleteWinnerCategory = async (req, res, next) => {
    try {
        await WinnerCategory.destroy({
            where: {
                winnerCategoryId: {
                    [db.Sequelize.Op.in]: req.winnerCategoryIds
                },
            },
            force: true
        });
        return res.status(200).json({
            response_str: "WinnerCategory deleted successfully",
            response_data: {}
        });
    } catch (err) {
        console.log("deleteWinnerCategory error - ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
}
