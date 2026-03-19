import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "../models/Event.js";

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to:", mongoose.connection.name);

    const result = await Event.updateMany(
      { isPublished: { $ne: true } }, // anything not true
      { $set: { isPublished: true } },
    );

    console.log("Modified count:", result.modifiedCount);

    const publishedCount = await Event.countDocuments({ isPublished: true });
    console.log("Total published events now:", publishedCount);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

migrate();
