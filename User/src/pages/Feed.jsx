

// src/pages/Feed.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ChevronUp,
  MapPin,
  SlidersHorizontal,
  User,
} from "lucide-react";
import API from "../api/axios";

import EventCard from "../components/EventCard";
import {
  getEvents,
  getEventComments,
  createComment,
} from "../api/services/eventApi";
import Loader from "../components/Loader";

// ─── Passly wordmark (top of feed) ───────────────────────────────────────────
const PassllyMark = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
    <span
      style={{
        fontSize: "1.35rem",
        fontWeight: 900,
        letterSpacing: "-0.04em",
        lineHeight: 1,
        background: "linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      pass
    </span>
    <span
      style={{
        fontSize: "1.35rem",
        fontWeight: 900,
        letterSpacing: "-0.04em",
        lineHeight: 1,
        color: "#ffffff",
      }}
    >
      lly
    </span>
    <span
      style={{
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #a78bfa, #ec4899)",
        display: "inline-block",
        marginLeft: 2,
        marginBottom: 14,
        flexShrink: 0,
      }}
    />
  </div>
);

const Feed = () => {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]); // unfiltered source
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Search + filter
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [filtersActive, setFiltersActive] = useState(false);

  // Comments
  const [activeCommentEventId, setActiveCommentEventId] = useState(null);
  const [commentsByEvent, setCommentsByEvent] = useState({});
  const [newCommentByEvent, setNewCommentByEvent] = useState({});

  // Scrolling (native scroll-snap)
  const scrollRef = useRef(null);
  const itemRefs = useRef([]);

  // ── Fetch events ────────────────────────────────────────────────────────────
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
        setAllEvents(normalized);
        setEvents(normalized);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // ── Fetch states ────────────────────────────────────────────────────────────
  useEffect(() => {
    API.get("/locations/states")
      .then((res) => setStates(res.data.states || []))
      .catch(() => {});
  }, []);

  // ── Fetch cities when state changes ─────────────────────────────────────────
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      setSelectedCity("");
      return;
    }

    API.get(`/locations/cities?state=${encodeURIComponent(selectedState)}`)
      .then((res) => {
        setCities(res.data.cities || []);
        setSelectedCity("");
      })
      .catch(() => {});
  }, [selectedState]);

  // ── Apply filters ────────────────────────────────────────────────────────────
  useEffect(() => {
    let filtered = allEvents;
    const q = searchQuery.trim().toLowerCase();

    if (q) {
      filtered = filtered.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q),
      );
    }
    if (selectedState) {
      filtered = filtered.filter((e) =>
        e.location?.toLowerCase().includes(selectedState.toLowerCase()),
      );
    }
    if (selectedCity) {
      filtered = filtered.filter((e) =>
        e.location?.toLowerCase().includes(selectedCity.toLowerCase()),
      );
    }

    setEvents(filtered);
    setActiveIndex(0);
    scrollRef.current?.scrollTo({ top: 0 });
    setFiltersActive(!!(q || selectedState || selectedCity));
  }, [searchQuery, selectedState, selectedCity, allEvents]);

  // ── Comments ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeCommentEventId) return;
    const fetch_ = async () => {
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
    fetch_();
  }, [activeCommentEventId]);

  // ── Track which card is on screen (drives video autoplay + dots) ────────────
  useEffect(() => {
    const root = scrollRef.current;
    if (!root || events.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(Number(entry.target.dataset.index));
          }
        });
      },
      { root, threshold: 0.6 },
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [events]);

  // ── Programmatic navigation (dots, back-to-top, keyboard) ───────────────────
  const goTo = useCallback(
    (index) => {
      if (index < 0 || index >= events.length) return;
      itemRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [events.length],
  );

  useEffect(() => {
    const handleKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        goTo(activeIndex + 1);
      }
      if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        goTo(activeIndex - 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, goTo]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedState("");
    setSelectedCity("");
    setShowSearch(false);
  };

  const handleOpenComments = (eventId) => setActiveCommentEventId(eventId);
  const handleCloseComments = () => setActiveCommentEventId(null);
  const handleNewCommentChange = (eventId, value) =>
    setNewCommentByEvent((prev) => ({ ...prev, [eventId]: value }));
  // const handlePostComment = async (eventId) => {
  //   const content = newCommentByEvent[eventId]?.trim();
  //   if (!content) return;
  //   try {
  //     const data = await createComment(eventId, content);
  //     setCommentsByEvent((prev) => ({
  //       ...prev,
  //       [eventId]: [data.comment, ...(prev[eventId] || [])],
  //     }));
  //     setNewCommentByEvent((prev) => ({ ...prev, [eventId]: "" }));
  //   } catch (err) {
  //     console.error("Post failed:", err);
  //   }
  // };
    const handlePostComment = async (eventId) => {
      const content = newCommentByEvent[eventId]?.trim();
      if (!content) return;

      // Posting needs an account
      if (!localStorage.getItem("token")) {
        window.location.href = "/login";
        return;
      }

      try {
        const data = await createComment(eventId, content);
        if (!data?.comment) throw new Error("Unexpected response from server");
        setCommentsByEvent((prev) => ({
          ...prev,
          [eventId]: [data.comment, ...(prev[eventId] || [])],
        }));
        setNewCommentByEvent((prev) => ({ ...prev, [eventId]: "" }));
      } catch (err) {
        console.error("Post failed:", err);
        alert(
          err?.response?.data?.message ||
            err?.message ||
            "Could not post your comment. Please try again.",
        );
      }
    };

  if (isLoading) return <Loader type="page" />;

  return (
    <div
      id="feed-root"
      className="w-full overflow-hidden bg-black relative"
      style={{ height: "100dvh" }}
    >
      {/* ── Top bar — filter left · logo center · profile right ────────── */}
      <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="grid grid-cols-3 items-center px-5 pt-12 pb-3 pointer-events-auto">
          {/* LEFT — filter / search */}
          <div className="flex justify-start">
            <Motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowSearch((v) => !v)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full"
              style={{
                background: filtersActive
                  ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                  : "rgba(255,255,255,0.12)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#ffffff",
              }}
            >
              {filtersActive ? (
                <SlidersHorizontal size={16} />
              ) : (
                <Search size={16} />
              )}
              <span className="text-xs font-semibold">
                {filtersActive ? "Filtered" : "Search"}
              </span>
              {filtersActive && (
                <span className="w-2 h-2 rounded-full bg-white/80 flex-shrink-0" />
              )}
            </Motion.button>
          </div>

          {/* CENTER — Passlly wordmark */}
          <div className="flex justify-center">
            <PassllyMark />
          </div>

          {/* RIGHT — profile icon */}
          <div className="flex justify-end">
            <Motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                const token = localStorage.getItem("token");
                if (!token) {
                  window.location.href = "/login";
                  return;
                }
                const role = localStorage.getItem("role");
                window.location.href =
                  role === "planner" ? "/planner/profile" : "/profile";
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <User size={18} className="text-white" />
            </Motion.button>
          </div>
        </div>

        {/* ── Search / filter panel ─────────────────────────────────────── */}
        <AnimatePresence>
          {showSearch && (
            <Motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="mx-4 mb-2 pointer-events-auto rounded-2xl overflow-hidden"
              style={{
                background: "rgba(10,8,20,0.92)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
              }}
            >
              <div className="p-4 space-y-3">
                {/* Search input */}
                <div className="relative">
                  <Search
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                  />
                  <input
                    type="text"
                    placeholder="Search events, locations…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-9 pr-10 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* State + City dropdowns */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <MapPin
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                    />
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full pl-8 pr-3 py-3 rounded-xl text-sm text-white outline-none appearance-none"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: selectedState
                          ? "#fff"
                          : "rgba(255,255,255,0.35)",
                      }}
                    >
                      <option value="" style={{ background: "#0a0814" }}>
                        All States
                      </option>
                      {states.map((s) => (
                        <option
                          key={s}
                          value={s}
                          style={{ background: "#0a0814" }}
                        >
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      disabled={!selectedState}
                      className="w-full px-3 py-3 rounded-xl text-sm outline-none appearance-none disabled:opacity-40"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: selectedCity ? "#fff" : "rgba(255,255,255,0.35)",
                      }}
                    >
                      <option value="" style={{ background: "#0a0814" }}>
                        All Cities
                      </option>
                      {cities.map((c) => (
                        <option
                          key={c}
                          value={c}
                          style={{ background: "#0a0814" }}
                        >
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filter actions */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-white/30">
                    {events.length} event{events.length !== 1 ? "s" : ""} found
                  </span>
                  <div className="flex gap-2">
                    {filtersActive && (
                      <button
                        onClick={clearFilters}
                        className="px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white/80 transition-colors"
                        style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                      >
                        Clear all
                      </button>
                    )}
                    <button
                      onClick={() => setShowSearch(false)}
                      className="px-4 py-1.5 rounded-lg text-xs text-white font-semibold"
                      style={{
                        background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Scroll-snap feed (native scrolling = smooth + momentum) ────────── */}
      <div
        ref={scrollRef}
        className="w-full snap-y snap-mandatory overflow-y-scroll overscroll-y-contain [&::-webkit-scrollbar]:hidden"
        style={{
          height: "100dvh",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {events.length === 0 && !isLoading ? (
          <div
            className="w-full flex flex-col items-center justify-center gap-4"
            style={{ height: "100dvh" }}
          >
            <Search size={40} className="text-white/20" />
            <p className="text-white/40 text-sm">No events match your search</p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-full text-white text-sm font-semibold"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          events.map((event, idx) => (
            <div
              key={event._id}
              ref={(el) => (itemRefs.current[idx] = el)}
              data-index={idx}
              className="w-full snap-start snap-always"
              style={{ height: "100dvh" }}
            >
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
          ))
        )}
      </div>

      {/* ── Progress dots ────────────────────────────────────────────────── */}
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

      {/* ── Scroll back to top button — shows when not on first card ────── */}
      <AnimatePresence>
        {activeIndex > 0 && (
          <Motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => goTo(0)}
            className="absolute left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1"
            style={{ top: 90 }}
          >
            <div
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <ChevronUp size={14} className="text-white/70" />
              <span className="text-white/70 text-xs font-medium">
                Back to top
              </span>
            </div>
          </Motion.button>
        )}
      </AnimatePresence>

      {/* ── Swipe hint ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!isLoading && activeIndex === 0 && events.length > 1 && (
          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-40 pointer-events-none"
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
