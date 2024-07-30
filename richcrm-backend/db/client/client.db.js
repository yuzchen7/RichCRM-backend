/**
 * Author: Eden Wu
 * Date: 2024-07-09
 * Database Model of Client
 * 
 * @typedef {object} Client
 * @property {string} ClientId - Client ID
 * @property {title} Title - Client's title
 * @property {string} FirstName - Client's first name
 * @property {string} LastName - Client's last name
 * @property {gender} Gender - Client's gender
 * @property {string} CellNumber - Client's cell phone number
 * @property {string} WorkNumber - Client's work phone number
 * @property {string} Email - Client's email address
 * @property {string} WechatAccount - Client's WeChat Account
 * @property {string} SSN - Client's Social Security Number
 * @property {Date} DOB - Client's date of birth
 * @property {string} AttorneyId - Foreign key to Attorney
 * @property {string} BankAttorneyId - Foreign key to Bank Attorney
 * @property {string} AddressId - Foreign key to Address
 */

const db = require('../dynamodb');
const { title, gender } = require('../types');

class Client {
    constructor() {
        this.table = 'Client';
    }

    async getClientById(clientId) {
        const params = {
            TableName: this.table,
            Key: {
                ClientId: clientId,
            },
        };
        const data = await db.get(params).promise();
        return data;
    }

    async getClientByPhoneNumber(phoneNumber) {
        const params = {
            TableName: this.table,
            FilterExpression: 'CellNumber = :c',
            ExpressionAttributeValues: {
                ':c': phoneNumber,
            },
        };
        const data = await db.scan(params).promise();
        return data;
    }

    async getClientByEmail(email) {
        const params = {
            TableName: this.table,
            FilterExpression: 'Email = :e',
            ExpressionAttributeValues: {
                ':e': email,
            },
        };
        const data = await db.scan(params).promise();
        return data;
    }

    async getClientByKeyword(keyword) {
        const params = {
            TableName: this.table,
            FilterExpression: 'contains(FirstName, :k) or contains(LastName, :k) or contains(Email, :k) or contains(CellNumber, :k)',
            ExpressionAttributeValues: {
                ':k': keyword,
            },
        };
        const data = await db.scan(params).promise();
        return data;
    }


    async createClient(client) {
        const params = {
            TableName: this.table,
            Item: {
                ClientId: client.clientId,
                Title: client.title,
                FirstName: client.firstName,
                LastName: client.lastName,
                Gender: client.gender,
                CellNumber: client.cellNumber,
                WorkNumber: client.workNumber,
                Email: client.email,
                SSN: client.ssn,
                DOB: client.dob,
                AttorneyId: client.attorneyId,
                BankAttorneyId: client.bankAttorneyId,
                AddressId: client.addressId,
            },
        };
        await db.put(params).promise();
        return params.Item;
    }

    async updateClient(client) {
        const params = {
            TableName: this.table,
            Key: {
                ClientId: client.clientId,
            },
            UpdateExpression: 'set Title = :t, FirstName = :f, LastName = :l, Gender = :g, CellNumber = :c, Email = :e',
            ExpressionAttributeValues: {
                ':t': client.title,
                ':f': client.firstName,
                ':l': client.lastName,
                ':g': client.gender,
                ':c': client.cellNumber,
                ':e': client.email,
            },
            ReturnValues: 'UPDATED_NEW',
        };

        // Optional fields
        if (client.ssn !== undefined) {
            params.ExpressionAttributeValues[':ssn'] = client.ssn;
            params.UpdateExpression += ', SSN = :ssn';
        }
        if (client.attorneyId !== undefined) {
            params.ExpressionAttributeValues[':a'] = client.attorneyId;
            params.UpdateExpression += ', AttorneyId = :a';
        }
        if (client.bankAttorneyId !== undefined) {
            params.ExpressionAttributeValues[':b'] = client.bankAttorneyId;
            params.UpdateExpression += ', BankAttorneyId = :b';
        }
        if (client.addressId !== undefined) {
            params.ExpressionAttributeValues[':ad'] = client.addressId;
            params.UpdateExpression += ', AddressId = :ad';
        }
        if (client.wechatAccount !== undefined) {
            params.ExpressionAttributeValues[':wc'] = client.wechatAccount;
            params.UpdateExpression += ', WechatAccount = :wc';
        }
        if (client.dob !== undefined) {
            params.ExpressionAttributeValues[':d'] = client.dob;
            params.UpdateExpression += ', DOB = :d';
        }
        if (client.workNumber !== undefined) {
            params.ExpressionAttributeValues[':w'] = client.workNumber;
            params.UpdateExpression += ', WorkNumber = :w';
        }


        const data = await db.update(params).promise();
        return data.Attributes;
    }

    async deleteClient(clientId) {
        const params = {
            TableName: this.table,
            Key: {
                ClientId: clientId,
            },
        };
        const data = await db.delete(params).promise();
        return data;
    }

}

module.exports = new Client();