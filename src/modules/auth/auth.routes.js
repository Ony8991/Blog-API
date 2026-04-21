const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const { protect } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const { registerValidator, loginValidator } = require("./auth.validator");

// POST /api/auth/register
router.post("/register", validate(registerValidator), authController.register);

// POST /api/auth/login
router.post("/login", validate(loginValidator), authController.login);

// GET /api/auth/me — route protégée
router.get("/me", protect, authController.getMe);

module.exports = router;