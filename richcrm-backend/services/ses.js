const { SESClient, SendEmailCommand, VerifyEmailIdentityCommand } = require('@aws-sdk/client-ses');
require('dotenv').config();

let SESClientConfig = {
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY
    },
    ...(process.env.NODE_ENV === 'local' && {endpoint: process.env.ENDPOINT})
}

let sesClient = new SESClient(SESClientConfig);

const ses = {

    verifyEmailAddress: async (emails) => {
        try {
            const verificationPromises = emails.map(async email => {
                const params = {
                    EmailAddress: email,
                }
                return await sesClient.send(new VerifyEmailIdentityCommand(params))
            })
            const result = await Promise.all(verificationPromises);
            console.log('Email verification results: ', result);
            return true;
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
            const data = await sesClient.send(new SendEmailCommand(params));
            return data;
        } catch (err) {
            console.log("Fail to send email: ", err, err.stack);
            return err;
        }
    },

    // TODO: Create Template
};


module.exports = ses;