/**
 * Author: Eden Wu
 * Date: 2024-07-11
 * Database Model of Case
 * 
 * @typedef {object} Case
 * @property {string} CaseId - Case ID
 * @property {string} CreatorId - Foreign key to User who created this case
 * @property {string} PremisesId - Foreign key to Premises
 * @property {clientType} ClientType - Is this case for buyside or sellside clients?
 * @property {string} BuyerId - Foreign key to Buyers
 * @property {string} SellerId - Foreign key to Sellers
 * @property {Date} CreateAt - When this case was created
 * @property {Date} ClosingDate - When this case was closed
 * @property {stage} Stage - The stage of this case(0-START, 1-CONTRACT_PREPARING, 2-CONTRACT_SIGNING, 3-MORTGAGE, 4-CLOSING)
 * 
 */

const db = require("../dynamodb");
const { stage, clientType } = require("../types");

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

    async getAllCasesByCreatorId(creatorId) {
        const params = {
            TableName: this.table,
            FilterExpression: "CreatorId = :c",
            ExpressionAttributeValues: {
                ":c": creatorId,
            },
        };
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
                ClientType: c.clientType,
                BuyerId: c.buyerId,
                SellerId: c.sellerId,
                CreateAt: c.createAt,
                ClosingDate: c.closingDate,
                Stage: c.stage
            },
        };
        console.log(params);
        await db.put(params).promise();
        return params.Item;
    }

    async updateCase(c) {
        const params = {
            TableName: this.table,
            Key: {
                CaseId: c.caseId,
            },
            UpdateExpression: "set CreatorId = :c, PremisesId = :p, ClosingDate = :cd, #stg = :stg",
            ExpressionAttributeNames: {
                "#stg": "Stage",
            },
            ExpressionAttributeValues: {
                ":c": c.creatorId,
                ":p": c.premisesId,
                ":cd": c.closingDate,
                ":stg": c.stage,
            },
            ReturnValues: "UPDATED_NEW",
        };
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