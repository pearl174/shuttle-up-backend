import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { prisma } from "../lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async(req, res) => {
    const errors = validationResult(req); // the req body has errors stored for each one triggered in the authRoute
    // as the checks were in the middleware of .post. get added to the request body and can be gathered here
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // bad request
    }
    const { username, email, password } = req.body;

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        })
        if (existingUser) {
            return res.status(400).json({ msg: "Email or Username already exists" });
        }

        // Create new user
        // for that get the profile pic path 
        // total 20 icons 
        const totalIcons = 20;
        const randomIconNumber = Math.floor(Math.random() * totalIcons) + 1;
        const profilePicPath = `/icons/icon${randomIconNumber}.png`;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                profile: {
                    create: {
                        profilePicPath: profilePicPath,
                    } // Foreign key set on its own if using nested stuff like so. 
                    // The nested way is cleaner and also safer — if the profile create fails, the user won't be created either (it's atomic).
                }
            }
        })

        res.status(201).json({ msg: "Signup successful! Please login" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

export const login = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    
    try {
        const user = await prisma.user.findUnique({
            where: { username }
        })
      
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ token });
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}