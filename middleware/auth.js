const jwt = require("jsonwebtoken");
const connection = require("../DB/connection");
const User = require("../models/userModel");
const keysecret = "sandeshshresthaaryanpradhan8597831351";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    const verifyToken = jwt.verify(token, keysecret);
    const rootUser = await User.findOne({ _id: verifyToken._id });
    if (!rootUser) {
      throw new Error("User not found");
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (error) {
    res.status(401).send({ error: "Invalid token!" });
  }
};

module.exports = auth;
