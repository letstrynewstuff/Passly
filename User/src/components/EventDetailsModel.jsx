// src/components/EventDetailsModal.jsx
import React, { useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  X,
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";

const EventDetailsModel = ({
  event,
  isOpen,
  onClose,
  isAuthenticated = false,
  onLoginRedirect,
}) => {

  const navigate = useNavigate();
  const [showFullDesc, setShowFullDesc] = React.useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  const {
    title = "Event Title",
    posterUrl = "",
    videoUrl = "",
    date = "Sat, 15 Mar 2025",
    time = "8:00 PM - 2:00 AM",
    location = "Eko Hotel, Victoria Island, Lagos",
    price = "₦5,000 – ₦25,000",
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    organizer = {
      id: "demo",
      name: "Vibes Entertainment",
      avatar: "https://images.unsplash.com/photo-1556155099-490a1ba16284?w=80",
    },
  } = event;

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      onLoginRedirect?.();
    } else {
      // Temporary toast simulation
      alert("Ticket purchase coming soon! 🎫");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Modal / Bottom Sheet */}
          <Motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className={`
              fixed inset-x-0 bottom-0 z-50 
              max-h-[92vh] overflow-y-auto 
              bg-gray-950 text-white rounded-t-3xl shadow-2xl
              md:inset-0 md:max-w-2xl md:mx-auto md:my-auto md:rounded-2xl md:max-h-[90vh]
            `}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            {/* Media (poster or video) */}
            <div className="relative w-full aspect-video bg-black">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  poster={posterUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={posterUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Content */}
            <div className="p-6 pt-5 space-y-6">
              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                {title}
              </h2>

              {/* Date, Time, Location */}
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-purple-400" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-purple-400" />
                  <span>{time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-purple-400" />
                  <span>{location}</span>
                </div>
              </div>

              {/* Price */}
              <div className="inline-block px-5 py-2.5 bg-purple-900/40 rounded-full text-purple-300 font-medium">
                {price}
              </div>

              {/* Description */}
              <div className="text-gray-300 leading-relaxed">
                <p className={showFullDesc ? "" : "line-clamp-4"}>
                  {description}
                </p>
                {description.length > 200 && (
                  <button
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className="mt-2 text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                  >
                    {showFullDesc ? "Show less" : "Read more"}
                    {showFullDesc ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>
                )}
              </div>

              {/* Organizer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-3">
                  <img
                    src={organizer.avatar}
                    alt={organizer.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/30"
                  />
                  <div>
                    <p className="font-medium">Organized by</p>
                    <p className="text-purple-300">{organizer.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/planner/${organizer.id || "demo"}`)}
                  className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition"
                >
                  View Organizer
                </button>
              </div>
            </div>

            {/* Sticky Buy Ticket Bar */}
            <div className="sticky bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-gray-950 to-transparent pt-12">
              <button
                onClick={handleBuyClick}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-purple-900/30 transition-all active:scale-98"
              >
                {isAuthenticated ? "Buy Ticket" : "Log in to Buy Ticket"}
              </button>
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EventDetailsModel;
