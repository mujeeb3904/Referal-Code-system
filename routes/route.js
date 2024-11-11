const express = require("express");
const router = express.Router();
const handleRegisterUser = require("../controllers/referal");

router.post("/register", handleRegisterUser);

module.exports = router;
