const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const joi = require("joi");

//creating a model
//step1: require mongoose
//step2: define a schema for user
//create a model

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    private: true,
  },
  username: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    requred: true,
  },
  likedSongs: [
    {
      type: String,

      //we will change it later
    },
  ],
  playlists: [
    {
      type: String,

      //we will change it later
    },
  ],
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
User.methods.generateAuthToken = function () {
  const expiresIn = 30 * 24 * 60 * 60;
  const token = jwt.sign(
    { _id: this._id, name: this.name, isAdmin: this.isAdmin },
    process.env.JWTPRIVATEKEY,
    { expiresIn }
  );
  return token;
};

const validate = (user) => {
  console.log(user);
  const schema = joi.object({
    email: joi.string().email().required(),
    username: joi.string().required(),
    password: joi
      .string()
      .min(8) // Minimum length of 8 characters
      .required()
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/)
      .message(
        "Password must contain at least one letter, one number, and one special character"
      ),
    name: joi.string().required(),
    dob: joi.string().required(),
    gender: joi.string().required(),
    isAdmin: joi.boolean(),
  });
  return schema.validate(user);
};

const UserModel = new mongoose.model("user", User);
//two argument 1> collection name 2> schema name

module.exports = { UserModel, validate };
