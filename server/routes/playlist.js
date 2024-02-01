const express = require("express");
const router = express.Router();
const passport = require("passport");
const userauth = require("../middleware/authCheck");
const admin = require("../middleware/Admin");
const validateObjectId = require("../middleware/validObjectId");
const joi = require("joi");

const { UserModel: User } = require("../models/User");
const { SongModel: Song } = require("../models/Song");
const { PlaylistModel: PlayList, validate } = require("../models/Playlist");

//to get a single playlist using id
router.post("/", userauth, async (req, res) => {
  try {
    // console.log(req.body);
    const userId = req.user._id;
    const userData = await User.findOne({ _id: userId });
    const playlistId = req.body.playlist_id;
    const playlist = await PlayList.findOne({ _id: playlistId }).populate([
      "songs",
      "owner",
    ]);

    userData.password = undefined;
    // console.log(playlist);
    return res.status(200).json({ playlist, userData });
  } catch (err) {
    return res.status(403).json({ error: err });
  }
});

// add song to playlist
router.post("/addsong", userauth, async (req, res) => {
  try {
    // console.log(req.body);
    const user = await User.findById(req.user._id);
    const playlist = await PlayList.findById(req.body.playlistId);
    if (!user._id.equals(playlist.owner))
      return res
        .status(403)
        .send({ message: "User don't have access to add!" });

    if (playlist.songs.indexOf(req.body.songId) === -1) {
      playlist.songs.push(req.body.songId);
    }
    await playlist.save();
    res.status(200).send({ data: playlist, message: "Added to playlist" });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

/////to get all the playlists

router.get("/all", userauth, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId });
    // console.log(user);
    if (!user) {
      return res.status(203).json({ error: "User not found" });
    }
    const playlistIds = user.playlists;
    // console.log(playlistIds);

    let playLists = [];
    for (let i = 0; i < playlistIds.length; i++) {
      let playlist = await PlayList.findOne({ _id: playlistIds[i] }).populate(
        "owner"
      );
      playlist.owner.password = undefined;
      playlist.owner.__v = undefined;
      // console.log(playlist);
      playLists.push(playlist);
    }
    user.password = undefined;
    user.__v = undefined;
    return res.status(200).json({ data: playLists });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

router.get("/create", userauth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const noOfPlaylists = user.playlists.length;

    const name = "My Playlist #" + (noOfPlaylists + 1);

    const playList = await PlayList({
      name: name,
      owner: user._id,
    }).save();

    user.playlists.push(playList._id);
    await user.save();
    res.status(201).json({ playList, user });
  } catch (err) {
    res.status(401).json({ error: err });
  }
});

// user playlists
router.get("/favourite", userauth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const playlists = await PlayList.find({ _id: user.playlists });
  res.status(200).send({ data: playlists });
});

// get random playlists
router.get("/random", async (req, res) => {
  try {
    const playlists = await PlayList.aggregate([
      { $sample: { size: 5 } },
      {
        $lookup: {
          from: "users", // Assuming your user collection is named 'users'
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: "$owner" },
    ]);
    // console.log(playlists);

    res.status(200).json({ data: playlists });
  } catch (err) {
    res.status(400).json({ erroe: err });
  }
});

// get playlist by id
router.get("/:id", [validateObjectId, userauth], async (req, res) => {
  const playlist = await PlayList.findById(req.params.id).populate("owner");
  if (!playlist) return res.status(404).send("not found");

  const songs = await Song.find({ _id: playlist.songs });
  res.status(200).send({ data: { playlist, songs } });
});

// get all playlists
router.get("/", userauth, async (req, res) => {
  const playlists = await PlayList.find();
  res.status(200).send({ data: playlists });
});

router.get("/top", async (req, res) => {
  try {
    const topPlaylists = await Playlist.find().sort({ songs: -1 }).limit(5); // Adjust the limit as needed
    return res.status(200).json(topPlaylists);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// delete playlist by id
router.delete("/delete/:id", userauth, async (req, res) => {
  // console.log(req.params.id);
  try {
    const user = await User.findById(req.user._id);
    const playlist = await PlayList.findById(req.params.id);
    // console.log(playlist);
    if (!user._id.equals(playlist.owner))
      return res
        .status(403)
        .send({ message: "User don't have access to delete!" });

    const index = user.playlists.indexOf(req.params.id);
    console.log(index);
    if (index !== -1) {
      user.playlists.splice(index, 1);
    }
    // console.log(user);
    await user.save();
    const deleted = PlayList.deleteOne({ _id: req.params.id });
    // console.log(deleted);
    res.status(200).json({ message: "Removed from library" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

// edit playlist by id
router.put("/edit/:id", [validateObjectId, userauth], async (req, res) => {
  // const { error } = schema.validate(req.body);
  // if (error) return res.status(400).send({ message: error.details[0].message });

  const playlist = await PlayList.findById(req.params.id);
  if (!playlist) return res.status(404).send({ message: "Playlist not found" });

  const user = await User.findById(req.user._id);
  if (!user._id.equals(playlist.owner))
    return res.status(403).send({ message: "User don't have access to edit!" });

  playlist.name = req.body.name;
  playlist.desc = req.body.desc;
  playlist.thumbnail = req.body.thumbnail;
  await playlist.save();

  res.status(200).send({ message: "Updated successfully" });
});

//edit visiblity by the id of playlist//
router.put("/edittype/:id", [validateObjectId, userauth], async (req, res) => {
  // console.log("called");

  const playlist = await PlayList.findById(req.params.id);
  if (!playlist) return res.status(404).send({ message: "Playlist not found" });

  const user = await User.findById(req.user._id);
  if (!user._id.equals(playlist.owner))
    return res.status(403).send({ message: "User don't have access to edit!" });

  playlist.type = req.body.type;
  await playlist.save();

  res.status(200).send({ message: "playlist set as " + req.body.type });
});

// remove song from playlist
router.delete("/removesong", userauth, async (req, res) => {
  const schema = joi.object({
    playlistId: joi.string().required(),
    songId: joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findById(req.user._id);
  const playlist = await PlayList.findById(req.body.playlistId);
  if (!user._id.equals(playlist.user))
    return res
      .status(403)
      .send({ message: "User don't have access to Remove!" });

  const index = playlist.songs.indexOf(req.body.songId);
  playlist.songs.splice(index, 1);
  await playlist.save();
  res.status(200).send({ data: playlist, message: "Removed from playlist" });
});

module.exports = router;
