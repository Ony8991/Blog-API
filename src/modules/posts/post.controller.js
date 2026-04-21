const postService = require("./post.service");
const ApiResponse = require("../../utils/ApiResponse");

class PostController {
  async createPost(req, res, next) {
    try {
      const post = await postService.createPost(req.body, req.user._id);
      res.status(201).json(new ApiResponse(201, "Post created successfully", post));
    } catch (error) {
      next(error);
    }
  }

  async getAllPosts(req, res, next) {
    try {
      // récupère les paramètres de pagination et filtres depuis l'URL
      // exemple : /posts?page=2&limit=5&category=technology
      const { page, limit, category } = req.query;
      const result = await postService.getAllPosts({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        category,
      });
      res.status(200).json(new ApiResponse(200, "Posts fetched successfully", result));
    } catch (error) {
      next(error);
    }
  }

  async getPostBySlug(req, res, next) {
    try {
      const post = await postService.getPostBySlug(req.params.slug);
      res.status(200).json(new ApiResponse(200, "Post fetched successfully", post));
    } catch (error) {
      next(error);
    }
  }

  async updatePost(req, res, next) {
    try {
      const post = await postService.updatePost(
        req.params.id,
        req.body,
        req.user._id
      );
      res.status(200).json(new ApiResponse(200, "Post updated successfully", post));
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req, res, next) {
    try {
      const result = await postService.deletePost(
        req.params.id,
        req.user._id,
        req.user.role
      );
      res.status(200).json(new ApiResponse(200, result.message));
    } catch (error) {
      next(error);
    }
  }

  async getMyPosts(req, res, next) {
    try {
      const posts = await postService.getMyPosts(req.user._id);
      res.status(200).json(new ApiResponse(200, "My posts fetched successfully", posts));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();