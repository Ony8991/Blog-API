const express = require("express");
const router = express.Router({ mergeParams: true });
// mergeParams:true permet d'accéder à :postId depuis les routes parentes
const commentController = require("./comment.controller");
const { protect } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const { createCommentValidator } = require("./comment.validator");

// GET /api/posts/:postId/comments — public
router.get("/", commentController.getPostComments);

// POST /api/posts/:postId/comments — authentifié uniquement
router.post("/", protect, validate(createCommentValidator), commentController.createComment);

// PUT /api/posts/:postId/comments/:id — authentifié uniquement
router.put("/:id", protect, commentController.updateComment);

// DELETE /api/posts/:postId/comments/:id — authentifié uniquement
router.delete("/:id", protect, commentController.deleteComment);

module.exports = router;