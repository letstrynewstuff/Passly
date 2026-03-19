import API from "../axios";

// Public profile (viewing others)
// export const getUserProfile = async (userId) => {
//   const response = await API.get(`/profile/${userId}`);
// ;
//   return response.data;
// };
export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const response = await API.get("/profile/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Logged-in user updates THEIR profile
export const updateUserProfile = async (data) => {
  const isFormData = data instanceof FormData;

  const response = await API.put("/profile/me", data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });

  return response.data;
};

// Logged-in user uploads avatar file
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await API.put("/profile/me/avatar", formData);
  return response.data;
};

// Admin / planner only
export const switchUserRole = async (userId, data) => {
  const response = await API.post(`/profile/${userId}/role-switch`, data);
  return response.data;
};

// Logged-in user changes avatar style
export const updateAvatarStyle = async (avatarStyle) => {
  const { data } = await API.put("/profile/me/avatar", { avatarStyle });

  return data;
};
