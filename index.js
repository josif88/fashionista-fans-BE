const functions = require("firebase-functions");
const express = require("express");
const router = require("./router");
const { notFound, validations } = require("./middleWares");
let cors = require("cors");

const app = express();

app.use(cors({ origin: true }));

app.use(validations);

app.use("/api", router);

app.use(notFound);

exports.app = functions.https.onRequest(app);
