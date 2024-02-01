const mongoose = require("mongoose");
const joi = require("joi");

//creating a model
//step1: require mongoose
//step2: define a schema for user
//create a model

const Playlist = new mongoose.Schema({
  name: {
    type: String,
  },
  thumbnail: {
    type: String,
    default: "",
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
  //1. Playlist main songs kon si hain
  //2. Plalist collaborators
  songs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "song",
      default: [],
    },
  ],
  collaborators: [
    {
      type: mongoose.Types.ObjectId,
      ref: "user",
      default: [],
    },
  ],
  desc: {
    type: String,
    default: "",
  },
  type: { type: String, enum: ["public", "private"], default: "public" },
});

const validate = (playlist) => {
  const schema = joi.object({
    name: joi.string(),
    thumbnail: joi.string(),
    songs: joi.array().items(joi.string()),
    owner: joi.string().required(),
    desc: joi.string(),
    collaborators: joi.array().items(joi.string()),
  });
};

const PlaylistModel = new mongoose.model("playlist", Playlist);
//two argument 1> collection name 2> schema name

module.exports = { PlaylistModel, validate };
