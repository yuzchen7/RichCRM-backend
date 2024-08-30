var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var CaseController = require('../../controllers/case');


const router = express.Router();

/**
 * @api {get} v1/case/:caseId Get a case by ID
 * @apiName GetCase
 * @apiGroup Case
 *
 * @apiParam {String} caseId Case ID.
 *
 * @apiSuccess {String} caseId Case ID.
 * @apiSuccess {Number} creatorId Creator ID.
 * @apiSuccess {Number} premisesId Premises ID.
 * @apiSuccess {Number} caseType Client Type (0-PURCHASING, 1-SELLING).
 * @apiSuccess {String} buyerId Buyer ID.
 * @apiSuccess {String} sellerId Seller ID.  
 * @apiSuccess {String} stage Stage of the case (0-Case Setup, 1-Contract Preparing, 2-Contract Signing, 3-Mortgage, 4-Closing).
 * @apiSuccess {String} createAt Creation date of the case.
 * @apiSuccess {String} closeAt Date when the case was closed.
 * @apiSuccess {String} closingDate Closing date of the case.
 * @apiSuccess {String} mortgageContingencyDate Date when the mortgage contingency should be removed.
 * @apiSuccess {Array} additionalClients Additional clients in this case.
 * @apiSuccess {Array} contacts Contacts in this case.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "caseId": "0-98765-123456",
 *  "creatorId": "test1@gmail.com",
 *  "premisesId": "1820 NW 21st St #6A COMMERCIAL",
 *  "stage": 1,
 *  "caseType": 0,
 *  "buyerId": 98765,
 *  "createAt": "2024-07-18T19:52:16.672Z",
 *  "closeAt": "2024-07-18T19:52:16.672Z",
 *  "closingDate": "2024-07-20T20:04:24.740Z",
 *  "mortgageContingencyDate": "2024-07-20T20:04:24.740Z",
 *  "additionalClients": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *  "contacts": [
 *      "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *      "8c2bfe8d-0e87-4e19-8b32-d372188c56b2"
 *   ]
 * }
 */
router.get(
    "/:caseId",
    check("caseId")
        .notEmpty()
        .withMessage("Case ID is required"),
    validate,
    CaseController.readCase
);

/**
 * @api {post} v1/case/all Get all cases
 * @apiName GetAllCases
 * @apiGroup Case
 * 
 * @apiBody {String} creatorId Creator ID.
 * @apiBody {Boolean} closed Show closed cases or not (default: false).
 * 
 * @apiSuccess {String} caseId Case ID.
 * @apiSuccess {Number} creatorId Creator ID.
 * @apiSuccess {Number} premisesId Premises ID.
 * @apiSuccess {String} stage Stage of the case (0-Case Setup, 1-Contract Preparing, 2-Contract Signing, 3-Mortgage, 4-Closing).
 * @apiSuccess {String} stageId current Stage ID of this case.
 * @apiSuccess {Number} caseType Client Type (0-PURCHASING, 1-SELLING).
 * @apiSuccess {String} buyerId Buyer ID.
 * @apiSuccess {String} sellerId Seller ID.
 * @apiSuccess {String} createAt Creation date of the case.
 * @apiSuccess {String} closeAt Date when the case was closed.
 * @apiSuccess {String} closingDate Closing date of the case.
 * @apiSuccess {String} mortgageContingencyDate Date when the mortgage contingency should be removed.
 * @apiSuccess {Array} additionalClients Additional clients in this case.
 * @apiSuccess {Array} contacts Contacts in this case.
 * 
 * @apiSuccessExample Example data on success:
 * [{
 * "caseId": "badc8b89-1165-406b-7cds-f3d00d22ea74",
 *  "premisesId": "1820 NW 21st St #6A COMMERCIAL",
 *  "stage": 1,
 *  "caseStatus": 0,
 *  "stageId": "badc8b89-1165-406b-8cdd-f3d00d22ea74",
 *  "caseType": 0,
 *  "buyerId": "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *  "clientName": "Doe, John",
 *  "createAt": "2024-07-18T19:52:16.672Z",
 *  "closeAt": "2024-07-18T19:52:16.672Z",
 *  "closingDate": "2024-07-20T20:04:24.740Z",
 *  "mortgageContingencyDate": "2024-07-20T20:04:24.740Z",
 *  "additionalClients": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *  "contacts": [
 *      "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *      "8c2bfe8d-0e87-4e19-8b32-d372188c56b2"
 *   ]
 * }]
 * 
 */
router.post(
    "/all",
    check("creatorId")
        .notEmpty()
        .withMessage("Creator ID is required"),
    check("closed")
        .default(false),
    validate,
    CaseController.readAllCasesByCreatorId
);


/**
 * @api {post} v1/case/query/client Get all cases by client ID
 * @apiName GetAllCasesByClientId
 * @apiGroup Case
 * 
 * @apiBody {String} clientId Seller ID, Buyer ID, or Additional Client ID.
 * @apiBody {Boolean} closed Show closed cases or not (default: false).
 * 
 * @apiSuccess {String} caseId Case ID.
 * @apiSuccess {Number} creatorId Creator ID.
 * @apiSuccess {Number} premisesId Premises ID.
 * @apiSuccess {String} stage Stage of the case (0-Case Setup, 1-Contract Preparing, 2-Contract Signing, 3-Mortgage, 4-Closing).
 * @apiSuccess {String} stageId current Stage ID of this case.
 * @apiSuccess {Number} caseType Client Type (0-PURCHASING, 1-SELLING).
 * @apiSuccess {String} buyerId Buyer ID.
 * @apiSuccess {String} sellerId Seller ID.
 * @apiSuccess {String} createAt Creation date of the case.
 * @apiSuccess {String} closeAt Date when the case was closed.
 * @apiSuccess {String} closingDate Closing date of the case.
 * @apiSuccess {String} mortgageContingencyDate Date when the mortgage contingency should be removed.
 * @apiSuccess {Array} additionalClients Additional clients in this case.
 * @apiSuccess {Array} contacts Contacts in this case.
 * 
 * @apiSuccessExample Example data on success:
 * [{
 * "caseId": "badc8b89-1165-406b-7cds-f3d00d22ea74",
 *  "premisesId": "1820 NW 21st St #6A COMMERCIAL",
 *  "stage": 1,
 *  "caseStatus": 0,
 *  "stageId": "badc8b89-1165-406b-8cdd-f3d00d22ea74",
 *  "caseType": 0,
 *  "buyerId": "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *  "clientName": "Doe, John",
 *  "createAt": "2024-07-18T19:52:16.672Z",
 *  "closeAt": "2024-07-18T19:52:16.672Z",
 *  "closingDate": "2024-07-20T20:04:24.740Z",
 *  "mortgageContingencyDate": "2024-07-20T20:04:24.740Z",
 *  "additionalClients": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *  "contacts": [
 *      "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *      "8c2bfe8d-0e87-4e19-8b32-d372188c56b2"
 *   ]
 * }]
 * 
 */
router.post(
    "/query/client",
    check("clientId")
        .notEmpty()
        .withMessage("Client ID is required"),
    check("closed")
        .default(false),
    validate,
    CaseController.readAllCasesByClientId
)


/**
 * @api {post} v1/case/query/contact Get all cases by contact ID
 * @apiName GetAllCasesByContactId
 * @apiGroup Case
 * 
 * @apiBody {String} contactId Contact ID.
 * @apiBody {Boolean} closed Show closed cases or not (default: false).
 * 
 * 
 * @apiSuccess {String} caseId Case ID.
 * @apiSuccess {Number} creatorId Creator ID.
 * @apiSuccess {Number} premisesId Premises ID.
 * @apiSuccess {String} stage Stage of the case (0-Case Setup, 1-Contract Preparing, 2-Contract Signing, 3-Mortgage, 4-Closing).
 * @apiSuccess {String} stageId current Stage ID of this case.
 * @apiSuccess {Number} caseType Client Type (0-PURCHASING, 1-SELLING).
 * @apiSuccess {String} buyerId Buyer ID.
 * @apiSuccess {String} sellerId Seller ID.
 * @apiSuccess {String} createAt Creation date of the case.
 * @apiSuccess {String} closeAt Date when the case was closed.
 * @apiSuccess {String} closingDate Closing date of the case.
 * @apiSuccess {String} mortgageContingencyDate Date when the mortgage contingency should be removed.
 * @apiSuccess {Array} additionalClients Additional clients in this case.
 * @apiSuccess {Array} contacts Contacts in this case.
 * 
 * @apiSuccessExample Example data on success:
 * [{
 * "caseId": "badc8b89-1165-406b-7cds-f3d00d22ea74",
 *  "premisesId": "1820 NW 21st St #6A COMMERCIAL",
 *  "stage": 1,
 *  "caseStatus": 0,
 *  "stageId": "badc8b89-1165-406b-8cdd-f3d00d22ea74",
 *  "caseType": 0,
 *  "buyerId": "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *  "clientName": "Doe, John",
 *  "createAt": "2024-07-18T19:52:16.672Z",
 *  "closeAt": "2024-07-18T19:52:16.672Z",
 *  "closingDate": "2024-07-20T20:04:24.740Z",
 *  "mortgageContingencyDate": "2024-07-20T20:04:24.740Z",
 *  "additionalClients": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *  "contacts": [
 *      "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *      "8c2bfe8d-0e87-4e19-8b32-d372188c56b2"
 *   ]
 * }]
 * 
 */
router.post(
    "/query/contact",
    check("contactId")
        .notEmpty()
        .withMessage("Contact ID is required"),
    check("closed")
        .default(false),
    validate,
    CaseController.readAllCasesByContactId
)


/**
 * @api {post} v1/case/create Create a new case
 * @apiName CreateCase
 * @apiGroup Case
 * @apiDescription Create a new case, **the stage object will be created accordingly, its stageId will be returned**!
 *
 * @apiBody {String} premisesId Premises ID.
 * @apiBody {String} creatorId Creator ID.
 * @apiBody {Number} caseType Client Type (0-PURCHASING, 1-SELLING).
 * @apiBody {String} buyerId Buyer ID.
 * @apiBody {String} sellerId Seller ID.
 * @apiBody {String} stage Stage of the case (0-Case Setup, 1-Contract Preparing, 2-Contract Signing, 3-Mortgage, 4-Closing).
 * @apiBody {Array} additionalClients Additional clients in this case.
 * @apiBody {Array} contacts Contacts in this case.
 *
 * @apiSuccess {String} caseId Case ID.
 * @apiSuccess {Number} creatorId Creator ID.
 * @apiSuccess {Number} premisesId Premises ID.
 * @apiSuccess {Number} caseType Client Type (0-PURCHASING, 1-SELLING).
 * @apiSuccess {String} buyerId Buyer ID.
 * @apiSuccess {String} sellerId Seller ID.  
 * @apiSuccess {String} stage Stage of the case (0-Case Setup, 1-Contract Preparing, 2-Contract Signing, 3-Mortgage, 4-Closing).
 * @apiSuccess {String} stageId Stage ID created by input stage.
 * @apiSuccess {String} createAt Creation date of the case.
 * @apiSuccess {Array} additionalClients Additional clients in this case.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "caseId": "0-98765-123456",
 *  "creatorId": "test1@gmail.com",
 *  "premisesId": "1820 NW 21st St #6A COMMERCIAL",
 *  "stage": 0,
 *  "stageId": "badc8b89-1165-406b-8cdd-f3d00d22ea74",
 *  "caseType": 0,
 *  "buyerId": 98765,
 *  "createAt": "2024-07-18T19:52:16.672Z",
 *  "additionalClients": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *  "contacts": [
 *      "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *      "8c2bfe8d-0e87-4e19-8b32-d372188c56b2"
 *   ]
 * }
 */
router.post(
    "/create",
    check("premisesId")
        .notEmpty()
        .withMessage("Premises ID is required"),
    check("creatorId")
        .notEmpty()
        .withMessage("Creator ID is required"),
    check("caseType")
        .notEmpty()
        .withMessage("Client Type is required"),
    check("stage")
        .notEmpty()
        .withMessage("Stage is required"),
    check("additionalClients")
        .optional()
        .isArray()
        .withMessage("Additional Clients should be an array"),
    check("contacts")
        .optional()
        .isArray()
        .withMessage("Contacts should be an array"),
    validate,
    CaseController.createCase
);


/**
 * @api {post} v1/case/update Update a case
 * @apiName UpdateCase
 * @apiGroup Case
 * @apiDescription Update a case by ID, **if the stage is updated, the new stage will be created and the stageId will be returned**!
 *
 * @apiBody {String} caseId Case ID.
 * @apiBody {String} creatorId Creator ID.
 * @apiBody {Number} stage Stage of the case (0-Case Setup, 1-Contract Preparing, 2-Contract Signing, 3-Mortgage, 4-Closing).
 * @apiBody {String} closeAt Date when the case was closed.
 * @apiBody {String} closingDate Closing date of the case.
 * @apiBody {String} mortgageContingencyDate Date when the mortgage contingency should be removed.
 * @apiBody {Array} additionalClients Additional clients in this case.
 * @apiBody {Array} contacts Contacts in this case.
 * 
 *
 * @apiSuccess {String} caseId Case ID.
 * @apiSuccess {Number} creatorId Creator ID.
 * @apiSuccess {Number} stage Stage of the case (0-Case Setup, 1-Contract Preparing, 2-Contract Signing, 3-Mortgage, 4-Closing).
 * @apiSuccess {String} stageId new Stage ID created or old Stage ID if the stage remain unchanged.
 * @apiSuccess {String} status Status of the case (0-Confirming, 1-Setup, 2-Go Over, 3-Signing, 4-Clear).
 * @apiSuccess {String} closeAt Date when the case was closed.
 * @apiSuccess {String} closingDate Closing date of the case.
 * @apiSuccess {String} mortgageContingencyDate Date when the mortgage contingency should be removed.
 * @apiSuccess {Array} additionalClients Additional clients in this case.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "caseId": "0-98765-123456",
 *  "creatorId": "test1@gmail.com",
 *  "stage": 0,
 *  "stageId": "badc8b89-1165-406b-8cdd-f3d00d22ea74",
 *  "status": 0,
 *  "closeAt": "2024-07-18T19:52:16.672Z",
 *  "closingDate": "2024-07-18T19:52:16.672Z",
 *  "mortgageContingencyDate": "2024-07-18T19:52:16.672Z",
 *  "additionalClients": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *  "contacts": [
 *      "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *      "8c2bfe8d-0e87-4e19-8b32-d372188c56b2"
 *   ]
 * }
 */
router.post(
    "/update",
    check("caseId")
        .notEmpty()
        .withMessage("Case ID is required"),
    check("additionalClients")
        .optional()
        .isArray()
        .withMessage("Additional Clients should be an array"),
    check("contacts")
        .optional()
        .isArray()
        .withMessage("Contacts should be an array"),
    validate,
    CaseController.updateCase
);


/**
 * @api {post} v1/case/close Close a case
 * @apiName CloseCase
 * @apiGroup Case
 * 
 * @apiBody {String} caseId Case ID.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "caseId": "0-98765-123456",
 *  "creatorId": "test1@gmail.com",
 *  "stage": 0,
 *  "stageId": "badc8b89-1165-406b-8cdd-f3d00d22ea74",
 *  "status": 0,
 *  "closeAt": "2024-07-18T19:52:16.672Z",
 *  "closingDate": "2024-07-18T19:52:16.672Z",
 *  "mortgageContingencyDate": "2024-07-18T19:52:16.672Z",
 *  "additionalClients": [
 *      "7c377ce8-d6d5-4823-b60f-92ce5603d53f",
 *      "03c290cf-1758-4edc-95d5-be61f2339fd6",
 *      "b4e53724-6e7b-4070-be8a-d6c78d961ade"
 *   ],
 *  "contacts": [
 *      "8d587c04-0d59-4b70-8264-922d26bf6f00",
 *      "8c2bfe8d-0e87-4e19-8b32-d372188c56b2"
 *   ]
 * }
 */
router.post(
    "/close",
    check("caseId")
        .notEmpty()
        .withMessage("Case ID is required"),
    validate,
    CaseController.closeCase
)

/**
 * @api {post} v1/case/delete Delete a case
 * @apiName DeleteCase
 * @apiGroup Case
 * @apiDescription Delete a case by ID. **Note that all stages and tasks related to the case will be deleted as well**!
 *
 * @apiBody {String} caseId Case ID.
 * 
 * @apiSuccessExample Example data on success:
 * {}
 */
router.post(
    "/delete",
    check("caseId")
        .notEmpty()
        .withMessage("Case ID is required"),
    validate,
    CaseController.deleteCase
)

module.exports = router;