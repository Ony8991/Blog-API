const authService = require("./auth.service");
const ApiResponse = require("../../utils/ApiResponse");

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(new ApiResponse(201, "User registered successfully", result));
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json(new ApiResponse(200, "Login successful", result));
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user._id);
      res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();