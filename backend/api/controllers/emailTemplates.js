const db = require("../models");
const moment = require("moment");

const { Op } = require("sequelize");
const utils = require("../controllers/utils.js");
const { user, judgeEventMap } = require("../models");
const { getEventListeners } = require("events");
const { emailTemplates: emailTemplates, emailLogs: emailLogs} = db;


exports.getEmailTemplates = async (req, res) => {
    try {
        const results = await emailTemplates.findAll();
        
        res.json({
            response_str: "Email Templates retrieved successfully",
            response_data: {
                response: results
            }
        })
        return;
    } catch (err) {
        console.log("getEmailTemplates error - ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
};


// req body = {"title": "a string", "subject": "subject string", "body": "body string"}
exports.addEmailTemplate = (req, res) => {
    try {
        emailTemplates.add(
            req.body.title,
            req.body.subject,
            req.body.body)
            .then((template) => {
                res.status(201).json({
                    response_str: "New Email Template created successfully!",
                    response_data: {template_id: template.emailTemplateId}
                });
                return;
            });
    } catch (err) {
        console.log("addEmailTemplate error out- ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
};

// req body = { "emailTemplateId": 1, "title": "a string", "subject": "subject string", "body": "body string"}
exports.updateEmailTemplate = async (req, res) => {
    try {
        await emailTemplates.update({
            title : req.body.title,
            emailSubject: req.body.subject,
            emailBody: req.body.body,

        },{
            where: {
                emailTemplateId : req.body.emailTemplateId
            }
        })
        .then((template) => {
            res.status(201).json({
                response_str: "Email Template updated successfully!",
            });
            return;
        })
        
    } catch (err) {
        console.log("updateEmailTemplate error - ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
};

// req is body : {"emailTemplateIds": [array of emailTemplateId]}
exports.deleteEmailTemplate = async (req, res) => {
    try {
        const emailTemplateIds = req.body.emailTemplateIds
        for(let emailTemplateId of emailTemplateIds){
            await emailTemplates.destroy({
                where: {
                    emailTemplateId : emailTemplateId
                }
            })
            .catch((err)=>{
                console.log("deleteEmailTemplate error - ", err);
                res.status(500).json({
                    error: {
                        message: "Internal server error!"
                    }
                });
            })    
        }
        
        
        res.status(201).json({
            response_str: "Template(s) deleted successfully!"
        });
        return;
    
        
    } catch (err) {
        console.log("deleteEmailTemplate error - ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
};

const Keywords = {
	UserName: "{~User Name~}" ,
	UserDetails: "{~User Details~}",
	Token: "{~Token~}", 		
	UserRoles: "{~User Roles~}",
	StudentProjects: "{~Student Projects~}",
	ClientProjects: "{~Client Projects~}",
	Events: "{~Events~}",
	JudgeEvents: "{~Judge Events~}",
	JudgeProjects: "{~Judge Projects~}",
	InstructorDetails: "{~Instructor Details~}"
}

const getUserNameText = async (userId) => {
    let result = await db.user.findByPk(userId).then(userId => userId.getBasicInfo);
    let text = utils.getdefaultValue(result.PrefferedName, result.userName);
    text = text ? text : result.email;
    return text;
};

const getUserDetails = async (userId) => {
    let result = await db.user.findByPk(userId).then(userId => userId.getBasicInfo);
    let name = utils.getdefaultValue(
        utils.getdefaultValue(result.PrefferedName, result.userName), "N/A");
    let text = "User Name: " + name
                + " Email: " + result.email 
                + " Preferred Name: " + utils.getdefaultValue(result.PrefferedName, "N/A") 
                + " Github: " + utils.getdefaultValue(result.Github, "N/A") ;
    return text;
};

const getToken = async (userId) => {
    let result  = await db.user.findByPk(userId);
    let text    = utils.getdefaultValue(result.tokenNo ,"N/A");
    return "Token: " + text;
}


const getUserRoles = async (userId) => {
    let {semester, year} = utils.getSemester(new Date());
    
    const user = await User.findByPk(userId);
    const roles = utils.getRolesArray(user);
    
    let text = roles.join(", ");
    return text;
}


const getProjectsByRole = async (userId, roleName) => {
    let resultText= "";
    let throughAttributes = [] // for students we wish to also get the status of student related to the project
    if(roleName === db.UserRoles.Student){
        throughAttributes.push("status");
    }
    
    const role = await db.role.findOne({where:{name:roleName}});
    await db.project.findAll(
        {
            include:
                {
                    model: db.userRole,
                    required: true,
                    where:{
                        userId: userId,
                        roleId: role.Id
                    },
                    through: {
                        attributes: throughAttributes
                    },
                    
                }
        }
    ).then(async res => {
        if (res==null || res.length == 0){
            resultText += "<br>N/A<br>"
        }
        else {
            resultText = "Projects: <br>"
            for (const project of res){
                resultText+="Project: "+project["name"]+"<br>";
                if(roleName === db.UserRoles.Student){
                    resultText+="status: "+ project.userRoles[0].userRoleCourse.status+"<br>";
                }
            }
            
        }
    });
    return resultText;
    
}


const getEvents = async (userId) => {
    let result = await db.event.findAll();
    let text = "Event: " + result.name 
                + " Location: " + utils.getdefaultValue(result.location, "N/A" )
                + " description: " + utils.getdefaultValue(result.description, "N/A")
    return text;
}

const getJudgeEvents = async (userId) => {
    let result = await db.sequelize.query(
        `SELECT e.name, e.location, e.startDate, e.endDate, e.description, jem.code from events e join judgeEventMaps jem on e.eventId=jem.eventId where jem.judgeId=:judgeId`,
        {
            replacements: { judgeId: userId },
            type: db.Sequelize.QueryTypes.SELECT,
        }
    );

    const table_head = `<table style="width:42%">`
    const table_tail = `</table>`
    let text = ``

    for(let iResult of result){
        
        const eventName = iResult.name;
        
        const location = utils.getdefaultValue(iResult.location, "N/A" );
        
        const startTime = moment(result[0].startDate)
        .tz("America/New_York")
        .format("dddd, MMMM Do YYYY h:mm A z");
        
        const endTime = moment(iResult.endDate)
        .tz("America/New_York")
        .format("dddd, MMMM Do YYYY h:mm A z");           

        text +=  
                `<tr>
                    <th>Event:</th>
                    <td colspan="2">${eventName}</td>
                </tr>
                <tr>
                    <th>Where</th>
                    <td colspan="2">${location}</td>
                </tr>
                <tr>
                    <th rowspan="2">Schedule</th>
                    <th>Starts</th>
                    <td>${startTime}</td>
                </tr>
                <tr>
                    <th>Ends</th>
                    <td>${endTime}</td>
                </tr>`


    }
    
              
        
    return table_head + text + table_tail;
}

const getJudgeProjects = async (userId) => {
    
    let values = await db.sequelize.query(
        `select c.name projectName, d.name eventName, d.location, b.tableNumber  from judgeProjectMaps a 
        inner join  eventProjectMaps b on a.eventProjectId  = b.eventProjectid
        inner join projects c on b.projectId = c.projectId
        inner join events d on b.eventId = d.eventId
        where c.deletedAt is null and d.deletedAt is null and a.judgeId = :user`,
        {
            replacements: { user: userId },
            type: db.Sequelize.QueryTypes.SELECT,
        }
    ).then(async res => {
        if (!res[0]){
            await judgeEventMap.findOne({
                where:{
                    judgeId:userId
                }
            }).then(found=>{
                if (!found){
                    resultText = "(Not a Judge)";
                }
                else {
                    resultText = "You have not been invited to an event yet or have not been assigned any projects to judge";
                }
            });
        }
        else {
            resultText = "Projects<br>"
            for (var i=0; i<res.length;i++){
                resultText+="Project Name: "+res[i]["projectName"]+"; Event Name: "+res[i]["eventName"]+"; Location: "+res[i]["location"]+"; Table Number: "+res[i]["tableNumber"]+"<br>";
            }
        }
        

    });
    return resultText;
}

const getInstructorDetails = async (userId) => {
    const role = await db.role.findOne({where:{name:db.UserRoles.Instructor}});
    await db.courseCode.findAll(
        {
            include:{
                model: db.userRoleCourse,
                required: true,
                include:[
                    {
                        model: db.userRole,
                        where:{
                            userId: userId,
                            roleId: role.Id
                        }
                    }

                ]
            }
        }
    ).then(async res => {
        
        if (res==null || res.length == 0){
            resultText += "<br>N/A<br>"
        }
        else {
            resultText = "Associated courses: <br>"
            for (course of res){
                resultText+="Course code: "+course["code"]+"; Course Name: "+course["name"]+"<br><br>";
            }
        }
        
    });
    return resultText;
}

const getReplacementText = async (keyword, userId) => {

    let content;
    switch(keyword){
        case Keywords.UserName:
            content = await getUserNameText(userId);
            break;
        case Keywords.UserDetails:
            content = await getUserDetails(userId);
            break;
        case Keywords.Token:
            content = await getToken(userId);
            break;
        case Keywords.UserRoles:
            content = await getUserRoles(userId);
            break;
        case Keywords.StudentProjects:
            content = await getProjectsByRole(userId, db.UserRoles.Student);
            break;
        case Keywords.ClientProjects:
            content = await getProjectsByRole(userId, db.UserRoles.Client);
            break;
        case Keywords.Events:
            content = await getEvents(userId);
            break;
        case Keywords.JudgeEvents:
            content = await getJudgeEvents(userId);
            break;
        case Keywords.JudgeProjects:
            content = await getJudgeProjects(userId);
            break;
        case Keywords.InstructorDetails:
            content = await getInstructorDetails(userId);
            break;
        default:
            content = "N/A"                                                                                    
    }
    return content;
   
};


exports.getEmailContent = async (userId, emailContent, seenKeywords) => {

    let replacedTextSubject = emailContent.subject ;
    let replacedTextBody     = emailContent.htmlBody ;
    let replacedEmailContent = {};
    
    for (let keyword of seenKeywords){
        let text = await getReplacementText(keyword, userId);
        replacedTextSubject = await replacedTextSubject.replaceAll(keyword, text);
        replacedTextBody = await replacedTextBody.replaceAll(keyword, text);
    }

    replacedEmailContent.subject    = replacedTextSubject;
    replacedEmailContent.htmlBody   = replacedTextBody;
	return replacedEmailContent;
};

const saveEmailLog = async (senderId, receiverId, replacedEmailContent) => {
    try{
        await emailLogs.add(
            senderId,
            receiverId,
            replacedEmailContent.subject,
            replacedEmailContent.htmlBody,
            new Date().toISOString().replace("T", " ")
        );
    }
    catch{
        console.log("savingEmailLogs error - ");
        res.status(500).json({
            error: {
                message: "Internal server error! Saving Emaillogs failed."
            }
        });
        return;
    }
}

/* req body is
 {  emailIds: ["user3@buffalo.edu", "user4@buffalo.edu"],
    emailSubject: "some text",
    emailBody : "email body text"
   }}
*/
exports.sendEmailByTemplate = async (req, res) => {
    try{
        

        let { semester, year } = utils.getSemester(new Date());
        const emailIds = req.body.emailIds.map(Email => Email.trim());
        let allUsers = []
        let non_users = []
        
        // user existence validation for client representatives
        for (let userItr = 0; userItr < emailIds.length; userItr++) {
        await user.findOne({where: {email: emailIds[userItr]}})
        .then(async Auser => {
            if(!Auser){
                non_users.push(emailIds[userItr]);
            }
            else{
                allUsers.push(Auser);
            }});
        }

        
        if (non_users.length > 0){
        non_users = non_users.map(Email => " " + Email);
        return res.status(400).json({
            error: {
            message: "User(s) not in system: " + non_users.toString(),
            response: non_users,
            },
        });
        }
        
        const keyword_regex= /\{~(.*?)~\}/g;
        let content = {};
        content.subject  = req.body.emailSubject;
        content.htmlBody = req.body.emailBody;
        
        let keywords_subject = content.subject.match(keyword_regex);
        let keywords_body   = content.htmlBody.match(keyword_regex);
        let seenKeywords = new Set();
        if (keywords_subject) keywords_subject.map(item => seenKeywords.add(item));
        if (keywords_body) keywords_body.map(item => seenKeywords.add(item));
        seenKeywords = [...seenKeywords]
        
        for(let user of allUsers) {
            
            let receiverId = user.dataValues.userId;
            let receiverEmail = user.dataValues.email;

            if(seenKeywords.length === 0){
                utils.sendEmail(content.subject, content.htmlBody, receiverEmail);
                saveEmailLog(req.user.userId, receiverId, content);
            }
            else{
                let replacedEmailContent = await this.getEmailContent(receiverId, content, seenKeywords);
                // send email via nodemailer
                utils.sendEmail(replacedEmailContent.subject, replacedEmailContent.htmlBody, receiverEmail);
                saveEmailLog(req.user.userId, receiverId, replacedEmailContent)
            }
            
        }
        
        res.status(201).json({
            response_str: "New Emails sent!",
        });
        return;
    }
    catch(err){
        console.log("sendEmailByTemplate error out- ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
};