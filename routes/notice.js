const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const { Notice, validate } = require("../models/notice");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.post("/", async (req, res) => {
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "Request Body cannot be empty",
    });

  const { error } = validate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  // already many documents exits

  try {
    const topIndex = (await Notice.find({}).count()) + 1;

    // const topIndex = parseInt(find[0].id) + 1;
    // console.log(topIndex.toString());

    const newdoc = await Notice.create({ ...req.body, id: topIndex });

    return res.status(200).send({
      message: "suceessfully added",
    });
  } catch (e) {
    return res.status(400).send({
      message: "Bad Request",
      error: e.message,
    });
  }
});

router.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  // udpate

  const found = await Notice.find({
    id: id,
  });

  if (found.length == 0)
    return res.status(404).send({
      response: false,
      message: "Not found",
    });




  
});

router.delete("/", async (req, res) => {
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "Request Body cannot be empty",
    });

  // const { error } = validate(req.body);

  // if (error) return res.status(400).send({ error: error.details[0].message });

  const filter = {
    id: req.body.id,
  };
  const update = {
    isDeleted: true,
  };

  const found = await Notice.findOneAndUpdate(filter, update, {
    new: true,
  });

  if (found.length == 0) {
    return res.status(400).send({
      message: "Not Found",
      response: false,
    });
  } else {
    const all = await Notice.find({});
    return res.status(200).send({
      message: "Deleted Successfully",
      data: all,
    });
  }
});

router.get("/", async (req, res) => {
  const all = await Notice.find({ isDeleted: false });

  if (all.length == 0) {
    return res.status(404).send({
      response: false,
      message : "Not found",
      docs: [],
    });
  } else {
    return res.status(200).send({
      response: true,
      docs: all,
      message : "Successfully Fetched"
    });
  }
});

module.exports = router;
