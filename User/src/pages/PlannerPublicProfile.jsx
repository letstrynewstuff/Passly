
// src/pages/PlannerPublicProfile.jsx
import React, { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  MessageCircle,
  Verified,
} from "lucide-react";
import Loader from "../components/Loader";
import { getEvents } from "../api/services/eventApi"; 

const PlannerPublicProfile = ({ plannerId, onEventClick = () => {} }) => {
  const [planner, setPlanner] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    const fetchPlannerData = async () => {
      setIsLoading(true);
      try {
        // In real app → fetch planner profile by ID
        // For now we mock it (replace with real API call)
        setPlanner({
          name: "Vibes Entertainment",
          avatar: "https://images.unsplash.com/photo-1556155099-490a1ba16284?w=400",
          bio: "Creating unforgettable nights across Lagos and beyond. Amapiano, Afrobeats, Raves & more.",
          isVerified: true,
        });

        // Fetch all events and filter by planner (in real app use /api/events?createdBy=plannerId)
        const data = await getEvents();
        const plannerEvents = data.events.filter(
          (e) => e.createdBy === plannerId || e.createdBy?._id === plannerId
        );
        setEvents(plannerEvents);
      } catch (err) {
        console.error("Failed to load planner data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (plannerId) fetchPlannerData();
  }, [plannerId]);

  const upcomingEvents = events.filter((e) => new Date(e.date) > new Date());
  const pastEvents = events.filter((e) => new Date(e.date) <= new Date());

  const displayedEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  if (isLoading) return <Loader type="page" />;

  if (!planner) return <div className="text-white text-center py-20">Planner not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white pb-20">
      {/* Header */}
      <div className="relative pt-16 pb-10 px-6 bg-gradient-to-b from-purple-950/40 to-transparent">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="relative mb-4">
            <img
              src={planner.avatar}
              alt={planner.name}
              className="w-32 h-32 rounded-full object-cover ring-4 ring-purple-500/30 shadow-2xl"
            />
            {planner.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-1.5 shadow-lg">
                <Verified className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2 justify-center">
            {planner.name}
            {planner.isVerified && <Verified className="w-6 h-6 text-blue-400" />}
          </h1>

          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {planner.bio}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-20 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 flex">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 py-4 font-medium text-center transition-all ${
              activeTab === "upcoming"
                ? "text-purple-400 border-b-2 border-purple-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Upcoming Events ({upcomingEvents.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex-1 py-4 font-medium text-center transition-all ${
              activeTab === "past"
                ? "text-purple-400 border-b-2 border-purple-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Past Events ({pastEvents.length})
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {displayedEvents.map((event) => (
            <Motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
              onClick={() => onEventClick?.(event)}
            >
              <div className="relative aspect-video">
                <img
                  src={event.media?.[0] || event.posterUrl}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-bold text-xl line-clamp-2 group-hover:text-purple-400 transition-colors">
                  {event.title}
                </h3>

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar size={16} />
                  <span>{new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                  {event.time && <span>• {event.time}</span>}
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin size={16} />
                  <span className="line-clamp-1">{event.location}</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-2">
                    {event.tags?.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-1 bg-purple-950/50 text-purple-300 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <MessageCircle size={16} />
                    <span>{event.comments?.length || 0}</span>
                  </div>
                </div>
              </div>
            </Motion.div>
          ))}
        </AnimatePresence>

        {displayedEvents.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-400">
            No {activeTab} events found.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlannerPublicProfile;