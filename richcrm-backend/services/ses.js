var AWS = require("aws-sdk");
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


const ses = {
    sendEmail: async (data) => {
        var params = {
            Destination: {
                /* required */
                ToAddresses: data.toAddresses, // Array of Emails
                CcAddresses: data.ccAddresses, // Array of Emails
            },
            Message: {
                /* required */
                Body: {
                    /* required */
                    Text: {
                        Charset: "UTF-8",
                        Data: data.emailContent,
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: data.emailTitle,
                },
            },
            Source: process.env.SES_SOURCE_EMAIL /* required */,
            ReplyToAddresses: [
                process.env.SES_REPLY_EMAIL,
            ],
        }

        // Create the promise and SES service object
        var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
            .sendEmail(params)
            .promise();

        // Handle promise's fulfilled/rejected states
        sendPromise
            .then(function (data) {
                console.log(data.MessageId);
            })
            .catch(function (err) {
                console.error(err, err.stack);
            });

        return;
    }
};


module.exports = ses;