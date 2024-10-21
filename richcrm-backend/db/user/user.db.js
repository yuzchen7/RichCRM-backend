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
        // aws V3
        const command = new GetItemCommand(params);
        const user = await db.send(command);
        // const user = await db.get(params).promise();
        return user;
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

    async updateRefreshToken(key, token) {
        const params = {
            TableName: this.table,
            Key: {
                EmailAddress: { S: key }
            },
            UpdateExpression: 'set RefreshToken = :t',
            ExpressionAttributeValues: {
                ':t': { S: token }
            },
            ReturnValues: 'UPDATED_NEW'
        }
        const command = new UpdateItemCommand(params);
        const result = await db.send(command);
        return result.Attributes;
    }

    // TODO: update to aws v3 and implement partial updates, remove password updates
    async updateUser (user) {
        const params = {
            TableName: this.table,
            Key: {
                EmailAddress: user.emailAddress
            },
            UpdateExpression: 'set UserName = :n, Password = :p, #r = :r',
            ExpressionAttributeNames: {
                "#r": "Role"
            },
            ExpressionAttributeValues: {
                ':n': user.userName,
                ':p': user.password,
                ':r': user.role
            },
            ReturnValues: 'UPDATED_NEW'
        };
        const update = await db.update(params).promise();
        return update.Attributes;
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