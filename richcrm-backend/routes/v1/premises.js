var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var PremisesController = require('../../controllers/premises');

const router = express.Router();

/**
 * @api {post} v1/premises/register Register a new premises
 * @apiName RegisterPremises
 * @apiGroup Premises
 * 
 * @apiBody {String} name Name of the Premises.
 * @apiBody {String} addressId Address ID of the Premises, created by the Address service.
 * @apiBody {Number} propertyType Property Type of the Premises (0-CONDO, 1-HOUSE, 2-CO_OP, 3-COMMERCIAL, 4-LAND, 5-CONDO_OP).
 * @apiSuccess {String} premisesId Premises ID.
 * @apiSuccess {String} name Name of the Premises.
 * @apiSuccess {Number} propertyType Property Type of the Premises (0-CONDO, 1-HOUSE, 2-CO_OP, 3-COMMERCIAL, 4-LAND, 5-CONDO_OP).
 * @apiSuccess {String} addressId Address ID of the Premises.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "premisesId": "e8218a59-f565-4860-8bb3-23121151d3b9",
 *  "name": "RichCRM",
 *  "addressId": "1600 AMPHITHEATRE PKWY, MOUNTAIN VIEW, CA 94043-1351 US",
 *  "propertyType": 2
 * }
 * 
 */
router.post(
    "/register",
    check("name")
        .notEmpty()
        .withMessage("Name is required"),
    check("addressId")
        .notEmpty()
        .withMessage("Address ID is required"),
    check("propertyType")
        .notEmpty()
        .isInt()
        .withMessage("Property Type is required"),
    validate,
    PremisesController.createPremises
);


/**
 * @api {get} v1/premises/:premisesId Read a premises by ID
 * @apiName ReadPremises
 * @apiGroup Premises
 * 
 * @apiParam {String} premisesId Premises ID.
 * 
 * @apiSuccess {String} premisesId Premises ID.
 * @apiSuccess {String} name Name of the Premises.
 * @apiSuccess {Number} block Block of the Premises.
 * @apiSuccess {Number} lot Lot of the Premises.
 * @apiSuccess {Number} section Section of the Premises.
 * @apiSuccess {Number} propertyType Property Type of the Premises (0-CONDO, 1-HOUSE, 2-CO_OP, 3-COMMERCIAL, 4-LAND, 5-CONDO_OP).
 * @apiSuccess {Boolean} vacantAtClosing Vacant at Closing.
 * @apiSuccess {Boolean} subjectToTenancy Subject to Tenancy.
 * @apiSuccess {Boolean} hoa HOA.
 * @apiSuccess {Number} parkingSpaces Number of Parking Spaces.
 * @apiSuccess {Number} maintenanceFee Maintenance Fee.
 * @apiSuccess {Number} maintenanceFeePer Maintenance Fee Per (0-Month, 1-Quarter, 2-Year).
 * @apiSuccess {Number} assessments Assessments.
 * @apiSuccess {String} assessmentsPaidById Assessments Paid By ID.
 * @apiSuccess {String} managingCompany Managing Company.
 * @apiSuccess {Boolean} isTwoFamily Is Two Family.
 * 
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "premisesId":"2ff1e12c-d65a-4bfb-86b8-2db1a562421f",
 *  "propertyType": 0,
 *  "addressId": "1600 AMPHITHEATRE PKWY, MOUNTAIN VIEW, CA 94043-1351 US",
 *  "name": "Test Premises #1",
 *  "block": 1,
 *  "lot": 1,
 *  "section": 1,
 *  "propertyType": 2,
 *  "vacantAtClosing": true,
 *  "subjectToTenancy": false,
 *  "hoa": true,
 *  "parkingSpaces": 2,
 *  "maintenanceFee": 100,
 *  "maintenanceFeePer": 1,
 *  "assessments": 100,
 *  "assessmentsPaidById": "123456",
 *  "managingCompany": "RichCRM",
 *  "isTwoFamily": false
 * }
 * 
 */
router.get(
    "/:premisesId",
    check("premisesId")
        .notEmpty()
        .withMessage("Premises ID is required"),
    validate,
    PremisesController.readPremises
);


/**
 * @api {post} v1/premises/query/address Query premises by Address ID
 * @apiName QueryPremisesByAddressId
 * @apiGroup Premises
 * 
 * @apiBody {String} addressId Address ID of the Premises, created by the Address service.
 * 
 * @apiSuccess {String} premisesId Premises ID.
 * @apiSuccess {Number} propertyType Property Type of the Premises (0-CONDO, 1-HOUSE, 2-CO_OP, 3-COMMERCIAL, 4-LAND, 5-CONDO_OP).
 * @apiSuccess {String} addressId Address ID of the Premises.
 * @apiSuccess {String} name Name of the Premises.
 * @apiSuccess {Number} block Block of the Premises.
 * @apiSuccess {Number} lot Lot of the Premises.
 * @apiSuccess {Number} section Section of the Premises.
 * @apiSuccess {Number} propertyType Property Type of the Premises (0-CONDO, 1-HOUSE, 2-CO_OP, 3-COMMERCIAL, 4-LAND, 5-CONDO_OP).
 * @apiSuccess {Boolean} vacantAtClosing Vacant at Closing.
 * @apiSuccess {Boolean} subjectToTenancy Subject to Tenancy.
 * @apiSuccess {Boolean} hoa HOA.
 * @apiSuccess {Number} parkingSpaces Number of Parking Spaces.
 * @apiSuccess {Number} maintenanceFee Maintenance Fee.
 * @apiSuccess {Number} maintenanceFeePer Maintenance Fee Per (0-Month, 1-Quarter, 2-Year).
 * @apiSuccess {Number} assessments Assessments.
 * @apiSuccess {String} assessmentsPaidById Assessments Paid By ID.
 * @apiSuccess {String} managingCompany Managing Company.
 * @apiSuccess {Boolean} isTwoFamily Is Two Family.
 * 
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "premisesId":"2ff1e12c-d65a-4bfb-86b8-2db1a562421f",
 *  "propertyType": 0,
 *  "addressId": "1600 AMPHITHEATRE PKWY, MOUNTAIN VIEW, CA 94043-1351 US",
 *  "name": "Test Premises #1",
 *  "block": 1,
 *  "lot": 1,
 *  "section": 1,
 *  "propertyType": 2,
 *  "vacantAtClosing": true,
 *  "subjectToTenancy": false,
 *  "hoa": true,
 *  "parkingSpaces": 2,
 *  "maintenanceFee": 100,
 *  "maintenanceFeePer": 1,
 *  "assessments": 100,
 *  "assessmentsPaidById": "123456",
 *  "managingCompany": "RichCRM",
 *  "isTwoFamily": false
 * }
 * 
 */
router.post(
    "/query/address",
    check("addressId")
        .notEmpty()
        .withMessage("Address ID is required"),
    validate,
    PremisesController.readAllPremisesByAddressId
);


/**
 * @api {post} v1/premises/update Update a premises
 * @apiName UpdatePremises
 * @apiGroup Premises
 * 
 * @apiBody {String} premisesId Premises ID.
 * @apiBody {String} addressId Address ID of the Premises, created by the Address service.
 * @apiBody {String} name Name of the Premises.
 * @apiBody {Number} block Block of the Premises.
 * @apiBody {Number} lot Lot of the Premises.
 * @apiBody {Number} section Section of the Premises.
 * @apiBody {Number} propertyType Property Type of the Premises (0-CONDO, 1-HOUSE, 2-CO_OP, 3-COMMERCIAL, 4-LAND, 5-CONDO_OP).
 * @apiBody {Boolean} vacantAtClosing Vacant at Closing.
 * @apiBody {Boolean} subjectToTenancy Subject to Tenancy.
 * @apiBody {Boolean} hoa HOA.
 * @apiBody {Number} parkingSpaces Number of Parking Spaces.
 * @apiBody {Number} maintenanceFee Maintenance Fee.
 * @apiBody {Number} maintenanceFeePer Maintenance Fee Per (0-Month, 1-Quarter, 2-Year).
 * @apiBody {Number} assessments Assessments.
 * @apiBody {String} assessmentsPaidById Assessments Paid By ID.
 * @apiBody {String} managingCompany Managing Company.
 * @apiBody {Boolean} isTwoFamily Is Two Family.
 * @apiBody {String} twoFamilyFirstFloorTenantId Tenant ID of the First Floor of the Two Family Premises.
 * @apiBody {String} twoFamilySecondFloorTenantId Tenant ID of the Second Floor of the Two Family Premises.
 * 
 * @apiSuccess {String} premisesId Premises ID.
 * @apiSuccess {String} addressId Address ID of the Premises.
 * @apiSuccess {String} name Name of the Premises.
 * @apiSuccess {Number} block Block of the Premises.
 * @apiSuccess {Number} lot Lot of the Premises.
 * @apiSuccess {Number} section Section of the Premises.
 * @apiSuccess {Number} propertyType Property Type of the Premises (0-CONDO, 1-HOUSE, 2-CO_OP, 3-COMMERCIAL, 4-LAND, 5-CONDO_OP).
 * @apiSuccess {Boolean} vacantAtClosing Vacant at Closing.
 * @apiSuccess {Boolean} subjectToTenancy Subject to Tenancy.
 * @apiSuccess {Boolean} hoa HOA.
 * @apiSuccess {Number} parkingSpaces Number of Parking Spaces.
 * @apiSuccess {Number} maintenanceFee Maintenance Fee.
 * @apiSuccess {Number} maintenanceFeePer Maintenance Fee Per (0-Month, 1-Quarter, 2-Year).
 * @apiSuccess {Number} assessments Assessments.
 * @apiSuccess {String} assessmentsPaidById Assessments Paid By ID.
 * @apiSuccess {String} managingCompany Managing Company.
 * @apiSuccess {Boolean} isTwoFamily Is Two Family.
 * 
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "premisesId":"2ff1e12c-d65a-4bfb-86b8-2db1a562421f",
 *  "propertyType": 0,
 *  "addressId": "1600 AMPHITHEATRE PKWY, MOUNTAIN VIEW, CA 94043-1351 US",
 *  "name": "Test Premises #1",
 *  "block": 1,
 *  "lot": 1,
 *  "section": 1,
 *  "propertyType": 2,
 *  "vacantAtClosing": true,
 *  "subjectToTenancy": false,
 *  "hoa": true,
 *  "parkingSpaces": 2,
 *  "maintenanceFee": 100,
 *  "maintenanceFeePer": 1,
 *  "assessments": 100,
 *  "assessmentsPaidById": "123456",
 *  "managingCompany": "RichCRM",
 *  "isTwoFamily": false
 * }
 */
router.post(
    "/update",
    check("premisesId")
        .notEmpty()
        .withMessage("Premises ID is required"),
    validate,
    PremisesController.updatePremises
)


/**
 * @api {post} v1/premises/delete Delete a premises
 * @apiName DeletePremises
 * @apiGroup Premises
 * 
 * @apiBody {String} premisesId Premises ID.
 * 
 * @apiSuccessExample Example data on success:
 * {}
 * 
 */
router.post(
    "/delete",
    check("premisesId")
        .notEmpty()
        .withMessage("Premises ID is required"),
    validate,
    PremisesController.deletePremises
);


module.exports = router;