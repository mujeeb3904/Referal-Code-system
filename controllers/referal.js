const User = require("../model/referal");
const crypto = require("crypto");

async function handleRegisterUser(req, res) {
  try {
    const { username, password, email, referrerCode } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Generate Referral Code
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
        return res.status(400).json({ message: "Referral code is incorrect." });
      }
    }

    // Create new user
    const newUser = new User({
      username,
      password,
      email,
      referrer: referrer ? referrer._id : null,
      referralCode,
      referralCount: 0,
      XP: 0,
    });

    await newUser.save();

    // Update referrer if applicable
    if (referrer) {
      referrer.referralCount += 1;
      await referrer.save();

      async function updateLevels(user, level = 1) {
        if (!user.referrer || level > 5) {
          return;
        }

        const parent = await User.findById(user.referrer);
        if (!parent) return;

        // XP bonus
        const xpLevels = [100, 50, 30, 20, 10];
        const parentXP = xpLevels[level - 1];
        const levelKey = `level${level}`;

        if (!parent[levelKey].includes(newUser._id)) {
          parent[levelKey].push(newUser._id);
          parent.XP = (parent.XP || 0) + parentXP;
        }

        await parent.save();
        await updateLevels(parent, level + 1);
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
