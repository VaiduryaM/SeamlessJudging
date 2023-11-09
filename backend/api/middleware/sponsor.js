const db = require("../models");
var validator = require('validator');
const utils = require("../controllers/utils.js");
const { sponsor: Sponsor} = db;

checkRequestBody = (req, res, next) => {
    Sponsor.findOne({where :{name  : req.body.name}})
    .then(sponsor => {
        if(sponsor){
            if (req.params.sponsorId != sponsor.sponsorId) {
                res.status(400).json({
                    error: {
                        message: "Sponsor already Added" 
                    }
                });
                return;
            }
        }
        next();
    })
    .catch (err => {
        console.log("sponsor-checkRequestBody-middleware error - ", err);
        res.status(500).json({ 
            error: {
                message: "Internal server error!!"
            }
        });
        return;
    });
};

validateSponsorDeletion = async (req, res, next) => {
    try {
        req.sponsorIds = utils.getdefaultValue(req.body.ids, []);
        req.sponsorIds = req.sponsorIds instanceof Array ? req.sponsorIds : JSON.parse(req.sponsorIds);
        if (req.sponsorIds.length == 0) {
            res.status(400).json({
                error: {
                    message: "SponsorIds to delete cannot be empty!!" 
                }
            });
            return;
        }
        const results = await db.sequelize.query(`select * from sponsorEventMaps se where se.sponsorId IN (:sponsorIds)`,
        {
          replacements: {sponsorIds: req.sponsorIds},
          type: db.Sequelize.QueryTypes.SELECT,
        });
        if (results.length > 0) {
            res.status(400).json({
                error: {
                    message: "Sponsors cannot be deleted as they are attached to some events!!" 
                }
            });
            return;
        }
        next();
    } catch (err) {
        console.log("validateSponsorDeletion-middleware error - ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!!"
            }
        });
        return;
    }
};

const sponsor = {
	checkRequestBody: checkRequestBody,
    validateSponsorDeletion: validateSponsorDeletion
};

module.exports = sponsor;