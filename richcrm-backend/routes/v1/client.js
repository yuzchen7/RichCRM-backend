var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var ClientController = require('../../controllers/client');

const router = express.Router();

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

router.get(
    "/:clientId",
    ClientController.getClient
);

router.post(
    "/update",
    check("clientId")
        .notEmpty()
        .withMessage("ClientId is required"),
    validate,
    ClientController.updateClient
)

router.post(
    "/delete",
    check("clientId")
        .notEmpty()
        .withMessage("ClientId is required"),
    validate,
    ClientController.deleteClient
)

module.exports = router;