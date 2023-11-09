const db = require("../models");
const fs = require('fs');
const utils = require("../controllers/utils.js");
const { sponsor: Sponsor, event: Event } = db;

const Op = db.Sequelize.Op;


exports.createSponsor = async (req, res, next) => {
    try {

        let logoPath = "";
        if (req.file) {
            let fileType = "." + req.file.originalname.split('.').pop().trim();
            logoPath = utils.uploadFile(req.file.path, fileType);
        }

        const userID = req.user.userId;
        const sponsor = await Sponsor.create({
            name: req.body.name,
            logo: logoPath

        })
        return res.status(200).json({
            response_str: "Sponsor added succesfully",
            response_data: {
                id: sponsor.sponsorId,
            }
        })

    }
    catch (err) {
        console.log("createSponsor error - ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
}


exports.getSponsors = async (req, res, next) => {
    try {
        let response = [];
        let includeQuery = [];
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
        let sponsorQuery = {};
        if (req.query.name != undefined) {
            sponsorQuery.name = req.query.name;
        }
        const sponsors = await Sponsor.findAll({
            where: sponsorQuery,
            include: includeQuery
        });
        if(req.query.event_filter== db.EventFilters.Include) {
            sponsors.map((obj) => {
                if(obj.events.length>0){
                    response.push(obj.getBasicInfo);
                }
            });
        } else if (req.query.event_filter== db.EventFilters.Exclude) {
            sponsors.map((obj) => {
                if(obj.events.length===0){
                    response.push(obj.getBasicInfo);
                }
            });
        } else {
            sponsors.forEach(function (sponsor) {
                response.push(sponsor.getBasicInfo);
            });
        }
         return res.status(200).json({
            response_str: "Sponsor details retrieved successfully",
            response_data: response
            });
    }
    catch (err) {
        console.log("getSponsors error - ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
}


exports.updateSponsor = async (req, res, next) => {
    try {
        const userID = req.user.userId;
        const sponsorId = req.params.sponsorId;
        const body = req.body;
        
        const sponsorById = await Sponsor.findOne({
            where: {
                sponsorId: sponsorId,
            }
        });
        if (!sponsorById) {
            res.status(400).json({
                error: {
                    message: "Sponsor not found to Update!"
                }
            });
            return;
        }

        let tempFilePath = "";
        if (req.file) {
            tempFilePath = sponsorById.logo;
            let fileType = "." + req.file.originalname.split('.').pop().trim();
            sponsorById.logo = utils.uploadFile(req.file.path, fileType);
        }

        if (req.body.name != "" && req.body.name != undefined) {
            sponsorById.name = req.body.name;
        }
        await sponsorById.save();

        if (tempFilePath != "") {
            try {
                fs.unlinkSync(tempFilePath); //remove old file from server
            } catch (err) {
                console.log(`Failed to delete file from folder - ${tempFilePath} - ${err}`);
            }
        }

        res.status(200).json({
            response_str: "Sponsor updated successfully",
            response_data: {
                sponsor_id: sponsorById.sponsorId
            }
        });
        return;
    }
    catch (err) {
        console.log("updateSponsor error - ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
}


exports.deleteSponsor = async (req, res, next) => {
    try {
        await Sponsor.destroy({
            where: {
                sponsorId: {
                    [db.Sequelize.Op.in]: req.sponsorIds
                }
            },
            force: true
        });
        return res.status(200).json({
            response_str: "Sponsors deleted successfully",
            response_data: {}
        });
    } catch (err) {
        console.log("deleteSponsor error - ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
}

