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
        } catch {
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[PremisesController][readAllPremisesByAddressId] Internal server error',
            });
        }
    }

    async readPremises(req, res) {
        const { premisesId } = req.params;
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
        } catch {
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
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[PremisesController][createPremises] Address not found',
                });
                return;
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

            const premisesId = uuidv4();
            const premises = {
                PremisesId: premisesId,
                Name: name,
                AddressId: addressId,
                PropertyType: propertyType,
            };

            const data = await PremisesService.createPremises(premises);
            if (data !== null) {
                res.status(200).json({
                    status: "success",
                    data: [{
                        premisesId: premisesId,
                        name: name,
                        addressId: addressId,
                        propertyType: propertyType,
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
        } catch {
            res.status(500).json({
                status: "failed",
                data: [],
                message: '[PremisesController][createPremises] Internal server error',
            });
        }
    }


}

module.exports = new PremisesController();