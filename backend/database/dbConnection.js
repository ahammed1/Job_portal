import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    if (!process.env.DB_URL) {
      throw new Error("DB_URL is missing. Check backend/config/config.env.");
    }

    await mongoose.connect(process.env.DB_URL, {
      dbName: "job_portal",
    });

    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Error connecting to database:", err.message);
  }
};
