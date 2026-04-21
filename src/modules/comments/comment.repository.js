const Comment = require("../../models/Comment.model");

class CommentRepository {
  async create(commentData) {
    const comment = new Comment(commentData);
    return await comment.save();
  }

  async findByPost(postId) {
    return await Comment.find({ post: postId })
      .populate("author", "username email")
      .sort({ createdAt: -1 });
  }

  async findById(id) {
    return await Comment.findById(id).populate("author", "username email");
  }

  async update(id, content) {
    return await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await Comment.findByIdAndDelete(id);
  }

  async deleteByPost(postId) {
    // supprime tous les commentaires d'un post
    // appelé quand on supprime un post
    return await Comment.deleteMany({ post: postId });
  }
}

module.exports = new CommentRepository();