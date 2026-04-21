const express = require("express");
const router = express.Router();
const postController = require("./post.controller");
const { protect, restrictTo } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const { createPostValidator, updatePostValidator } = require("./post.validator");

// GET /api/posts — public
router.get("/", postController.getAllPosts);

// GET /api/posts/my — posts de l'utilisateur connecté
router.get("/my", protect, postController.getMyPosts);

// GET /api/posts/:slug — public
router.get("/:slug", postController.getPostBySlug);

// POST /api/posts — authentifié uniquement
router.post("/", protect, validate(createPostValidator), postController.createPost);

// PUT /api/posts/:id — authentifié uniquement
router.put("/:id", protect, validate(updatePostValidator), postController.updatePost);

// DELETE /api/posts/:id — authentifié uniquement
router.delete("/:id", protect, postController.deletePost);

module.exports = router;