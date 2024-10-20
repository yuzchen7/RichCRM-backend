// const AWS = require('aws-sdk');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config();

let dynamoDBClientConfig = {
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY,
    },
    ...(process.env.NODE_ENV === 'local' && {endpoint: process.env.ENDPOINT})
}

// if (process.env.NODE_ENV === 'local') {
//     AWS.config.update({
//         accessKeyId: process.env.ACCESSKEYID,
//         secretAccessKey: process.env.SECRETACCESSKEY,
//         region: process.env.REGION,
//         endpoint: new AWS.Endpoint(process.env.ENDPOINT)
//     });
// } else {
//     AWS.config.update({
//         accessKeyId: process.env.ACCESSKEYID,
//         secretAccessKey: process.env.SECRETACCESSKEY,
//         region: process.env.REGION,
//     });
// }

const dynamoClient = new DynamoDBClient(dynamoDBClientConfig);

const db = DynamoDBDocumentClient.from(dynamoClient, {
    marshallOptions: {
        convertEmptyValues: true,
    }
});

module.exports = db;
