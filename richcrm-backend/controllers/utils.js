var AddressService = require('../db/address/address.service');
var TemplateService = require('../db/template/template.service');
var TaskService = require('../db/task/task.service');
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
                    data: [{
                        addressId: address.AddressId,
                        addressLine1: address.AddressLine1,
                        addressLine2: address.AddressLine2,
                        city: address.City,
                        state: address.State,
                        zipCode: address.ZipCode,
                        plus4: address.Plus4
                    }],
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

    async getAllAddresses(req, res) {
        try {
            const addresses = await AddressService.readAllAddresses();
            if (addresses !== null) {
                res.status(200).json({
                    status: "success",
                    data: addresses,
                    message: 'Addresses retrieved successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'No addresses found'
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

    async deleteAddress(req, res) {
        const { addressId } = req.body;
        try {
            const address = await AddressService.readAddress(addressId);
            if (address === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Address not found'
                });
            }
            const deletedAddress = await AddressService.deleteAddress(addressId);
            if (deletedAddress !== null) {
                res.status(200).json({
                    status: "success",
                    data: [deletedAddress],
                    message: 'Address deleted successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Address deletion failed'
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

    // Check if templates exists
    async validateTemplates(templates) {
        var templateTitles = [];
        if (templates !== undefined && templates.length > 0) {
            for (let i = 0; i < templates.length; i++) {
                const templateTitle = templates[i].templateTitle;
                    
                const template = await TemplateService.getTemplateByTitle(templateTitle);
                if (template !== null) {
                    if (!templateTitles.includes(templateTitle)) {
                        templateTitles.push(templateTitle);
                    }
                } else {
                    console.log(`[TaskController][createTask] Template not found: ${templateTitle}`);
                }
            }
        }
        return templateTitles;
    }

    // Update new task to task list
    async updateTaskList(tasks, newTask) {
        if (newTask !== undefined) {
            if (!tasks.includes(newTask)) {
                // validate if task exists
                const task = await TaskService.getTaskById(newTask);
                if (task === null) {
                    console.log(`[StageController][updateStage] Task not found: ${newTask}`);
                    return tasks;
                }
                tasks.push(newTask);
            }
        }
        return tasks;
    }
}

module.exports = new UtilsController();