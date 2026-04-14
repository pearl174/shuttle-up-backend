import { getProfile } from "../controllers/profileController.js"
import authMiddleware from "../middleware/auth.js";
import express from "express";

const router = express.Router();

// @route   GET /api/profile/:username
// @desc    Get current user's profile data 
// @access  Private

router.get(
    "/:username",
    authMiddleware,
    getProfile
);

export default router;