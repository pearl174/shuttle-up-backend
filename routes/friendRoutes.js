import { getFriends, deleteFriend, getFriendRequests } from "../controllers/friendsController.js";
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

// @route DELETE /api/friends/:friendUsername
// @desc Nuke a friend from orbit
// @access Private

router.delete(
    "/:friendUsername",
    authMiddleware,
    deleteFriend
)

// @route GET /api/friends/requests/:username
// @desc Get current user's friend requests
// @access Private

router.get(
    "/requests/:username",
    authMiddleware,
    getFriendRequests
)

export default router;