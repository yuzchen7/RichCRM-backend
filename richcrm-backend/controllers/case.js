const CaseService = require('../db/case/case.service');
const UserService = require('../db/user/user.service');
const PremisesService = require('../db/premises/premises.service');
const ClientService = require('../db/client/client.service');
const ContactService = require('../db/contact/contact.service');
const StageService = require('../db/stage/stage.service');
const StageController = require('./stage');
const Types = require("../db/types");
const { v4: uuidv4 } = require('uuid');

class CaseController {

    constructor () {
        this.createCase = this.createCase.bind(this);
        this.updateCase = this.updateCase.bind(this);
        this.closeCase = this.closeCase.bind(this);
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
                        "caseType": c.CaseType,
                        "buyerId": c.BuyerId,
                        "sellerId": c.SellerId,
                        "createAt": c.CreateAt,
                        "closeAt": c.CloseAt,
                        "closingDate": c.ClosingDate,
                        "mortgageContingencyDate": c.MortgageContingencyDate,
                        "additionalClients": c.AdditionalClients,
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
        const { creatorId, closed } = req.body;
        try {
            var caseList = [];
            const cases = await CaseService.readAllCasesByCreatorId(creatorId, closed);
            if (cases !== null) {
                for (let i = 0; i < cases.length; i++) {
                    const c = cases[i];
                    // Read current stage
                    const stages = await StageService.getStagesByCaseIdAndStageType(c.CaseId, c.Stage);
                    if (stages === null || stages.length === 0) {
                        console.log(`[CaseController][readAllCasesByCreatorId] Stage does not exist for case: ${c.CaseId}`);
                    }

                    // Read client
                    var clientId = c.BuyerId;
                    if (c.BuyerId === undefined || c.BuyerId === null) {
                        clientId = c.SellerId;
                    }
                    const client = await ClientService.readClient(clientId);
                    if (client === null) {
                        console.log(`[CaseController][readAllCasesByCreatorId] Client does not exist for case: ${c.CaseId}`);
                    }

                    // Read premises
                    const premises = await PremisesService.readPremises(c.PremisesId);
                    if (premises === null) {
                        console.log(`[CaseController][readAllCasesByCreatorId] Premises does not exist for case: ${c.CaseId}`);
                    }

                    caseList.push({
                        "caseId": c.CaseId,
                        "creatorId": c.CreatorId,
                        "premisesId": c.PremisesId,
                        "premisesName": premises.Name,
                        "stage": c.Stage,
                        "caseStatus": stages[0].StageStatus,
                        "stageId": stages[0].StageId,
                        "caseType": c.CaseType,
                        "buyerId": c.BuyerId,
                        "sellerId": c.SellerId,
                        "clientName": client.LastName + ", " + client.FirstName,
                        "createAt": c.CreateAt,
                        "closeAt": c.CloseAt,
                        "closingDate": c.ClosingDate,
                        "mortgageContingencyDate": c.MortgageContingencyDate,
                        "additionalClients": c.AdditionalClients,
                    });
                }
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

    async readAllCasesByClientId(req, res) {
        const { clientId, closed } = req.body;
        try {
            var caseList = [];
            const cases = await CaseService.readAllCasesByClientId(clientId, closed);
            if (cases !== null) {
                for (let i = 0; i < cases.length; i++) {
                    const c = cases[i];
                    // Read current stage
                    const stages = await StageService.getStagesByCaseIdAndStageType(c.CaseId, c.Stage);
                    if (stages === null || stages.length === 0) {
                        console.log(`[CaseController][readAllCasesByClientId] Stage does not exist for case: ${c.CaseId}`);
                    }

                    // Read premises
                    const premises = await PremisesService.readPremises(c.PremisesId);
                    if (premises === null) {
                        console.log(`[CaseController][readAllCasesByClientId] Premises does not exist for case: ${c.CaseId}`);
                    }

                    caseList.push({
                        "caseId": c.CaseId,
                        "creatorId": c.CreatorId,
                        "premisesId": c.PremisesId,
                        "premisesName": premises.Name,
                        "stage": c.Stage,
                        "caseStatus": stages[0].StageStatus,
                        "stageId": stages[0].StageId,
                        "caseType": c.CaseType,
                        "buyerId": c.BuyerId,
                        "sellerId": c.SellerId,
                        "createAt": c.CreateAt,
                        "closeAt": c.CloseAt,
                        "closingDate": c.ClosingDate,
                        "mortgageContingencyDate": c.MortgageContingencyDate,
                        "additionalClients": c.AdditionalClients,
                    });
                }
            }
            res.status(200).json({
                status: "success",
                data: caseList,
                message: '[CaseController][readAllCasesByClientId] Cases retrieved successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[CaseController][readAllCasesByClientId] Internal server error'
            });
        }

    }

    async readAllCasesByContactId(req, res) {
        const { contactId, closed } = req.body;
        try {
            var caseList = [];
            const cases = await CaseService.readAllCasesByContactId(contactId, closed);
            if (cases !== null) {
                for (let i = 0; i < cases.length; i++) {
                    const c = cases[i];
                    // Read current stage
                    const stages = await StageService.getStagesByCaseIdAndStageType(c.CaseId, c.Stage);
                    if (stages === null || stages.length === 0) {
                        console.log(`[CaseController][readAllCasesByContactId] Stage does not exist for case: ${c.CaseId}`);
                    }

                    // Read premises
                    const premises = await PremisesService.readPremises(c.PremisesId);
                    if (premises === null) {
                        console.log(`[CaseController][readAllCasesByContactId] Premises does not exist for case: ${c.CaseId}`);
                    }

                    caseList.push({
                        "caseId": c.CaseId,
                        "creatorId": c.CreatorId,
                        "premisesId": c.PremisesId,
                        "premisesName": premises.Name,
                        "stage": c.Stage,
                        "caseStatus": stages[0].StageStatus,
                        "stageId": stages[0].StageId,
                        "caseType": c.CaseType,
                        "buyerId": c.BuyerId,
                        "sellerId": c.SellerId,
                        "createAt": c.CreateAt,
                        "closeAt": c.CloseAt,
                        "closingDate": c.ClosingDate,
                        "mortgageContingencyDate": c.MortgageContingencyDate,
                        "additionalClients": c.AdditionalClients,
                        "contacts": c.Contacts,
                    });
                }
            }
            res.status(200).json({
                status: "success",
                data: caseList,
                message: '[CaseController][readAllCasesByContactId] Cases retrieved successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[CaseController][readAllCasesByContactId] Internal server error'
            });
        }

    }
    
    async createCase(req, res) {
        const {creatorId, premisesId, caseType, buyerId, sellerId, stage, additionalClients, contacts} = req.body;

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
        const caseTypeEnum = Types.castIntToEnum(Types.caseType, caseType);
        if (caseTypeEnum === undefined) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][createCase] Invalid case type'
            });
        }

        // Check if the buyerId / SellerId is valid -> Generate caseId
        var caseId;
        var clientId = buyerId;
        var additionalClientIds = [];
        var contactIds = [];
        try {
            switch (caseType) {
                case Types.caseType.PURCHASING:
                    const buyer = await ClientService.readClient(buyerId);
                    if (buyerId === undefined || buyer === null) {
                        return res.status(400).json({
                            status: "failed",
                            data: [],
                            message: '[CaseController][createCase] Invalid buyer id'
                        });
                    } else {
                        caseId = generateCaseId(caseType, buyerId, premisesId);
                        console.log(`[CaseController][createCase] Generated case id: ${caseId}`);
                    }
                    break;
                case Types.caseType.SELLING:
                    const seller = await ClientService.readClient(sellerId);
                    if (sellerId === undefined || seller === null) {
                        return res.status(400).json({
                            status: "failed",
                            data: [],
                            message: '[CaseController][createCase] Invalid seller id'
                        });
                    } else {
                        clientId = sellerId;
                        caseId = generateCaseId(caseType, sellerId, premisesId);
                        console.log(`[CaseController][createCase] Generated case id: ${caseId}`);
                    }
                    break;
                default:
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[CaseController][createCase] Invalid case type'
                    });
            }

            // Check additional clients
            if (additionalClients !== undefined) {
                for (let i = 0; i < additionalClients.length; i++) {
                    if (additionalClients[i] === clientId) {
                        console.log(`[CaseController][createCase] Client id ${additionalClients[i]} is the same as the buyer/seller id`);
                        continue;
                    }
                    const client = await ClientService.readClient(additionalClients[i]);
                    if (client === null) {
                        console.log(`[CaseController][createCase] Invalid additional client id ${additionalClients[i]}`);
                    }
                    additionalClientIds.push(additionalClients[i]);
                }
            }

            // Check contacts
            if (contacts !== undefined) {
                for (let i = 0; i < contacts.length; i++) {
                    const contact = await ContactService.readContact(contacts[i]);
                    if (contact === null) {
                        console.log(`[CaseController][createCase] Invalid contact id ${contacts[i]}`);
                    }
                    contactIds.push(contacts[i]);
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[CaseController][createCase] readClient internal server error: ${error}`
            });
        }
        
        

        try {
            const existingCase = await CaseService.readCaseByPresmisesIdAndClientId(premisesId, clientId);
            if (existingCase !== null && existingCase.length > 0) {
                return res.status(400).json({
                    status: "failed",
                    data: [{
                        caseId: existingCase[0].CaseId,
                    }],
                    message: '[CaseController][createCase] Case already exists'
                });
            }
            const c = await CaseService.createCase({
                creatorId: creatorId,
                caseId: caseId,
                premisesId: premisesId,
                stage: stage,
                caseType: caseType,
                buyerId: buyerId,
                sellerId: sellerId,
                createAt: new Date().toISOString(),
                additionalClients: additionalClientIds,
                contacts: contactIds,
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
                        "caseType": c.CaseType,
                        "buyerId": c.BuyerId,
                        "sellerId": c.SellerId,
                        "createAt": c.CreateAt,
                        "closeAt": c.CloseAt,
                        "closingDate": c.ClosingDate,
                        "mortgageContingencyDate": c.MortgageContingencyDate,
                        "additionalClients": c.AdditionalClients,
                        "contacts": c.Contacts,
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
        const {caseId, creatorId, stage, premisesId, closeAt, closingDate, mortgageContingencyDate, additionalClients, contacts} = req.body;

        // Check if the case id is valid
        if (caseId === undefined) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: '[CaseController][updateCase] Invalid case id'
            });
        }
        try {
            // Check if the creator id is valid
            if (creatorId === undefined) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][updateCase] Invalid creator id'
                });
            } else {
                const creator = await UserService.readUser(creatorId);
                if (creator === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[CaseController][updateCase] Creator does not exist'
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

            var caseObj = {
                caseId: caseId,
                creatorId: creatorId,
                premisesId: existingCase.PremisesId,
                stage: existingCase.Stage,
                closingDate: existingCase.ClosingDate,
                closeAt: existingCase.CloseAt,
                mortgageContingencyDate: existingCase.MortgageContingencyDate,
                additionalClients: existingCase.AdditionalClients,
                contacts: existingCase.Contacts,
            }

            // Check if the stage is valid
            var stageObj;
            if (stage !== undefined) {
                const stageEnum = Types.castIntToEnum(Types.stage, stage);
                if (stageEnum === undefined) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[CaseController][updateCase] Invalid stage'
                    });
                }

                // Update the stage
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
                caseObj.stage = stage;
            }

            // Check if the premises id is valid
            if (premisesId !== undefined && premisesId !== "") {
                const premises = await PremisesService.readPremises(premisesId);
                if (premises === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[CaseController][updateCase] Premises does not exist'
                    });
                }
                caseObj.premisesId = premisesId;
            }

            // Check if the closing date is valid
            if (closingDate !== undefined && closingDate !== "") {
                caseObj.closingDate = new Date(closingDate).toISOString();
            }

            // Check if the close at date is valid
            if (closeAt !== undefined && closeAt !== "") {
                caseObj.closeAt = new Date(closeAt).toISOString();
            }

            // Check if the mortgage contingency date is valid
            if (mortgageContingencyDate !== undefined && mortgageContingencyDate !== "") {
                caseObj.mortgageContingencyDate = new Date(mortgageContingencyDate).toISOString();
            }

            // Update additional clients list 
            if (additionalClients !== undefined && additionalClients.length > 0) {
                caseObj.additionalClients = await this.updateAdditionalClients(caseObj.additionalClients, additionalClients);
            }

            // Update contacts list
            if (contacts !== undefined && contacts.length > 0) {
                caseObj.contacts = await this.updateAdditionalContacts(caseObj.contacts, contacts);
            }

            // Update the case
            const c = await CaseService.updateCase(caseObj);
            if (c !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [{
                        "caseId": c.CaseId,
                        "creatorId": c.CreatorId,
                        "premisesId": c.PremisesId,
                        "stage": c.Stage,
                        "stageId": stageObj.stageId,
                        "caseType": c.CaseType,
                        "buyerId": c.BuyerId,
                        "sellerId": c.SellerId,
                        "createAt": c.CreateAt,
                        "closeAt": c.CloseAt,
                        "closingDate": c.ClosingDate,
                        "mortgageContingencyDate": c.MortgageContingencyDate,
                        "additionalClients": c.AdditionalClients,
                        "contacts": c.Contacts,
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

    async closeCase(req, res) {
        const {caseId} = req.body;
        if (caseId === undefined) {
            console.log("[CaseController][closeCase] Invalid case id");
            return null;
        }
        try {
            const existingCase = await CaseService.readCase(caseId);
            if (existingCase === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][closeCase] Case does not exist'
                });
            }
            const c = await CaseService.updateCase({
                caseId: caseId,
                creatorId: existingCase.CreatorId,
                closeAt: new Date().toISOString()
            });
            if (c !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [{
                        "caseId": caseId,
                        "creatorId": existingCase.CreatorId,
                        "premisesId": existingCase.PremisesId,
                        "stage": existingCase.Stage,
                        "caseType": existingCase.CaseType,
                        "buyerId": existingCase.BuyerId,
                        "sellerId": existingCase.SellerId,
                        "createAt": existingCase.CreateAt,
                        "closeAt": c.CloseAt,
                        "closingDate": existingCase.ClosingDate,
                        "mortgageContingencyDate": existingCase.MortgageContingencyDate,
                        "additionalClients": existingCase.AdditionalClients,
                        "contacts": existingCase.Contacts,
                    }],
                    message: '[CaseController][closeCase] Case closed successfully'
                });
            } else {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[CaseController][closeCase] Case close failed'
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[CaseController][closeCase] Internal server error: ${error}`
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

    // Update additional clients list
    async updateAdditionalClients(additionalClients, additionalClientsNew) {
        for (let i = 0; i < additionalClientsNew.length; i++) {
            if (!additionalClients.includes(additionalClientsNew[i])) {
                const client = await ClientService.readClient(additionalClientsNew[i]);
                if (client === null) {
                    console.log(`[CaseController][updateAdditionalClients] Invalid additional client id ${additionalClientsNew[i]}`);
                    continue;
                }
                additionalClients.push(additionalClientsNew[i]);
            }
        }
        return additionalClients;
    }

    // Update contacts list
    async updateAdditionalContacts(contacts, contactsNew) {
        for (let i = 0; i < contactsNew.length; i++) {
            if (!contacts.includes(contactsNew[i])) {
                const contact = await ContactService.readContact(contactsNew[i]);
                if (contact === null) {
                    console.log(`[CaseController][updateAdditionalContacts] Invalid contact id ${contactsNew[i]}`);
                    continue;
                }
                contacts.push(contactsNew[i]);
            }
        }
        return contacts;
    }
}

const generateCaseId = (caseType, clientId, premisesId) => {
    console.log(`[CaseController][generateCaseId] Generating case id for client type: ${caseType}, client id: ${clientId}, premises id: ${premisesId}`);
    // return `${caseType}_${clientId}_${premisesId}`;
    return uuidv4();
}

module.exports = new CaseController();
