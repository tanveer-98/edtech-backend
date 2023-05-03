const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/me", [auth, admin], async (req, res) => {
  // get admin details
  const user = await User.findById(req.user.id).select("-password");
  return res.status(200).send(user);
});

router.post("/sign-up", async (req, res) => {
  // if body is empty
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "Request Body cannot be empty",
    });

  const { error } = validate(req.body);

  if (error) return res.status(400).send({ error: error.details[0].message });

  // check if user already exists

  let user = await User.findOne({ mail: req.body.mail });
  console.log("user");
  console.log(user);
  if (user !== null)
    return res.status(400).send({
      error: "User already Registered",
    });

  // if user not registered

  user = new User(_.pick(req.body, ["name", "mail", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.isAdmin = false;

  await user.save();

  const token = "Bearer " + (await user.generateAuthToken());

  return res
    .status(201)
    .header("Authorization", token)
    .send(_.pick(user, ["_id", "name", "mail"]));
});

router.post("/sign-up-admin", async (req, res) => {
  // if body is empty
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "Request Body cannot be empty",
    });

  const { error } = validate(req.body);

  if (error) return res.status(400).send({ error: error.details[0].message });

  // check if user already exists

  let user = await User.findOne({ mail: req.body.mail });

  console.log(user);

  if (user !== null)
    return res.status(400).send({
      error: "User already Registered",
    });

  // if user not registered

  user = new User(_.pick(req.body, ["name", "mail", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.isAdmin = true;

  await user.save();

  const token = "Bearer " + (await user.generateAuthToken());

  return res
    .status(201)
    .header("Authorization", token)
    .send(_.pick(user, ["_id", "name", "mail"]));
});

router.post('/login' , async (req,res)=>{

    try {
        const { mail, password } = req.body;
        const user = await User.findOne({
          mail: mail.toLowerCase(),
        });
        // console.log(user);
        // console.log("PASSWORD" + password);
        // console.log("USERNAME");
    
        if (!user)
          return res.status(404).send({
            message: "User not found",
          });
    
        const validate = await bcrypt.compare(password, user.password);
      //   console.log(user.password);
      //   console.log(password);
      // console.log(validate)
        if (!validate)
          return res.status(400).send({
            message: "Something went wrong . Please try Again",
          });
    
        // const publicdata = ["name","mail"];
        // const publicUser = {};
        // publicdata.forEach(x=>{
        //   publicUser[x] = user[x];
        // })
    
        // console.log("Public User");
        // console.log(publicUser);
    
        const token = jwt.sign({
          data: _.pick(user, ['name','mail', 'isAdmin'])
        }, process.env.SECRET_KEY, { expiresIn:  60*60 }); // 3600 seconds
    
        return res.header("Authorization", token).status(200).json({
          userDetails: {
            mail: user.mail,
            // token: token,
            name: user.name,
          },
        });
    
        // successfully logged in so send a new token
    
        // return res.status(200).send({
        //   message: "Something went wrong . Please try again ",
        // });
      } catch (err) {
        return res.status(500).send({
          message: "Something went wrong . Please try again",
        });
      }
});

module.exports = router;
