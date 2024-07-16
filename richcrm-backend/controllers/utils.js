var AddressService = require('../db/address/address.service');
var { standardizeAddress } = require('../middlewares/utils');


class UtilsController {
    // Address
    async registerAddress(req, res) {
        const {addressLine1, addressLine2, city, state, zipCode} = req.body;
        try {
            // Validate & standardize address
            const standardizedData = await standardizeAddress(addressLine1, addressLine2, city, state, zipCode);
            if (standardizedData === null || standardizedData.formattedAddress === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'The address you entered cannot be verified, please check and try again'
                });
            }
            const addressId = standardizedData.formattedAddress;

            // Check if address already exists
            const existingAddress = await AddressService.readAddress(addressId);
            if (existingAddress !== null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Address already exists'
                });
            }

            // Create address
            const address = await AddressService.createAddress({
                addressId: addressId,
                addressLine1: standardizedData.addressLabel,
                addressLine2: addressLine2,
                city: standardizedData.city,
                state: standardizedData.county,
                zipCode: standardizedData.postalCode,
                plus4: standardizedData.plus4
            });
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