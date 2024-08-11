const CaseService = require('../db/case/case.service');
const UserService = require('../db/user/user.service');
const PremisesService = require('../db/premises/premises.service');
const ClientService = require('../db/client/client.service');
const StageService = require('../db/stage/stage.service');
const StageController = require('./stage');
const Types = require("../db/types");

class CaseController {

    constructor () {
        this.createCase = this.createCase.bind(this);
        this.updateCase = this.updateCase.bind(this);
        this.deleteCase = this.deleteCase.bind(this);
    }

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
        const {creatorId, premisesId, clientType, buyerId, sellerId, stage} = req.body;

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

        // Check if the premises id is valid
        try {
            const premises = await PremisesService.readPremises(premisesId);
            if (premises === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][createCase] Premises does not exist'
                });
            }
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: '[CaseController][createCase] readPremises internal server error'
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

        // Check if the client type is valid
        const clientTypeEnum = Types.castIntToEnum(Types.clientType, clientType);
        if (clientTypeEnum === undefined) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][createCase] Invalid client type'
            });
        }

        // Check if the buyerId / SellerId is valid -> Generate caseId
        var caseId;
        try {
            switch (clientType) {
                case Types.clientType.BUYER:
                    const buyer = await ClientService.readClient(buyerId);
                    if (buyerId === undefined || buyer === null) {
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
                    const seller = await ClientService.readClient(sellerId);
                    if (sellerId === undefined || seller === null) {
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
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: '[CaseController][createCase] readClient internal server error'
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
                clientType,
                buyerId,
                sellerId,
                createAt: new Date().toISOString()
            });
            if (c !== null) {

                // Create the stage
                var stageObj;
                const stageRet = await StageController.createStageByCaseIdAndStageType(c.CaseId, c.Stage);
                if (stageRet.status === "success") {
                    console.log(`[CaseController][createCase] Stage created successfully`);
                    stageObj = stageRet.data[0];
                } else {
                    await CaseService.deleteCase(c.CaseId);
                    return res.status(400).json(stageRet);
                }

                res.status(200).json({
                    status: "success",
                    data: [{
                        "caseId": c.CaseId,
                        "creatorId": c.CreatorId,
                        "premisesId": c.PremisesId,
                        "stage": c.Stage,
                        "stageId": stageObj.stageId,
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
            await CaseService.deleteCase(caseId);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[CaseController][createCase] Internal server error: ${error}`
            });
        }
        res.end();
    }

    async updateCase(req, res) {
        const {caseId, creatorId, stage, premisesId, closingDate} = req.body;

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
        // Update the stage
        var stageObj;
        if (stage !== existingCase.Stage) {
            const stageRet = await StageController.createStageByCaseIdAndStageType(existingCase.CaseId, stage);
            if (stageRet.status === "success") {
                console.log(`[CaseController][createCase] Stage created successfully`);
                stageObj = stageRet.data[0];
            } else {
                return res.status(400).json(stageRet);
            }
        } else {
            const stages = await StageService.getStagesByCaseIdAndStageType(existingCase.CaseId, stage);
            if (stages === null || stages.length === 0) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][updateCase] Stage does not exist'
                });
            } else {
                stageObj = stages[0];
            }
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
                closingDate: new Date(closingDate).toISOString()
            });
            if (c !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [{
                        "caseId": c.CaseId,
                        "creatorId": c.CreatorId,
                        "premisesId": c.PremisesId,
                        "stage": c.Stage,
                        "stageId": stageObj.stageId,
                        "clientType": c.ClientType,
                        "buyerId": c.BuyerId,
                        "sellerId": c.SellerId,
                        "createAt": c.CreateAt,
                        "closingDate": c.ClosingDate
                    }],
                    message: '[CaseController][updateCase] Case updated successfully'
                });
            } else {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][updateCase] Case update failed'
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[CaseController][updateCase] Internal server error: ${error}`
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
            // Delete all stages in the case
            await StageController.deleteStagesByCaseId(caseId);
            return res.status(200).json({
                status: "success",
                data: [],
                message: '[CaseController][deleteCase] Case deleted successfully'
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[CaseController][deleteCase] Internal server error: ${error}`
            });
        }
    }
}

const generateCaseId = (clientType, clientId, premisesId) => {
    console.log(`[CaseController][generateCaseId] Generating case id for client type: ${clientType}, client id: ${clientId}, premises id: ${premisesId}`);
    return `${clientType}_${clientId}_${premisesId}`;
}

module.exports = new CaseController();
