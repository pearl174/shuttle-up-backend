import { prisma } from "../lib/prisma.js";

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database Connected");
  } catch (err) {
    console.error("Database connection failed", err);
    process.exit(1);
  }
};

export default connectDB;