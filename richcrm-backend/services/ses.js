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

const SES = new AWS.SES();

const ses = {

    verifyEmailAddress: async (emails) => {
        try {
            const verificationPromises = emails.map(async email => {
                const params = {
                    EmailAddress: email,
                }
                return await SES.verifyEmailIdentity(params).promise();
            })
        } catch (err) {
            console.log("Fail to verify emails: ", err, err.stack);
            return false;
        }
    },

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
                    // Html: {
                    //     Charset: "UTF-8",
                    //     Data: data.templateContent,
                    // },
                    Text: {
                        Charset: "UTF-8",
                        Data: data.templateContent,
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: data.templateTitle,
                },
            },
            Source: process.env.SES_SOURCE_EMAIL /* required */,
            ReplyToAddresses: [
                process.env.SES_REPLY_EMAIL,
            ],
        }

        try {
            const data = await SES.sendEmail(params).promise();
            return data;
        } catch (err) {
            console.log("Fail to send email: ", err, err.stack);
            return err;
        }
    },

    // TODO: Create Template
};


module.exports = ses;