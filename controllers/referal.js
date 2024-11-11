const User = require("../model/referal");
const crypto = require("crypto");

async function handleRegisterUser(req, res) {
  try {
    const { username, password, email, referrerCode } = req.body;

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

    let referrer = null;
    if (referrerCode) {
      referrer = await User.findOne({ referralCode: referrerCode });
      if (!referrer) {
        return res.status(400).json({ message: "Invalid referral code" });
      }
    }

    const newUser = new User({
      username,
      password,
      email,
      referrer: referrer ? referrer._id : null,
      referralCode,
      referrals: [],
      referralCount: 0,
    });

    await newUser.save();

    if (referrer) {
      referrer.referrals.push(newUser._id);
      referrer.referralCount += 1;
      await referrer.save();

      async function updateLevels(user) {
        if (!user.referrer) {
          return;
        }
        const parent = await User.findById(user.referrer);
        parent.level = Math.min(parent.level + 1, 5);
        await parent.save();
        await updateLevels(parent);
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
