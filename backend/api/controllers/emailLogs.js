const db = require("../models");
const { Op } = require("sequelize");
const utils = require("../controllers/utils.js");
const { user } = require("../models");
const { emailLogs: emailLogs, project: Project, user: User } = db;


exports.deleteEmailLog = async (req, res) => {
    try {
        await emailLogs.destroy({
			where: {
				emailLogId: req.body.emailLogId,
			},
			force: false
		})
        .then(() => {
            res.status(201).json({
                response_str: "Email Log deleted successfully!"
            });
            return;
        })
        
    } catch (err) {
        console.log("deleteNote error - ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
};

exports.getEmailLogs = async (req, res) => {
    try {
        
        const results = await db.sequelize.query(
            `select u.firstName, u.lastname, u.PrefferedName, el.emailSubject, el.emailBody, el.dateSent from emailLogs el join users u on u.userId = el.receiverId where el.senderId=:senderId order by el.datesent desc;`,
            {
                replacements: {senderId : req.user.userId},
                type: db.Sequelize.QueryTypes.SELECT
            }
        )
        results.forEach(result => {
            result.name = result.firstName + " " + result.lastname;
            result.dateSent = (new Date(result.dateSent)).toLocaleString()
            
        });
        res.json({
            response_str: "Request details retrieved successfully",
            response_data: {
                response: results
            }
        })
        return;
    } catch (err) {
        console.log("getRequest error - ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
};
