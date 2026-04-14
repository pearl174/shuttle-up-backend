import { prisma } from "./lib/prisma.js";

await prisma.activityLog.create()