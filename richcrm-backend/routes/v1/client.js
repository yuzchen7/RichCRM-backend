var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var ClientController = require('../../controllers/client');

const router = express.Router();

/**
 * @api {post} v1/client/register Register a new client
 * @apiName RegisterClient
 * @apiGroup Client
 * 
 * @apiBody {String} firstName First Name of the Client.
 * @apiBody {String} lastName Last Name of the Client.
 * @apiBody {String} cellNumber Cell Number of the Client.
 * @apiBody {String} email Email of the Client.
 * @apiBody {String} ssn SSN of the Client.
 * @apiBody {String} addressId Address ID of the Client.
 * 
 * @apiSuccess {String} clientId Client ID.
 * @apiSuccess {Number} title Title of the Client (0-NA, 1-MR, 2-MRS, 3-MS, 4-DR).
 * @apiSuccess {String} firstName First Name of the Client.
 * @apiSuccess {String} lastName Last Name of the Client.
 * @apiSuccess {Number} gender Gender of the Client (0-NA, 1-MALE, 2-FEMALE).
 * @apiSuccess {String} cellNumber Cell Number of the Client.
 * @apiSuccess {String} email Email of the Client.
 * @apiSuccess {String} ssn SSN of the Client.
 * @apiSuccess {String} addressId Address ID of the Client.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "clientId":"123-45-6789",
 *  "title": 0,
 *  "firstName": "John",
 *  "lastName": "Doe",
 *  "gender": 0,
 *  "cellNumber": "1234567890",
 *  "email": "john.doe@hotmail.com",
 *  "ssn": "123-45-6789",
 *  "addressId": "1600 AMPHITHEATRE PKWY, MOUNTAIN VIEW, CA 94043-1351 US"
 * }
 * 
 */
router.post(
    "/register",
    check("firstName")
        .notEmpty()
        .withMessage("First Name is required"),
    check("lastName")
        .notEmpty()
        .withMessage("Last Name is required"),
    check("cellNumber")
        .notEmpty()
        .isMobilePhone()
        .withMessage("Cell Number is required"),
    check("email")
        .notEmpty()
        .isEmail()
        .withMessage("Email is required"),
    check("ssn")
        .notEmpty()
        .withMessage("SSN is required"),
    check("addressId")
        .notEmpty()
        .withMessage("Address ID is required"),
    validate,
    ClientController.registerClient
);

/**
 * @api {get} v1/client/:clientId Get a client
 * @apiName GetClient
 * @apiGroup Client
 * 
 * @apiParam {String} clientId Client ID.
 * 
 * @apiBody {String} clientId Client ID.
 * @apiBody {Number} title Title of the Client (0-NA, 1-MR, 2-MRS, 3-MS, 4-DR).
 * @apiBody {String} firstName First Name of the Client.
 * @apiBody {String} lastName Last Name of the Client.
 * @apiBody {String} gender Gender of the Client (0-NA, 1-MALE, 2-FEMALE).
 * @apiBody {String} cellNumber Cell Number of the Client.
 * @apiBody {String} workNumber Work Number of the Client.
 * @apiBody {String} email Email of the Client.
 * @apiBody {String} wechatAccount Wechat Account of the Client.
 * @apiBody {String} ssn SSN of the Client.
 * @apiBody {String} dob Date of Birth of the Client.
 * @apiBody {String} attorneyId Attorney ID of the Client.
 * @apiBody {String} bankAttorneyId Bank Attorney ID of the Client.
 * @apiBody {String} addressId Address ID of the Client.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "clientId":"123-45-6789",
 *  "title": 0,
 *  "firstName": "John",
 *  "lastName": "Doe",
 *  "gender": 0,
 *  "cellNumber": "1234567890",
 *  "email": "john.doe@hotmail.com",
 *  "ssn": "123-45-6789",
 *  "addressId": "1600 AMPHITHEATRE PKWY, MOUNTAIN VIEW, CA 94043-1351 US"
 *  "workNumber": "1234567890",
 *  "wechatAccount": "john.doe",
 *  "dob": "1990-01-01T00:00:00.000Z",
 *  "attorneyId": 1,
 *  "bankAttorneyId": 2
 * }
 * 
 */
router.get(
    "/:clientId",
    check("clientId")
        .notEmpty()
        .withMessage("Client ID is required"),
    ClientController.getClient
);


/**
 * @api {post} v1/client/update Update a client
 * @apiName UpdateClient
 * @apiGroup Client
 * 
 * @apiBody {String} clientId Client ID.
 * @apiBody {Number} title Title of the Client (0-NA, 1-MR, 2-MRS, 3-MS, 4-DR).
 * @apiBody {String} firstName First Name of the Client.
 * @apiBody {String} lastName Last Name of the Client.
 * @apiBody {String} gender Gender of the Client (0-NA, 1-MALE, 2-FEMALE).
 * @apiBody {String} cellNumber Cell Number of the Client.
 * @apiBody {String} workNumber Work Number of the Client.
 * @apiBody {String} email Email of the Client.
 * @apiBody {String} wechatAccount Wechat Account of the Client.
 * @apiBody {String} dob Date of Birth of the Client.
 * @apiBody {String} attorneyId Attorney ID of the Client.
 * @apiBody {String} bankAttorneyId Bank Attorney ID of the Client.
 * @apiBody {String} addressId Address ID of the Client.
 * 
 * 
 * @apiSuccess {Number} title Title of the Client (0-NA, 1-MR, 2-MRS, 3-MS, 4-DR).
 * @apiSuccess {String} firstName First Name of the Client.
 * @apiSuccess {String} lastName Last Name of the Client.
 * @apiSuccess {Number} gender Gender of the Client (0-NA, 1-MALE, 2-FEMALE).
 * @apiSuccess {String} cellNumber Cell Number of the Client.
 * @apiSuccess {String} email Email of the Client.
 * @apiSuccess {String} ssn SSN of the Client.
 * @apiSuccess {String} addressId Address ID of the Client.
 * @apiSuccess {String} workNumber Work Number of the Client.
 * @apiSuccess {String} wechatAccount Wechat Account of the Client.
 * @apiSuccess {String} dob Date of Birth of the Client.
 * @apiSuccess {String} attorneyId Attorney ID of the Client.
 * @apiSuccess {String} bankAttorneyId Bank Attorney ID of the Client.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "title": 0,
 *  "firstName": "John",
 *  "lastName": "Doe",
 *  "gender": 0,
 *  "cellNumber": "1234567890",
 *  "email": "john.doe@hotmail.com",
 *  "addressId": "1600 AMPHITHEATRE PKWY, MOUNTAIN VIEW, CA 94043-1351 US",
 *  "workNumber": "1234567890",
 *  "wechatAccount": "john.doe",
 *  "dob": "1990-01-01T00:00:00.000Z",
 *  "attorneyId": 1,
 *  "bankAttorneyId": 2
 * }
 * 
 */
router.post(
    "/update",
    check("clientId")
        .notEmpty()
        .withMessage("ClientId is required"),
    validate,
    ClientController.updateClient
)


/**
 * @api {post} v1/client/delete Delete a client
 * @apiName DeleteClient
 * @apiGroup Client
 * 
 * @apiBody {String} clientId Client ID.
 * 
 * @apiSuccessExample Example data on success:
 * {}
 */
router.post(
    "/delete",
    check("clientId")
        .notEmpty()
        .withMessage("ClientId is required"),
    validate,
    ClientController.deleteClient
)

module.exports = router;