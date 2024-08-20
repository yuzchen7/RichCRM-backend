/**
 * Author: Eden Wu
 * Date: 2024-07-11
 * Database Model of Case
 * 
 * @typedef {object} Case
 * @property {string} CaseId - Case ID
 * @property {string} CreatorId - Foreign key to User who created this case
 * @property {string} PremisesId - Foreign key to Premises
 * @property {caseType} CaseType - Is this case for buyside or sellside clients? (0-PURCHASING, 1-SELLING)
 * @property {string} BuyerId - Foreign key to Buyers
 * @property {string} SellerId - Foreign key to Sellers
 * @property {Date} CreateAt - When this case was created
 * @property {Date} CloseAt - When this case was closed
 * @property {Date} ClosingDate - When this case should be closed
 * @property {Date} MortgageContingencyDate - When should the mortgage contingency be removed
 * @property {stage} Stage - The stage of this case(0-SETUP, 1-CONTRACT_PREPARING, 2-CONTRACT_SIGNING, 3-MORTGAGE, 4-CLOSING)
 * 
 */

const db = require("../dynamodb");
const { stage, caseType } = require("../types");

class Case {
    constructor() {
        this.table = "Case";
    }

    async getCaseById(caseId) {
        const params = {
            TableName: this.table,
            Key: {
                CaseId: caseId,
            },
        };
        const data = await db.get(params).promise();
        return data;
    }

    async getAllCasesByCreatorId(creatorId, closed) {
        const params = {
            TableName: this.table,
            FilterExpression: "CreatorId = :c",
            ExpressionAttributeValues: {
                ":c": creatorId,
            },
        };

        if (closed === true) {
            params.FilterExpression += " AND attribute_exists(CloseAt)";
        }
        const data = await db.scan(params).promise();
        return data;
    }

    async getAllCasesByBuyerId(buyerId) {
        const params = {
            TableName: this.table,
            IndexName: "BuyerIdIndex",
            KeyConditionExpression: "BuyerId = :b",
            ExpressionAttributeValues: {
                ":b": buyerId,
            },
        };
        const data = await db.query(params).promise();
        return data;
    }

    async getAllCasesBySellerId(sellerId) {
        const params = {
            TableName: this.table,
            IndexName: "SellerIdIndex",
            KeyConditionExpression: "SellerId = :s",
            ExpressionAttributeValues: {
                ":s": sellerId,
            },
        };
        const data = await db.query(params).promise();
        return data;
    }

    async getCaseByPremisesIdAndClientId(premisesId, clientId) {
        const params = {
            TableName: this.table,
            FilterExpression: "PremisesId = :p AND (BuyerId = :c OR SellerId = :c)",
            ExpressionAttributeValues: {
                ":p": premisesId,
                ":c": clientId,
            },
        };
        const data = await db.scan(params).promise();
        return data;
    }

    async getAllCases() {
        const params = {
            TableName: this.table,
        };
        const data = await db.scan(params).promise();
        return data;
    }

    async createCase(c) {
        const params = {
            TableName: this.table,
            Item: {
                CaseId: c.caseId,
                CreatorId: c.creatorId,
                PremisesId: c.premisesId,
                CaseType: c.caseType,
                BuyerId: c.buyerId,
                SellerId: c.sellerId,
                CreateAt: c.createAt,
                CloseAt: c.closeAt,
                ClosingDate: c.closingDate,
                MortgageContingencyDate: c.mortgageContingencyDate,
                Stage: c.stage
            },
        };
        await db.put(params).promise();
        return params.Item;
    }

    async updateCase(c) {
        const params = {
            TableName: this.table,
            Key: {
                CaseId: c.caseId,
            },
            UpdateExpression: "set CreatorId = :c, PremisesId = :p",
            ExpressionAttributeNames: {
                "#stg": "Stage",
            },
            ExpressionAttributeValues: {
                ":c": c.creatorId,
                ":p": c.premisesId,
            },
            ReturnValues: "UPDATED_NEW",
        };

        // Optional fields
        if (c.closeAt !== undefined) {
            params.ExpressionAttributeValues[':ca'] = c.closeAt;
            params.UpdateExpression += ', CloseAt = :ca';
        }

        if (c.closingDate !== undefined) {
            params.ExpressionAttributeValues[':cd'] = c.closingDate;
            params.UpdateExpression += ', ClosingDate = :cd';
        }

        if (c.mortgageContingencyDate !== undefined) {
            params.ExpressionAttributeValues[':mc'] = c.mortgageContingencyDate;
            params.UpdateExpression += ', MortgageContingencyDate = :mc';
        }

        if (c.stage !== undefined) {
            params.ExpressionAttributeValues[':s'] = c.stage;
            params.UpdateExpression += ', #stg = :s';
        }

        const data = await db.update(params).promise();
        return data.Attributes;
    }

    async deleteCase(caseId) {
        const params = {
            TableName: this.table,
            Key: {
                CaseId: caseId,
            },
        };
        await db.delete(params).promise();
    }

}

module.exports = new Case();