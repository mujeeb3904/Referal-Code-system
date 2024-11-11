const User = require("../model/referal");
const crypto = require("crypto");

async function handleRegisterUser(req, res) {
  try {
    const { username, password, email, referrerCode } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Generate a new referral code for the user
    function generateReferralCode(length = 4) {
      return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length)
        .toUpperCase();
    }

    const referralCode = generateReferralCode();
    // check refrrer provided
    let referrer = null;
    if (referrerCode) {
      referrer = await User.findOne({ referralCode: referrerCode });
      if (!referrer) {
        return res.status(400).json({ message: "Invalid referral code" });
      }
    }

    // Create new user with or without a referrer
    const newUser = new User({
      username,
      password,
      email,
      referrer: referrer ? referrer._id : null,
      level: 1,
      referralCode,
    });

    // Save the new user
    await newUser.save();

    // Update levels of referring user, if applicable
    const referrerIds = [];
    if (referrer) {
      async function updateLevels(user) {
        if (!user.referrer) {
          return;
        }
        referrerIds.push(referrer._id);
        const parent = await User.findById(user.referrer);
        parent.level = Math.min(parent.level + 1, 5);
        await parent.save();
        // Recursively update parent levels
        updateLevels(parent);
      }
      // Only update if there's a referrer
      await updateLevels(newUser);
    }

    return res.json({ message: "User registered successfully", User: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = handleRegisterUser;
