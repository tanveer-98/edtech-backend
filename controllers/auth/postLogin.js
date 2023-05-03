const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const postLogin = async (req, res) => {
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

    const publicdata = ["name","mail"];
    const publicUser = {};
    publicdata.forEach(x=>{
      publicUser[x] = user[x];
    })

    console.log("Public User");
    console.log(publicUser);

    const token = jwt.sign({
      data: publicUser
    }, process.env.SECRET_KEY, { expiresIn:  60*60 }); // 3600 seconds

    return res.status(200).json({
      userDetails: {
        mail: user.mail,
        token: token,
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
  res.send("login route");
};

module.exports = postLogin;
