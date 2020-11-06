module.exports.notFound = (res, statusCode = 404) => {
  let response = {
    status: false,
    message: "Not Found",
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
  message = "Request response ",
  statusCode = 200
) => {
  res.statusCode = statusCode;
  let response = {
    message: message,
    status: true,
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
  errorMessage = "something went wrong",
  statusCode = 500
) => {
  res.statusCode = statusCode;
  let response = {
    message: errorMessage,
    status: false,
    error: errorDetails,
  };

  return res.json(response);
};

module.exports.userErrorOutput = (
  res,
  errorDetails,
  errorMessage = "query error",
  statusCode = 400
) => {
  res.statusCode = statusCode;
  let response = {
    message: errorMessage,
    status: false,
    error: errorDetails,
  };

  return res.json(response);
};
