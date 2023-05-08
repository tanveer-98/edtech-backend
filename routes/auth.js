const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const config = require("config");

router.post("/login", async (req, res) => {
  // return res.status(200).send({
  //     message: "hello world"
  // })

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if user exists
  let user = await User.findOne({ mail: req.body.mail });

  // if user doesnot exist
  if (!user)
    return res
      .status(400)
      .send({
        token: "",
        user: {},
        response: false,
        message: "Invalid email or password.",
      });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .send({
        token: "",
        user: {},
        response: false,
        message: "Invalid email or password.",
      });

  const token = user.generateAuthToken();
  res.send({
    token: token,
    user: { name: user.name, email: user.mail },
    response: true,
  });
});

router.get("/verify", async (req, res) => {
  let token = req.header("Authorization");
  token = token.replace("Bearer ", "");

  if (!token)
    return res
      .status(400)
      .send({ message: "no Bearer token in header", response: false });

  try {
    jwt.verify(token, config.get("SECRET_KEY"));
    res.send({ message: "Authorization token Verified", response: true });
  } catch (ex) {
    res
      .status(400)
      .send({ message: "Authorization Token Not Verified", response: false });
  }
});

module.exports = router;
