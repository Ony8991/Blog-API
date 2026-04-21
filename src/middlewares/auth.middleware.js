const jwt = require("jsonwebtoken");
const authRepository = require("../modules/auth/auth.repository");
const ApiError = require("../utils/ApiError");

const protect = async (req, res, next) => {
  try {
    // vérifie que le header Authorization existe
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Access denied. No token provided");
    }

    // extrait le token — "Bearer eyJhbGc..." → "eyJhbGc..."
    const token = authHeader.split(" ")[1];

    // vérifie et décode le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // récupère l'utilisateur depuis la base
    const user = await authRepository.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    // attache l'utilisateur à la requête — disponible dans tous les controllers
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token expired"));
    }
    next(error);
  }
};

// middleware pour restreindre l'accès aux admins uniquement
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission"));
    }
    next();
  };
};

module.exports = { protect, restrictTo };