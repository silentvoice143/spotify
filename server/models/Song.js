const mongoose = require("mongoose");
const joi = require("joi");

//creating a model
//step1: require mongoose
//step2: define a schema for user
//create a model

const Song = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  track: {
    type: String,
    required: true,
  },
  artist: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  duration: {
    type: String,
    // required: true,
  },
});

const validate = function (song) {
  const schema = joi.object({
    name: joi.string().required(),
    artist: joi.string().required(),
    track: joi.string().required(),
    thumbnail: joi.string().required(),
    // duration: joi.number().required(),
  });
  return schema.validate(song);
};

const SongModel = new mongoose.model("song", Song);
//two argument 1> collection name 2> schema name

module.exports = { SongModel, validate };
