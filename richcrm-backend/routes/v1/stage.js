var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var StageController = require('../../controllers/stage');

const router = express.Router();

router.get(
    "/:caseId/:stageType",
    check("caseId")
        .notEmpty()
        .withMessage("Case ID is required"),
    check("stageType")
        .notEmpty()
        .withMessage("Stage Type is required"),
    validate,
    StageController.readStageByCaseIdAndStageType
)

router.post(
    "/create",
    check("stageType")
        .notEmpty()
        .withMessage("Stage Type is required"),
    check("caseId")
        .notEmpty()
        .withMessage("Case ID is required"),
    validate,
    StageController.createStage
)

router.post(
    "/update",
    check("stageId")
        .notEmpty()
        .withMessage("Stage ID is required"),
    check("stageStatus")
        .notEmpty()
        .withMessage("Stage Status is required"),
    validate,
    StageController.updateStage
)

router.post(
    "/delete",
    check("stageId")
        .notEmpty()
        .withMessage("Stage ID is required"),
    validate,
    StageController.deleteStage
)

module.exports = router;