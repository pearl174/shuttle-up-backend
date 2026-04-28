import { getFriends, deleteFriend, getFriendRequests, deleteFriendRequest } from "../controllers/friendsController.js";
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

// @route DELETE /api/friends/requests/:friendUsername
// @desc Decline friend request by friend
// @access Private

router.delete(
    "/requests/:friendUsername",
    authMiddleware,
    deleteFriendRequest
)

// @route /api/friends/:friendUsername
// @desc Add friend for the current user 
// @access private 

router.post(
    "/:friendUsername",
    authMiddleware,
    deleteFriendRequest,
    addFriend
)

export default router;