const { header } = require('express-validator');
var AddressService = require('../db/address/address.service');
var axios = require('axios');

class UtilsController {
    // Address
    async standardizeAddress(req, res, next) {
        const {addressLine1, addressLine2, city, state, zipCode} = req.body;
        // Get OAuth token
        const token = await axios.post("https://api.usps.com/oauth2/v3/token", {
            "grant_type": "client_credentials",
            "scope": "address",
            "client_id": process.env.USPS_CLIENT_ID,
            "client_secret": process.env.USPS_CLIENT_SECRET
        });
        console.log(token.data);
        const headers = { 'Authorization': `Bearer ${token.data.access_token}` };
        // try {
        //     const res = await axios.get("https://api.usps.com/addresses/v3/address", {
        //         "address": {
        //             "streetAddress": addressLine1,
        //             "secondaryAddress": addressLine2,
        //             "city": city,
        //             "state": state,
        //             "zipCode": zipCode
        //         }
        //     },
        //     { headers });
        //     console.log(res);
        //     res.json(data);
        // } catch (err) {
        //     console.error(err);
        //     res.status(500).json({
        //         status: "failed",
        //         data: [],
        //         message: 'Internal server error'
        //     });
        // }
    }
    async registerAddress(req, res) {
        const {addressId, addressLine1, addressLine2, city, state, zipCode} = req.body;
        try {
            const existingAddress = await AddressService.readAddress(addressId);
            if (existingAddress !== null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Address already exists'
                });
            }
            const address = await AddressService.createAddress({addressId, addressLine1, addressLine2, city, country, zipCode});
            if (address !== null) {
                res.status(200).json({
                    status: "success",
                    data: [address],
                    message: 'Address created successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Address creation failed'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: 'Internal server error'
            });
        }
        res.end();
    }

    
}

module.exports = new UtilsController();