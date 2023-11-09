const db = require("../models");
const fs = require("fs");
const utils = require("../controllers/utils.js");
const { judgeProjectMap, eventProjectMap, judgeEventMap } = require("../models");
const {
  user: User,
  judgeEventMap: JudgeEventMap,
  event: Event,
  judgeProjectMap: JudgeProjectMap,
  score: Score,
  project: Project,
  projectType: ProjectType,
  eventProjectMap: EventProjectMap,
  role: Role
} = db;

const Op = db.Sequelize.Op;


exports.createJudge = async (req, res, next) => {
  try {
    let userID;
    const body = req.body;
    const user = await User.create({
      email: body.email,
      firstName: body.first_name,
      middleName: utils.getdefaultValue(body.middle_name, ""),
      lastName: body.last_name,
      company: body.company,

    }).then(async (user) => {
      const role = await Role.findOne({ where: { name: db.UserRoles.Judge } });
      await user.addRole(role.Id);
      userID = user.dataValues.userId;
    });
    return res.status(201).json({
      response_str: "Judge added succesfully",
      response_data: {
        id: userID,
      },
    });
  } catch (err) {
    console.log("createJudge error - ", err);
    if (err.name === db.SequelizeUniqueConstraintError) {
      res.status(400).json({
        error: {
          message: `Invalid. Judge - ${req.body.email} is already available.`,
        },
      });
      return;
    }
    if (err.name === db.SequelizeValidationErrorItem) {
      res.status(400).json({
        error: {
          message: `Invalid email-id given.`,
        },
      });
      return;
    }
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

function getJudgeResp(judge, role) {
  try {
    let info = judge.getBasicInfo;
    info.events = [];
    if (role == db.UserRoles.Admin && judge.events.length > 0) {
      judge.events.forEach((event) => {
        let eventResp = event.getBasicInfo;
        eventResp.code = event.judgeEventMap.code;
        info.events.push(eventResp);
      });
    }
    info.key = info.user_id;
    return info;
  } catch (err) {
    console.log("getJudgeResp error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
}

exports.getJudges = async (req, res, next) => {
  try {
    if (req.query.event_id != undefined) {
      if (
        req.query.event_filter == undefined ||
        ![db.EventFilters.Include, db.EventFilters.Exclude].includes(
          req.query.event_filter
        )
      ) {
        res.status(400).json({
          error: {
            message: "Invalid filters passed!",
          },
        });
        return;
      }
    }

    let includeQuery = [];
    if (req.user.role == db.UserRoles.Admin) {
      includeQuery.push({
        model: db.event,
        where:
          req.query.event_id != undefined
            ? { eventId: req.query.event_id }
            : {},
        required: false,
      });
    }

    let judgeQuery = {};
    judgeQuery.role = db.UserRoles.Judge;
    if (req.query.email != undefined) {
      judgeQuery.email = req.query.email;
    }
    /*const judgeIds = await db.sequelize.query(
      `select distinct judgeId from judgeEventMaps;`,
      //`SELECT userId FROM users WHERE userId IN ( SELECT userId FROM userroles WHERE roleId = ( SELECT Id FROM roles WHERE name = 'JUDGE' ) );     `,
      {
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );*/
    const userIds = await db.sequelize.query(
      //`select distinct judgeId from judgeEventMaps;`,
      `SELECT userId FROM users WHERE userId IN ( SELECT userId FROM userRoles WHERE roleId = ( SELECT Id FROM roles WHERE name = 'JUDGE' ) );     `,
      {
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    let judgeIdarray = []

    userIds.forEach((id) => {
      judgeIdarray.push(id.userId);
    })
    //has all judges
    const judges = await User.findAll({
      where: { userId: { [Op.in]: judgeIdarray } },
      include: includeQuery,
    });

    let judgesResp = [];
    if (req.query.event_filter == db.EventFilters.Include) {
      const eveId = req.query.event_id;
      //find judges associated with selected event
      const addedJudges = await judgeEventMap.findAll({
        where: {
          judgeId: { [Op.in]: judgeIdarray }, eventId: eveId
        },
      });
      const getJudgesForSelectEvent = [];
      let idCodeDict = {};
      addedJudges.forEach((id) => {
        getJudgesForSelectEvent.push(id.judgeId),
          idCodeDict[id.judgeId] = id.code
      })
      
      //get judge info from user table
      const judgesForGivenEvent = await User.findAll({
        where: { userId: { [Op.in]: getJudgesForSelectEvent } },
        include: includeQuery,
      });

      judgesForGivenEvent.forEach((judge) => {
        if (judge.userId) {
        
          funcRet = getJudgeResp(judge, req.user.role);
          funcRet.code = idCodeDict[funcRet.user_id];
          judgesResp.push(funcRet);
        }
      });

    }
    //Get all the judges who aren't added to given event
    else if (req.query.event_filter == db.EventFilters.Exclude) {
      const eveId = req.query.event_id;

      //find judges associated with selected event
      const addedJudges = await judgeEventMap.findAll({
        where: {
          judgeId: { [Op.in]: judgeIdarray }, eventId: eveId
        },
      });

      const getJudgesForSelectEvent = []
      addedJudges.forEach((id) => { getJudgesForSelectEvent.push(id.judgeId) })

      //get judge info from user table
      const judgesForGivenEvent = await User.findAll({
        where: {
          [Op.and]: [
            { userId: { [Op.in]: judgeIdarray } },
            { userId: { [Op.notIn]: getJudgesForSelectEvent } }
          ]
        },
        include: includeQuery,
      });


      judgesForGivenEvent.forEach((judge) => {
        if (judge.userId) {
          judgesResp.push(getJudgeResp(judge, req.user.role));
        }
      });
    } else {
      judges.forEach((judge) =>{
      const ret = getJudgeResp(judge, req.user.role);
        judgesResp.push(ret);
      });

    }

    res.status(200).json({
      response_str: "Judge details retrieved successfully",
      response_data: judgesResp
    });
    return;
  } catch (err) {
    console.log("getJudges error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.updateJudge = async (req, res, next) => {
  try {
    const userID = req.user.userId;
    const judgeId = req.params.judgeId;
    const body = req.body;
    const judgebyId = await User.findOne({
      where: {
        userId: judgeId,
      },
    });
    if (!judgebyId) {
      res.status(400).json({
        error: {
          message: "Judge not found to Update!",
        },
      });
      return;
    }
    if (judgebyId.role == db.UserRoles.Judge) {
      const user = await User.update(
        {
          ...(body.email && { email: body.email.trim() }),
          ...(body.first_name && { firstName: body.first_name.trim() }),
          ...(body.last_name && { lastName: body.last_name.trim() }),
          ...(body.company && { company: body.company.trim() }),
        },
        {
          where: { userId: judgeId },
        }
      );

      return res.status(200).json({
        response_str: "Judge updated successfully",
        response_data: {},
      });
    }
  } catch (err) {
    console.log("updateJudge error - ", err);
    if (err.name === db.SequelizeUniqueConstraintError) {
      res.status(400).json({
        error: {
          message: `Invalid. User - ${req.body.email} is already available.`,
        },
      });
      return;
    }
    if (err.name === db.SequelizeValidationErrorItem) {
      res.status(400).json({
        error: {
          message: `Invalid email-id given.`,
        },
      });
      return;
    }
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.deleteJudge = async (req, res, next) => {
  try {
    await User.destroy({
      where: {
        userId: {
          [db.Sequelize.Op.in]: req.judgeIds,
        }
      },
      force: true,
    });
    return res.status(200).json({
      response_str: "Judge deleted successfully",
      response_data: {},
    });
  } catch (err) {
    console.log("deleteJudge error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.addScores = async (req, res) => {
  try {
    console.log("req.body = ", req.body);
    const eventProjectObj = await EventProjectMap.findOne({
      where: {
        eventId: req.body.eventId,
        projectId: req.params.projectId,
      },
    });
    const judge = await JudgeProjectMap.findOne({
      where: {
        judgeId: req.user.userId,
        eventProjectId: eventProjectObj.eventProjectId,
      },
      include: [db.score],
    });

    let existingScoreIds = [];
    judge.scores.forEach((score) => existingScoreIds.push(score.scoreId));
    if (existingScoreIds.length > 0) {
      await Score.destroy({
        where: {
          scoreId: {
            [db.Sequelize.Op.in]: existingScoreIds,
          },
        },
        force: true,
      });
    }

    req.body.scoring.map((obj) => {
      Score.add(
        obj.score,
        req.body.feedback,
        obj.score_category_id,
        judge.judgeProjectId
      );
    });
    res.status(201).json({
      response_str: "Scores posted succesfully",
      response_data: {},
    });
  } catch (err) {
    console.log("addScores error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.getProjects = async (req, res) => {
  try {
    const eventDetails = req.judge_event;
    let eventId=null;
    const judgeEventMap =  await JudgeEventMap.findOne({
          where:{
              judgeId:req.user.userId
              
          }
      }).then(found=>{
        if(found){
          // console.log("found = ", found);
          eventId = found.eventId;
        }
      });

    const results = await db.sequelize.query(
      `SELECT ep.projectId, ep.tableNumber, jp.judgeProjectId, scores.scoreId, scores.value, scores.feedback, scores.categoryId 
			from judgeProjectMaps jp join eventProjectMaps ep on jp.eventProjectId=ep.eventProjectId 
			 left join scores on scores.judgeProjectId=jp.judgeProjectId where jp.judgeId=:judgeId and ep.eventId=:eventId 
			 order by scores.scoreId`,
      {
        replacements: {
          judgeId: req.user.userId,
          eventId: eventId,
        },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );
    let projectScoreMap = {};
    const projectIds = new Set();
    results.forEach((result) => {
      projectIds.add(result.projectId);
      if (!projectScoreMap.hasOwnProperty(result.projectId)) {
        projectScoreMap[result.projectId] = {
          tableNumber: result.tableNumber,
          score: {},
        };
      }
      if (result.scoreId != null) {
        projectScoreMap[result.projectId].score[result.categoryId] = {
          value: result.value,
          feedback: result.feedback,
        };
      }
    });

    const projects = await Project.findAll({
      where: {
        projectId: {
          [db.Sequelize.Op.in]: Array.from(projectIds),
        },
      },
      include: [
        {
          model: db.projectType,
          include: {
            model: db.scoreCategory,
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    let projectMap = {};
    projects.forEach((project) => (projectMap[project.projectId] = project));

    let response = [];
    Array.from(projectIds).forEach((projectId) => {
      const project = projectMap[projectId];
      let info = project.getBasicInfo;
      info.table_number = projectScoreMap[project.projectId].tableNumber;
      info.scoring_categories = [];
      info.rated = false;
      info.feedback = "";
      info.eventId = eventId;
      // if(project.projectTypes.length>0 && project.projectTypes[0].scoreCategories){
      //   console.log("project.projectTypes[0].scoreCategories = ", project.projectTypes[0].scoreCategories);
      // }
      project.projectTypes.length>0 && project.projectTypes[0].scoreCategories && project.projectTypes[0].scoreCategories.forEach((category) => {
        let scoreInfo = category.getBasicInfo;
        scoreInfo.value = 0;
        if (
          projectScoreMap[project.projectId].score.hasOwnProperty(
            category.scoreCategoryId
          )
        ) {
          scoreInfo.value =
            projectScoreMap[project.projectId].score[
              category.scoreCategoryId
            ].value;
          info.feedback =
            projectScoreMap[project.projectId].score[
              category.scoreCategoryId
            ].feedback;
          info.rated = true;
        }
        info.scoring_categories.push(scoreInfo);
      });
      response.push(info);
    });

    res.status(200).json({
      response_str: "Projects retrieved succesfully",
      response_data: response,
    });
  } catch (err) {
    console.log("getProjects error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};

exports.regenerateCode = async (req, res) => {
  try {
    const judgeEventObj = await JudgeEventMap.findOne({
      where: {
        judgeId: req.params.judgeId,
        eventId: req.params.eventId,
      },
    });
    if (!judgeEventObj) {
      res.status(400).json({
        error: {
          message: "Invalid eventId or judgeId given!",
        },
      });
    }
    const judgeEvents = await JudgeEventMap.findAll();
    const existingCodes = [];
    judgeEvents.forEach((je) => existingCodes.push(je.code));
    const newCodes = utils.myRandomInts(1, existingCodes);
    judgeEventObj.code = newCodes[0];
    await judgeEventObj.save();

    const event = await Event.findByPk(req.params.eventId);
    const judge = await User.findByPk(req.params.judgeId);
    const emailContent = utils.getEventMailContent(event, judge, newCodes[0]);
    utils.sendEmail(emailContent.subject, emailContent.htmlBody, judge.email);

    res.status(200).json({
      response_str: "JudgeCode regenerated succesfully",
      response_data: {},
    });
  } catch (err) {
    console.log("regenerateCode error - ", err);
    res.status(500).json({
      error: {
        message: "Internal server error!",
      },
    });
    return;
  }
};
