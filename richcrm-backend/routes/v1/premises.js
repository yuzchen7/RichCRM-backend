var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var PremisesController = require('../../controllers/premises');

const router = express.Router();

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

router.get(
    "/:premisesId",
    check("premisesId")
        .notEmpty()
        .withMessage("Premises ID is required"),
    validate,
    PremisesController.readPremises
);

router.post(
    "/query/address",
    check("addressId")
        .notEmpty()
        .withMessage("Address ID is required"),
    validate,
    PremisesController.readAllPremisesByAddressId
);


module.exports = router;