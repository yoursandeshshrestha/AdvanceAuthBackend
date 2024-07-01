const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const keysecret = "sandeshshresthaaryanpradhan8597831351";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: {
    type: Array,
    default: [],
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// Token
userSchema.methods.generateAuthtoken = async function () {
  try {
    let token2 = jwt.sign({ _id: this._id }, keysecret, {
      expiresIn: "1d",
    });
    this.tokens = [{ token: token2 }];
    await this.save();
    return token2;
  } catch (error) {
    throw new Error("Failed to generate token");
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
