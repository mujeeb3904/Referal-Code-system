const User = require("../model/referal");
const crypto = require("crypto");

async function handleRegisterUser(req, res) {
  try {
    const { username, password, email, referrerCode, XP } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Generating Referal
    function generateReferralCode(length = 4) {
      return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length)
        .toUpperCase();
    }

    const referralCode = generateReferralCode();

    let referrer;
    if (referrerCode) {
      referrer = await User.findOne({ referralCode: referrerCode });
      if (!referrer) {
        return res.status(400).json({ message: "Referral code is incorrect." });
      }
    }

    const newUser = new User({
      username,
      password,
      email,
      referrer: referrer ? referrer._id : null,
      referralCode,
      referralCount: 0,
      XP,
    });

    await newUser.save();

    if (referrer) {
      referrer.referralCount += 1;
      await referrer.save();

      async function updateLevels(user, level = 1) {
        if (!user.referrer) {
          return;
        }
        const XP = 100;
        const parent = await User.findById(user.referrer);
        const levelKey = `level${level}`;
        if (!parent[levelKey].includes(newUser._id)) {
          parent[levelKey].push(newUser._id);
          parent.XP += XP;
        }
        await parent.save();
        if (level < 5) {
          await updateLevels(parent, level + 1);
        }
      }
      await updateLevels(newUser);
    }

    return res.json({ message: "User registered successfully", User: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = handleRegisterUser;
