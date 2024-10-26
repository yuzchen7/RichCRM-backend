/**
 * Author: Eden Wu
 * Date: 2024-07-09
 * Database Model of User
 * 
 * @typedef {object} User
 * @property {string} EmailAddress - User's email address (Primary Key)
 * @property {string} Password - User's password
 * @property {string} Salt - User's salt
 * @property {string} UserName - User's name
 * @property {enum} Role - User's role (ADMIN, ATTORNEY, CLIENT)
 * @property {string} RefreshToken - User's renew token
 */

const { GetItemCommand, PutItemCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const db = require('../dynamodb');

class User {
    constructor () {
        this.table = 'User';
    }

    async getUserByEmail (emailAddress) {
        const params = {
            TableName: this.table,
            Key: {
                EmailAddress: { S: emailAddress }
            }
        };

        const command = new GetItemCommand(params);
        return await db.send(command);
    }

    // TODO: update to aws v3
    async getAllUsers () {
        const params = {
            TableName: this.table
        };
        const users = await db.scan(params).promise();
        return users;
    }

    async createUser (user) {
        const params = {
            TableName: this.table,
            Item: {
                EmailAddress: { S: user.emailAddress },
                Password: { S: user.password },
                UserName: { S: user.userName },
                Salt: { S: user.salt },
                Role: { N: String(user.role) },
            }
        };

        const command = new PutItemCommand(params);
        await db.send(command);

        return {
            EmailAddress: user.emailAddress,
            UserName: user.userName,
            Role: user.role
        };
    }

    async updateUser (user) {
        const params = {
            TableName: this.table,
            Key: {
                EmailAddress: {S: user.emailAddress}
            },
            UpdateExpression: undefined,
            ExpressionAttributeValues: undefined,
            ReturnValues: 'UPDATED_NEW'
        };

        let updateExpression = 'set ';
        let expressionAttributeValues = {};
        if (user.userName !== undefined) {
            updateExpression += 'UserName = :n, ';
            expressionAttributeValues[':n'] = { S: user.userName };
        }

        if (user.role !== undefined) {
            updateExpression += 'Role = :r, ';
            expressionAttributeValues[':r'] = { N: String(user.role) };
        }

        if (user.refreshToken !== undefined) {
            updateExpression += 'RefreshToken = :t, ';
            expressionAttributeValues[':t'] = { S: user.refreshToken };
        }

        params.UpdateExpression = updateExpression.slice(0, -2);
        params.ExpressionAttributeValues = expressionAttributeValues;

        const updateCommand = new UpdateItemCommand(params);
        const result = await db.send(updateCommand);
        return result.Attributes;
    }

    async deleteUser (emailAddress) {
        const params = {
            TableName: this.table,
            Key: {
                EmailAddress: emailAddress
            }
        };
        return await db.delete(params).promise();
    }
}

module.exports = new User();