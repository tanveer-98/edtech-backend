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

  const find = await Notice.find({}).sort({ id: -1 }).select({ id: 1 });

  console.log(find);

  // already many documents exits

  if (find.length != 0) {
    try {
      const topIndex = parseInt(find[0].id) + 1;
      console.log(topIndex.toString());
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
  }

  try {
    const newdoc = await Notice.create(req.body);
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

router.delete("/", async (req, res) => {
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "Request Body cannot be empty",
    });


  // const { error } = validate(req.body);

  // if (error) return res.status(400).send({ error: error.details[0].message });

 const filter = {
  id : req.body.id
 } 
 const update = {
  isDeleted : true 
 }

  const found = await Notice.findOneAndUpdate(filter, update, {
    new: true
  });
  
  if(found.length == 0){
    return res.status(400).send({
      message : "Not Found",
      response : false 
    })
  }
  else{
    const all   = await Notice.find({});
    return res.status(200).send({
      message  : "Deleted Successfully",
      data : all
    })
  }

});

router.get("/", async (req, res) => {
  const all   = await Notice.find({isDeleted : false});
  console.log(all)
  if(all.length == 0){
    return res.status(404).send({
      response : false ,
      docs  : []
    })
  }
  else {
    return res.status(200).send({
      response: true, 
      docs : all
    })
  }
});

module.exports = router;
