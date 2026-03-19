// src/utils/avatarUtils.js
export const getAvatarUrl = (user) => {
  if (user && user.avatarStyle) {
    return `https://api.dicebear.com/7.x/${user.avatarStyle}/svg?seed=${user._id || "default"}`;
  }

  // Fallback to initials placeholder
  const initial = user && user.username ? user.username[0].toUpperCase() : "U";
  return `https://via.placeholder.com/128/8B5CF6/FFFFFF?text=${initial}`;
};
