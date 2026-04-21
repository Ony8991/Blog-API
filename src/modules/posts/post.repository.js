const Post = require("../../models/Post.model");

class PostRepository {
  async create(postData) {
    const post = new Post(postData);
    return await post.save();
  }

  async findAll({ page = 1, limit = 10, category, isPublished = true }) {
    const query = { isPublished };
    if (category) query.category = category;

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate("author", "username email") // récupère username et email de l'auteur
        .sort({ createdAt: -1 })              // plus récents en premier
        .skip(skip)
        .limit(limit),
      Post.countDocuments(query),
    ]);

    return {
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBySlug(slug) {
    return await Post.findOne({ slug }).populate("author", "username email");
  }

  async findById(id) {
    return await Post.findById(id).populate("author", "username email");
  }

  async findByAuthor(authorId) {
    return await Post.find({ author: authorId }).sort({ createdAt: -1 });
  }

  async update(id, updateData) {
    return await Post.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
      // new:true renvoie le document mis à jour
      // runValidators:true applique les validations du schéma
    );
  }

  async delete(id) {
    return await Post.findByIdAndDelete(id);
  }
}

module.exports = new PostRepository();