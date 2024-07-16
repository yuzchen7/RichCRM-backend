var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var CaseController = require('../../controllers/case');


const router = express.Router();

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

router.post(
    "/delete",
    check("caseId")
        .notEmpty()
        .withMessage("Case ID is required"),
    validate,
    CaseController.deleteCase
)

module.exports = router;