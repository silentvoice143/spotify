require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("authorization");
  // console.log(token);
  if (!token) return res.status(400).send("Access denied, no token provided.");

  jwt.verify(token, process.env.JWTPRIVATEKEY, async (err, validToken) => {
    // console.log(validToken.isAdmin);
    if (err) {
      return res.status(400).send({ error: "invalid token" });
    }
    if (validToken) {
      req.decodedToken = validToken;
      const isAdmin = await validToken.isAdmin;
      //   If the user is trying to access a restricted route and isn't logged in show error
      if (!isAdmin) {
        return res.status(401).json({ error: "Permission denied!" });
      } else {
        req.user = validToken;
      }
    }

    next();
  });
};
