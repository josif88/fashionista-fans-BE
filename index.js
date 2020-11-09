const functions = require("firebase-functions");
const express = require("express");
const router = require("./router");
const { notFound, auth } = require("./middleWares");

let cors = require("cors");
const app = express();

app.use(cors({ origin: true }));

app.use(auth);

app.use("/api", router);

app.use(notFound);

exports.app = functions.https.onRequest(app);
