const { body } = require("express-validator");

const createCommentValidator = [
  body("content")
    .trim()
    .notEmpty().withMessage("Comment content is required")
    .isLength({ min: 2 }).withMessage("Comment must be at least 2 characters")
    .isLength({ max: 500 }).withMessage("Comment cannot exceed 500 characters"),
];

module.exports = { createCommentValidator };