const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth/authController");
const auth = require('../middleware/auth')
const Joi = require("joi");

const validator = require("express-joi-validation").createValidator({});

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(12),
  password: Joi.string().min(6).max(12),
  mail: Joi.string().email(),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).max(12),
  mail: Joi.string().email(),
});

router.post(
  "/register",
  validator.body(registerSchema),
  authControllers.controllers.postRegister
);

router.post(
  "/login",
  validator.body(loginSchema),
  authControllers.controllers.postLogin
);

// async (req,res)=>{
//    return res.status(200).send("register routes")
// }
// router.post("/login", async (req, res) => {
//   return res.status(200).send("login ");
// });

// TEST ROUTES 

router.get("/test"  ,auth , async (req,res)=>{
   return res.status(200).send("Token verified")
})


module.exports = router;
