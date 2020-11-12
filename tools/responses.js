const I18n = require("../tools/language");

module.exports.notFound = (res, statusCode = 404) => {
  let response = {
    status: false,
    statusCode,
    message: I18n.__("notFound"),
  };
  res.statusCode = statusCode;
  return res.json(response);
};

/**
 *
 * @param {*} res
 * @param {*} data
 * @param {*} statusCode optional
 */
module.exports.successOutput = (
  res,
  data,
  message = "Request response",
  statusCode = 200
) => {
  res.statusCode = statusCode;
  let response = {
    status: true,
    statusCode,
    message: message,
    data: data,
  };

  return res.json(response);
};

/**
 *
 * @param {*} res
 * @param {*} errorDetails
 * @param {*} errorMessage
 * @param {*} statusCode
 */
module.exports.serverErrorOutput = (
  res,
  errorDetails,
  errorMessage = I18n.__("serverError"),
  statusCode = 500
) => {
  res.statusCode = statusCode;
  let response = {
    status: false,
    statusCode,
    message: errorMessage,
    error: errorDetails,
  };

  return res.json(response);
};

module.exports.badRequestOutput = (
  res,
  errorDetails,
  errorMessage = I18n.__("inputError"),
  statusCode = 400
) => {
  res.statusCode = statusCode;
  let response = {
    status: false,
    statusCode,
    message: errorMessage,
    error: errorDetails,
  };

  return res.json(response);
};
