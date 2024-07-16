const { deleteCase } = require('../db/case/case.db');
const CaseService = require('../db/case/case.service');
const Types = require("../db/types");

class CaseController {
    
    async createCase(req, res) {
        const {premisesId, clientType, buyerId, sellerId, stage, status} = req.body;
        if (premisesId === undefined) {
            console.log("[CASE-Create] Invalid premises id");
            return null;
        }
        // Check if the stage is valid
        const stageEnum = Types.castIntToEnum(Types.stage, stage);
        if (stageEnum === undefined) {
            console.log("[CASE-Create] Invalid stage");
            return null;
        }

        // Check if the status is valid
        const statusEnum = Types.castIntToEnum(Types.status, status);
        if (statusEnum === undefined) {
            console.log("[CASE-Create] Invalid status");
            return null;
        }

        // Check if the client type is valid
        const clientTypeEnum = Types.castIntToEnum(Types.clientType, clientType);
        if (clientTypeEnum === undefined) {
            console.log("[CASE-Create] Invalid client type");
            return null;
        }
        var caseId;
        switch (clientType) {
            case Types.clientType.BUYER:
                if (buyerId === undefined) {
                    console.log("[CASE-Create] Invalid buyer id");
                    return null;
                } else {
                    caseId = generateCaseId(clientType, buyerId, premisesId);
                    console.log(`[CASE-Create] Generated case id: ${caseId}`);
                }
                break;
            case Types.clientType.SELLER:
                if (sellerId === undefined) {
                    console.log("[CASE-Create] Invalid seller id");
                    return null;
                } else {
                    caseId = generateCaseId(clientType, sellerId, premisesId);
                    console.log(`[CASE-Create] Generated case id: ${caseId}`);
                }
                break;
            default:
                console.log("[CASE-Create] Invalid client type");
                return null;
        }
        try {
            const existingCase = await CaseService.readCase(caseId);
            if (existingCase !== null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Case already exists'
                });
            }
            const c = await CaseService.createCase({
                caseId,
                premisesId,
                stage,
                status,
                clientType,
                buyerId,
                sellerId,
                createAt: new Date()
            });
            if (c !== null) {
                res.status(200).json({
                    status: "success",
                    data: [c],
                    message: 'Case created successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Case creation failed'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: 'Internal server error'
            });
        }
        res.end();
    }

    async deleteCase(req, res) {
        const {caseId} = req.body;
        if (caseId === undefined) {
            console.log("[CASE-Delete] Invalid case id");
            return null;
        }
        try {
            const existingCase = await CaseService.readCase(caseId);
            if (existingCase === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Case does not exist'
                });
            }
            await CaseService.deleteCase(caseId);
            res.status(200).json({
                status: "success",
                data: [],
                message: 'Case deleted successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: 'Internal server error'
            });
        }
        res.end();
    }
}

const generateCaseId = (clientType, clientId, premisesId) => {
    console.log(`[CASE-Create] Generating case id for client type: ${clientTypeEnum}, client id: ${clientId}, premises id: ${premisesId}`);
    return `${clientType}-${clientId}-${premisesId}`;
}

module.exports = new CaseController();
