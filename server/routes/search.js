const router = require("express").Router();
const { SongModel: Song } = require("../models/Song");
const { PlaylistModel: PlayList } = require("../models/Playlist");
const userauth = require("../middleware/authCheck");

router.get("/all/:input", userauth, async (req, res) => {
  try {
    const search = req.params.input;
    if (search !== "") {
      const songs = await Song.find({
        name: { $regex: search, $options: "i" },
      }).populate("artist");
      // .limit(10) for first 10 matching
      // console.log(songs);

      const playlists = await PlayList.find({
        name: { $regex: search, $options: "i" },
        type: "public",
      });
      // console.log(playlists);

      res.status(200).json({ songs: songs, playlists: playlists });
    } else {
      res.status(200).json({});
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get("/songs/:songname", userauth, async (req, res) => {
  try {
    const search = req.params.songname;
    if (search !== "") {
      const songs = await Song.find({
        name: { $regex: search, $options: "i" },
      });
      // .limit(10) for first 10 matching
      // console.log(songs);

      res.status(200).json({ data: songs });
    } else {
      res.status(200).json({});
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get("/artist/:artist", userauth, async (req, res) => {
  try {
    const search = req.params.artist;
    if (search !== "") {
      const songs = await Song.find({
        name: { $regex: search, $options: "i" },
      });
      // .limit(10) for first 10 matching
      // console.log(songs);

      res.status(200).json({ data: songs });
    } else {
      res.status(200).json({});
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get("/:playlist", userauth, async (req, res) => {
  const search = req.query.search;
  if (search !== "") {
    const songs = await Song.find({
      name: { $regex: search, $options: "i" },
    }).limit(10);
    const playlists = await PlayList.find({
      name: { $regex: search, $options: "i" },
    }).limit(10);
    const result = { songs, playlists };
    res.status(200).send(result);
  } else {
    res.status(200).send({});
  }
});

module.exports = router;
