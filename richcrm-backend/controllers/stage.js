const StageService = require('../db/stage/stage.service');
const CaseService = require('../db/case/case.service');
const TaskService = require('../db/task/task.service');
const UtilsController = require('./utils');

const Types = require('../db/types');
const { v4: uuidv4 } = require('uuid');

class StageController {

    async readStageByCaseIdAndStageType(req, res) {
        const { caseId } = req.params;
        const stageType = parseInt(req.params.stageType);
        try {
            const stages = await StageService.getStagesByCaseIdAndStageType(caseId, stageType);
            console.log(caseId, stageType, stages);
            if (stages === null || stages.length == 0) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[StageController][readStageByCaseIdAndStageType] No stages found'
                });
            }
            return res.status(200).json({
                status: "success",
                data: [{
                    stageId: stages[0].StageId,
                    stageType: stages[0].StageType,
                    caseId: stages[0].CaseId,
                    tasks: stages[0].Tasks,
                    stageStatus: stages[0].StageStatus
                }],
                message: '[StageController][readStageByCaseIdAndStageType] Stages found'
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[StageController][readStageByCaseIdAndStageType] Internal server error: ${error}`
            });
        }
    }

    async createStage(req, res) {
        const { caseId, stageType } = req.body;
        
        try {
            // Check if the caseId is valid
            const caseObj = await CaseService.readCase(caseId);
            if (caseObj === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[StageController][createStage] CaseId not found'
                });
            }

            // Check if the stageType is valid
            const stageTypeEnum = Types.castIntToEnum(Types.stage, stageType);
            if (stageTypeEnum === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[StageController][createStage] Invalid stageType'
                });
            }

            // Check if the stage already exists
            const stages = await StageService.getStagesByCaseIdAndStageType(caseId, stageType);
            if (stages !== null && stages.length > 0) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: `[StageController][createStage] Stage already exists. CaseId: ${caseId}. StageType: ${stageTypeEnum}`
                });
            }

            

            const stageId = uuidv4();
            // IMPORTANT: Generate new tasks for this stage
            var tasks = [];
            const taskConfigs = Types.stageDefaultTaskList[stageTypeEnum]
            for (let i = 0; i < taskConfigs.length; i++) {
                const taskId = uuidv4();
                const taskConfig = taskConfigs[i];
                // Check if the templates exists
                const templateTitles = await UtilsController.validateTemplates(taskConfig.templates);

                const taskObj = {
                    taskId: taskId,
                    taskType: taskConfig.taskType,
                    name: taskConfig.name,
                    status: taskConfig.status,
                    templates: templateTitles,
                };
                const t = await TaskService.createTask(taskObj);
                tasks.push(t.TaskId);
            }

            const stage = {
                stageId: stageId,
                stageType: stageType,
                caseId: caseId,
                tasks: tasks,
                stageStatus: Types.status.NOT_STARTED,
            };

            const s = await StageService.createStage(stage);
            if (s !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [{
                        stageId: s.StageId,
                        stageType: s.StageType,
                        caseId: s.CaseId,
                        tasks: s.Tasks,
                        stageStatus: s.StageStatus
                    }],
                    message: '[StageController][createStage] Stage created'
                });
            } else {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[StageController][createStage] Stage not created'
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[StageController][createStage] Internal server error: ${error}`
            });
        }
    }

    async updateStage(req, res) {
        const { stageId, stageStatus, newTask } = req.body;

        try {
            // Check if the stageId is valid
            const stage = await StageService.getStageById(stageId);
            if (stage === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[StageController][updateStage] Stage not found'
                });
            }

            var stageObj = {
                stageId: stageId,
                stageType: stage.StageType,
                caseId: stage.CaseId,
                tasks: stage.Tasks,
                stageStatus: stage.StageStatus
            };

            // Check if the stageStatus is valid
            if (stageStatus !== undefined) {
                const stageStatusEnum = Types.castIntToEnum(Types.status, stageStatus);
                if (stageStatusEnum === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[StageController][updateStage] Invalid stageStatus'
                    });
                }

                stageObj.stageStatus = stageStatus;
            }

            // Check if tasks are the same
            if (newTask !== undefined) {
                if (!stageObj.tasks.includes(newTask)) {
                    stageObj.tasks.push(newTask);
                }
            }

            
            const s = await StageService.updateStage(stageObj);
            if (s !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [{
                        stageId: s.StageId,
                        stageType: s.StageType,
                        caseId: s.CaseId,
                        tasks: s.Tasks,
                        stageStatus: s.StageStatus
                    }],
                    message: '[StageController][updateStage] Stage updated'
                });
            } else {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[StageController][updateStage] Stage not updated'
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[StageController][updateStage] Internal server error: ${error}`
            });
        }
    }

    async deleteStage(req, res) {
        const { stageId } = req.body;
        try {
            const stage = await StageService.getStageById(stageId);
            if (stage === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[StageController][deleteStage] Stage not found'
                });
            }

            const tasks = stage.Tasks;
            for (let i = 0; i < tasks.length; i++) {
                const t = await TaskService.deleteTask(tasks[i]);
                if (t === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[StageController][deleteStage] Task not deleted'
                    });
                }
            }

            const s = await StageService.deleteStage(stageId);
            if (s !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [],
                    message: '[StageController][deleteStage] Stage deleted'
                });
            } else {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[StageController][deleteStage] Stage not deleted'
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[StageController][deleteStage] Internal server error: ${error}`
            });
        }
    }
}

module.exports = new StageController();