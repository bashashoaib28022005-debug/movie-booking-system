const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.post("/register", async (req, res) => {

    const { name, email, mobile, password } = req.body;

    const newUser = new User({
        name,
        email,
        mobile,
        password
    });

    await newUser.save();

    res.json({ message: "User Registered Successfully" });

});

module.exports = router;