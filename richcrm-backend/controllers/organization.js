var OrganizationService = require("../db/organization/organization.service");
var AddressService = require("../db/address/address.service");
const { v4: uuidv4 } = require('uuid');
const Types = require("../db/types");

class OrganizationController {
    constructor() {
    }


    async registerOrganization(req, res) {
        const { organizationId, organizationName, organizationType, cellNumber, email, website, addressId } = req.body;

        try {

            // Check if organizationId is provided
            if (organizationId !== undefined) {
                const existingOrganization = await OrganizationService.readOrganization(organizationId);
                if (existingOrganization !== null) {
                    return res.status(200).json({
                        status: "success",
                        data: [{
                            organizationId: existingOrganization.OrganizationId,
                            organizationName: existingOrganization.OrganizationName,
                            organizationType: existingOrganization.OrganizationType,
                            cellNumber: existingOrganization.CellNumber,
                            email: existingOrganization.Email,
                            website: existingOrganization.Website,
                            addressId: existingOrganization.AddressId
                        }],
                        message: '[OrganizationController][registerOrganization] Organization already exists'
                    });
                }
            }

            // Check if organizationType is valid
            if (Types.castIntToEnum(Types.organizationType, organizationType) === undefined) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[OrganizationController][registerOrganization] Invalid organization type'
                });
            }

            // Check if addressId is valid
            if (addressId !== undefined) {
                const existingAddress = await AddressService.readAddress(addressId);
                if (existingAddress === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[OrganizationController][registerOrganization] Invalid address'
                    });
                }
            }

            const organization = await OrganizationService.createOrganization({
                organizationId: uuidv4(),
                organizationName: organizationName,
                organizationType: organizationType,
                cellNumber: cellNumber,
                email: email,
                website: website,
                addressId: addressId
            });
            console.log(organization);
            if (organization !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [{
                        organizationId: organization.OrganizationId,
                        organizationName: organization.OrganizationName,
                        organizationType: organization.OrganizationType,
                        cellNumber: organization.CellNumber,
                        email: organization.Email,
                        website: organization.Website,
                        addressId: organization.AddressId
                    }],
                    message: '[OrganizationController][registerOrganization] Organization created successfully'
                });
            } else {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[OrganizationController][registerOrganization] Failed to create organization'
                });
            }
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[OrganizationController][registerOrganization] Internal server error: ${error}`
            });
        }
    }

    async getOrganization(req, res) {
        const { organizationId } = req.params;

        try {
            const organization = await OrganizationService.readOrganization(organizationId);
            if (organization !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [{
                        organizationId: organization.OrganizationId,
                        organizationName: organization.OrganizationName,
                        organizationType: organization.OrganizationType,
                        cellNumber: organization.CellNumber,
                        email: organization.Email,
                        website: organization.Website,
                        addressId: organization.AddressId
                    }],
                    message: '[OrganizationController][getOrganization] Organization found'
                });
            } else {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[OrganizationController][getOrganization] Organization not found'
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[OrganizationController][getOrganization] Internal server error: ${error}`
            });
        }
    }

    async getOrganizationByType(req, res) {
        const { organizationType } = req.body;

        try {
            // Check if organizationType is valid
            if (Types.castIntToEnum(Types.organizationType, organizationType) === undefined) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[OrganizationController][getOrganizationByType] Invalid organization type'
                });
            }
            
            var organizationList = [];
            const organizations = await OrganizationService.readOrganizationsByType(organizationType);
            if (organizations !== null) {
                organizations.forEach(organization => {
                    organizationList.push({
                        organizationId: organization.OrganizationId,
                        organizationName: organization.OrganizationName,
                        organizationType: organization.OrganizationType,
                        cellNumber: organization.CellNumber,
                        email: organization.Email,
                        website: organization.Website,
                        addressId: organization.AddressId
                    });
                });
                return res.status(200).json({
                    status: "success",
                    data: organizationList,
                    message: '[OrganizationController][getOrganizationByType] Organizations retrieved successfully'
                });
            } else {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[OrganizationController][getOrganizationByType] Organizations not found'
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[OrganizationController][getOrganizationByType] Internal server error: ${error}`
            });
        }
    }

    async getOrganizationByKeyWord(req, res) {
        const { keyword } = req.body;

        try {
            var organizationList = [];
            const organizations = await OrganizationService.readOrganizationByKeyWord(keyword);
            if (organizations !== null) {
                organizations.forEach(organization => {
                    organizationList.push({
                        organizationId: organization.OrganizationId,
                        organizationName: organization.OrganizationName,
                        organizationType: organization.OrganizationType,
                        cellNumber: organization.CellNumber,
                        email: organization.Email,
                        website: organization.Website,
                        addressId: organization.AddressId
                    });
                });
                return res.status(200).json({
                    status: "success",
                    data: organizationList,
                    message: '[OrganizationController][getOrganizationByKeyWord] Organizations retrieved successfully'
                });
            } else {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[OrganizationController][getOrganizationByKeyWord] Organizations not found'
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[OrganizationController][getOrganizationByKeyWord] Internal server error: ${error}`
            });
        }
    }

    async updateOrganization(req, res) {
        
        const { organizationId, organizationName, organizationType, cellNumber, email, website, addressId } = req.body;

        try {
            // Check if organizationId is valid
            const existingOrganization = await OrganizationService.readOrganization(organizationId);
            if (existingOrganization === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[OrganizationController][updateOrganization] Organization not found'
                });
            }

            var organizationObj = {
                organizationId: existingOrganization.OrganizationId,
                organizationName: existingOrganization.OrganizationName,
                organizationType: existingOrganization.OrganizationType,
                cellNumber: existingOrganization.CellNumber,
                email: existingOrganization.Email,
                website: existingOrganization.Website,
                addressId: existingOrganization.AddressId
            }

            // Check if organizationType is valid
            if (Types.castIntToEnum(Types.organizationType, organizationType) !== undefined) {
                organizationObj.organizationType = organizationType;
            }

            // Check if addressId is valid
            if (addressId !== undefined && addressId !== "" && addressId !== existingOrganization.AddressId) {
                const existingAddress = await AddressService.readAddress(addressId);
                if (existingAddress === null) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[OrganizationController][updateOrganization] Invalid address'
                    });
                }
                organizationObj.addressId = addressId;
            }

            if (organizationName !== undefined && organizationName !== "" && organizationName !== existingOrganization.OrganizationName) {
                organizationObj.organizationName = organizationName;
            }

            if (cellNumber !== undefined && cellNumber !== "" && cellNumber !== existingOrganization.CellNumber) {
                organizationObj.cellNumber = cellNumber;
            }

            if (email !== undefined && email !== "" && email !== existingOrganization.Email) {
                organizationObj.email = email;
            }

            if (website !== undefined && website !== "" && website !== existingOrganization.Website) {
                organizationObj.website = website;
            }

            const organization = await OrganizationService.updateOrganization(organizationObj);
            if (organization !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [organizationObj],
                    message: '[OrganizationController][updateOrganization] Organization updated successfully'
                });
            } else {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[OrganizationController][updateOrganization] Failed to update organization'
                });
            }
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[OrganizationController][updateOrganization] Internal server error: ${error}`
            });
        }
    }

    async deleteOrganization(req, res) {
        const { organizationId } = req.body;

        try {
            const organization = await OrganizationService.deleteOrganization(organizationId);
            if (organization !== null) {
                return res.status(200).json({
                    status: "success",
                    data: [],
                    message: '[OrganizationController][deleteOrganization] Organization deleted successfully'
                });
            } else {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[OrganizationController][deleteOrganization] Organization not found'
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[OrganizationController][deleteOrganization] Internal server error: ${error}`
            });
        }
    }
}

module.exports = new OrganizationController();