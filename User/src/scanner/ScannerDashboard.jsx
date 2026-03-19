// // src/Scanner/ScannerDashboard.jsx
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext"; // your auth hook/context

// export default function ScannerDashboard() {
//   const { user } = useAuth();
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         setLoading(true);
//         let url = "/api/events/upcoming"; // public or your endpoint

//         if (user.role === "planner") {
//           url = "/api/planner/events"; // or filter by createdBy in backend
//         }

//         const res = await axios.get(url, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });

//         setEvents(res.data.events || res.data || []);
//       } catch (err) {
//         setError("Failed to load events");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, [user.role]);

//   const isAdmin = user.role === "admin";

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-5xl mx-auto">
//         <div className="text-center mb-10">
//           <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
//             Ticket Scanner {isAdmin ? "Control Panel" : "Access"}
//           </h1>
//           <p className="mt-3 text-lg text-gray-600">
//             {isAdmin
//               ? "Scan tickets for any event"
//               : "Scan tickets for your upcoming events"}
//           </p>
//         </div>

//         {loading && (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading events...</p>
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
//             {error}
//           </div>
//         )}

//         {!loading && !error && events.length === 0 && (
//           <div className="text-center py-12 bg-white rounded-xl shadow-sm">
//             <p className="text-gray-600 text-lg">
//               {isAdmin
//                 ? "No upcoming events found"
//                 : "You have no upcoming events yet"}
//             </p>
//           </div>
//         )}

//         {!loading && events.length > 0 && (
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {events.map((event) => (
//               <div
//                 key={event._id}
//                 className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//               >
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
//                     {event.title}
//                   </h3>
//                   <p className="text-gray-600 mb-4">
//                     {new Date(event.date).toLocaleDateString("en-US", {
//                       weekday: "short",
//                       month: "short",
//                       day: "numeric",
//                       year: "numeric",
//                     })}
//                   </p>
//                   <Link
//                     to={`/event/${event._id}/scanner`}
//                     className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg text-center transition"
//                   >
//                     Open Scanner
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// src/Scanner/ScannerDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyEvents, getEvents } from "../api/services/eventApi";   // ← import this
import { useAuth } from "../context/AuthContext";

export default function ScannerDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.role) return;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedData;

        if (user.role === "admin") {
          // For admin: you probably need a different endpoint
          // If you don't have one yet, use getEvents() for now (public)
          // or create /api/admin/events/upcoming in backend
          fetchedData = await getEvents(); // ← temporary fallback
        } else if (user.role === "planner") {
          fetchedData = await getMyEvents();   // ← use your existing function
        }

        console.log("Fetched events data:", fetchedData); // ← debug

        // Normalize to array - most common patterns
        const eventList =
          Array.isArray(fetchedData) ? fetchedData :
          Array.isArray(fetchedData?.events) ? fetchedData.events :
          Array.isArray(fetchedData?.data)   ? fetchedData.data :
          Array.isArray(fetchedData?.myEvents) ? fetchedData.myEvents :
          [];

        setEvents(eventList);
      } catch (err) {
        console.error("Events fetch failed:", err);
        setError(
          err.response?.data?.message ||
          err.message ||
          "Could not load events. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user?.role]);

  const isAdmin = user?.role === "admin";

  // Rest of your component remains almost the same
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
              {isAdmin ? "No upcoming events found" : "You have no upcoming events yet"}
            </p>
          </div>
        )}

        {!loading && events.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event._id || event.id || Math.random()} // fallback key
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