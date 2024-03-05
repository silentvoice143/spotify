const express = require("express");
const nodemailer = require("nodemailer");
const { UserModel: User } = require("../models/User");
const userauth = require("../middleware/authCheck");
const validObjectId = require("../middleware/validObjectId");

///
const router = express.Router();

//password
// hsqm vumn atou gcjg

// Create a transporter object for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "austyn.wilderman38@ethereal.email",
    pass: "G1DD5QWctwzzUSEe5B",
  },
});

let generatedOTP = "";

// Route to handle forgot password request
router.post("/forgot-password", async (req, res) => {
  const userEmail = req.body.email; // Assuming email is sent via request body
  const otp = randomstring.generate({ length: 6, charset: "numeric" }); // Generate a 6-digit OTP

  const mailOptions = {
    from: "your_email@gmail.com",
    to: userEmail,
    subject: "Reset Your Password",
    text: `Your OTP for password reset is: ${otp}`,
  };

  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return res.status(400).json({ error: "Something is wrong" });
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to send OTP" });
    } else {
      console.log("Email sent: " + info.response);
      generatedOTP = otp;
      res.status(200).json({ message: "OTP sent successfully" });
    }
  });
});

// Route to handle OTP verification and password reset
router.post("/verify-otp", async (req, res) => {
  const userEmail = req.body.email;
  const userOTP = req.body.otp; // Assuming OTP is sent via request body

  // Perform OTP verification logic here (compare user's OTP with the generated OTP)
  if (userOTP !== generatedOTP) {
    res.status(400).json({ error: "Invalid OTP" });
  }

  // If OTP is valid, allow password reset
  res.status(200).json({ message: "OTP verified successfully" });

  // If OTP is invalid, return an error response
  // res.status(400).json({ message: 'Invalid OTP' });
});

router.put("/change-password", async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: params },
    { $set: req.body },
    { new: true, upsert: true }
  );

  if (user) {
    res.status(200).json({ message: "Password updated successfully" });
  }
  res.status(401).json({ error: "Something is wrong" });
});

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
