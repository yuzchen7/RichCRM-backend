const AWS = require('aws-sdk');
require('dotenv').config();

if (process.env.NODE_ENV === 'local') {
    AWS.config.update({
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY,
        region: process.env.REGION,
        endpoint: new AWS.Endpoint(process.env.ENDPOINT)
    });
} else {
    AWS.config.update({
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY,
        region: process.env.REGION,
    });
}


const db = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });

module.exports = db;
