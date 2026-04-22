import { getFriends } from "../controllers/friendsController.js";
import authMiddleware from "../middleware/auth.js";
import express from "express";

const router = express.Router();

// @route   GET /api/friends/:username
// @desc    Get current user's friends
// @access  Private

router.get(
    "/:username",
    authMiddleware,
    getFriends
);

export default router;