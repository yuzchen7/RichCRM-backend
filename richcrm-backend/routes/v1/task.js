var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var TaskController = require('../../controllers/task');

const router = express.Router();

router.post(
    "/create",
    check("taskType")
        .notEmpty()
        .withMessage("Task Type is required"),
    check("name")
        .notEmpty()
        .withMessage("Name is required"),
    check("status")
        .notEmpty()
        .withMessage("Status is required"),
    check("templates")
        .notEmpty()
        .isArray()
        .withMessage("Templates is required"),
    validate,
    TaskController.createTask
)

router.get(
    "/:taskId",
    check("taskId")
        .notEmpty()
        .withMessage("Task ID is required"),
    validate,
    TaskController.readTaskById
)

router.post(
    "/update",
    check("taskId")
        .notEmpty()
        .withMessage("Task ID is required"),
    validate,
    TaskController.updateTask
)

router.post(
    "/delete",
    check("taskId")
        .notEmpty()
        .withMessage("Task ID is required"),
    validate,
    TaskController.deleteTask
)

module.exports = router;