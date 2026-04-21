const commentRepository = require("./comment.repository");
const postRepository = require("../posts/post.repository");
const ApiError = require("../../utils/ApiError");

class CommentService {
  async createComment(content, postId, authorId) {
    // vérifie que le post existe et est publié
    const post = await postRepository.findById(postId);
    if (!post) {
      throw new ApiError(404, "Post not found");
    }
    if (!post.isPublished) {
      throw new ApiError(403, "Cannot comment on an unpublished post");
    }

    return await commentRepository.create({
      content,
      post: postId,
      author: authorId,
    });
  }

  async getPostComments(postId) {
    const post = await postRepository.findById(postId);
    if (!post) {
      throw new ApiError(404, "Post not found");
    }
    return await commentRepository.findByPost(postId);
  }

  async updateComment(commentId, content, userId) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    // seul l'auteur peut modifier son commentaire
    if (comment.author._id.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not allowed to update this comment");
    }

    return await commentRepository.update(commentId, content);
  }

  async deleteComment(commentId, userId, userRole) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    const isOwner = comment.author._id.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
      throw new ApiError(403, "You are not allowed to delete this comment");
    }

    await commentRepository.delete(commentId);
    return { message: "Comment deleted successfully" };
  }
}

module.exports = new CommentService();