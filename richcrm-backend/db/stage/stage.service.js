const Stage = require('./stage.db');

class StageService {
    async getStageById(stageId) {
        const data = await Stage.getStageById(stageId);

        if (data.Item !== undefined) {
            return data.Item;
        }

        return null;
    }

    async getStagesByCaseId(caseId) {
        const data = await Stage.getStagesByCaseId(caseId);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async getStagesByCaseIdAndStageType(caseId, stageType) {
        const data = await Stage.getStagesByCaseIdAndStageType(caseId, stageType);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async createStage(stage) {
        // Check if the stage object is valid
        if (stage.stageId === undefined ||
            stage.stageType === undefined ||
            stage.caseId === undefined ||
            stage.tasks === undefined ||
            stage.stageStatus === undefined) {
            console.log("[STAGE-Create] Invalid stage object");
            return null;
        }

        const data = await Stage.createStage(stage);
        return data;
    }

    async updateStage(stage) {
        // Check if the stage object is valid
        if (stage.stageId === undefined ||
            stage.stageStatus === undefined) {
            console.log("[STAGE-Update] Invalid stage object");
            return null;
        }

        const data = await Stage.updateStage(stage);
        return data;
    }

    async deleteStage(stageId) {
        // Check if the stage ID is valid
        if (stageId === undefined) {
            console.log("[STAGE-Delete] Invalid stage ID");
            return null;
        }

        const data = await Stage.deleteStage(stageId);
        return data;
    }
}

module.exports = new StageService();