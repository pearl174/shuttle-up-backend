import { prisma } from "../lib/prisma.js";

export const getFriends = async(req, res) => {
    const username = req.params.username;
    const userId = req.user.id;
    console.log(username);

    try {
        const profile = await prisma.profile.findUnique({
            where: { 
                userId: userId
            },
            include: {
                friends: {
                    include: {
                        user: true
                    }
                }
            }
        });
        console.log(profile?.friends);
        const friends = profile?.friends;
        
        res.status(200).json({ "msg": "Friends retrieved successfully", "friends": friends });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "msg": "Error retrieving friends" });
    }
}

export const deleteFriend = async(req, res) => {
    const friendUsername = req.params.friendUsername;
    const userId = req.user.id;

    try {
        // Find the friend to delete 
        const [requesterProfile, friendProfile] = await Promise.all([
            prisma.profile.findUnique({
                where: {
                    userId: userId
                },
                select: {id: true}
            }),
            prisma.profile.findFirst({
                where: {
                    user: {username: friendUsername}
                },
                select: {id: true}
            })
        ])
        if (!friendProfile) {
            throw new Error("Friend not found");
        }
        
        await prisma.$transaction([
            prisma.profile.update({
                where: {id: requesterProfile.id},
                data: {friends: {disconnect: {id: friendProfile.id}}}
            }),
            prisma.profile.update({
                where: {id: friendProfile.id},
                data: {friends: {disconnect: {id: requesterProfile.id}}}
            })
        ]);
        res.status(200).json({msg: "Friend deleted"})
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: "Something went wrong with deleting your friend"})
    }
}

export const getFriendRequests = async(req, res) => {
    const username = req.params.username;
    const userId = req.user.id;

    try {
        const profile = await prisma.profile.findUnique({
            where: {userId},
            include: {friendRequestsReceived: {include: {user: true}}}
        });
        res.status(200).json({"msg": "Friend requests retrieved successfully.", "friendRequests": profile?.friendRequestsReceived});
    } catch (err) {
        console.error(err);
        res.status(500).json({"msg": "Error retrieving friend requets"})
    }
}

export const deleteFriendRequest = async(req, res) => {
    const friendUsername = req.params.friendUsername;
    const userId = req.user.id;
    // find profiles for both
    // disconnect friend req on both using transaction 
    try {
        const [friendProfile, requesterProfile] = await Promise.all([
            prisma.profile.findUnique({
                where: {user: {username: friendUsername}}
            }
            ),
            prisma.profile.findUnique({
                where: {userId}
            }
            )
        ]);
        if (!friendProfile) throw new Error("Friend profile does not exist");

        await prisma.profile.update({
                where: {id: requesterProfile.id},
                data: {friendRequestsReceived: {disconnect: {id: friendProfile.id}}}
            }
        );
        res.status(200).json({"msg": "Successfully deleted friend request"});
    } catch (err) {
        console.error(err);
        res.status(500).json({"msg": "Error deleting friend request"});
    }
}

export const addFriend = async(req, res) => {
    const friendUsername = req.params.friendUsername;
    const userId = req.user.id;

    try {
        const [requesterProfile, friendProfile] = await Promise.all([
            prisma.profile.findUnique(
                {where: {userId}}
            ),
            prisma.profile.findFirst(
                {where: {user: {username: friendUsername}}}
            )
        ]);
        if (!friendProfile) {
            throw new Error(`No friend found with username: ${friendUsername}`);
        }

        await prisma.$transaction([
            // delete the friend request
            prisma.profile.update({
                where: {id: requesterProfile.id},
                data: {friendRequestsReceived: {disconnect: {id: friendProfile.id}}}
            }),
            prisma.profile.update({
                where: {id: requesterProfile.id},
                data: {
                    friends: {connect: {id: friendProfile.id}},
                    friendOf: {connect: {id: friendProfile.id}}
                }
            })
        ]);
        res.status(200).json({"msg": "Friend added successfully"});
    } catch(err) {
        console.log(err);
        res.status(500).json({"msg": "Error deleting friend"});
    }
}

export const getUsers = async(req, res) => {
    const userId = req.user.id;
    try {
        const profile = await prisma.profile.findUnique({where: {userId}});
        const users = await prisma.profile.findMany({
            where: {
                userId: {not: userId},
                friendRequestsSent: {none: {id: profile.id}},
                friendRequestsReceived: {none: {id: profile.id}}
            },
            include: {user: {select: {username: true}}}
        });
        res.status(200).json({"users": users});
        console.log(users);
    } catch(err) {
        console.error(err);
        res.status(500).json({"msg": "Something went wrong in fetching users"})
    }
}

export const addFriendRequest = async(req, res) => {
    const userId = req.user.id;
    const friendUsername = req.params.friendUsername;

    try {
        const [requesterProfile, friendProfile] = await Promise.all([
            prisma.profile.findUnique({
                where: {userId}
            }),
            prisma.profile.findFirst({
                where: {user: {username: friendUsername}}
            })
        ]);
        if (!friendProfile) {
            throw new Error("Friend for friend request not found");
        }
        await prisma.profile.update({
            where: {id: requesterProfile.id},
            data: {
                friendRequestsSent: {connect: {id: friendProfile.id}}
            }
        })
        return res.status(200.).json({"msg": "Friend Request sent"});
    } catch(err) {
        console.error(err);
        return res.status(500).json({"msg": "Something went wrong"});
    }
}