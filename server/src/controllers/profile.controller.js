

// src/controllers/profile.controller.js
import User from "../models/User.js";
import Event from "../models/Event.js";

// Allowed DiceBear styles (unchanged)
const AVATAR_STYLES = [
  "adventurer", "adventurer-neutral", "avataaars", "big-smile", "bottts", "bottts-neutral",
  "fun-emoji", "icons", "lorelei", "lorelei-neutral", "micah", "miniavs", "notionists",
  "notionists-neutral", "open-peeps", "personas", "pixel-art", "pixel-art-neutral", "thumbs", "identicon"
];

// NEW: GET /profile/me - Private self-profile (full data)
export const getPrivateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT

    const user = await User.findById(userId).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const avatarUrl = `https://api.dicebear.com/7.x/${user.avatarStyle}/svg?seed=${userId}`;

    // Add event summary if planner
    let eventSummary = null;
    if (user.role === "planner") {
      const events = await Event.find({ createdBy: userId }).select("title ticketsSold status");
      eventSummary = {
        totalEvents: events.length,
        upcomingEvents: events.filter((e) => e.status === "published").length,
        pastEvents: events.filter((e) => e.status === "past").length,
        totalTicketsSold: events.reduce((sum, e) => sum + e.ticketsSold, 0),
      };
    }

    res.json({
      success: true,
      profile: {
        ...user.toObject(),
        avatarUrl: `https://api.dicebear.com/7.x/${user.avatarStyle}/svg?seed=${user._id}`,
        avatarStyle: user.avatarStyle, // Ensure this field is included!
      },
      eventSummary,
    });
  } catch (error) {
    console.error("Get private profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// NEW: GET /profile/:userId - Public profile (safe fields only)
export const getPublicProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select(
      "username role avatarStyle bio companyName isVerified createdAt" // Safe public fields only
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const avatarUrl = `https://api.dicebear.com/7.x/${user.avatarStyle}/svg?seed=${userId}`;

    // Public event summary if planner
    let eventSummary = null;
    if (user.role === "planner") {
      const events = await Event.find({ createdBy: userId, status: "published" }).select("title date location");
      eventSummary = {
        totalEvents: events.length,
        events: events.map(e => ({ title: e.title, date: e.date, location: e.location })),
      };
    }

    res.json({
      success: true,
      profile: { ...user.toObject(),avatarUrl: `https://api.dicebear.com/7.x/${user.avatarStyle}/svg?seed=${user._id}`,
    avatarStyle: user.avatarStyle, // Ensure this field is included!
   },
      eventSummary,
    });
  } catch (error) {
    console.error("Get public profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /profile/me - Update own profile (unchanged, but ensure userId = req.user.id)
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT, no param needed
    const { username, email, bio, companyName, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId).select("+password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (companyName && user.role === "planner") user.companyName = companyName;

    // Password change
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ success: false, message: "Current password required" });
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(401).json({ success: false, message: "Invalid current password" });
      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();

    res.json({ success: true, message: "Profile updated", profile: user });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /profile/me/role-switch - Self role switch (updated logic)
export const switchUserRole = async (req, res) => {
  try {
    const userId = req.user.id; // Self only
    const { role } = req.body;

    if (role !== "planner") {
      return res.status(400).json({ success: false, message: "Can only switch to planner" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.role !== "user") {
      return res.status(400).json({ success: false, message: "Can only switch from user to planner" });
    }

    user.role = role;
    await user.save();

    res.json({ success: true, message: "Role switched to planner", profile: user });
  } catch (error) {
    console.error("Role switch error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /profile/me/avatar - Update avatar style (unchanged)
export const updateAvatarStyle = async (req, res) => {
  try {
    const { avatarStyle } = req.body;
    const userId = req.user.id;

    if (!AVATAR_STYLES.includes(avatarStyle)) {
      return res.status(400).json({ success: false, message: "Invalid avatar style" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatarStyle },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const avatarUrl = `https://api.dicebear.com/7.x/${user.avatarStyle}/svg?seed=${userId}`;

    res.json({
      success: true,
      message: "Avatar style updated",
      avatarUrl,
    });
  } catch (error) {
    console.error("Update avatar style error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Existing updateProfileImage if needed (unchanged, but not used since DiceBear)
export const updateProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const profileImage = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage },
      { new: true }
    );

    res.json({ success: true, profile: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};