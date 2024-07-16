var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var UtilsController = require('../../controllers/utils');

const router = express.Router();

// Address
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

router.post(
    "/address/delete",
    check("addressId")
        .notEmpty()
        .withMessage("Address ID is required"),
    validate,
    UtilsController.deleteAddress
)

router.get(
    "/address/all",
    validate,
    UtilsController.getAllAddresses
)

module.exports = router;