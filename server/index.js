//import express
require("dotenv").config();
require("express-async-errors");

const express = require("express");

const bodyParser = require("body-parser");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const cors = require("cors");
const authRoutes = require("./routes/auth");
const songRoute = require("./routes/song");
const playlistRoute = require("./routes/playlist");
const searchRoute = require("./routes/search");
const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");
const { ConnectDB } = require("./mongodb/Connection");
const User = require("./models/User");

const app = express();
const PORT = 8000;

// Set the timeout to 5 minutes (300,000 milliseconds)
app.timeout = 300000;

//to allow other ip address to access server
app.use(cors());

//conver the data into json
app.use(express.json());

//parse urlencoded http request (Form data)
app.use(bodyParser.urlencoded({ extended: true }));

//to parse body from url
app.use(
  express.urlencoded({
    extended: false,
  })
);

// //parse JSON bodies
app.use(bodyParser.json());

//database setup
ConnectDB();

//middleware setup

//passport middleware setup

// var opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = "secret";
// passport.use(
//   new JwtStrategy(opts, async function (jwt_payload, done) {
//     await User.findOne({ id: jwt_payload.sub })
//       .then(function (user) {
//         if (user) {
//           return done(null, user);
//         } else {
//           return done(null, false);
//         }
//       })
//       .catch(function (err) {
//         return done(null, false);
//       });
//   })
// );

// , function (err, user) {
//   if (err) {
//     return done(err, false);
//   }
//   if (user) {
//     return done(null, user);
//   } else {
//     return done(null, false);
//     // or you could create a new account
//   }
// });

app.use("/auth", authRoutes);
//if we want to use auth routes then the api call should be life auth/register

app.use("/user", userRoute);

app.use("/admin", adminRoute);

//for song related route
app.use("/song", songRoute);
//for playlist routes
app.use("/playlist", playlistRoute);

//for search route
app.use("/search", searchRoute);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
