const postRepository = require("./post.repository");
const commentRepository = require("../comments/comment.repository");
const ApiError = require("../../utils/ApiError");

class PostService {
  async createPost(postData, authorId) {
    const post = await postRepository.create({
      ...postData,
      author: authorId,
    });
    return post;
  }

  async getAllPosts(query) {
    return await postRepository.findAll(query);
  }

  async getPostBySlug(slug) {
    const post = await postRepository.findBySlug(slug);
    if (!post) {
      throw new ApiError(404, "Post not found");
    }
    return post;
  }

  async updatePost(postId, updateData, userId) {
    const post = await postRepository.findById(postId);
    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    // vérifie que l'utilisateur est bien l'auteur du post
    if (post.author._id.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not allowed to update this post");
    }

    // si on publie le post, on enregistre la date de publication
    if (updateData.isPublished && !post.isPublished) {
      updateData.publishedAt = new Date();
    }

    return await postRepository.update(postId, updateData);
  }

  async deletePost(postId, userId, userRole) {
    const post = await postRepository.findById(postId);
    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    // un admin peut supprimer n'importe quel post
    // un user ne peut supprimer que ses propres posts
    const isOwner = post.author._id.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
      throw new ApiError(403, "You are not allowed to delete this post");
    }

    // supprime aussi tous les commentaires liés au post
    await commentRepository.deleteByPost(postId);
    await postRepository.delete(postId);

    return { message: "Post deleted successfully" };
  }

  async getMyPosts(userId) {
    return await postRepository.findByAuthor(userId);
  }
}

module.exports = new PostService();