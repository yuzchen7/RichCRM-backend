const PremisesService = require('../db/premises/premises.service');
const AddressService = require('../db/address/address.service');
const ClientService = require('../db/client/client.service');

const Types = require('../db/types');
const { v4: uuidv4 } = require('uuid');

class PremisesController {

    async readAllPremisesByAddressId(req, res) {
        const { addressId } = req.body;
        try {
            var premisesList = [];
            const premises = await PremisesService.readPremisesByAddressId(addressId);
            if (premises !== null) {
                premises.forEach(p => {
                    premisesList.push({
                        premisesId: p.PremisesId,
                        addressId: p.AddressId,
                        name: p.Name,
                        block: p.Block,
                        lot: p.Lot,
                        section: p.Section,
                        propertyType: p.PropertyType,
                        vacantAtClosing: p.VacantAtClosing,
                        subjectToTenancy: p.SubjectToTenancy,
                        hoa: p.HOA,
                        parkingSpaces: p.ParkingSpaces,
                        maintenanceFee: p.MaintenanceFee,
                        maintenanceFeePer: p.MaintenanceFeePer,
                        assessments: p.Assessments,
                        assessmentsPaidById: p.AssessmentsPaidById,
                        managingCompany: p.ManagingCompany,
                        isTwoFamily: p.IsTwoFamily,
                        twoFamilyFirstFloorTenantId: p.TwoFamilyFirstFloorTenantId,
                        twoFamilySecondFloorTenantId: p.TwoFamilySecondFloorTenantId,
                    });
                });
            }
            res.status(200).json({
                status: "success",
                data: premisesList,
                message: '[PremisesController][readAllPremisesByAddressId] Successfully retrieved all premises by addressId',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[PremisesController][readAllPremisesByAddressId] Internal server error',
            });
        }
    }

    async readPremises(req, res) {
        const { premisesId } = req.body;
        try {
            const premises = await PremisesService.readPremises(premisesId);
            if (premises === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[PremisesController][readPremises] Premises not found',
                });
            }
            res.status(200).json({
                status: "success",
                data: [{
                    premisesId: premises.PremisesId,
                    addressId: premises.AddressId,
                    name: premises.Name,
                    block: premises.Block,
                    lot: premises.Lot,
                    section: premises.Section,
                    propertyType: premises.PropertyType,
                    vacantAtClosing: premises.VacantAtClosing,
                    subjectToTenancy: premises.SubjectToTenancy,
                    hoa: premises.HOA,
                    parkingSpaces: premises.ParkingSpaces,
                    maintenanceFee: premises.MaintenanceFee,
                    maintenanceFeePer: premises.MaintenanceFeePer,
                    assessments: premises.Assessments,
                    assessmentsPaidById: premises.AssessmentsPaidById,
                    managingCompany: premises.ManagingCompany,
                    isTwoFamily: premises.IsTwoFamily,
                    twoFamilyFirstFloorTenantId: premises.TwoFamilyFirstFloorTenantId,
                    twoFamilySecondFloorTenantId: premises.TwoFamilySecondFloorTenantId,
                }],
                message: '[PremisesController][readPremises] Successfully retrieved premises',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[PremisesController][readPremises] Internal server error',
            });
        }
    }

    async createPremises(req, res) {
        const {
            name,
            addressId,
            propertyType,
        } = req.body;

        try {
            // Check if the address exists
            const address = await AddressService.readAddress(addressId);
            if (address === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[PremisesController][createPremises] Address not found',
                });
            }

            // Check if the property type is valid
            const propertyTypeEnum = Types.castIntToEnum(Types.propertyType, propertyType);
            if (propertyTypeEnum === undefined) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[PremisesController][createPremises] Invalid property type',
                });
            }

            // Parse premises ID and name
            var addressLine2 = address.AddressLine2;
            if (addressLine2 === undefined) {
                addressLine2 = '';
            }
            const premisesId = `${address.AddressLine1} #${addressLine2} ${propertyTypeEnum}`;

            const premises = {
                premisesId: premisesId,
                name: premisesId,
                addressId: addressId,
                propertyType: propertyType,
            };

            const p = await PremisesService.createPremises(premises);
            if (p !== null) {
                res.status(200).json({
                    status: "success",
                    data: [{
                        premisesId: p.PremisesId,
                        name: p.Name,
                        addressId: p.AddressId,
                        propertyType: p.PropertyType,
                    }],
                    message: '[PremisesController][createPremises] Successfully created premises',
                });
            } else {
                res.status(500).json({
                    status: "failed",
                    data: [],
                    message: '[PremisesController][createPremises] Internal server error',
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[PremisesController][createPremises] Internal server error: ${error}`,
            });
        }
    }

    async updatePremises(req, res) {
        const {
            premisesId,
            name,
            addressId,
            block,
            lot,
            section,
            propertyType,
            vacantAtClosing,
            subjectToTenancy,
            hoa,
            parkingSpaces,
            maintenanceFee,
            maintenanceFeePer,
            assessments,
            assessmentsPaidById,
            managingCompany,
            isTwoFamily,
            twoFamilyFirstFloorTenantId,
            twoFamilySecondFloorTenantId,
        } = req.body;

        try {
            // Get the premises object
            const premises = await PremisesService.readPremises(premisesId);
            if (premises === null) {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[PremisesController][updatePremises] Premises not found',
                });
                return;
            }

            var premisesObj = {
                premisesId: premisesId,
                name: premises.Name,
                addressId: premises.AddressId,
                block: premises.Block,
                lot: premises.Lot,
                section: premises.Section,
                propertyType: premises.PropertyType,
                vacantAtClosing: premises.VacantAtClosing,
                subjectToTenancy: premises.SubjectToTenancy,
                hoa: premises.HOA,
                parkingSpaces: premises.ParkingSpaces,
                maintenanceFee: premises.MaintenanceFee,
                maintenanceFeePer: premises.MaintenanceFeePer,
                assessments: premises.Assessments,
                assessmentsPaidById: premises.AssessmentsPaidById,
                managingCompany: premises.ManagingCompany,
                isTwoFamily: premises.IsTwoFamily,
                twoFamilyFirstFloorTenantId: premises.TwoFamilyFirstFloorTenantId,
                twoFamilySecondFloorTenantId: premises.TwoFamilySecondFloorTenantId,
            };

            console.log(premisesObj);


            // Check if the premises exists
            if (premisesId !== undefined) {
                const premises = await PremisesService.readPremises(premisesId);
                if (premises === null) {
                    res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[PremisesController][updatePremises] Premises not found',
                    });
                    return;
                }
                premisesObj.premisesId = premisesId;
            }

            // Check if the address exists
            if (addressId !== undefined) {
                const address = await AddressService.readAddress(addressId);
                if (address === null) {
                    res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[PremisesController][updatePremises] Address not found',
                    });
                    return;
                }
                premisesObj.addressId = addressId;
            }

            // Check if the property type is valid
            if (propertyType !== undefined) {
                const propertyTypeEnum = Types.castIntToEnum(Types.propertyType, propertyType);
                if (propertyTypeEnum === undefined) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[PremisesController][updatePremises] Invalid property type',
                    });
                }
                premisesObj.propertyType = propertyType;
            }

            // Update name
            if (name !== undefined) {
                premisesObj.name = name;
            }

            // Update block
            if (block !== undefined) {
                premisesObj.block = block;
            }

            // Update lot
            if (lot !== undefined) {
                premisesObj.lot = lot;
            }

            // Update section
            if (section !== undefined) {
                premisesObj.section = section;
            }

            // Update vacantAtClosing
            if (vacantAtClosing !== undefined) {
                premisesObj.vacantAtClosing = vacantAtClosing;
            }

            // Update subjectToTenancy
            if (subjectToTenancy !== undefined) {
                premisesObj.subjectToTenancy = subjectToTenancy;
            }

            // Update hoa
            if (hoa !== undefined) {
                premisesObj.hoa = hoa;
            }

            // Update parkingSpaces
            if (parkingSpaces !== undefined) {
                premisesObj.parkingSpaces = parkingSpaces;
            }

            // Update maintenanceFee
            if (maintenanceFee !== undefined) {
                premisesObj.maintenanceFee = maintenanceFee;
            }

            // Update maintenanceFeePer
            if (maintenanceFeePer !== undefined) {
                const maintenanceFeePerEnum = Types.castIntToEnum(Types.maintenanceFeePer, maintenanceFeePer);
                if (maintenanceFeePerEnum === undefined) {
                    return res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[PremisesController][updatePremises] Invalid maintenance fee per',
                    });
                }

                premisesObj.maintenanceFeePer = maintenanceFeePer;
            }

            // Update assessments
            if (assessments !== undefined) {
                premisesObj.assessments = assessments;
            }

            // Update assessmentsPaidById
            if (assessmentsPaidById !== undefined) {
                premisesObj.assessmentsPaidById = assessmentsPaidById;
            }

            // Update managingCompany
            if (managingCompany !== undefined) {
                premisesObj.managingCompany = managingCompany;
            }

            // Update isTwoFamily
            if (isTwoFamily !== undefined) {
                premisesObj.isTwoFamily = isTwoFamily;
            }

            // Update twoFamilyFirstFloorTenantId
            if (twoFamilyFirstFloorTenantId !== undefined) {
                const client = await ClientService.readClient(twoFamilyFirstFloorTenantId);
                if (client === null) {
                    res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[PremisesController][updatePremises] Two-family first floor tenant not found',
                    });
                    return;
                }
                premisesObj.twoFamilyFirstFloorTenantId = twoFamilyFirstFloorTenantId;
            }

            // Update twoFamilySecondFloorTenantId
            if (twoFamilySecondFloorTenantId !== undefined) {
                const client = await ClientService.readClient(twoFamilySecondFloorTenantId);
                if (client === null) {
                    res.status(400).json({
                        status: "failed",
                        data: [],
                        message: '[PremisesController][updatePremises] Two-family second floor tenant not found',
                    });
                    return;
                }
                premisesObj.twoFamilySecondFloorTenantId = twoFamilySecondFloorTenantId;
            }

            const p = await PremisesService.updatePremises(premisesObj);
            if (p !== null) {
                res.status(200).json({
                    status: "success",
                    data: [{
                        premisesId: p.PremisesId,
                        name: p.Name,
                        addressId: p.AddressId,
                        block: p.Block,
                        lot: p.Lot,
                        section: p.Section,
                        propertyType: p.PropertyType,
                        vacantAtClosing: p.VacantAtClosing,
                        subjectToTenancy: p.SubjectToTenancy,
                        hoa: p.HOA,
                        parkingSpaces: p.ParkingSpaces,
                        maintenanceFee: p.MaintenanceFee,
                        maintenanceFeePer: p.MaintenanceFeePer,
                        assessments: p.Assessments,
                        assessmentsPaidById: p.AssessmentsPaidById,
                        managingCompany: p.ManagingCompany,
                        isTwoFamily: p.IsTwoFamily,
                        twoFamilyFirstFloorTenantId: p.TwoFamilyFirstFloorTenantId,
                        twoFamilySecondFloorTenantId: p.TwoFamilySecondFloorTenantId,
                    }],
                    message: '[PremisesController][updatePremises] Successfully updated premises',
                });
            } else {
                res.status(500).json({
                    status: "failed",
                    data: [],
                    message: '[PremisesController][updatePremises] Internal server error',
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[PremisesController][updatePremises] Internal server error',
            });
        }
    }

    async deletePremises(req, res) {
        const { premisesId } = req.body;
        try {
            const premises = await PremisesService.readPremises(premisesId);
            if (premises === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[PremisesController][deletePremises] Premises not found',
                });
            }

            const data = await PremisesService.deletePremises(premisesId);
            if (data !== null) {
                res.status(200).json({
                    status: "success",
                    data: [],
                    message: '[PremisesController][deletePremises] Successfully deleted premises',
                });
            } else {
                res.status(500).json({
                    status: "failed",
                    data: [],
                    message: '[PremisesController][deletePremises] DeletePremises error',
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[PremisesController][deletePremises] Internal server error',
            });
        }
    }
}

module.exports = new PremisesController();