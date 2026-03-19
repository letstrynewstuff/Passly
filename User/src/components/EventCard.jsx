// src/components/EventCard.jsx
import React, { useRef, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Ticket,
  X,
  MapPin,
  Calendar,
  User,
  ArrowLeft,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EventCard = ({
  event = {},
  isActive = false,
  onCardClick = () => {},
  showComments = false,
  onOpenComments = () => {},
  onCloseComments = () => {},
  comments = [],
  newComment = "",
  onNewCommentChange = () => {},
  onPostComment = () => {},
}) => {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // Video auto-play / pause
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  const handleProfileClick = (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login", { replace: true });
    const role = localStorage.getItem("role");
    navigate(role === "planner" ? "/planner/profile" : "/profile", {
      replace: true,
    });
  };

  // const handleBack = (e) => {
  //   e.stopPropagation();
  //   if (window.history.length <= 1) navigate("/feed", { replace: true });
  //   else navigate(-1);
  // };

  const handlePost = (e) => {
    if (e.key === "Enter" && newComment.trim()) onPostComment();
  };

  const formattedDate = event?.date
    ? new Date(event.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Date TBA";

  const lowestPrice = event?.ticketCategories?.length
    ? Math.min(...event.ticketCategories.map((c) => c.price || 0))
    : null;

  return (
    <Motion.div
      className="relative w-full h-screen flex-shrink-0 bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      onClick={onCardClick}
    >
      {/* ── Media Background ─────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        {event?.videoUrl ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src={event.videoUrl}
            poster={event?.media?.[0]}
            loop
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <Motion.img
            src={event?.media?.[0] || "https://via.placeholder.com/800x1200"}
            alt={event?.title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.05 }}
            animate={{ scale: isActive ? 1 : 1.05 }}
            transition={{ duration: 6, ease: "easeOut" }}
          />
        )}
      </div>

      {/* ── Gradient layers ──────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent via-40% to-black/95 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <Motion.div
        className="absolute top-0 left-75 right-0 flex items-center justify-between px-5 pt-9.5 pb-4 z-30 pointer-events-auto"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* <Motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBack}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Motion.button> */}

        <Motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleProfileClick}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg"
        >
          <User className="w-5 h-5  text-white" />
        </Motion.button>
      </Motion.div>

      {/* ── Bottom content ───────────────────────────────────────────────── */}
      <Motion.div
        className="absolute bottom-0 left-0 right-0 px-5 pb-8 z-20 pointer-events-none"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      >
        {/* Price badge */}
        {lowestPrice !== null && (
          <Motion.div
            className="inline-flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-full pointer-events-auto"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Ticket className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-xs font-bold tracking-wide">
              From ₦{lowestPrice.toLocaleString()}
            </span>
          </Motion.div>
        )}

        {/* Event title */}
        <h2
          className="text-white font-black text-3xl md:text-4xl leading-tight mb-4 pointer-events-auto"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
        >
          {event?.title || "Event Title"}
        </h2>

        {/* Meta info */}
        <div className="flex flex-col gap-2 mb-5 pointer-events-auto">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "rgba(124,58,237,0.3)" }}
            >
              <MapPin className="w-3.5 h-3.5 text-purple-300" />
            </div>
            <span className="text-white/85 text-sm font-medium">
              {event?.location || "Location TBA"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "rgba(124,58,237,0.3)" }}
            >
              <Calendar className="w-3.5 h-3.5 text-purple-300" />
            </div>
            <span className="text-white/85 text-sm font-medium">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Buy Ticket CTA */}
        <Motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={(e) => {
            e.stopPropagation();
            navigate("/checkout", { state: { event } });
          }}
          className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2.5 pointer-events-auto relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #ec4899)",
            boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
          }}
        >
          <Ticket className="w-5 h-5" />
          Get Tickets
          <Motion.div
            className="absolute inset-0 bg-white/10"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.5 }}
          />
        </Motion.button>
      </Motion.div>

      {/* ── Right side icons ─────────────────────────────────────────────── */}
      <div className="absolute right-5 bottom-56 flex flex-col gap-5 items-center z-30 pointer-events-auto">
        {/* Comments */}
        <Motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.88 }}
          onClick={(e) => {
            e.stopPropagation();
            onOpenComments();
          }}
          className="flex flex-col items-center gap-1.5"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-semibold drop-shadow">
            {comments.length}
          </span>
        </Motion.button>
      </div>

      {/* ── Comments sheet ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showComments && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-50"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onCloseComments();
            }}
          >
            <Motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="absolute bottom-0 left-0 right-0 rounded-t-3xl overflow-hidden"
              style={{
                background: "rgba(15,10,30,0.97)",
                backdropFilter: "blur(20px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div>
                  <h3 className="text-white font-bold text-lg">Comments</h3>
                  <p className="text-white/40 text-xs mt-0.5">
                    {comments.length} comments
                  </p>
                </div>
                <Motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseComments();
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10"
                >
                  <X className="w-5 h-5 text-white/70" />
                </Motion.button>
              </div>

              {/* Comments list */}
              <div
                className="overflow-y-auto px-5 py-4 space-y-5"
                style={{ maxHeight: "45vh" }}
              >
                {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <MessageCircle className="w-10 h-10 text-white/20" />
                    <p className="text-white/40 text-sm">
                      Be the first to comment
                    </p>
                  </div>
                ) : (
                  comments.map((comment, idx) => (
                    <Motion.div
                      key={comment?._id || idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex gap-3"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #7c3aed, #ec4899)",
                        }}
                      >
                        {(comment?.user?.username?.[0] || "U").toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white/60 text-xs font-semibold mb-0.5">
                          {comment?.user?.username || "User"}
                        </p>
                        <p className="text-white/90 text-sm leading-relaxed">
                          {comment?.content || ""}
                        </p>
                      </div>
                    </Motion.div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="px-5 py-4 border-t border-white/10 flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Write a comment…"
                  value={newComment}
                  onChange={(e) => onNewCommentChange(e.target.value)}
                  onKeyDown={handlePost}
                  className="flex-1 bg-white/8 text-white placeholder-white/30 rounded-2xl px-4 py-3 text-sm outline-none border border-white/10 focus:border-purple-500/50 transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
                <Motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPostComment();
                  }}
                  disabled={!newComment.trim()}
                  className="w-11 h-11 flex items-center justify-center rounded-full disabled:opacity-30 transition-opacity flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                  }}
                >
                  <Send className="w-4 h-4 text-white" />
                </Motion.button>
              </div>

              {/* Safe area spacer */}
              <div className="h-6" />
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </Motion.div>
  );
};

export default EventCard;
