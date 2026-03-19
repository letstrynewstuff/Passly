

// src/pages/MyTickets.jsx
import React, { useState, useEffect } from "react";
import { useTheme } from "../components/ThemeProvider";
import Loader from "../components/Loader";
import TicketCard from "../components/TicketCard";
import { getMyTickets } from "../api/services/ticketApi";

const MyTickets = () => {
  console.log("🔴 MYTICKETS RENDERED");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);

        // 🔍 Fetch tickets
        const data = await getMyTickets();

        // 🔍 Debug logs
        console.log("DATA:", data);

        // 🔍 Set tickets
        setTickets(data.tickets || []);
      } catch (err) {
        console.log("ERROR:", err);
        setError(err.message || "Something went wrong");
      } finally {
        console.log("FINALLY REACHED");
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (isLoading) return <Loader type="page" />;

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"} p-6`}
    >
      <h2
        className={`text-2xl font-bold mb-6 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        My Tickets
      </h2>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg mb-6">
          {error}
        </div>
      )}

      {tickets.length === 0 ? (
        <p
          className={`text-center ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          No tickets purchased yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
