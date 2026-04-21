const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

const validate = (validations) => {
  return async (req, res, next) => {
    // exécute toutes les validations
    await Promise.all(validations.map((v) => v.run(req)));

    // récupère les erreurs
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    // formate les erreurs proprement
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return next(new ApiError(422, JSON.stringify(extractedErrors)));
  };
};

module.exports = validate;