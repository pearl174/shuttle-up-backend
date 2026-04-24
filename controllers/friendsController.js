import { prisma } from "../lib/prisma.js";

export const getFriends = async(req, res) => {
    const username = req.params.username;
    console.log(username);

    try {
        const profile = await prisma.profile.findUnique({
            where: { 
                user: {
                    username: username
                }
            },
            include: {
                friends: true
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
                    user: {id: userId}
                },
                select: {id: true}
            }),
            prisma.profile.findUnique({
                where: {
                    user: {username: friendUsername}
                },
                select: {id: true}
            })
        ])
        if (!friendProfile) {
            return res.status(404).json({msg: "Friend not found"});
        }
        
        await prisma.$transaction([
            prisma.profile.update({
                where: {id: requesterProfile.id},
                data: {friends: {disconnect: friendProfile.id}}
            }),
            prisma.profile.update({
                where: {id: friendProfile.id},
                data: {friends: {disconnect: requesterProfile.id}}
            })
        ]);
        res.status(200).json({msg: "Friend deleted"})
    } catch (err) {
        console.error(err);
        res.status(500).json({msg: "Something went wrong with deleting your friend"})
    }
}