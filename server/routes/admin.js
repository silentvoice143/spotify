const express = require("express");
const { UserModel: User } = require("../models/User");
const admin = require("../middleware/Admin");
const validObjectId = require("../middleware/validObjectId");

///
const router = express.Router();

//get all users
router.get("/users", admin, async (req, res) => {
  try {
    console.log("getting all users");
    const users = await User.find().select("-password-__v");
    return res.status(200).json({ data: users });
  } catch (err) {
    return res.status(404).json({ err: "Something wrong" + err });
  }
});

//restrict user

module.exports = router;
