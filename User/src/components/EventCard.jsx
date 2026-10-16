


// // src/components/EventCard.jsx
// import React, { useRef, useEffect } from "react";
// import { motion as Motion, AnimatePresence } from "framer-motion";
// import { MessageCircle, Ticket, X, MapPin, Calendar, Send } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const EventCard = ({
//   event = {},
//   isActive = false,
//   onCardClick = () => {},
//   showComments = false,
//   onOpenComments = () => {},
//   onCloseComments = () => {},
//   comments = [],
//   newComment = "",
//   onNewCommentChange = () => {},
//   onPostComment = () => {},
// }) => {
//   const videoRef = useRef(null);
//   const navigate = useNavigate();

//   // Video auto-play / pause
//   useEffect(() => {
//     if (videoRef.current) {
//       if (isActive) {
//         videoRef.current.play().catch(() => {});
//       } else {
//         videoRef.current.pause();
//       }
//     }
//   }, [isActive]);

//   const handlePost = (e) => {
//     if (e.key === "Enter" && newComment.trim()) onPostComment();
//   };

//   const formattedDate = event?.date
//     ? new Date(event.date).toLocaleDateString("en-US", {
//         month: "long",
//         day: "numeric",
//         year: "numeric",
//       })
//     : "Date TBA";

//   const lowestPrice = event?.ticketCategories?.length
//     ? Math.min(...event.ticketCategories.map((c) => c.price || 0))
//     : null;

//   // const imageSrc = event?.media?.[0] || "https://via.placeholder.com/800x1200";

//     const imageSrc =
//       event?.imageUrl ||
//       event?.media?.[0] ||
//       "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1200'><rect width='100%' height='100%' fill='%231a1030'/></svg>";

//   return (
//     <Motion.div
//       className="relative w-full h-full flex-shrink-0 bg-black overflow-hidden"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.4 }}
//       onClick={onCardClick}
//     >
//       {/* ── Media Background ─────────────────────────────────────────────── */}
//       <div className="absolute inset-0 bg-black overflow-hidden">
//         {/* Blurred copy fills the whole screen behind the poster */}
//         <img
//           src={imageSrc}
//           alt=""
//           aria-hidden="true"
//           loading="lazy"
//           decoding="async"
//           className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-50"
//         />

//         {/* Sharp poster, fully visible (no cropping, no zoom).
//             Top/bottom padding keeps it clear of the top bar and the info panel.
//             Adjust these two numbers if you want the poster bigger or smaller. */}
//         <div
//           className="absolute inset-0 flex items-center justify-center"
//           style={{ paddingTop: "5rem", paddingBottom: "16rem" }}
//         >
//           {event?.videoUrl ? (
//             <video
//               ref={videoRef}
//               className="max-w-full max-h-full object-contain"
//               src={event.videoUrl}
//               poster={imageSrc}
//               loop
//               muted
//               playsInline
//               preload="metadata"
//             />
//           ) : (
//             <img
//               src={imageSrc}
//               alt={event?.title}
//               loading="lazy"
//               decoding="async"
//               className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
//             />
//           )}
//         </div>
//       </div>

//       {/* ── Gradient layers (only darken the very bottom for text) ───────── */}
//       <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent via-60% to-black/90 pointer-events-none" />

//       {/* ── Bottom content ───────────────────────────────────────────────── */}
//       <Motion.div
//         className="absolute bottom-0 left-0 right-0 px-5 pb-8 z-20 pointer-events-none"
//         initial={{ y: 40, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
//       >
//         {/* Price badge */}
//         {lowestPrice !== null && (
//           <Motion.div
//             className="inline-flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-full pointer-events-auto"
//             style={{
//               background: "linear-gradient(135deg, #7c3aed, #ec4899)",
//             }}
//             initial={{ opacity: 0, x: -10 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.5 }}
//           >
//             <Ticket className="w-3.5 h-3.5 text-white" />
//             <span className="text-white text-xs font-bold tracking-wide">
//               From ₦{lowestPrice.toLocaleString()}
//             </span>
//           </Motion.div>
//         )}
        

//         {/* Event title */}
//         <h2
//           className="text-white font-black text-3xl md:text-4xl leading-tight mb-4 pointer-events-auto"
//           style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
//         >
//           {event?.title || "Event Title"}
//         </h2>

//         {/* Meta info */}
//         <div className="flex flex-col gap-2 mb-5 pointer-events-auto">
//           <div className="flex items-center gap-2">
//             <div
//               className="w-6 h-6 rounded-full flex items-center justify-center"
//               style={{ background: "rgba(124,58,237,0.3)" }}
//             >
//               <MapPin className="w-3.5 h-3.5 text-purple-300" />
//             </div>
//             <span className="text-white/85 text-sm font-medium">
//               {event?.location || "Location TBA"}
//             </span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div
//               className="w-6 h-6 rounded-full flex items-center justify-center"
//               style={{ background: "rgba(124,58,237,0.3)" }}
//             >
//               <Calendar className="w-3.5 h-3.5 text-purple-300" />
//             </div>
//             <span className="text-white/85 text-sm font-medium">
//               {formattedDate}
//             </span>
//           </div>
//         </div>

//         {/* Buy Ticket CTA */}
//         <Motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.97 }}
//           onClick={(e) => {
//             e.stopPropagation();
//             navigate("/checkout", { state: { event } });
//           }}
//           className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2.5 pointer-events-auto relative overflow-hidden"
//           style={{
//             background: "linear-gradient(135deg, #7c3aed, #ec4899)",
//             boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
//           }}
//         >
//           <Ticket className="w-5 h-5" />
//           Get Tickets
//           <Motion.div
//             className="absolute inset-0 bg-white/10"
//             initial={{ x: "-100%" }}
//             whileHover={{ x: "100%" }}
//             transition={{ duration: 0.5 }}
//           />
//         </Motion.button>
//       </Motion.div>

//       {/* ── Right side icons ─────────────────────────────────────────────── */}
//       <div className="absolute right-5 bottom-56 flex flex-col gap-5 items-center z-30 pointer-events-auto">
//         <Motion.button
//           whileHover={{ scale: 1.15 }}
//           whileTap={{ scale: 0.88 }}
//           onClick={(e) => {
//             e.stopPropagation();
//             onOpenComments();
//           }}
//           className="flex flex-col items-center gap-1.5"
//         >
//           <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
//             <MessageCircle className="w-6 h-6 text-white" />
//           </div>
//           <span className="text-white text-xs font-semibold drop-shadow">
//             {comments.length}
//           </span>
//         </Motion.button>
//       </div>

//       {/* ── Comments sheet ───────────────────────────────────────────────── */}
//       <AnimatePresence>
//         {showComments && (
//           <Motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             className="absolute inset-0 z-50"
//             style={{
//               background: "rgba(0,0,0,0.6)",
//               backdropFilter: "blur(8px)",
//             }}
//             onClick={(e) => {
//               e.stopPropagation();
//               onCloseComments();
//             }}
//           >
//             <Motion.div
//               initial={{ y: "100%" }}
//               animate={{ y: 0 }}
//               exit={{ y: "100%" }}
//               transition={{ type: "spring", damping: 28, stiffness: 320 }}
//               className="absolute bottom-0 left-0 right-0 rounded-t-3xl overflow-hidden"
//               style={{
//                 background: "rgba(15,10,30,0.97)",
//                 backdropFilter: "blur(20px)",
//               }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Handle */}
//               <div className="flex justify-center pt-3 pb-1">
//                 <div className="w-10 h-1 rounded-full bg-white/20" />
//               </div>

//               {/* Header */}
//               <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
//                 <div>
//                   <h3 className="text-white font-bold text-lg">Comments</h3>
//                   <p className="text-white/40 text-xs mt-0.5">
//                     {comments.length} comments
//                   </p>
//                 </div>
//                 <Motion.button
//                   whileTap={{ scale: 0.9 }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onCloseComments();
//                   }}
//                   className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10"
//                 >
//                   <X className="w-5 h-5 text-white/70" />
//                 </Motion.button>
//               </div>

//               {/* Comments list */}
//               <div
//                 className="overflow-y-auto px-5 py-4 space-y-5"
//                 style={{ maxHeight: "45vh" }}
//               >
//                 {comments.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center py-12 gap-3">
//                     <MessageCircle className="w-10 h-10 text-white/20" />
//                     <p className="text-white/40 text-sm">
//                       Be the first to comment
//                     </p>
//                   </div>
//                 ) : (
//                   comments.map((comment, idx) => (
//                     <Motion.div
//                       key={comment?._id || idx}
//                       initial={{ opacity: 0, y: 8 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: idx * 0.04 }}
//                       className="flex gap-3"
//                     >
//                       <div
//                         className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
//                         style={{
//                           background:
//                             "linear-gradient(135deg, #7c3aed, #ec4899)",
//                         }}
//                       >
//                         {(comment?.user?.username?.[0] || "U").toUpperCase()}
//                       </div>
//                       <div>
//                         <p className="text-white/60 text-xs font-semibold mb-0.5">
//                           {comment?.user?.username || "User"}
//                         </p>
//                         <p className="text-white/90 text-sm leading-relaxed">
//                           {comment?.content || ""}
//                         </p>
//                       </div>
//                     </Motion.div>
//                   ))
//                 )}
//               </div>

//               {/* Input */}
//               <div className="px-5 py-4 border-t border-white/10 flex gap-3 items-center">
//                 <input
//                   type="text"
//                   placeholder="Write a comment…"
//                   value={newComment}
//                   onChange={(e) => onNewCommentChange(e.target.value)}
//                   onKeyDown={handlePost}
//                   className="flex-1 bg-white/8 text-white placeholder-white/30 rounded-2xl px-4 py-3 text-sm outline-none border border-white/10 focus:border-purple-500/50 transition-colors"
//                   style={{ background: "rgba(255,255,255,0.06)" }}
//                 />
//                 <Motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onPostComment();
//                   }}
//                   disabled={!newComment.trim()}
//                   className="w-11 h-11 flex items-center justify-center rounded-full disabled:opacity-30 transition-opacity flex-shrink-0"
//                   style={{
//                     background: "linear-gradient(135deg, #7c3aed, #ec4899)",
//                   }}
//                 >
//                   <Send className="w-4 h-4 text-white" />
//                 </Motion.button>
//               </div>

//               {/* Safe area spacer */}
//               <div className="h-6" />
//             </Motion.div>
//           </Motion.div>
//         )}
//       </AnimatePresence>
//     </Motion.div>
//   );
// };

// export default EventCard;



// src/components/EventCard.jsx
import React, { useRef, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Ticket, X, MapPin, Calendar, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1200'><rect width='100%' height='100%' fill='%231a1030'/></svg>";

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

  // Prefer the image the server picked, then the first media item
  const imageSrc = event?.imageUrl || event?.media?.[0] || FALLBACK_IMAGE;

  // Show the count from the feed until the comments are opened and loaded
  const commentCount =
    comments.length > 0 ? comments.length : event?.commentCount || 0;

  return (
    <Motion.div
      className="relative w-full h-full flex-shrink-0 bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      onClick={onCardClick}
    >
      {/* ── Media Background ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-black overflow-hidden">
        {/* Blurred copy fills the whole screen behind the poster */}
        <img
          src={imageSrc}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-50"
        />

        {/* Sharp poster, fully visible (no cropping, no zoom).
            Top/bottom padding keeps it clear of the top bar and the info panel.
            Adjust these two numbers if you want the poster bigger or smaller. */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ paddingTop: "5rem", paddingBottom: "16rem" }}
        >
          {event?.videoUrl ? (
            <video
              ref={videoRef}
              className="max-w-full max-h-full object-contain"
              src={event.videoUrl}
              poster={imageSrc}
              loop
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              src={imageSrc}
              alt={event?.title}
              loading="lazy"
              decoding="async"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            />
          )}
        </div>
      </div>

      {/* ── Gradient layers (only darken the very bottom for text) ───────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent via-60% to-black/90 pointer-events-none" />

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
            {commentCount}
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
                  maxLength={500}
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