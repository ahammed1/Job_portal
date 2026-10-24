import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URL, {
      dbName: "MERN_JOB_PORTAL",
    })
    .then(() => {
      console.log("Connected to MongoDB successfully!");
    })
    .catch((err) => {
      console.log(`Error connecting to database: ${err}`);
    });
};