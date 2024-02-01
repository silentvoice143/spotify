const express = require("express");
const passport = require("passport");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const admin = require("../middleware/Admin");
const userauth = require("../middleware/authCheck");

const { SongModel: Song, validate } = require("../models/Song");
const validObjectId = require("../middleware/validObjectId");
const { UserModel: User } = require("../models/User");

router.post("/upload", admin, async (req, res) => {
  try {
    // console.log(req.body);
    req.body.artist = req.user._id;
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    // console.log(req.body);

    const song = await Song(req.body).save();
    return res
      .status(201)
      .json({ message: "Song created successfully", data: song });
  } catch (err) {
    res.status(200).json({ error: err });
  }
});

// API endpoint for retrieving all songs
// router.get('/songs', async (req, res) => {
//   try {
//     const songs = await Song.find();
//     res.status(200).json(songs);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

//get all song created by user
router.get("/mysongs", admin, async (req, res) => {
  try {
    const userId = req.user._id;
    const songs = await Song.find({ artist: userId }).populate("artist");
    songs.forEach((item) => {
      item.artist.password = undefined;
      item.artist.__v = undefined;
    });
    return res.status(200).json({ data: songs });
  } catch (err) {
    return res.status(402).json({ err: err.message });
  }
});

//get all song form the server
router.get("/", async (req, res) => {
  try {
    // const currentUser = req.user;
    const songs = await Song.find();
    return res.status(200).json({ data: songs });
  } catch (err) {
    return res.status(402).json({ err: err.message });
  }
});

// ..update song
router.put("/:id/edit", [validObjectId, admin], async (req, res) => {
  const song = await Song.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true, upsert: true }
  );

  return res
    .status(200)
    .json({ message: "Song updated successfully", data: song });
});

//delete song
router.delete("/:id/delete", [validObjectId, admin], async (req, res) => {
  const params = req.params.id;
  await Song.findOneAndDelete({ _id: params });
  return res.status(200).json({ message: "Successfully deleted song" });
});

//like a song
router.post("/like/:id", [validObjectId, userauth], async (req, res) => {
  // step1: find the song

  let resMessage = "";
  //step1: get the song
  const song = await Song.findById(req.params.id);
  if (!song) return res.status(400).send({ message: "song does not exist" });
  //step2: get the user
  const user = await User.findById(req.user._id);
  //search in user detail in likedsongs array find song_id if present then remove form like or if not then add in the array
  const index = user.likedSongs.indexOf(song._id);
  if (index === -1) {
    user.likedSongs.push(song._id);
    resMessage = "Added to your liked songs";
  } else {
    user.likedSongs.splice(index, 1);
    resMessage = "Removed from your liked songs";
  }

  await user.save();
  res.status(200).send({ message: resMessage });
});

//get all like song
router.get("/likes", userauth, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  const songs = await Song.find({ _id: user.likedSongs });

  return res.status(200).json({ data: songs });

  // const user = await User.findById(req.user._id);
  // return res.status(200).send({ data: songs });
});

module.exports = router;
