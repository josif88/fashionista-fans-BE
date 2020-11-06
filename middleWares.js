const { notFound } = require("./tools/helper");

module.exports.validations = (req, res, next) => {
  next();
};

module.exports.notFound = (req, res, next) => {
  notFound(res);
};
