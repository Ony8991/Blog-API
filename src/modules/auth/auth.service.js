const jwt = require("jsonwebtoken");
const authRepository = require("./auth.repository");
const ApiError = require("../../utils/ApiError");

class AuthService {
  // génère un token JWT pour un utilisateur
  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }

  async register(userData) {
    const { username, email, password } = userData;

    // vérifie si l'email existe déjà
    const existingEmail = await authRepository.findByEmail(email);
    if (existingEmail) {
      throw new ApiError(409, "Email already in use");
    }

    // vérifie si le username existe déjà
    const existingUsername = await authRepository.findByUsername(username);
    if (existingUsername) {
      throw new ApiError(409, "Username already taken");
    }

    // crée l'utilisateur — le hash du password se fait dans le modèle
    const user = await authRepository.createUser({ username, email, password });

    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async login(email, password) {
    // récupère l'utilisateur avec le password (select:false sur le modèle)
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    // compare le mot de passe avec le hash en base
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async getMe(userId) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }
}

module.exports = new AuthService();