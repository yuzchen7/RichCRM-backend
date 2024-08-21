var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var UtilsController = require('../../controllers/utils');

const router = express.Router();

// Address

/**
 * @api {post} v1/utils/address/register Register a new address
 * @apiName RegisterClient
 * @apiGroup Utils
 * 
 * @apiBody {String} addressLine1 Address Line 1.
 * @apiBody {String} addressLine2 Address Line 2.
 * @apiBody {String} city City.
 * @apiBody {String} state State.
 * @apiBody {String} zipCode Zip Code.
 * 
 * @apiSuccess {String} addressId Address ID.
 * @apiSuccess {String} addressLine1 Address Line 1.
 * @apiSuccess {String} addressLine2 Address Line 2.
 * @apiSuccess {String} city City.
 * @apiSuccess {String} state State.
 * @apiSuccess {String} zipCode Zip Code.
 * @apiSuccess {String} plus4 Plus 4.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "addressId": "130 W 3RD ST, NEW YORK, NY 10012-1296 US",
 *  "addressLine1": "130 W 3RD ST",
 *  "city": "NEW YORK",
 *  "state": "NEW YORK",
 *  "zipCode": "10012",
 *  "plus4": "1296"
 * }
 * 
 */
router.post(
    "/address/register",
    check("addressLine1")
        .notEmpty()
        .withMessage("Address Line 1 is required"),
    check("city")
        .notEmpty()
        .withMessage("City is required"),
    check("state")
        .notEmpty()
        .withMessage("State is required"),
    check("zipCode")
        .notEmpty()
        .withMessage("Zip Code is required"),
    validate,
    UtilsController.registerAddress
);


/**
 * @api {post} v1/utils/address/delete Delete an address
 * @apiName DeleteAddress
 * @apiGroup Utils
 * 
 * @apiBody {String} addressId Address ID.
 * 
 * @apiSuccessExample Example data on success:
 * {}
 */
router.post(
    "/address/delete",
    check("addressId")
        .notEmpty()
        .withMessage("Address ID is required"),
    validate,
    UtilsController.deleteAddress
)


/**
 * @api {get} v1/utils/address/all Get all addresses
 * @apiName GetAllAddresses
 * @apiGroup Utils
 * 
 * @apiSuccess {String} addressId Address ID.
 * @apiSuccess {String} addressLine1 Address Line 1.
 * @apiSuccess {String} addressLine2 Address Line 2.
 * @apiSuccess {String} city City.
 * @apiSuccess {String} state State.
 * @apiSuccess {String} zipCode Zip Code.
 * @apiSuccess {String} plus4 Plus 4.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  [
 *   {
 *    "addressId": "130 W 3RD ST, NEW YORK, NY 10012-1296 US",
 *    "addressLine1": "130 W 3RD ST",
 *    "city": "NEW YORK",
 *    "state": "NEW YORK",
 *    "zipCode": "10012",
 *    "plus4": "1296"
 *   },
 *   {...}
 *  ]
 * }
 */
router.get(
    "/address/all",
    validate,
    UtilsController.getAllAddresses
)


/**
 * @api {post} v1/utils/address/query/id Get an address by ID
 * @apiName GetAddress
 * @apiGroup Utils
 * 
 * @apiBody {String} addressId Address ID.
 * 
 * @apiSuccess {String} addressId Address ID.
 * @apiSuccess {String} addressLine1 Address Line 1.
 * @apiSuccess {String} addressLine2 Address Line 2.
 * @apiSuccess {String} city City.
 * @apiSuccess {String} state State.
 * @apiSuccess {String} zipCode Zip Code.
 * @apiSuccess {String} plus4 Plus 4.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *    "addressId": "New York NY 10012-1296",
 *    "addressLine1": "130 W 3RD ST",
 *    "city": "NEW YORK",
 *    "state": "NEW YORK",
 *    "zipCode": "10012",
 *    "plus4": "1296"
 * }
 */
router.post(
    "/address/query/id",
    check("addressId")
        .notEmpty()
        .withMessage("Address ID is required"),
    validate,
    UtilsController.getAddress
)

module.exports = router;