import { prisma } from "../lib/prisma.js";

export const getFriends = async(req, res) => {
    const username = req.params.username;
    console.log(username);

    try {
        const profile = await prisma.profile.findMany({
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
        const friends = profile?.friends || [];
        
        res.status(200).json({ "msg": "Friends retrieved successfully", "friends": friends });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "msg": "Error retrieving friends" });
    }
}