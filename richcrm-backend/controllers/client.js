var ClientService = require("../db/client/client.service");
var AddressService = require("../db/address/address.service");
const Types = require("../db/types");

class ClientController {
    async registerClient(req, res) {
        const { title, firstName, lastName, cellNumber, email, ssn, addressId } = req.body;

        try {
            // Check if client already exists
            const existingClient = await ClientService.readClient(ssn);
            if (existingClient !== null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[ClientController][registerClient] Client already exists'
                });
            }
            // Check if address exists
            const existingAddress = await AddressService.readAddress(addressId);
            if (existingAddress === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[ClientController][registerClient] Address does not exist'
                });
            }
            // Check if title is valid
            var titleParsed = title;
            if (Types.castIntToEnum(Types.title, title) === undefined) {
                titleParsed = Types.title.NA;
            }
            const client = await ClientService.createClient({
                clientId: ssn,
                title: titleParsed,
                firstName: firstName,
                lastName: lastName,
                cellNumber: cellNumber,
                email: email,
                ssn: ssn,
                addressId: addressId
            });
            if (client !== null) {
                res.status(200).json({
                    status: "success",
                    data: [client],
                    message: '[ClientController][registerClient] Client created successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[ClientController][registerClient] Client creation failed'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[ClientController][registerClient] Internal server error'
            });
        }
    }

    async getClient(req, res) {
        const { clientId } = req.params;
        try {
            const client = await ClientService.readClient(clientId);
            if (client !== null) {
                res.status(200).json({
                    status: "success",
                    data: [client],
                    message: '[ClientController][getClient] Client retrieved successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[ClientController][getClient] Client not found'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[ClientController][getClient] Internal server error'
            });
        }
    }

    async updateClient(req, res) {
        const { clientId, title, firstName, lastName, gender, cellNumber, workNumber, email, wechatAccount, dob, attorneyId, bankAttorneyId, addressId } = req.body;

        try {
            // Check if client exists
            const existingClient = await ClientService.readClient(clientId);
            if (existingClient === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[ClientController][updateClient] Client does not exist'
                });
            }
            var clientObj = {
                clientId: clientId,
                title: existingClient.title,
                firstName: existingClient.firstName,
                lastName: existingClient.lastName,
                cellNumber: existingClient.cellNumber,
                workNumber: existingClient.workNumber,
                email: existingClient.email,
                wechatAccount: existingClient.wechatAccount,
                dob: existingClient.dob,
                attorneyId: existingClient.attorneyId,
                bankAttorneyId: existingClient.bankAttorneyId,
                addressId: existingClient.addressId
            };
            // Check if address exists
            const existingAddress = await AddressService.readAddress(addressId);
            if (existingAddress === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[ClientController][updateClient] Address does not exist'
                });
            }
            clientObj.addressId = addressId;
            // Check if title is valid
            var titleParsed = title;
            if (Types.castIntToEnum(Types.title, title) === undefined) {
                titleParsed = Types.title.NA;
            }
            clientObj.title = titleParsed;
            // Check if gender is valid
            var genderParsed = gender;
            if (Types.castIntToEnum(Types.gender, gender) === undefined) {
                genderParsed = Types.gender.NA;
            }
            clientObj.gender = genderParsed;

            // Check if dob is valid
            if (dob !== undefined) {
                clientObj.dob = new Date(dob).toISOString();
            }

            // Check work number is valid
            if (workNumber !== undefined) {
                clientObj.workNumber = workNumber;
            }

            // Check if attorneyId is valid
            if (attorneyId !== undefined) {
                clientObj.attorneyId = attorneyId;
            }

            // Check if bankAttorneyId is valid
            if (bankAttorneyId !== undefined) {
                clientObj.bankAttorneyId = bankAttorneyId;
            }

            // Check if firstName is valid
            if (firstName !== undefined) {
                clientObj.firstName = firstName;
            }

            // Check if lastName is valid
            if (lastName !== undefined) {
                clientObj.lastName = lastName;
            }

            // Check if cellNumber is valid
            if (cellNumber !== undefined) {
                clientObj.cellNumber = cellNumber;
            }

            // Check if email is valid
            if (email !== undefined) {
                clientObj.email = email;
            }

            // Check if wechatAccount is valid
            if (wechatAccount !== undefined) {
                clientObj.wechatAccount = wechatAccount;
            }


            const client = await ClientService.updateClient(clientObj);
            if (client !== null) {
                res.status(200).json({
                    status: "success",
                    data: [client],
                    message: '[ClientController][updateClient] Client updated successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[ClientController][updateClient] Client update failed'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[ClientController][updateClient] Internal server error'
            });
        }
    }

    async deleteClient(req, res) {
        const { clientId } = req.body;
        try {
            const client = await ClientService.deleteClient(clientId);
            if (client !== null) {
                res.status(200).json({
                    status: "success",
                    data: [client],
                    message: '[ClientController][deleteClient] Client deleted successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[ClientController][deleteClient] Client deletion failed'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[ClientController][deleteClient] Internal server error'
            });
        }
    }
}

module.exports = new ClientController();