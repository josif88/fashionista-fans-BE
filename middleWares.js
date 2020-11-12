const { notFound, badRequestOutput } = require("./tools/responses");
const { firebaseApp } = require("./init");
const I18n = require("./tools/language");
const db = require("./tools/db");

//handle authentication
module.exports.auth = (req, res, next) => {
  //get token id from headers
  let token = req.headers.token;
  //check token validations
  if (token) {
    firebaseApp
      .auth()
      .verifyIdToken(token)
      .then(async (decodedUrl) => {
        req.user = await db.getUserById(decodedUrl.uid);
        return next();
      })
      .catch((err) => {
        return badRequestOutput(res, err.message, "token id not valid");
      });
  } else {
    return badRequestOutput(res, I18n.__("pleaseLogIn"), "token id not found");
  }
};

//set i18n language
module.exports.setUiLanguage = (req, res, next) => {
  //init i18n language
  I18n.init(req, res);
  //if no lang preferred set en
  req.query.lang ? I18n.setLocale(req.query.lang) : I18n.setLocale("en");
  return next();
};

//404 response
module.exports.notFound = (req, res, next) => {
  notFound(res);
};
