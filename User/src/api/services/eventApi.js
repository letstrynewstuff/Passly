// src/api/eventApi.js
import API from "../axios";

// Public (no auth needed)
export const getEvents = async () => {
  const response = await API.get("/events");
  return response.data;
};

export const getEventById = async (eventId) => {
  const response = await API.get(`/events/${eventId}`);
  return response.data;
};

export const getEventComments = async (eventId) => {
  const response = await API.get(`/events/${eventId}/comments`);
  return response.data;
};

// Planner (requires login)
// export const getMyEvents = async () => {
//   try {
//     const token = localStorage.getItem("token"); // Make sure the token is stored on login
//     if (!token) throw new Error("No token found");

//     const response = await API.get("/events/my-events", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch my events:", error.response?.data || error.message);
//     throw error;
//   }
// };
export const getMyEvents = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  try {
    const response = await API.get("/events/my-events", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error(
      "Failed to fetch my events:",
      err.response?.data || err.message,
    );
    throw err;
  }
};

// Protected (requires login)
export const createComment = async (eventId, content) => {
  const token = localStorage.getItem("token");
  const response = await API.post(
    `/events/${eventId}/comments`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

// Planner-only: create new event (requires login)
export const createEvent = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await API.post("/events", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // important for file uploads
      },
    });

    return response.data;
  } catch (err) {
    console.error("Failed to create event:", err.response?.data || err.message);
    throw err;
  }
};
