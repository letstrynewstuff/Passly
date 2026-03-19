// src/components/AvatarPicker.jsx
import React from "react";
import { motion as Motion } from "framer-motion";
import { updateAvatarStyle } from "../api/services/profileApi";
import { jwtDecode } from "jwt-decode";

const AVATAR_STYLES = [
  "adventurer",
  "adventurer-neutral",
  "avataaars",
  "big-smile",
  "bottts",
  "bottts-neutral",
  "fun-emoji",
  "icons",
  "lorelei",
  "lorelei-neutral",
  "micah",
  "miniavs",
  "notionists",
  "notionists-neutral",
  "open-peeps",
  "personas",
  "pixel-art",
  "pixel-art-neutral",
  "thumbs",
  "identicon",
];

const AvatarPicker = ({ currentStyle, onStyleChange }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  // ✅ userId NOT needed here
  const handleSelect = async (style) => {
    setIsLoading(true);
    try {
      const response = await updateAvatarStyle(style);
      onStyleChange(response.avatarUrl, style);
    } catch (err) {
      console.error("Avatar update failed:", err);
      alert("Failed to update avatar");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Decode once, not inside map
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const userId = decoded.id || decoded._id || decoded.userId || decoded.sub;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Choose Avatar Style
      </h3>

      <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
        {AVATAR_STYLES.map((style) => {
          const previewUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${userId}`;

          return (
            <Motion.div
              key={style}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(style)}
              className={`cursor-pointer rounded-full overflow-hidden ring-2 ${
                style === currentStyle ? "ring-purple-500" : "ring-transparent"
              }`}
            >
              <img
                src={previewUrl}
                alt={style}
                className="w-16 h-16 object-cover"
              />
            </Motion.div>
          );
        })}
      </div>

      {isLoading && <p className="text-center text-gray-500">Updating...</p>}
    </div>
  );
};

export default AvatarPicker;
