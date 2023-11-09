const { projectType } = require("../models");
const db = require("../models");
const { projectType: ProjectType, scoreCategory: ScoreCategory} = db;

exports.addProjectType = async (req, res, next) => {
    try {
        const body = req.body;
        const projType = await ProjectType.create({
            projectType: body.project_type
        });
        req.scoreCategories.map((obj) => {projType.addScoreCategory(obj)});
        res.status(201).json({
			response_str: "ProjectType added successfully",
			response_data: {}
		});
		return;
	}
    catch (err) {
        console.log("addProjectType error - ", err);
        if (err.name === db.SequelizeUniqueConstraintError) {
            res.status(400).json({
                error: {
                    message: `Invalid. ProjectType - ${req.body.project_type} is already available.`
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
};

exports.getProjectType = async (req, res, next) => {
    try {
        const projectTypes = await ProjectType.findAll({
            include: [db.scoreCategory],
            order: [ [ 'createdAt', 'DESC' ]]
        });
        let response = [];
        projectTypes.forEach(projectType => {
            let info = projectType.getBasicInfo;
            info.scoring_categories = [];
            projectType.scoreCategories.forEach(category => {
                info.scoring_categories.push(category.getBasicInfo);
            });
            response.push(info);
        });
        if(projectTypes.length == 0 || projectTypes == null){
            return res.status(400).json({
                response_str: "No Project Type exists currently!"
            });
        }
        return res.status(200).json({
            response_str: "ProjectType details retrieved successfully",
            response_data: response
        });
    }
    catch (err) {
        console.log("getProjectType error - ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
};

exports.updateProjectType = async (req, res, next) => {
    try {

        const projectTypeId = req.params.projectTypeId;

        const body = req.body;

        const projectType = await ProjectType.findOne({
            where: {
                projectTypeId: projectTypeId,
            },
            include: [db.scoreCategory]
        });
        if (!projectType) {
            res.status(400).json({
                error: {
                    message: "Project Type not found to Update!"
                }
            });
            return;
        }

        const updatedProjectType = await ProjectType.update({
            ...(body.project_type && { projectType: body.project_type })
        }, {
            where: {
                projectTypeId: projectTypeId
            }
        }
        );

        let deleteCategoryMaps = [];
        projectType.scoreCategories.forEach(category => {
            if (!req.body.scoring_categories.includes(category.scoreCategoryId)) {
                deleteCategoryMaps.push(category.projectTypeScoreCategoryMaps);
            }
        });
        deleteCategoryMaps.forEach(async categoryMap => await categoryMap.destroy());

        req.scoreCategories.map((obj) => {projectType.addScoreCategory(obj)});
        return res.status(200).json({
            response_str: "Project Type updated successfully",
            response_data: {}
        });

    }
    catch (err) {
        console.log("updateProjectType error - ", err);
        if (err.name === db.SequelizeUniqueConstraintError) {
            res.status(400).json({
                error: {
                    message: `Invalid. ProjectType - ${req.body.project_type} is already available.`
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
};

exports.removeProjectType = async (req, res, next) => {
    try {
        await ProjectType.destroy({
            where: {
                projectTypeId: {
                    [db.Sequelize.Op.in]: req.projectTypeIds
                }
            },
            force: true
        });
        return res.status(200).json({
            response_str: "projectType deleted successfully",
            response_data: {}
        });
    } catch (err) {
        console.log("removeProjectType error - ", err);
        res.status(500).json({
            error: {
                message: "Internal server error!"
            }
        });
        return;
    }
}