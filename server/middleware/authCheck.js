require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const request = req.headers;
  // console.log(request);
  const token = request["authorization"];
  if (!token) {
    return res.status(400).json({ err: "Access denied no token provided" });
  }

  jwt.verify(token, process.env.JWTPRIVATEKEY, (err, validToken) => {
    if (err) {
      return res.status(400).json({ err: "Invalid token" });
    } else {
      req.user = validToken;
      next();
    }
  });
};
