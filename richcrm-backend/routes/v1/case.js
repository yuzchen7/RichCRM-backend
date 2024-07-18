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
 * @apiSuccess {Number} premisesId Premises ID.
 * @apiSuccess {Number} clientType Client Type (0-Buyer, 1-Seller).
 * @apiSuccess {String} buyerId Buyer ID.
 * @apiSuccess {String} sellerId Seller ID.  
 * @apiSuccess {String} stage Stage of the case (0-Case Start, 1-Contract, 2-Mortgage, 3-Closing).
 * @apiSuccess {String} status Status of the case (0-Confirming, 1-Setup, 2-Go Over, 3-Signing, 4-Clear).
 * @apiSuccess {String} createAt Creation date of the case.
 * @apiSuccess {String} closingDate Closing date of the case.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "caseId": "0-98765-123456",
 *  "premisesId": 123456,
 *  "stage": 1,
 *  "status": 1,
 *  "clientType": 0,
 *  "buyerId": 98765,
 *  "createAt": "2024-07-18T19:52:16.672Z",
 *  "closingDate": "2024-07-20T20:04:24.740Z"
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
 * @api {post} v1/case/create Create a new case
 * @apiName CreateCase
 * @apiGroup Case
 *
 * @apiBody {String} premisesId Premises ID.
 * @apiBody {Number} clientType Client Type (0-Buyer, 1-Seller).
 * @apiBody {String} buyerId Buyer ID.
 * @apiBody {String} sellerId Seller ID.
 * @apiBody {String} stage Stage of the case (0-Case Start, 1-Contract, 2-Mortgage, 3-Closing).
 * @apiBody {String} status Status of the case (0-Confirming, 1-Setup, 2-Go Over, 3-Signing, 4-Clear).
 *
 * @apiSuccess {String} caseId Case ID.
 * @apiSuccess {Number} premisesId Premises ID.
 * @apiSuccess {Number} clientType Client Type (0-Buyer, 1-Seller).
 * @apiSuccess {String} buyerId Buyer ID.
 * @apiSuccess {String} sellerId Seller ID.  
 * @apiSuccess {String} stage Stage of the case (0-Case Start, 1-Contract, 2-Mortgage, 3-Closing).
 * @apiSuccess {String} status Status of the case (0-Confirming, 1-Setup, 2-Go Over, 3-Signing, 4-Clear).
 * @apiSuccess {String} createAt Creation date of the case.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "caseId": "0-98765-123456",
 *  "premisesId": 123456,
 *  "stage": 0,
 *  "status": 0,
 *  "clientType": 0,
 *  "buyerId": 98765,
 *  "createAt": "2024-07-18T19:52:16.672Z",
 * }
 */
router.post(
    "/create",
    check("premisesId")
        .notEmpty()
        .withMessage("Premises ID is required"),
    check("clientType")
        .notEmpty()
        .withMessage("Client Type is required"),
    check("stage")
        .notEmpty()
        .withMessage("Stage is required"),
    check("status")
        .notEmpty()
        .withMessage("Status is required"),
    validate,
    CaseController.createCase
);


/**
 * @api {post} v1/case/update Update a case
 * @apiName UpdateCase
 * @apiGroup Case
 *
 * @apiBody {String} caseId Case ID.
 * @apiBody {Number} stage Stage of the case (0-Case Start, 1-Contract, 2-Mortgage, 3-Closing).
 * @apiBody {Number} status Status of the case (0-Confirming, 1-Setup, 2-Go Over, 3-Signing, 4-Clear).
 * @apiBody {String} closingDate Closing date of the case.
 *
 * @apiSuccess {String} caseId Case ID.
 * @apiSuccess {String} stage Stage of the case (0-Case Start, 1-Contract, 2-Mortgage, 3-Closing).
 * @apiSuccess {String} status Status of the case (0-Confirming, 1-Setup, 2-Go Over, 3-Signing, 4-Clear).
 * @apiSuccess {String} closingDate Closing date of the case.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "caseId": "0-98765-123456",
 *  "stage": 0,
 *  "status": 0,
 *  "closingDate": "2024-07-18T19:52:16.672Z",
 * }
 */
router.post(
    "/update",
    check("caseId")
        .notEmpty()
        .withMessage("Case ID is required"),
    validate,
    CaseController.updateCase
);

/**
 * @api {post} v1/case/delete Delete a case
 * @apiName DeleteCase
 * @apiGroup Case
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