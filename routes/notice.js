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


router.post('/' , async (req,res)=>{
    if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "Request Body cannot be empty",
    });

  const { error } = validate(req.body);

  if (error) return res.status(400).send({ error: error.details[0].message });

  try{

      const newdoc = await Notice.create(req.body);
      return res.status(200).send({
        message : "suceessfully added"
      });

  }
  catch(e){
    return res.status(400).send({
        message : "Bad Request",
        error : e.message
      });


  }

 






})



router.delete('/' , async (req,res)=>{
    if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "Request Body cannot be empty",
    });

  const { error } = validate(req.body);

  if (error) return res.status(400).send({ error: error.details[0].message });

})



router.get('/' , async (req,res)=>{

  
   return res.status(200).send()
})



module.exports = router;