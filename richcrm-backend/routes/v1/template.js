var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
const TemplateController = require('../../controllers/template');

const router = express.Router();

/**
 * @api {post} v1/template/read Read a template by title
 * @apiName ReadTemplateByTitle
 * @apiGroup Template
 * 
 * @apiBody {String} templateTitle Template Title.
 * 
 * @apiSuccess {String} templateTitle Template Title.
 * @apiSuccess {String} templateContent Template Content.
 * 
 * @apiSuccessExample Example data on success:
 * {
 *  "templateTitle": "[Notice] Your account has been created",
 *  "templateContent": "Dear %(firstName) \n\nYour account has been created successfully.\n\nBest Regards,\nRichCRM Team"
 * }
 * 
 */
router.post(
    "/read",
    check("templateTitle")
        .notEmpty()
        .withMessage("Template Title is required"),
    validate,
    TemplateController.readTemplateByTitle
);


/**
 * @api {post} v1/template/create Create a new template
 * @apiName CreateTemplate
 * @apiGroup Template
 * 
 * @apiBody {String} templateTitle Template Title.
 * @apiBody {String} templateContent Template Content.
 * 
 * @apiSuccess {String} templateTitle Template Title.
 * @apiSuccess {String} templateContent Template Content.
 * 
 * @apiSuccessExample Example data on success:
 * {
 * "templateTitle": "[Notice] Your account has been created",
 * "templateContent": "Dear %(firstName) \n\nYour account has been created successfully.\n\nBest Regards,\nRichCRM Team"
 * }
 * 
 */
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

/**
 * @api {post} v1/template/update Update a template
 * @apiName UpdateTemplate
 * @apiGroup Template
 * 
 * @apiBody {String} templateTitle Template Title.
 * @apiBody {String} templateContent Template Content.
 * 
 * @apiSuccess {String} templateTitle Template Title.
 * @apiSuccess {String} templateContent Template Content.
 * 
 * @apiSuccessExample Example data on success:
 * {
 * "templateTitle": "[Notice] Your account has been created",
 * "templateContent": "Dear %(firstName) \n\nYour account has been created successfully.\n\nBest Regards,\nRichCRM Team"
 * }
 * 
 */
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


/**
 * @api {post} v1/template/delete Delete a template
 * @apiName DeleteTemplate
 * @apiGroup Template
 * 
 * @apiBody {String} templateTitle Template Title.
 * 
 * @apiSuccessExample Example data on success:
 * {
 * "status": "success",
 * "data": [],
 * "message": "[TemplateController][deleteTemplate] Template deleted"
 * }
 * 
 */
router.post(
    "/delete",
    check("templateTitle")
        .notEmpty()
        .withMessage("Template Title is required"),
    validate,
    TemplateController.deleteTemplate
);


/**
 * @api {post} v1/template/fill Fill a template with data
 * @apiName FillTemplate
 * @apiGroup Template
 * 
 * @apiBody {String} templateTitle Template Title.
 * @apiBody {Object} data Data to fill the template (Should be in the format of layered JSON file).
 * 
 * @apiSuccess {String} templateTitle Template Title.
 * @apiSuccess {String} templateContent Template Content.
 * 
 * @apiSuccessExample Example data on success:
 * {
 * "templateTitle": "[Notice] Your account has been created",
 * "templateContent": "Dear John \n\nYour account has been created successfully.\n\nBest Regards,\nRichCRM Team"
 * }
 * 
 */
router.post(
    "/fill",
    check("templateTitle")
        .notEmpty()
        .withMessage("Template Title is required"),
    check("data")
        .notEmpty()
        .withMessage("Data is required"),
    validate,
    TemplateController.fillTemplate
)

module.exports = router;