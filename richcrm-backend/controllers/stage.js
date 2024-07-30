const StageService = require('../db/stage/stage.service');
const CaseService = require('../db/case/case.service');

const Types = require('../db/types');
const { v4: uuidv4 } = require('uuid');

class StageController {

    async readStageByCaseIdAndStageType(req, res) {
        const { caseId, stageType } = req.params;
        try {
            const stages = await StageService.getStagesByCaseIdAndStageType(caseId, stageType);
            if (stages === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[StageController][readStageByCaseIdAndStageType] No stages found'
                });
            }
            return res.status(200).json({
                status: "success",
                data: [{
                    stageId: stages.StageId,
                    stageType: stages.StageType,
                    caseId: stages.CaseId,
                    tasks: stages.Tasks,
                    stageStatus: stages.StageStatus
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

            const stageId = uuidv4();
            const stage = {
                stageId: stageId,
                stageType: stageType,
                caseId: caseId,
                tasks: [],
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

    async deleteStage(req, res) {
        const { stageId } = req.body;
        try {
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