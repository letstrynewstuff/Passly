


// src/Scanner/ScannerDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyEvents, getEvents } from "../api/services/eventApi";
import { useAuth } from "../context/AuthContext";

export default function ScannerDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // The master scanner login doesn't fill useAuth(), so fall back to the
  // role saved by the scanner login screen.
  const role = user?.role || localStorage.getItem("scannerRole");
  const isAdmin = role === "admin";

  useEffect(() => {
    if (!role) {
      setLoading(false);
      setError("No scanner role found. Please sign in again.");
      return;
    }

    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedData;

        if (role === "admin") {
          // Admin (and master login): all events
          fetchedData = await getEvents();
        } else if (role === "planner") {
          // Planner: only their own events
          fetchedData = await getMyEvents();
        }

        // Normalize to an array
        const eventList = Array.isArray(fetchedData)
          ? fetchedData
          : Array.isArray(fetchedData?.events)
            ? fetchedData.events
            : Array.isArray(fetchedData?.data)
              ? fetchedData.data
              : Array.isArray(fetchedData?.myEvents)
                ? fetchedData.myEvents
                : [];

        setEvents(eventList);
      } catch (err) {
        console.error("Events fetch failed:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Could not load events. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [role]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Ticket Scanner {isAdmin ? "Control Panel" : "Access"}
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            {isAdmin
              ? "Scan tickets for any event"
              : "Scan tickets for your upcoming events"}
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-600 text-lg">
              {isAdmin
                ? "No upcoming events found"
                : "You have no upcoming events yet"}
            </p>
          </div>
        )}

        {!loading && events.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <div
                key={event._id || event.id || index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {event.title || "Untitled Event"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {event.date
                      ? new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "No date set"}
                  </p>
                  <Link
                    to={`/event/${event._id}/scanner`}
                    className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg text-center transition"
                  >
                    Open Scanner
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}