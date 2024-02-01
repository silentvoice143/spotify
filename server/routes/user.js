const express = require("express");
const { UserModel: User } = require("../models/User");
const userauth = require("../middleware/authCheck");
const validObjectId = require("../middleware/validObjectId");

///
const router = express.Router();

//get users by id
router.get("/:id", [validObjectId, userauth], async (req, res) => {
  const params = req.params.id;
  console.log(params);
  const user = await User.find({ _id: params }).select("-password-__v");
  return res.status(200).json({ data: user });
});

//update user by id
router.put("/:id", [validObjectId, userauth], async (req, res) => {
  const params = req.params.id;

  const user = await User.findOneAndUpdate(
    { _id: params },
    { $set: req.body },
    { new: true, upsert: true }
  );
  return res.status(200).json({ data: user });
});

//delete user
router.delete("/:id", [validObjectId, userauth], async (req, res) => {
  const params = req.params.id;
  await User.findOneAndDelete({ _id: params });
  return res.status(200).json({ message: "Successfully deleted user" });
});

module.exports = router;
