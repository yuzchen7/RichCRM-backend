// User
// ----------------
// EmailAddress (PK) : String
// Password : String
// UserName : String
// Role : Enum

const db = require('../dynamodb');
const uuid = require('uuid');

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