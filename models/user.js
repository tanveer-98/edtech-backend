const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");


const userSchema = new mongoose.Schema({
  mail: {
    type: String,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  name: {
    type: String,
    minlength: 3,
    maxLength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      isAdmin: this.isAdmin,
    },
    config.get("SECRET_KEY")
  );
};

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    mail: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });

  return schema.validate(user);
}

// module.exports = mongoose.model("user", userSchema);

const User = mongoose.model("User" , userSchema );

exports.User = User;
exports.validate = validateUser;
