const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
// const getToken = require("../utils/Authhelpers");
const { UserModel: User, validate } = require("../models/User");
//we can do router=express() but it will import all the invaluable functions too
// which we dont need.
//So particularly we are importing router form express

router.get("/", (req, res) => {
  //this code run when call for home route
});

router.post("/register", async (req, res) => {
  //my req.body will be of the format {email, password, firstName, lastName, username}

  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).json({ err: error.details[0].message });
    }

    /////
    const { email, username, password, name, dob, gender, isAdmin } = req.body;
    // console.log(req.body);

    //step 2: if user already exist the we dont let user to register again
    const user = await User.findOne({ email });
    if (user) {
      //user already exist
      // console.log(user);
      return res
        .status(409)
        .json({ err: "Email or Username is already taken" });
    }

    //if user not found means we register a new user
    //step 3: create and save a new user
    //before that we convert plain password in a hash password

    //   to generate simply
    const hash = await bcrypt.hash(password, 10);

    // Store hash in your password DB.
    const newUserData = {
      email,
      password: hash,
      name,
      username,
      dob,
      gender,
      isAdmin,
    };
    const newUser = new User(newUserData);
    await newUser.save();

    //step 4: we want to create a token to return the user
    // const token = await getToken(email, newUser);

    const token = newUser.generateAuthToken();
    newUser.password = undefined;
    newUser.__v = undefined;

    //step 5: return the response to the user
    const userReturn = { ...newUser.toJSON(), token };
    delete userReturn.password;
    // console.log(userReturn);
    return res
      .status(200)
      .json({ message: "Successfully signup", user: userReturn });
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/login", async (req, res) => {
  // step 1: get email and password sent by the user from req.body
  const { email, password } = req.body;
  // console.log(req.body);
  //step 2: check user exist or not
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ err: "User not registered" });
  }
  //step 3: if the user exist, check if the password is correct or not
  //here bcrypt let us compare us plain text password with hased password return true/ false
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(404).json({ err: "invalid credentials" });
  }

  //step 4: If the credential are currect return a token to the user

  const token = user.generateAuthToken();
  const userReturn = { ...user.toJSON(), token };
  delete userReturn.password;
  userReturn.__v = undefined;
  return res
    .status(200)
    .json({ message: "Login successfully", user: userReturn });
});

module.exports = router;
