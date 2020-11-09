const { notFound, userErrorOutput } = require("./tools/helper");
const { firebaseApp } = require("./init");

module.exports.auth = (req, res, next) => {
  let token = req.headers.token;

  if (token) {
    firebaseApp
      .auth()
      .verifyIdToken(idToken)
      .then((decodedUrl) => {
        // todo retrieve user info
        console.log(decodedUrl.uid);
        return next();
      })
      .catch((err) => {return userErrorOutput(res, err.message, "token id not valid")});
    
  } else {
    return userErrorOutput(res, "please login", "token id is missing");
  }
};

module.exports.notFound = (req, res, next) => {
  notFound(res);
};
