import { prisma } from "../lib/prisma.js";

export const getProfile = async (req, res) => {
    const user = req.user;
    const userId = user.id;
    // console.log(user);
    // const username = req.params.username;
    // console.log(username)

    try {
        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: {
                activityLogs: true
            }
        })
        // console.log(profile);
        if (!profile) {
            return res.status(404).json({ msg: "Profile not found" });
        }
        res.status(200).json({ msg: "Profile found", data: profile });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
}