const { body } = require("express-validator");

const createPostValidator = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3 }).withMessage("Title must be at least 3 characters")
    .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),

  body("content")
    .trim()
    .notEmpty().withMessage("Content is required")
    .isLength({ min: 10 }).withMessage("Content must be at least 10 characters"),

  body("category")
    .optional()
    .isIn(["technology", "lifestyle", "education", "other"])
    .withMessage("Invalid category"),
];

const updatePostValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage("Title must be at least 3 characters")
    .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),

  body("content")
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage("Content must be at least 10 characters"),

  body("category")
    .optional()
    .isIn(["technology", "lifestyle", "education", "other"])
    .withMessage("Invalid category"),
];

module.exports = { createPostValidator, updatePostValidator };