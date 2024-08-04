var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
const TemplateController = require('../../controllers/template');

const router = express.Router();

router.post(
    "/read",
    check("templateTitle")
        .notEmpty()
        .withMessage("Template Title is required"),
    validate,
    TemplateController.readTemplateByTitle
);

router.post(
    "/create",
    check("templateTitle")
        .notEmpty()
        .withMessage("Template Title is required"),
    check("templateContent")
        .notEmpty()
        .withMessage("Template Content is required"),
    validate,
    TemplateController.createTemplate
);

router.post(
    "/update",
    check("templateTitle")
        .notEmpty()
        .withMessage("Template Title is required"),
    check("templateContent")
        .notEmpty()
        .withMessage("Template Content is required"),
    validate,
    TemplateController.updateTemplate
);

router.post(
    "/delete",
    check("templateTitle")
        .notEmpty()
        .withMessage("Template Title is required"),
    validate,
    TemplateController.deleteTemplate
);

module.exports = router;