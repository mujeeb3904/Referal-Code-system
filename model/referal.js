const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  referralCode: {
    type: String,
    unique: true,
  },
  referralCount: {
    type: Number,
    default: 0,
  },
  XP: {
    type: Number,
    default: 0,
  },
  level1: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  level2: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  level3: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  level4: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  level5: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
