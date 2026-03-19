// // src/pages/Feed.jsx
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion as Motion } from "framer-motion";

// import EventCard from "../components/EventCard";
// import { getEvents, getEventComments, createComment } from "../api/services/eventApi";
// import Loader from "../components/Loader";

// const Feed = () => {
//   const navigate = useNavigate();

//   const [events, setEvents] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);

//   // Lifted comment control
//   const [activeCommentEventId, setActiveCommentEventId] = useState(null);
//   const [commentsByEvent, setCommentsByEvent] = useState({});     // eventId → comments array
//   const [newCommentByEvent, setNewCommentByEvent] = useState({}); // eventId → input text

//   // Scroll refs
//   const isScrolling = useRef(false);
//   const scrollAccumulator = useRef(0);
//   const SCROLL_THRESHOLD = 120;

//   // Fetch all events
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const data = await getEvents();
//         const normalized = (data.events || []).map((e) => ({
//           ...e,
//           _id: e._id?.toString(),
//           title: e.title || e.name,
//           location: e.location || "TBA",
//           date: e.date,
//           ticketTypes: Array.isArray(e.ticketTypes)
//             ? e.ticketTypes
//             : Object.keys(e.ticketTypes || {}),
//           prices: Array.isArray(e.prices)
//             ? e.prices
//             : Object.values(e.ticketTypes || {}),
//         }));
//         setEvents(normalized);
//       } catch (err) {
//         console.error("Failed to load events:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   // Fetch comments only when someone opens comments for a specific event
//   useEffect(() => {
//     if (!activeCommentEventId) return;

//     const fetch = async () => {
//       try {
//         const data = await getEventComments(activeCommentEventId);
//         setCommentsByEvent((prev) => ({
//           ...prev,
//           [activeCommentEventId]: data.comments || [],
//         }));
//       } catch (err) {
//         console.error("Failed to load comments:", err);
//       }
//     };
//     fetch();
//   }, [activeCommentEventId]);

//   const handleOpenComments = (eventId) => {
//     setActiveCommentEventId(eventId);
//   };

//   const handleCloseComments = () => {
//     setActiveCommentEventId(null);
//   };

//   const handleNewCommentChange = (eventId, value) => {
//     setNewCommentByEvent((prev) => ({ ...prev, [eventId]: value }));
//   };

//   const handlePostComment = async (eventId) => {
//     const content = newCommentByEvent[eventId]?.trim();
//     if (!content) return;

//     try {
//       const data = await createComment(eventId, content);
//       setCommentsByEvent((prev) => ({
//         ...prev,
//         [eventId]: [data.comment, ...(prev[eventId] || [])],
//       }));
//       setNewCommentByEvent((prev) => ({ ...prev, [eventId]: "" }));
//     } catch (err) {
//       console.error("Post failed:", err);
//     }
//   };

//   const handleWheel = useCallback(
//     (e) => {
//       e.preventDefault();
//       if (isScrolling.current) return;

//       scrollAccumulator.current += e.deltaY;

//       if (scrollAccumulator.current > SCROLL_THRESHOLD) {
//         if (activeIndex < events.length - 1) {
//           isScrolling.current = true;
//           setActiveIndex((prev) => prev + 1);
//         }
//         scrollAccumulator.current = 0;
//       }

//       if (scrollAccumulator.current < -SCROLL_THRESHOLD) {
//         if (activeIndex > 0) {
//           isScrolling.current = true;
//           setActiveIndex((prev) => prev - 1);
//         }
//         scrollAccumulator.current = 0;
//       }

//       setTimeout(() => {
//         isScrolling.current = false;
//       }, 600);
//     },
//     [activeIndex, events.length],
//   );

//   useEffect(() => {
//     const el = document.getElementById("feed-root");
//     if (!el) return;

//     el.addEventListener("wheel", handleWheel, { passive: false });
//     return () => el.removeEventListener("wheel", handleWheel);
//   }, [handleWheel]);

//   if (isLoading) return <Loader type="page" />;

//   return (
//     <div id="feed-root" className="h-screen w-full overflow-hidden bg-black">
//       <Motion.div
//         className="h-full w-full"
//         animate={{ y: `-${activeIndex * 100}vh` }}
//         transition={{ duration: 0.55, ease: "easeInOut" }}
//       >
//         {events.map((event, idx) => (
//           <div key={event._id} className="h-screen w-full">
//             <EventCard
//               event={event}
//               isActive={idx === activeIndex}
//               onCardClick={() => navigate("/checkout", { state: { event } })}
//               // Comment control props – only visible card receives real data
//               showComments={activeCommentEventId === event._id}
//               onOpenComments={() => handleOpenComments(event._id)}
//               onCloseComments={handleCloseComments}
//               comments={commentsByEvent[event._id] || []}
//               newComment={newCommentByEvent[event._id] || ""}
//               onNewCommentChange={(value) => handleNewCommentChange(event._id, value)}
//               onPostComment={() => handlePostComment(event._id)}
//             />
//           </div>
//         ))}
//       </Motion.div>
//     </div>
//   );
// };

// export default Feed;

// src/pages/Feed.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";

import EventCard from "../components/EventCard";
import {
  getEvents,
  getEventComments,
  createComment,
} from "../api/services/eventApi";
import Loader from "../components/Loader";

const Feed = () => {
  const [events, setEvents] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCommentEventId, setActiveCommentEventId] = useState(null);
  const [commentsByEvent, setCommentsByEvent] = useState({});
  const [newCommentByEvent, setNewCommentByEvent] = useState({});

  // Touch support
  const touchStartY = useRef(null);
  const isScrolling = useRef(false);
  const scrollAccumulator = useRef(0);
  const SCROLL_THRESHOLD = 120;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        const normalized = (data.events || []).map((e) => ({
          ...e,
          _id: e._id?.toString(),
          title: e.title || e.name,
          location: e.location || "TBA",
          date: e.date,
          ticketTypes: Array.isArray(e.ticketTypes)
            ? e.ticketTypes
            : Object.keys(e.ticketTypes || {}),
          prices: Array.isArray(e.prices)
            ? e.prices
            : Object.values(e.ticketTypes || {}),
        }));
        setEvents(normalized);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!activeCommentEventId) return;
    const fetch = async () => {
      try {
        const data = await getEventComments(activeCommentEventId);
        setCommentsByEvent((prev) => ({
          ...prev,
          [activeCommentEventId]: data.comments || [],
        }));
      } catch (err) {
        console.error("Failed to load comments:", err);
      }
    };
    fetch();
  }, [activeCommentEventId]);

  const goTo = useCallback(
    (index) => {
      if (isScrolling.current) return;
      if (index < 0 || index >= events.length) return;
      isScrolling.current = true;
      setActiveIndex(index);
      setTimeout(() => {
        isScrolling.current = false;
      }, 700);
    },
    [events.length],
  );

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      if (isScrolling.current) return;

      scrollAccumulator.current += e.deltaY;

      if (scrollAccumulator.current > SCROLL_THRESHOLD) {
        goTo(activeIndex + 1);
        scrollAccumulator.current = 0;
      } else if (scrollAccumulator.current < -SCROLL_THRESHOLD) {
        goTo(activeIndex - 1);
        scrollAccumulator.current = 0;
      }
    },
    [activeIndex, goTo],
  );

  // Touch swipe support
  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchStartY.current === null) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 60) {
        delta > 0 ? goTo(activeIndex + 1) : goTo(activeIndex - 1);
      }
      touchStartY.current = null;
    },
    [activeIndex, goTo],
  );

  useEffect(() => {
    const el = document.getElementById("feed-root");
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleWheel, handleTouchStart, handleTouchEnd]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowDown" || e.key === "j") goTo(activeIndex + 1);
      if (e.key === "ArrowUp" || e.key === "k") goTo(activeIndex - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, goTo]);

  const handleOpenComments = (eventId) => setActiveCommentEventId(eventId);
  const handleCloseComments = () => setActiveCommentEventId(null);
  const handleNewCommentChange = (eventId, value) =>
    setNewCommentByEvent((prev) => ({ ...prev, [eventId]: value }));

  const handlePostComment = async (eventId) => {
    const content = newCommentByEvent[eventId]?.trim();
    if (!content) return;
    try {
      const data = await createComment(eventId, content);
      setCommentsByEvent((prev) => ({
        ...prev,
        [eventId]: [data.comment, ...(prev[eventId] || [])],
      }));
      setNewCommentByEvent((prev) => ({ ...prev, [eventId]: "" }));
    } catch (err) {
      console.error("Post failed:", err);
    }
  };

  if (isLoading) return <Loader type="page" />;

  return (
    <div
      id="feed-root"
      className="h-screen w-full overflow-hidden bg-black relative"
    >
      {/* ── Slide strip ──────────────────────────────────────────────────── */}
      <Motion.div
        className="h-full w-full"
        animate={{ y: `-${activeIndex * 100}vh` }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        {events.map((event, idx) => (
          <div key={event._id} className="h-screen w-full">
            <EventCard
              event={event}
              isActive={idx === activeIndex}
              onCardClick={() => {}}
              showComments={activeCommentEventId === event._id}
              onOpenComments={() => handleOpenComments(event._id)}
              onCloseComments={handleCloseComments}
              comments={commentsByEvent[event._id] || []}
              newComment={newCommentByEvent[event._id] || ""}
              onNewCommentChange={(value) =>
                handleNewCommentChange(event._id, value)
              }
              onPostComment={() => handlePostComment(event._id)}
            />
          </div>
        ))}
      </Motion.div>

      {/* ── Progress dots (right side) ───────────────────────────────────── */}
      {events.length > 1 && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-40 pointer-events-auto">
          {events.map((_, idx) => (
            <Motion.button
              key={idx}
              onClick={() => goTo(idx)}
              animate={{
                height: idx === activeIndex ? 24 : 6,
                opacity: idx === activeIndex ? 1 : 0.35,
              }}
              transition={{ duration: 0.3 }}
              className="w-1.5 rounded-full"
              style={{
                background:
                  idx === activeIndex
                    ? "linear-gradient(180deg, #7c3aed, #ec4899)"
                    : "#ffffff",
              }}
            />
          ))}
        </div>
      )}

      {/* ── Swipe hint (shows briefly on first load) ─────────────────────── */}
      <AnimatePresence>
        {isLoading === false && activeIndex === 0 && events.length > 1 && (
          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-40 pointer-events-none"
          >
            <Motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: 3, duration: 0.8, delay: 2.5 }}
            >
              <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5v14M5 12l7 7 7-7"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Motion.div>
            <span className="text-white/40 text-xs">Scroll to explore</span>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Feed;
