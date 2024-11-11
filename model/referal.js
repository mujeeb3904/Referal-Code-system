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
  referralCode: {
    type: String,
  },
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  referrals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  referralCount: {
    type: Number,
  },
  level: {
    type: Number,
    default: 1,
  },
  level2: {
    type: Number,
  },
  level3: {
    type: Number,
  },
  level4: {
    type: Number,
  },
  level5: {
    type: Number,
  },
});

module.exports = mongoose.model("User", userSchema);
