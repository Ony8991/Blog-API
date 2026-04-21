const commentService = require("./comment.service");
const ApiResponse = require("../../utils/ApiResponse");

class CommentController {
  async createComment(req, res, next) {
    try {
      const comment = await commentService.createComment(
        req.body.content,
        req.params.postId,
        req.user._id
      );
      res.status(201).json(new ApiResponse(201, "Comment created successfully", comment));
    } catch (error) {
      next(error);
    }
  }

  async getPostComments(req, res, next) {
    try {
      const comments = await commentService.getPostComments(req.params.postId);
      res.status(200).json(new ApiResponse(200, "Comments fetched successfully", comments));
    } catch (error) {
      next(error);
    }
  }

  async updateComment(req, res, next) {
    try {
      const comment = await commentService.updateComment(
        req.params.id,
        req.body.content,
        req.user._id
      );
      res.status(200).json(new ApiResponse(200, "Comment updated successfully", comment));
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const result = await commentService.deleteComment(
        req.params.id,
        req.user._id,
        req.user.role
      );
      res.status(200).json(new ApiResponse(200, result.message));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommentController();