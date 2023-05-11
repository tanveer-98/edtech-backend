const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const config = require("config");
const hagen = require("hagen").default;
const chalk = require("chalk");
require("./db/db");

const auth = require("./routes/auth");
const users = require("./routes/users");
const notice = require("./routes/notice");
const subject = require('./routes/subjects.js')
const app = express();

app.use(function (req, res, next) {
  const allowedOrigins = [
    "*",
    "http://localhost:8888",
    "http://localhost:5173",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With , content-type , Authorization , Bearer"
  );
  next();
});

app.use(express.json());
app.use(cors());

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/notice", notice);
app.use("/api/subject", subject)

if (!config.get("SECRET_KEY")) {
  hagen.error("JWTError", "FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}
let port;
try {
  port = config.get("PORT");
} catch (ex) {
  port = 3000;
}
app.listen(port, () =>
  hagen.success(
    "PORT",
    chalk.green.bgWhite.bold(`Listening on port ${port}...`)
  )
);
