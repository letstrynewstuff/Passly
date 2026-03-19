// src/components/ProfileSettings.jsx
import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  Bell,
  Moon,
  Sun,
  Eye,
  EyeOff,
  LogOut,
  Crown,
  Loader2,
} from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import { useNavigate } from "react-router-dom";

import AvatarPicker from "./AvatarPicker"; // adjust path if needed

import { updateUserProfile, switchUserRole } from "../api/services/profileApi"; // Make sure these are correctly implemented

const ProfileSettings = ({ user, setUser }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [editProfile, setEditProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const [editForm, setEditForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // const fileInputRef = React.useRef(null);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveChanges = async () => {
    if (
      editForm.newPassword &&
      editForm.newPassword !== editForm.confirmPassword
    ) {
      alert("New passwords do not match!");
      return;
    }
    if (editForm.newPassword && editForm.newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    setIsSaving(true);

    try {
      // const token = localStorage.getItem("token");
      // const decoded = jwtDecode(token);
      // const userId = decoded.id || decoded._id || decoded.userId || decoded.sub;

      const payload = {
        username: editForm.username,
        email: editForm.email,
        // Add password change only if filled
        ...(editForm.newPassword && {
          currentPassword: editForm.currentPassword,
          newPassword: editForm.newPassword,
        }),
      };

      const updated = await updateUserProfile(payload);

      setUser(updated.profile);
      setEditProfile(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed: " + (err?.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleBecomePlanner = async () => {
    if (isUpgrading) return;

    setIsUpgrading(true);

    try {
      // const token = localStorage.getItem("token");
      // const decoded = jwtDecode(token);
      // const userId = decoded.id || decoded._id || decoded.userId || decoded.sub;

      const response = await switchUserRole({ role: "planner" });

      setUser(response.profile);
      alert("Successfully upgraded to Event Planner!");
      navigate("/profileplanner"); // or refresh page, etc.
    } catch (err) {
      console.error("Role upgrade failed:", err);
      alert("Upgrade failed: " + (err?.message || "Unknown error"));
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-2xl p-6 bg-white dark:bg-gray-800 shadow-lg space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h2>
          <Motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setEditProfile(!editProfile)}
            className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50"
            disabled={isSaving}
          >
            <Edit3 className="w-4 h-4" />
            {editProfile ? "Cancel" : "Edit Profile"}
          </Motion.button>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-4">
          <Motion.div
            whileHover={{ scale: 1.05 }}
            className="relative cursor-pointer"
            // onClick={handleAvatarClick} // This is still for file upload
          >
            <img
              src={
                user?.profileImage
                  ? user.profileImage
                  : user?.avatarStyle
                    ? `https://api.dicebear.com/7.x/${user.avatarStyle}/svg?seed=${user._id}`
                    : "https://via.placeholder.com/128?text=User"
              }
              alt={user?.username || "Profile"}
              className="w-32 h-32 rounded-full object-cover"
            />

            <div className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
          </Motion.div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click to change Avatar
          </p>

          {/* DiceBear Avatar Picker */}
          {editProfile && (
            <AvatarPicker
              currentStyle={user?.avatarStyle}
              onStyleChange={(avatarUrl, newStyle) => {
                setUser((prev) => ({
                  ...prev,
                  avatarStyle: newStyle,
                }));
              }}
            />
          )}
        </div>

        {/* Edit Form */}
        <AnimatePresence>
          {editProfile && (
            <Motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-5 overflow-hidden"
            >
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={editForm.username}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Change Password */}
              <div className="space-y-4 pt-4 border-t border-gray-300 dark:border-gray-700">
                <h4 className="font-medium text-lg text-gray-700 dark:text-gray-300">
                  Change Password (optional)
                </h4>

                <div className="relative">
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                    Current Password
                  </label>
                  <input
                    type={showPassword.current ? "text" : "password"}
                    name="currentPassword"
                    value={editForm.currentPassword}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    {showPassword.current ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                      New Password
                    </label>
                    <input
                      type={showPassword.new ? "text" : "password"}
                      name="newPassword"
                      value={editForm.newPassword}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute right-3 top-10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      {showPassword.new ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                      Confirm New Password
                    </label>
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={editForm.confirmPassword}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute right-3 top-10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      {showPassword.confirm ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <Motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium mt-6 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Motion.button>
            </Motion.div>
          )}
        </AnimatePresence>

        {/* Notifications */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Notifications
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-purple-500" />
              <span className="text-gray-700 dark:text-gray-300">
                Email Notifications
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>
        </div>

        {/* Appearance */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Appearance
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? (
                <Moon className="w-5 h-5 text-purple-500" />
              ) : (
                <Sun className="w-5 h-5 text-purple-500" />
              )}
              <span className="text-gray-700 dark:text-gray-300">
                {isDark ? "Dark Mode" : "Light Mode"}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isDark}
                onChange={toggleTheme}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>
        </div>

        {/* Become Planner (only shown if not already planner) */}
        {user?.role !== "planner" && (
          <div className="pt-6 border-t border-gray-300 dark:border-gray-700">
            <Motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBecomePlanner}
              disabled={isUpgrading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium text-lg disabled:opacity-70"
            >
              {isUpgrading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Upgrading...
                </>
              ) : (
                <>
                  <Crown className="w-6 h-6" />
                  Become an Event Planner
                </>
              )}
            </Motion.button>
          </div>
        )}

        {/* Logout */}
        <Motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Motion.button>
      </div>
    </div>
  );
};

export default ProfileSettings;
