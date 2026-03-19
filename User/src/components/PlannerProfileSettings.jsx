// // src/components/ProfileSettings.jsx  (or PlannerSettings.jsx)
// import React, { useState, useRef } from "react";
// import { motion as Motion, AnimatePresence } from "framer-motion";
// import {
//   Edit3,
//   Eye,
//   EyeOff,
//   DollarSign,
//   Bell,
//   Moon,
//   Sun,
//   LogOut,
//   Crown,
//   Loader2,
// } from "lucide-react";
// import { useTheme } from "../components/ThemeProvider";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// import { updateUserProfile, switchUserRole } from "../api/services/profileApi";

// export default function PlannerSettings({ user, setUser }) {
//   const { theme, toggleTheme } = useTheme();
//   const isDark = theme === "dark";
//   const navigate = useNavigate();

//   const [editProfile, setEditProfile] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isUpgrading, setIsUpgrading] = useState(false);

//   const [editForm, setEditForm] = useState({
//     username: user?.username || "",
//     email: user?.email || "",
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [showPassword, setShowPassword] = useState({
//     current: false,
//     new: false,
//     confirm: false,
//   });

//   const fileInputRef = useRef(null);

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const togglePasswordVisibility = (field) => {
//     setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
//   };

//   const handleAvatarClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Show preview
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setUser((prev) => ({ ...prev, avatar: event.target.result }));
//     };
//     reader.readAsDataURL(file);

//     // Upload to backend
//     try {
//       const formData = new FormData();
//       formData.append("profileImage", file);

//       const token = localStorage.getItem("token");
//       const decoded = jwtDecode(token);
//       const userId = decoded.id || decoded._id || decoded.userId || decoded.sub;

//       const updated = await updateUserProfile(userId, formData);
//       setUser(updated.profile);
//       alert("Profile picture updated!");
//     } catch (err) {
//       alert("Image upload failed: " + (err.message || "Unknown error"));
//     }
//   };

//   const handleSaveChanges = async () => {
//     if (
//       editForm.newPassword &&
//       editForm.newPassword !== editForm.confirmPassword
//     ) {
//       alert("New passwords do not match!");
//       return;
//     }
//     if (editForm.newPassword && editForm.newPassword.length < 6) {
//       alert("New password must be at least 6 characters");
//       return;
//     }

//     setIsSaving(true);

//     try {
//       const token = localStorage.getItem("token");
//       const decoded = jwtDecode(token);
//       const userId = decoded.id || decoded._id || decoded.userId || decoded.sub;

//       const payload = {
//         username: editForm.username,
//         email: editForm.email,
//         ...(editForm.newPassword && {
//           currentPassword: editForm.currentPassword,
//           newPassword: editForm.newPassword,
//         }),
//       };

//       const updated = await updateUserProfile(userId, payload);
//       setUser(updated.profile);
//       setEditProfile(false);
//       alert("Profile updated successfully!");
//     } catch (err) {
//       alert("Update failed: " + (err?.message || "Unknown error"));
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleBecomePlanner = async () => {
//     setIsUpgrading(true);

//     try {
//       const token = localStorage.getItem("token");
//       const decoded = jwtDecode(token);
//       const userId = decoded.id || decoded._id || decoded.userId || decoded.sub;

//       const response = await switchUserRole(userId, { role: "planner" });
//       setUser(response.profile);
//       alert("Successfully upgraded to Event Planner!");
//       navigate("/profileplanner");
//     } catch (err) {
//       alert("Upgrade failed: " + (err?.message || "Unknown error"));
//     } finally {
//       setIsUpgrading(false);
//     }
//   };

//   return (
//     <Motion.div
//       key="settings"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className="max-w-2xl mx-auto"
//     >
//       <div
//         className={`rounded-2xl p-6 ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg space-y-8`}
//       >
//         <div className="flex items-center justify-between">
//           <h2
//             className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
//           >
//             Settings
//           </h2>
//           <Motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={() => setEditProfile(!editProfile)}
//             className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
//           >
//             <Edit3 className="w-4 h-4" />
//             {editProfile ? "Cancel Edit" : "Edit Profile"}
//           </Motion.button>
//         </div>

//         {/* Profile Picture */}
//         <div className="flex flex-col items-center gap-4">
//           <Motion.div
//             whileHover={{ scale: 1.05 }}
//             className="relative cursor-pointer"
//             onClick={handleAvatarClick}
//           >
//             <img
//               src={user?.avatar || "https://via.placeholder.com/128"}
//               alt={user?.username || "Planner"}
//               className="w-32 h-32 rounded-full object-cover ring-4 ring-purple-500"
//             />
//             <input
//               type="file"
//               ref={fileInputRef}
//               accept="image/*"
//               className="hidden"
//               onChange={handleFileChange}
//             />
//             <div className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2">
//               <Edit3 className="w-5 h-5 text-white" />
//             </div>
//           </Motion.div>
//           <p
//             className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
//           >
//             Click to change profile picture
//           </p>
//         </div>

//         {/* Edit Form */}
//         <AnimatePresence>
//           {editProfile && (
//             <Motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               className="space-y-5 overflow-hidden"
//             >
//               <div>
//                 <label
//                   className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
//                 >
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   name="username"
//                   value={editForm.username}
//                   onChange={handleEditChange}
//                   className={`w-full px-4 py-3 rounded-lg ${
//                     isDark
//                       ? "bg-gray-700 text-white border-gray-600"
//                       : "bg-gray-100 text-gray-900 border-gray-300"
//                   } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
//                 />
//               </div>

//               <div>
//                 <label
//                   className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={editForm.email}
//                   onChange={handleEditChange}
//                   className={`w-full px-4 py-3 rounded-lg ${
//                     isDark
//                       ? "bg-gray-700 text-white border-gray-600"
//                       : "bg-gray-100 text-gray-900 border-gray-300"
//                   } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
//                 />
//               </div>

//               {/* Change Password */}
//               <div className="space-y-4 pt-4 border-t border-gray-300 dark:border-gray-700">
//                 <h4
//                   className={`font-medium text-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}
//                 >
//                   Change Password (optional)
//                 </h4>

//                 <div className="relative">
//                   <label
//                     className={`block text-sm mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
//                   >
//                     Current Password
//                   </label>
//                   <input
//                     type={showPassword.current ? "text" : "password"}
//                     name="currentPassword"
//                     value={editForm.currentPassword}
//                     onChange={handleEditChange}
//                     className={`w-full px-4 py-3 rounded-lg ${
//                       isDark
//                         ? "bg-gray-700 text-white border-gray-600"
//                         : "bg-gray-100 text-gray-900 border-gray-300"
//                     } border focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => togglePasswordVisibility("current")}
//                     className="absolute right-3 top-10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
//                   >
//                     {showPassword.current ? (
//                       <EyeOff size={20} />
//                     ) : (
//                       <Eye size={20} />
//                     )}
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="relative">
//                     <label
//                       className={`block text-sm mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
//                     >
//                       New Password
//                     </label>
//                     <input
//                       type={showPassword.new ? "text" : "password"}
//                       name="newPassword"
//                       value={editForm.newPassword}
//                       onChange={handleEditChange}
//                       className={`w-full px-4 py-3 rounded-lg ${
//                         isDark
//                           ? "bg-gray-700 text-white border-gray-600"
//                           : "bg-gray-100 text-gray-900 border-gray-300"
//                       } border focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => togglePasswordVisibility("new")}
//                       className="absolute right-3 top-10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
//                     >
//                       {showPassword.new ? (
//                         <EyeOff size={20} />
//                       ) : (
//                         <Eye size={20} />
//                       )}
//                     </button>
//                   </div>

//                   <div className="relative">
//                     <label
//                       className={`block text-sm mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
//                     >
//                       Confirm New Password
//                     </label>
//                     <input
//                       type={showPassword.confirm ? "text" : "password"}
//                       name="confirmPassword"
//                       value={editForm.confirmPassword}
//                       onChange={handleEditChange}
//                       className={`w-full px-4 py-3 rounded-lg ${
//                         isDark
//                           ? "bg-gray-700 text-white border-gray-600"
//                           : "bg-gray-100 text-gray-900 border-gray-300"
//                       } border focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => togglePasswordVisibility("confirm")}
//                       className="absolute right-3 top-10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
//                     >
//                       {showPassword.confirm ? (
//                         <EyeOff size={20} />
//                       ) : (
//                         <Eye size={20} />
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <Motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleSaveChanges}
//                 disabled={isSaving}
//                 className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium mt-6 flex items-center justify-center gap-2 disabled:opacity-70"
//               >
//                 {isSaving ? (
//                   <>
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   "Save Changes"
//                 )}
//               </Motion.button>
//             </Motion.div>
//           )}
//         </AnimatePresence>

//         {/* Balance & Withdraw */}
//         <div className="space-y-4 mt-8">
//           <h3
//             className={`font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}
//           >
//             Balance & Withdraw
//           </h3>
//           <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-5 text-center">
//             <p className="text-sm opacity-80 mb-1">Available Balance</p>
//             <p className="text-4xl font-bold text-purple-300">
//               ₦{(user?.balance || 0).toLocaleString()}
//             </p>
//           </div>
//           <Motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={() =>
//               alert(
//                 `Withdraw ₦${(user?.balance || 0).toLocaleString()} requested! (mock)`,
//               )
//             }
//             disabled={(user?.balance || 0) <= 0}
//             className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white font-medium transition-all ${
//               (user?.balance || 0) > 0
//                 ? "bg-gradient-to-r from-green-600 to-green-700 hover:brightness-110"
//                 : "bg-gray-600 cursor-not-allowed"
//             }`}
//           >
//             <DollarSign className="w-5 h-5" />
//             Withdraw Balance
//           </Motion.button>
//         </div>

//         {/* Notifications */}
//         <div className="space-y-4 mt-8">
//           <h3
//             className={`font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}
//           >
//             Notifications
//           </h3>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <Bell className="w-5 h-5 text-purple-500" />
//               <span className={isDark ? "text-gray-300" : "text-gray-700"}>
//                 Email Notifications
//               </span>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input type="checkbox" className="sr-only peer" defaultChecked />
//               <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
//             </label>
//           </div>
//         </div>

//         {/* Appearance */}
//         <div className="space-y-4 mt-8">
//           <h3
//             className={`font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}
//           >
//             Appearance
//           </h3>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               {isDark ? (
//                 <Moon className="w-5 h-5 text-purple-500" />
//               ) : (
//                 <Sun className="w-5 h-5 text-purple-500" />
//               )}
//               <span className={isDark ? "text-gray-300" : "text-gray-700"}>
//                 {isDark ? "Dark Mode" : "Light Mode"}
//               </span>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 className="sr-only peer"
//                 checked={isDark}
//                 onChange={() => toggleTheme()}
//               />
//               <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
//             </label>
//           </div>
//         </div>

//         {/* Become Planner (only shown if not already planner) */}
//         {user?.role !== "planner" && (
//           <div className="pt-6 border-t border-gray-300 dark:border-gray-700">
//             <Motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={handleBecomePlanner}
//               disabled={isUpgrading}
//               className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium text-lg disabled:opacity-70"
//             >
//               {isUpgrading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Upgrading...
//                 </>
//               ) : (
//                 <>
//                   <Crown className="w-6 h-6" />
//                   Become an Event Planner
//                 </>
//               )}
//             </Motion.button>
//           </div>
//         )}

//         {/* Logout */}
//         <Motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={() => {
//             localStorage.removeItem("token");
//             navigate("/login");
//           }}
//           className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition-colors mt-8"
//         >
//           <LogOut className="w-5 h-5" />
//           Logout
//         </Motion.button>
//       </div>
//     </Motion.div>
//   );
// }


// src/components/PlannerProfileSettings.jsx
// Changes from original:
//   1. Avatar section now uses AvatarPicker (same as ProfileSettings.jsx)
//      instead of file upload — reuses the exact same component and logic
//   2. The "Balance & Withdraw" section is REMOVED — it now lives in
//      PlannerWithdrawal.jsx (src/components/PlannerWithdrawal.jsx)
//      Import and render PlannerWithdrawal in your planner profile page
//      as its own tab/section instead.

import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  Eye,
  EyeOff,
  Bell,
  Moon,
  Sun,
  LogOut,
  Loader2,
} from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

import AvatarPicker from "./AvatarPicker"; // ✅ same component as ProfileSettings
import { updateUserProfile } from "../api/services/profileApi";

export default function PlannerSettings({ user, setUser }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [editProfile, setEditProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    companyName: user?.companyName || "",
    bio: user?.bio || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveChanges = async () => {
    if (editForm.newPassword && editForm.newPassword !== editForm.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    if (editForm.newPassword && editForm.newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        username: editForm.username,
        email: editForm.email,
        companyName: editForm.companyName,
        bio: editForm.bio,
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
      alert("Update failed: " + (err?.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
    isDark
      ? "bg-gray-700 text-white border-gray-600"
      : "bg-gray-100 text-gray-900 border-gray-300"
  }`;
  const labelClass = `block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`;

  return (
    <Motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className={`rounded-2xl p-6 ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg space-y-8`}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Settings
          </h2>
          <Motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setEditProfile(!editProfile)}
            className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            <Edit3 className="w-4 h-4" />
            {editProfile ? "Cancel Edit" : "Edit Profile"}
          </Motion.button>
        </div>

        {/* ── Avatar section ────────────────────────────────────────────────── */}
        {/*  ✅ Uses AvatarPicker — same as ProfileSettings.jsx                 */}
        {/*  The avatar click opens the picker only when editProfile is true    */}
        <div className="flex flex-col items-center gap-4">
          <Motion.div whileHover={{ scale: 1.05 }} className="relative">
            <img
              src={
                user?.profileImage
                  ? user.profileImage
                  : user?.avatarStyle
                    ? `https://api.dicebear.com/7.x/${user.avatarStyle}/svg?seed=${user._id}`
                    : "https://via.placeholder.com/128?text=Planner"
              }
              alt={user?.username || "Planner"}
              className="w-32 h-32 rounded-full object-cover ring-4 ring-purple-500"
            />
            <div className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
          </Motion.div>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {editProfile ? "Choose an avatar below" : "Click Edit Profile to change avatar"}
          </p>

          {/* AvatarPicker appears only when editing — same pattern as ProfileSettings */}
          {editProfile && (
            <AvatarPicker
              currentStyle={user?.avatarStyle}
              onStyleChange={(avatarUrl, newStyle) => {
                setUser((prev) => ({ ...prev, avatarStyle: newStyle }));
              }}
            />
          )}
        </div>

        {/* ── Edit Form ─────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {editProfile && (
            <Motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-5 overflow-hidden"
            >
              <div>
                <label className={labelClass}>Username</label>
                <input type="text" name="username" value={editForm.username} onChange={handleEditChange} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Company / Brand Name</label>
                <input type="text" name="companyName" value={editForm.companyName} onChange={handleEditChange} className={inputClass} placeholder="Your company or event brand name" />
              </div>

              <div>
                <label className={labelClass}>Bio</label>
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleEditChange}
                  rows={3}
                  maxLength={500}
                  className={`${inputClass} resize-none`}
                  placeholder="Tell attendees about you or your company…"
                />
                <p className={`text-xs mt-1 text-right ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  {editForm.bio.length}/500
                </p>
              </div>

              {/* Change password */}
              <div className={`space-y-4 pt-4 border-t ${isDark ? "border-gray-700" : "border-gray-300"}`}>
                <h4 className={`font-medium text-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Change Password (optional)
                </h4>

                <div className="relative">
                  <label className={labelClass}>Current Password</label>
                  <input
                    type={showPassword.current ? "text" : "password"}
                    name="currentPassword"
                    value={editForm.currentPassword}
                    onChange={handleEditChange}
                    className={`${inputClass} pr-12`}
                  />
                  <button type="button" onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200">
                    {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { field: "new", name: "newPassword", label: "New Password" },
                    { field: "confirm", name: "confirmPassword", label: "Confirm New Password" },
                  ].map(({ field, name, label }) => (
                    <div key={field} className="relative">
                      <label className={labelClass}>{label}</label>
                      <input
                        type={showPassword[field] ? "text" : "password"}
                        name={name}
                        value={editForm[name]}
                        onChange={handleEditChange}
                        className={`${inputClass} pr-12`}
                      />
                      <button type="button" onClick={() => togglePasswordVisibility(field)}
                        className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200">
                        {showPassword[field] ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  ))}
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
                  <><Loader2 className="w-5 h-5 animate-spin" /> Saving…</>
                ) : (
                  "Save Changes"
                )}
              </Motion.button>
            </Motion.div>
          )}
        </AnimatePresence>

        {/* ── Notifications ─────────────────────────────────────────────────── */}
        <div className="space-y-4 mt-8">
          <h3 className={`font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Notifications
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-purple-500" />
              <span className={isDark ? "text-gray-300" : "text-gray-700"}>Email Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500" />
            </label>
          </div>
        </div>

        {/* ── Appearance ────────────────────────────────────────────────────── */}
        <div className="space-y-4 mt-8">
          <h3 className={`font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Appearance
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-5 h-5 text-purple-500" /> : <Sun className="w-5 h-5 text-purple-500" />}
              <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                {isDark ? "Dark Mode" : "Light Mode"}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isDark} onChange={toggleTheme} />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500" />
            </label>
          </div>
        </div>

        {/* ── Logout ────────────────────────────────────────────────────────── */}
        <Motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition-colors mt-8"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Motion.button>
      </div>
    </Motion.div>
  );
}