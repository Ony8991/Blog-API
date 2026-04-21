const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const ApiError = require("./utils/ApiError");
const ApiResponse = require("./utils/ApiResponse");

// import des routes
const authRoutes = require("./modules/auth/auth.routes");
const postRoutes = require("./modules/posts/post.routes");
const commentRoutes = require("./modules/comments/comment.routes");

const app = express();

// middlewares globaux
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts/:postId/comments", commentRoutes);

// route de santé
app.get("/health", (req, res) => {
  res.json(new ApiResponse(200, "API is running"));
});

// middleware 404
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// middleware global d'erreurs
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json(new ApiResponse(statusCode, message));
});

module.exports = app;