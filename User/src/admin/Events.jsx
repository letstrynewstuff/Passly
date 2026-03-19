import React, { useEffect, useState } from "react";
import axios from "axios";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("/api/admin/events", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleAction = async (id, action) => {
    const token = localStorage.getItem("token");
    await axios.patch(
      `/api/admin/events/${id}/${action}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
    // Refresh events
    window.location.reload();
  };

  return (
    <div>
      <h1>Events Management</h1>
      <table>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Planner</th>
            <th>Tickets Sold</th>
            <th>Revenue</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id}>
              <td>{event.name}</td>
              <td>{event.planner.username}</td>
              <td>{event.ticketsSold}</td>
              <td>{event.revenue}</td>
              <td>{event.status}</td>
              <td>
                {event.status === "pending" && (
                  <>
                    <button onClick={() => handleAction(event._id, "approve")}>
                      Approve
                    </button>
                    <button onClick={() => handleAction(event._id, "reject")}>
                      Reject
                    </button>
                  </>
                )}
                <button onClick={() => handleAction(event._id, "delete")}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Events;
