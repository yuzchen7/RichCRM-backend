const CaseService = require('../db/case/case.service');
const Types = require("../db/types");

class CaseController {

    async readCase(req, res) {
        const {caseId} = req.body;
        if (caseId === undefined) {
            console.log("[CaseController][readCase] Invalid case id");
            return null;
        }
        try {
            const c = await CaseService.readCase(caseId);
            if (c !== null) {
                res.status(200).json({
                    status: "success",
                    data: [c],
                    message: '[CaseController][readCase] Case retrieved successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][readCase] Case does not exist'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[CaseController][readCase] Internal server error'
            });
        }
    }
    
    async createCase(req, res) {
        const {premisesId, clientType, buyerId, sellerId, stage, status} = req.body;
        if (premisesId === undefined) {
            console.log("[CaseController][createCase] Invalid premises id");
            return null;
        }
        // Check if the stage is valid
        const stageEnum = Types.castIntToEnum(Types.stage, stage);
        if (stageEnum === undefined) {
            console.log("[CaseController][createCase] Invalid stage");
            return null;
        }

        // Check if the status is valid
        const statusEnum = Types.castIntToEnum(Types.status, status);
        if (statusEnum === undefined) {
            console.log("[CaseController][createCase] Invalid status");
            return null;
        }

        // Check if the client type is valid
        const clientTypeEnum = Types.castIntToEnum(Types.clientType, clientType);
        if (clientTypeEnum === undefined) {
            console.log("[CaseController][createCase] Invalid client type");
            return null;
        }
        var caseId;
        switch (clientType) {
            case Types.clientType.BUYER:
                if (buyerId === undefined) {
                    console.log("[CaseController][createCase] Invalid buyer id");
                    return null;
                } else {
                    caseId = generateCaseId(clientType, buyerId, premisesId);
                    console.log(`[CaseController][createCase] Generated case id: ${caseId}`);
                }
                break;
            case Types.clientType.SELLER:
                if (sellerId === undefined) {
                    console.log("[CaseController][createCase] Invalid seller id");
                    return null;
                } else {
                    caseId = generateCaseId(clientType, sellerId, premisesId);
                    console.log(`[CaseController][createCase] Generated case id: ${caseId}`);
                }
                break;
            default:
                console.log("[CaseController][createCase] Invalid client type");
                return null;
        }
        try {
            const existingCase = await CaseService.readCase(caseId);
            if (existingCase !== null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][createCase] Case already exists'
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
                createAt: new Date().toISOString()
            });
            if (c !== null) {
                res.status(200).json({
                    status: "success",
                    data: [c],
                    message: '[CaseController][createCase] Case created successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][createCase] Case creation failed'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[CaseController][createCase] Internal server error'
            });
        }
        res.end();
    }

    async updateCase(req, res) {
        const {caseId, stage, status, premisesId, closingDate} = req.body;

        if (caseId === undefined) {
            console.log("[CaseController][updateCase] Invalid case id");
            return null;
        }

        // Get the existing case
        const existingCase = await CaseService.readCase(caseId);
        if (existingCase === null) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][updateCase] Case does not exist'
            });
        }

        // Check if the stage is valid
        const stageEnum = Types.castIntToEnum(Types.stage, stage);
        if (stageEnum === undefined) {
            console.log("[CaseController][updateCase] Invalid stage");
            return null;
        }

        // Check if the status is valid
        const statusEnum = Types.castIntToEnum(Types.status, status);
        if (statusEnum === undefined) {
            console.log("[CaseController][updateCase] Invalid status");
            return null;
        }

        var newPremisesId = premisesId;
        if (newPremisesId === undefined) {
            newPremisesId = existingCase.PremisesId;
        }

        // Update the case
        try {
            const c = await CaseService.updateCase({
                caseId: caseId,
                premisesId: newPremisesId,
                stage: stage,
                status: status,
                closingDate: new Date(closingDate).toISOString()
            });
            if (c !== null) {
                res.status(200).json({
                    status: "success",
                    data: [c],
                    message: '[CaseController][updateCase] Case updated successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][updateCase] Case update failed'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[CaseController][updateCase] Internal server error'
            });
        }
    }

    async deleteCase(req, res) {
        const {caseId} = req.body;
        if (caseId === undefined) {
            console.log("[CaseController][deleteCase] Invalid case id");
            return null;
        }
        try {
            const existingCase = await CaseService.readCase(caseId);
            if (existingCase === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][deleteCase] Case does not exist'
                });
            }
            await CaseService.deleteCase(caseId);
            res.status(200).json({
                status: "success",
                data: [],
                message: '[CaseController][deleteCase] Case deleted successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[CaseController][deleteCase] Internal server error'
            });
        }
        res.end();
    }
}

const generateCaseId = (clientType, clientId, premisesId) => {
    console.log(`[CaseController][generateCaseId] Generating case id for client type: ${clientType}, client id: ${clientId}, premises id: ${premisesId}`);
    return `${clientType}-${clientId}-${premisesId}`;
}

module.exports = new CaseController();
