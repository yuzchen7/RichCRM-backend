var express = require('express');
var check = require('express-validator').check;
var validate = require('../../middlewares/validation');
var AuthController = require('../../controllers/auth');

const router = express.Router();

router.post(
    "/register",
    check("emailAddress")
        .notEmpty()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
    check("userName")
        .notEmpty()
        .withMessage("User name is required"),
    check("role")
        .notEmpty()
        .withMessage("Role is required"),
    validate,
    AuthController.registerUser
);

router.post(
    "/login",
    check("emailAddress")
        .notEmpty()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Password invalid"),
    validate,
    AuthController.loginUser
);

router.post(
    "/delete",
    check("emailAddress")
        .notEmpty()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Password is invalid, must provide password to delete user"),
    validate,
    AuthController.deleteUser
);

router.post(
    "/update",
    check("emailAddress")
        .notEmpty()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Password is invalid, must provide password to update user"),
    check("userName")
        .notEmpty()
        .withMessage("User name is required"),
    check("role")
        .notEmpty()
        .withMessage("Role is required"),
    validate,
    AuthController.updateUser
);


module.exports = router;