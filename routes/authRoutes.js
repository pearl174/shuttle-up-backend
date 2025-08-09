const express = require("express");
const { check } = require("express-validator");
const { signup, login } = require("../controller/authController.js");

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
    "/register",
    [
        check("username", "Username is required").not().isEmpty(),
        check("email", "Include a valid email").isEmail(),
        check("password", "Password must be 6 or more chars").isLength({ min: 6 })
    ],
    signup
);