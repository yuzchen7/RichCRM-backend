var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var UtilsController = require('../../controllers/utils');

const router = express.Router();

router.post(
    "/address/standardize",
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
    UtilsController.standardizeAddress
);

module.exports = router;