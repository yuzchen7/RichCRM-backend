const CaseService = require('../db/case/case.service');
const UserService = require('../db/user/user.service');
const Types = require("../db/types");

class CaseController {

    async readCase(req, res) {
        const {caseId} = req.params;
        if (caseId === undefined) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][readCase] Invalid case id'
            });
        }
        try {
            const c = await CaseService.readCase(caseId);
            if (c !== null) {
                res.status(200).json({
                    status: "success",
                    data: [{
                        "caseId": c.CaseId,
                        "premisesId": c.PremisesId,
                        "stage": c.Stage,
                        "status": c.Status,
                        "clientType": c.ClientType,
                        "buyerId": c.BuyerId,
                        "sellerId": c.SellerId,
                        "createAt": c.CreateAt,
                        "closingDate": c.ClosingDate
                    }],
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

    async readAllCasesByCreatorId(req, res) {
        const { creatorId } = req.body;
        try {
            var caseList = [];
            const cases = await CaseService.readAllCasesByCreatorId(creatorId);
            if (cases !== null) {
                cases.forEach(c => {
                    caseList.push({
                        "caseId": c.CaseId,
                        "creatorId": c.CreatorId,
                        "premisesId": c.PremisesId,
                        "stage": c.Stage,
                        "status": c.Status,
                        "clientType": c.ClientType,
                        "buyerId": c.BuyerId,
                        "sellerId": c.SellerId,
                        "createAt": c.CreateAt,
                        "closingDate": c.ClosingDate
                    });
                });
            }
            res.status(200).json({
                status: "success",
                data: caseList,
                message: '[CaseController][readAllCasesByCreatorId] Cases retrieved successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[CaseController][readAllCasesByCreatorId] Internal server error'
            });
        }
    }


    
    async createCase(req, res) {
        const {creatorId, premisesId, clientType, buyerId, sellerId, stage, status} = req.body;

        // Check if the creator id is valid
        if (creatorId === undefined) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][createCase] Invalid creator id'
            });
        } else {
            try {
                const creator = await UserService.readUser(creatorId);
                if (creator === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[CaseController][createCase] Creator does not exist'
                    });
                }
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][createCase] Internal server error'
                });
            }
        }

        if (premisesId === undefined) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][createCase] Invalid premises id'
            });
        }
        // Check if the stage is valid
        const stageEnum = Types.castIntToEnum(Types.stage, stage);
        if (stageEnum === undefined) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][createCase] Invalid stage'
            });
        }

        // Check if the status is valid
        const statusEnum = Types.castIntToEnum(Types.status, status);
        if (statusEnum === undefined) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][createCase] Invalid status'
            });
        }

        // Check if the client type is valid
        const clientTypeEnum = Types.castIntToEnum(Types.clientType, clientType);
        if (clientTypeEnum === undefined) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][createCase] Invalid client type'
            });
        }
        var caseId;
        switch (clientType) {
            case Types.clientType.BUYER:
                if (buyerId === undefined) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[CaseController][createCase] Invalid buyer id'
                    });
                } else {
                    caseId = generateCaseId(clientType, buyerId, premisesId);
                    console.log(`[CaseController][createCase] Generated case id: ${caseId}`);
                }
                break;
            case Types.clientType.SELLER:
                if (sellerId === undefined) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[CaseController][createCase] Invalid seller id'
                    });
                } else {
                    caseId = generateCaseId(clientType, sellerId, premisesId);
                    console.log(`[CaseController][createCase] Generated case id: ${caseId}`);
                }
                break;
            default:
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][createCase] Invalid client type'
                });
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
                creatorId,
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
                    data: [{
                        "caseId": c.CaseId,
                        "creatorId": c.CreatorId,
                        "premisesId": c.PremisesId,
                        "stage": c.Stage,
                        "status": c.Status,
                        "clientType": c.ClientType,
                        "buyerId": c.BuyerId,
                        "sellerId": c.SellerId,
                        "createAt": c.CreateAt
                    }],
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
        const {caseId, creatorId, stage, status, premisesId, closingDate} = req.body;

        // Check if the case id is valid
        if (caseId === undefined) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][updateCase] Invalid case id'
            });
        }

        // Check if the creator id is valid
        if (creatorId === undefined) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][updateCase] Invalid creator id'
            });
        } else {
            try {
                const creator = await UserService.readUser(creatorId);
                if (creator === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[CaseController][updateCase] Creator does not exist'
                    });
                }
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][updateCase] Internal server error'
                });
            }
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
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][updateCase] Invalid stage'
            });
        }

        // Check if the status is valid
        const statusEnum = Types.castIntToEnum(Types.status, status);
        if (statusEnum === undefined) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][updateCase] Invalid status'
            });
        }

        var newPremisesId = premisesId;
        if (newPremisesId === undefined) {
            newPremisesId = existingCase.PremisesId;
        }

        // Update the case
        try {
            const c = await CaseService.updateCase({
                caseId: caseId,
                creatorId: creatorId,
                premisesId: newPremisesId,
                stage: stage,
                status: status,
                closingDate: new Date(closingDate).toISOString()
            });
            if (c !== null) {
                res.status(200).json({
                    status: "success",
                    data: [{
                        "caseId": c.CaseId,
                        "creatorId": c.CreatorId,
                        "premisesId": c.PremisesId,
                        "stage": c.Stage,
                        "status": c.Status,
                        "clientType": c.ClientType,
                        "buyerId": c.BuyerId,
                        "sellerId": c.SellerId,
                        "createAt": c.CreateAt,
                        "closingDate": c.ClosingDate
                    }],
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
