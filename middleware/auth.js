import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    // console.log("Auth middleware called");
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        // const payload = { user: { id: user.id } }; from authController.js
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
}

export default authMiddleware;