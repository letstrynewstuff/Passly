// src/config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

// Validate required environment variables
const requiredEnvVars = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key.toUpperCase());

if (missingVars.length > 0) {
  console.error(
    "❌ Cloudinary configuration failed: Missing environment variables:",
    missingVars.join(", "),
  );
  // Do NOT throw here in production → just log and let the app continue
  // You can throw in development if you prefer strict mode
  // throw new Error('Missing Cloudinary credentials');
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: requiredEnvVars.cloud_name,
  api_key: requiredEnvVars.api_key,
  api_secret: requiredEnvVars.api_secret,
  secure: true, // Always use HTTPS
});

// Optional: Test connection (only in development)
if (process.env.NODE_ENV !== "production") {
  cloudinary.api
    .ping()
    .then(() => console.log("✅ Cloudinary connection successful"))
    .catch((err) => console.error("⚠️ Cloudinary ping failed:", err.message));
}

// Export the configured instance
export default cloudinary;
