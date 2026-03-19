// src/server.js
import "dotenv/config"; // Load .env variables
import app from "./app.js";
import { connectDB } from "./config/db.js"; // Assuming you have a db config file

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("MongoDB connected successfully");

    // Start Express server
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
      );
      console.log(`Health check → http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

// Graceful shutdown & error handling
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// 
const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
  console.log(`Health check → http://localhost:${PORT}/api/health`);
});


// Start everything
startServer();
