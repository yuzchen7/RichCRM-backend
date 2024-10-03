var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var OrganizationController = require('../../controllers/organization');

const router = express.Router();

/**
 * @api {post} v1/organization/register Register Organization
 * @apiName RegisterOrganization
 * @apiGroup Organization
 * 
 * @apiBody {String} organizationId [Optional] Organization ID (will return the an existing organization).
 * @apiBody {Number} organizationType Organization Type (0-OTHER, 1-COMPANY, 2-TRUST).
 * @apiBody {String} organizationName Name of the Organization.
 * @apiBody {String} cellNumber [Optional] Cell Number of the Organization.
 * @apiBody {String} email [Optional] Email of the Organization.
 * @apiBody {String} website [Optional] Website of the Organization.
 * @apiBody {String} addressId [Optional] Address ID of the Organization.
 * 
 * 
 * @apiSuccess {String} organizationId Organization ID.
 * @apiSuccess {String} organizationName Name of the Organization.
 * @apiSuccess {Number} organizationType Organization Type (0-OTHER, 1-COMPANY, 2-TRUST).
 * @apiSuccess {String} cellNumber Cell Number of the Organization.
 * @apiSuccess {String} email Email of the Organization.
 * @apiSuccess {String} website Website of the Organization.
 * @apiSuccess {String} addressId Address ID of the Organization.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *    "organizationId": "449a5faa-6377-4604-9361-fbd3e412c299",
 *    "organizationName": "Test Organization Updated",
 *    "organizationType": 2,
 *    "cellNumber": "1234567890",
 *    "email": "xyz@gmail.com",
 *    "website": "www.test.com",
 *    "addressId": "New York NY 10012-1296"
 * }
 * 
 */
router.post(
    "/register",
    check("organizationId")
        .optional()
        .isUUID()
        .withMessage("Organization Id should be a valid UUID"),
    check("organizationType")
        .notEmpty()
        .withMessage("Organization Type is required"),
    check("organizationName")
        .notEmpty()
        .withMessage("Organization Name is required"),
    check("cellNumber")
        .optional()
        .isMobilePhone()
        .withMessage("Cell Number should be a valid phone number"),
    check("email")
        .optional()
        .isEmail()
        .withMessage("Email should be a valid email address"),
    check("website")
        .optional()
        .isURL()
        .withMessage("Website should be a valid URL"),
    validate,
    OrganizationController.registerOrganization
);


/**
 * @api {get} v1/organization/:organizationId Get Organization
 * @apiName GetOrganization
 * @apiGroup Organization
 * 
 * @apiParam {String} organizationId Organization ID.
 * 
 * @apiSuccess {String} organizationId Organization ID.
 * @apiSuccess {String} organizationName Name of the Organization.
 * @apiSuccess {Number} organizationType Organization Type (0-OTHER, 1-COMPANY, 2-TRUST).
 * @apiSuccess {String} cellNumber Cell Number of the Organization.
 * @apiSuccess {String} email Email of the Organization.
 * @apiSuccess {String} website Website of the Organization.
 * @apiSuccess {String} addressId Address ID of the Organization.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *    "organizationId": "449a5faa-6377-4604-9361-fbd3e412c299",
 *    "organizationName": "Test Organization Updated",
 *    "organizationType": 2,
 *    "cellNumber": "1234567890",
 *    "email": "xyz@gmail.com",
 *    "website": "www.test.com",
 *    "addressId": "New York NY 10012-1296"
 * }
 */
router.get(
    "/:organizationId",
    check("organizationId")
        .notEmpty()
        .isUUID()
        .withMessage("Organization Id should be a valid UUID"),
    validate,
    OrganizationController.getOrganization
)


/**
 * @api {post} v1/organization/query/type Get Organization by Type
 * @apiName GetOrganizationByType
 * @apiGroup Organization
 * 
 * @apiBody {Number} organizationType Organization Type (0-OTHER, 1-COMPANY, 2-TRUST).
 * 
 * @apiSuccess {String} organizationId Organization ID.
 * @apiSuccess {String} organizationName Name of the Organization.
 * @apiSuccess {Number} organizationType Organization Type (0-OTHER, 1-COMPANY, 2-TRUST).
 * @apiSuccess {String} cellNumber Cell Number of the Organization.
 * @apiSuccess {String} email Email of the Organization.
 * @apiSuccess {String} website Website of the Organization.
 * @apiSuccess {String} addressId Address ID of the Organization.
 * 
 * @apiSuccessExample Example data on success:
 * {[
 *    "organizationId": "449a5faa-6377-4604-9361-fbd3e412c299",
 *    "organizationName": "Test Organization Updated",
 *    "organizationType": 2,
 *    "cellNumber": "1234567890",
 *    "email": "xyz@gmail.com",
 *    "website": "www.test.com",
 *    "addressId": "New York NY 10012-1296"
 * ]}
 */
router.post(
    "/query/type",
    check("organizationType")
        .notEmpty()
        .withMessage("Organization Type is required"),
    validate,
    OrganizationController.getOrganizationByType
)

/**
 * @api {post} v1/organization/query Get Organization by Keyword
 * @apiName GetOrganizationByKeyWord
 * @apiGroup Organization
 * 
 * @apiBody {String} keyword Keyword to search.
 * 
 * @apiSuccess {String} organizationId Organization ID.
 * @apiSuccess {String} organizationName Name of the Organization.
 * @apiSuccess {Number} organizationType Organization Type (0-OTHER, 1-COMPANY, 2-TRUST).
 * @apiSuccess {String} cellNumber Cell Number of the Organization.
 * @apiSuccess {String} email Email of the Organization.
 * @apiSuccess {String} website Website of the Organization.
 * @apiSuccess {String} addressId Address ID of the Organization.
 * 
 * @apiSuccessExample Example data on success:
 * {[
 *    "organizationId": "449a5faa-6377-4604-9361-fbd3e412c299",
 *    "organizationName": "Test Organization Updated",
 *    "organizationType": 2,
 *    "cellNumber": "1234567890",
 *    "email": "xyz@gmail.com",
 *    "website": "www.test.com",
 *    "addressId": "New York NY 10012-1296"
 * ]}
 */
router.post(
    "/query",
    check("keyword")
        .notEmpty()
        .withMessage("Keyword is required"),
    validate,
    OrganizationController.getOrganizationByKeyWord
)

/**
 * @api {post} v1/organization/update Update Organization
 * @apiName UpdateOrganization
 * @apiGroup Organization
 * 
 * @apiBody {String} organizationId Organization ID.
 * @apiBody {Number} organizationType Organization Type (0-OTHER, 1-COMPANY, 2-TRUST).
 * @apiBody {String} organizationName Name of the Organization.
 * @apiBody {String} cellNumber [Optional] Cell Number of the Organization.
 * @apiBody {String} email [Optional] Email of the Organization.
 * @apiBody {String} website [Optional] Website of the Organization.
 * @apiBody {String} addressId [Optional] Address ID of the Organization.
 * 
 * @apiSuccess {String} organizationId Organization ID.
 * @apiSuccess {String} organizationName Name of the Organization.
 * @apiSuccess {Number} organizationType Organization Type (0-OTHER, 1-COMPANY, 2-TRUST).
 * @apiSuccess {String} cellNumber Cell Number of the Organization.
 * @apiSuccess {String} email Email of the Organization.
 * @apiSuccess {String} website Website of the Organization.
 * @apiSuccess {String} addressId Address ID of the Organization.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *    "organizationId": "449a5faa-6377-4604-9361-fbd3e412c299",
 *    "organizationName": "Test Organization Updated",
 *    "organizationType": 2,
 *    "cellNumber": "1234567890",
 *    "email": "xyz@gmail.com",
 *    "website": "www.test.com",
 *    "addressId": "New York NY 10012-1296"
 * }
 */
router.post(
    "/update",
    check("organizationId")
        .notEmpty()
        .isUUID()
        .withMessage("Organization Id should be a valid UUID"),
    check("cellNumber")
        .optional()
        .isMobilePhone()
        .withMessage("Cell Number should be a valid phone number"),
    check("email")
        .optional()
        .isEmail()
        .withMessage("Email should be a valid email address"),
    check("website")
        .optional()
        .isURL()
        .withMessage("Website should be a valid URL"),
    validate,
    OrganizationController.updateOrganization
)

/**
 * @api {post} v1/organization/delete Delete Organization
 * @apiName DeleteOrganization
 * @apiGroup Organization
 * 
 * @apiBody {String} organizationId Organization ID.
 * 
 * @apiSuccess {String} message Success message.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *    "message": "[OrganizationController][deleteOrganization] Organization deleted successfully"
 * }
 */
router.post(
    "/delete",
    check("organizationId")
        .notEmpty()
        .isUUID()
        .withMessage("Organization Id should be a valid UUID"),
    validate,
    OrganizationController.deleteOrganization
)

module.exports = router;