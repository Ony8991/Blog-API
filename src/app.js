const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const ApiError = require("./utils/ApiError");
const ApiResponse = require("./utils/ApiResponse");

const app = express();

app.use(express.json());        
app.use(cors());               
app.use(helmet());              
app.use(morgan("dev"));         

app.get("/health", (req, res) => {
  res.json(new ApiResponse(200, "API is running"));
});

app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json(new ApiResponse(statusCode, message));
});

module.exports = app;