const db = require("../models");
const utils = require("../controllers/utils.js");
const { request: Request, project: Project, user: User } = db;

exports.addRequest = (req, res) => {
    try {
        Request.add(
            req.body.request_type,
            utils.getdefaultValue(req.body.requestor_remarks, ""),
            req.project.projectId,
            req.user.userId,
            db.RequestStatus.Requested)
            .then(() => {
                res.status(201).json({
                    response_str: "Request created successfully!",
                    response_data: {}
                });
                return;
            })
            .catch(err => {
                console.log("addRequest error - ", err);
                res.status(500).json({
                    error: {
                        message: "Internal server error!"
                    }
                });
                return;
            });
    } catch (err) {
        console.log("addRequest error - ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
};

exports.updateRequest = async (req, res) => {
    try {
        let request = req.request;
        const userId = req.request.userId;
        request.actorRemark = utils.getdefaultValue(req.body.admin_remarks, "");
        request.actionBy = userId;
        if (req.body.status === db.RequestStatus.Approve) {
            request.requestStatus = db.RequestStatus.Approved;
            const user = await User.findByPk(userId);
            req.project.addUser(user);
        } if (req.body.status === db.RequestStatus.Reject) {
            request.requestStatus = db.RequestStatus.Rejected;
        }
        request.save()
            .then(() => {
                res.status(200).json({
                    response_str: "Request updated successfully!",
                    response_data: {
                        project_id: 1
                    }
                });
                return;
            })
            .catch(err => {
                console.log("updateRequest error - ", err);
                res.status(500).json({
                    error: {
                        message: "Internal server error!"
                    }
                });
                return;
            });
    } catch (err) {
        console.log("updateRequest error - ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
};

// TODO []: role change
exports.getRequest = async (req, res) => {
    try {
        const results = await db.sequelize.query(
        `SELECT requests.*, projects.name, projects.projectId, users.firstName, users.lastName, users.email, 
        users.firstName, users.lastName, users.email from requests left join users 
        on requests.userId = users.userId left join projects on requests.projectId = projects.projectId 
        where requests.requestStatus = :status order by requests.createdAt`,
        {
            replacements: {status: req.query.status},
            type: db.Sequelize.QueryTypes.SELECT
        });
        let response = []
        for (const obj of results) {
            if ((req.user.role == db.UserRoles.Participant) && (obj.userId != req.user.userId)) {
                continue;
            }
            response.push({
                request_id: obj.requestId,
                requestor_remarks: obj.requestorRemarks,
                request_type: obj.requestType,
                status: obj.requestStatus,
                admin_remarks: obj.actorRemark,
                project_name: obj.name,
                project_id: obj.projectId,
                requestor: {
                    user_id: obj.userId,
                    first_name: obj.firstName,
                    last_name: obj.lastName,
                    email: obj.email
                }
            })
        };
        res.json({
            response_str: "Request details retrieved successfully",
            response_data: {
                response: response
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
