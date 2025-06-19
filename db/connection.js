import mongoose from "mongoose";
import logError from "mongoose";
import handleError from "mongoose";
import { mongo_uri } from "../config/envConfig.js";

export default async function connectDB() {
  try {
    await mongoose.connect(mongo_uri);
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    handleError(error);
  }

  mongoose.connection.on("error", (err) => {
    logError(err);
  });
}