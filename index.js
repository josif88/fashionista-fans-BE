const functions = require("firebase-functions");
const express = require("express");
const router = require("./router");
const { notFound, auth, setUiLanguage } = require("./middleWares");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));

//figure user language
app.use(setUiLanguage);

app.use("/api", router);

//404
app.use(notFound);

exports.app = functions.https.onRequest(app);
