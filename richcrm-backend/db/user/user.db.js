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
 * @property {string} RenewToken - User's renew token
 */

const db = require('../dynamodb');

class User {
    constructor () {
        this.table = 'User';
    }

    async getUserByEmail (emailAddress) {
        const params = {
            TableName: this.table,
            Key: {
                EmailAddress: emailAddress
            }
        };
        const user = await db.get(params).promise();
        return user;
    }

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
                EmailAddress: user.emailAddress,
                Password: user.password,
                UserName: user.userName,
                Salt: user.salt,
                Role: user.role
            }
        };
        await db.put(params).promise();
        
        return params.Item;
    }

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