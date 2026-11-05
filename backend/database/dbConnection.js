
import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const dbConnection = async () => {
  try {
    if (!process.env.DB_URL) {
      throw new Error("DB_URL is missing.");
    }

    await mongoose.connect(process.env.DB_URL, {
      dbName: "job_portal",
    });

    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Error connecting to database:", err.message);
    throw err;
  }
};
