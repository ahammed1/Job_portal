import mongoose from "mongoose";

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
