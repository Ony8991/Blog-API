const User = require("../../models/User.model");

class AuthRepository {
  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findByEmail(email) {
    return await User.findOne({ email }).select("+password");
    // +password car on a mis select:false sur le modèle
    // on le récupère uniquement quand on en a besoin
  }

  async findByUsername(username) {
    return await User.findOne({ username });
  }

  async findById(id) {
    return await User.findById(id);
  }
}

module.exports = new AuthRepository();