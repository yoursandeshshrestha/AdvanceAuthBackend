const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const auth = require("../middleware/auth");

const router = express.Router();
const SECRET_KEY =
  process.env.SECRET_KEY || "sandeshshresthaaryanpradhan8597831351";

router.post("/register", async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullname, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      res.status(400).json({ message: "Email already in use" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = await user.generateAuthtoken();
    res.cookie("usercookie", token, {
      expires: new Date(Date.now() + 90000000),
      httpOnly: true,
    });
    const results = {
      user,
      token,
    };
    res.status(201).json({ status: 201, results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/auth", auth, async (req, res) => {
  try {
    const ValidUser = await User.find({ _id: req.userID });
    res.status(201).json({ status: 201, ValidUser });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
