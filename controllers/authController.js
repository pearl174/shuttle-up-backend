const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User.js");
const Profile = require("../models/Profile.js");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.signup = async(req, res) => {
    const errors = validationResult(req); // the req body has errors stored for each one triggered in the authRoute
    // as the checks were in the middleware of .post. get added to the request body and can be gathered here
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // bad request
    }
    const { username, email, password } = req.body;

    try {
        const [existingEmail, existingUsername] = await Promise.all([
            User.findOne({ email }),
            User.findOne({ username })
        ]);

        if (existingEmail || existingUsername) {
            return res.status(400).json({ msg: "Email or Username already exists" });
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        const profile = new Profile({ user: user._id, username });  
        await profile.save();

        res.status(201).json({ msg: "Signup successful! Please login" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

exports.login = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        // console.log(user._id); // ObjectId("64f23e9bdbe13a45c5f7c0aa")
        // console.log(user.id);  // "64f23e9bdbe13a45c5f7c0aa"  (string)

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ token });
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}