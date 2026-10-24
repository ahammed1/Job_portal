
import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      dbName: "job_portal",
    });

    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Error connecting to database:", err.message);
  }
};
