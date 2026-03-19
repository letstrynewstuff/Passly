// src/pages/Profile.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Settings,
  HelpCircle,
  Filter,
  QrCode,
  MessageSquare,
  Calendar,
  MapPin,
  ArrowLeft,
  Mail,
  X,
  Loader2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/ThemeProvider";
import Loader from "../components/Loader";
import { uploadAvatar } from "../api/services/profileApi";
import { getUserProfile } from "../api/services/profileApi";
import { getMyTickets } from "../api/services/ticketApi";
import ProfileSettings from "../components/ProfileSettings";
import { getAvatarUrl } from "../utils/avatarUtils";

// ─── Load jsPDF ───────────────────────────────────────────────────────────────
let jsPDFLib = null;
const loadJsPDF = () =>
  new Promise((resolve, reject) => {
    if (jsPDFLib) return resolve(jsPDFLib);
    if (window.jspdf) {
      jsPDFLib = window.jspdf.jsPDF;
      return resolve(jsPDFLib);
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js";
    script.onload = () => {
      jsPDFLib = window.jspdf.jsPDF;
      resolve(jsPDFLib);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

// ─── Passly branding on canvas ────────────────────────────────────────────────
const drawPasslyBranding = (ctx, canvasWidth, y) => {
  ctx.save();
  ctx.textAlign = "center";
  const pillW = 180,
    pillH = 28,
    r = 14;
  const pillX = canvasWidth / 2 - pillW / 2;
  const pillY = y - 18;
  const grad = ctx.createLinearGradient(pillX, 0, pillX + pillW, 0);
  grad.addColorStop(0, "#7c3aed");
  grad.addColorStop(1, "#ec4899");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(pillX + r, pillY);
  ctx.lineTo(pillX + pillW - r, pillY);
  ctx.quadraticCurveTo(pillX + pillW, pillY, pillX + pillW, pillY + r);
  ctx.lineTo(pillX + pillW, pillY + pillH - r);
  ctx.quadraticCurveTo(
    pillX + pillW,
    pillY + pillH,
    pillX + pillW - r,
    pillY + pillH,
  );
  ctx.lineTo(pillX + r, pillY + pillH);
  ctx.quadraticCurveTo(pillX, pillY + pillH, pillX, pillY + pillH - r);
  ctx.lineTo(pillX, pillY + r);
  ctx.quadraticCurveTo(pillX, pillY, pillX + r, pillY);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "11px Arial";
  ctx.fillText("Powered by", canvasWidth / 2 - 20, y + 3);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px Arial";
  ctx.fillText("Passly", canvasWidth / 2 + 28, y + 3);
  ctx.restore();
};

// ─── Price helper ─────────────────────────────────────────────────────────────
const getDisplayPrice = (ticket) => {
  const ticketP = Number(ticket.ticketPrice || 0);
  const totalP = Number(ticket.totalPrice || 0);
  return ticketP > 0 ? ticketP : totalP;
};

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  active: {
    label: "Active",
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  attended: {
    label: "Attended",
    bg: "bg-sky-500/15",
    text: "text-sky-400",
    dot: "bg-sky-400",
  },
  used: {
    label: "Used",
    bg: "bg-sky-500/15",
    text: "text-sky-400",
    dot: "bg-sky-400",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-rose-500/15",
    text: "text-rose-400",
    dot: "bg-rose-400",
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
};

const Profile = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState("tickets");
  const [ticketFilter, setTicketFilter] = useState("all");
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState(null);
  const [emailSending, setEmailSending] = useState(null);
  const [emailSent, setEmailSent] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login", { replace: true });
        const profileData = await getUserProfile(token);
        if (!profileData?.profile) throw new Error("Invalid profile data");
        setUser(profileData.profile);
        const ticketsData = await getMyTickets(token);
        setTickets(
          Array.isArray(ticketsData)
            ? ticketsData
            : ticketsData.tickets || ticketsData.data || [],
        );
      } catch (err) {
        console.error("Profile load error:", err);
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login", { replace: true });
        } else {
          alert("Something went wrong loading your profile.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [navigate]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUser((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
    try {
      const result = await uploadAvatar(file);
      setUser((prev) => ({ ...prev, avatar: result.avatar || result.url }));
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed.");
    }
  };

  const handleResendEmail = async (ticket) => {
    setEmailSending(ticket._id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/tickets/${ticket._id}/resend-email`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      if (data.success) {
        setEmailSent(ticket._id);
        setTimeout(() => setEmailSent(null), 3000);
      }
    } catch {
      alert("Failed to send email");
    } finally {
      setEmailSending(null);
    }
  };

  const handleDownloadImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 590;
    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.src = selectedQR.qrCode;
    const logoImg = new Image();
    logoImg.src = "/assets/logo.png";
    qrImg.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const grad = ctx.createLinearGradient(0, 0, 400, 0);
      grad.addColorStop(0, "#7c3aed");
      grad.addColorStop(1, "#ec4899");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 400, 75);
      const drawRest = () => {
        ctx.fillStyle = "#fff";
        ctx.font = "bold 15px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          (selectedQR.eventId?.title || "Event").slice(0, 36),
          200,
          48,
        );
        ctx.drawImage(qrImg, 75, 90, 250, 250);
        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, 355);
        ctx.lineTo(370, 355);
        ctx.stroke();
        ctx.fillStyle = "#9ca3af";
        ctx.font = "11px Arial";
        ctx.fillText("TICKET CODE", 200, 380);
        ctx.fillStyle = "#111827";
        ctx.font = "bold 24px monospace";
        ctx.fillText(selectedQR.ticketCode || "", 200, 412);
        if (selectedQR.eventId?.date) {
          ctx.fillStyle = "#6b7280";
          ctx.font = "12px Arial";
          ctx.fillText(
            new Date(selectedQR.eventId.date).toLocaleDateString("en-NG", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            200,
            440,
          );
        }
        if (selectedQR.eventId?.location) {
          ctx.fillStyle = "#9ca3af";
          ctx.font = "12px Arial";
          ctx.fillText(selectedQR.eventId.location, 200, 462);
        }
        ctx.fillStyle = "#7c3aed";
        ctx.font = "bold 13px Arial";
        ctx.fillText(selectedQR.ticketTypeName || "", 200, 485);
        drawPasslyBranding(ctx, 400, 560);
        const link = document.createElement("a");
        link.download = `ticket-${selectedQR.ticketCode || selectedQR._id}.png`;
        link.href = canvas.toDataURL();
        link.click();
      };
      logoImg.onload = () => {
        ctx.drawImage(logoImg, 12, 14, 44, 44);
        drawRest();
      };
      logoImg.onerror = () => drawRest();
    };
  };

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      const JsPDF = await loadJsPDF();
      const doc = new JsPDF({
        unit: "mm",
        format: "a6",
        orientation: "portrait",
      });
      const pageW = doc.internal.pageSize.getWidth();
      doc.setFillColor(124, 58, 237);
      doc.rect(0, 0, pageW, 24, "F");
      try {
        const logoRes = await fetch("/assets/logo.png");
        if (logoRes.ok) {
          const logoBlob = await logoRes.blob();
          const logoBase64 = await new Promise((r) => {
            const reader = new FileReader();
            reader.onload = () => r(reader.result);
            reader.readAsDataURL(logoBlob);
          });
          doc.addImage(logoBase64, "PNG", 4, 5, 14, 14);
        }
      } catch {
        /* logo optional */
      }
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(
        (selectedQR.eventId?.title || "Event").slice(0, 32),
        pageW / 2,
        14,
        { align: "center" },
      );
      doc.addImage(selectedQR.qrCode, "PNG", pageW / 2 - 28, 28, 56, 56);
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.3);
      doc.line(8, 88, pageW - 8, 88);
      doc.setTextColor(156, 163, 175);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("TICKET CODE", pageW / 2, 95, { align: "center" });
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(18);
      doc.setFont("courier", "bold");
      doc.text(selectedQR.ticketCode || "", pageW / 2, 106, {
        align: "center",
      });
      if (selectedQR.eventId?.date) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text(
          new Date(selectedQR.eventId.date).toLocaleDateString("en-NG", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          pageW / 2,
          115,
          { align: "center" },
        );
      }
      if (selectedQR.eventId?.location) {
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);
        doc.text(selectedQR.eventId.location, pageW / 2, 122, {
          align: "center",
        });
      }
      doc.setTextColor(124, 58, 237);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(selectedQR.ticketTypeName || "", pageW / 2, 130, {
        align: "center",
      });
      const pillW = 50,
        pillX = pageW / 2 - pillW / 2;
      doc.setFillColor(124, 58, 237);
      doc.roundedRect(pillX, 136, pillW, 7, 3, 3, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.text("Powered by ", pageW / 2 - 2, 140.5, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.text("Passly", pageW / 2 - 1, 140.5, { align: "left" });
      doc.save(`ticket-${selectedQR.ticketCode || selectedQR._id}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Please try the image download instead.");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleShare = () => {
    const eventTitle = selectedQR.eventId?.title || "an event";
    const code = selectedQR.ticketCode || selectedQR._id;
    const date = selectedQR.eventId?.date
      ? new Date(selectedQR.eventId.date).toLocaleDateString("en-NG", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "";
    const text = `🎟️ My ticket for *${eventTitle}*${date ? ` on ${date}` : ""}!\nTicket Code: *${code}*\n\nSee you there! 🎉`;
    if (navigator.share) {
      navigator
        .share({ title: `Ticket — ${eventTitle}`, text })
        .catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  const filteredTickets = tickets.filter((ticket) =>
    ticketFilter === "all" ? true : ticket.status === ticketFilter,
  );

  const tabs = [
    { id: "tickets", label: "My Tickets", icon: Ticket },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help", icon: HelpCircle },
  ];

  if (isLoading) return <Loader type="page" />;

  // ── dark/light palette tokens ───────────────────────────────────────────────
  const bg = isDark ? "#0a0a0f" : "#f8f7ff";
  const surface = isDark ? "#13121a" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const muted = isDark ? "#5a5870" : "#9b98b0";
  const strong = isDark ? "#f0eeff" : "#1a1730";

  return (
    <div
      style={{ background: bg }}
      className="min-h-screen transition-colors duration-500"
    >
      {/* ── Ambient glow ──────────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(ellipse, #7c3aed 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute top-1/3 -right-20 w-64 h-64 rounded-full opacity-10"
          style={{
            background: "radial-gradient(ellipse, #ec4899 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-40"
        style={{
          background: isDark ? "rgba(10,10,15,0.85)" : "rgba(248,247,255,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${border}`,
        }}
      >
        <div className="max-w-5xl mx-auto px-5 pt-5 pb-0 relative">
          {/* Back button */}
          <Motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate("/feed", { replace: true })}
            className="absolute left-5 top-6 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.05)",
              color: muted,
              border: `1px solid ${border}`,
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Motion.button>

          {/* Profile section */}
          <div className="flex flex-col items-center gap-3 pt-2 pb-6">
            <Motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative"
            >
              {/* Avatar ring */}
              <div
                className="absolute inset-0 rounded-full p-[3px] -m-[3px]"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed, #ec4899, #7c3aed)",
                  backgroundSize: "200% 200%",
                  animation: "gradient-rotate 4s linear infinite",
                }}
              />
              <img
                src={getAvatarUrl(user)}
                alt={user?.username || "Profile"}
                className="relative w-24 h-24 rounded-full object-cover ring-4"
                style={{ ringColor: bg }}
              />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              {/* Edit hint */}
              <Motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                }}
              >
                <span className="text-white text-xs">✎</span>
              </Motion.button>
            </Motion.div>

            <Motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-center"
            >
              <h2
                className="text-2xl font-bold tracking-tight"
                style={{ color: strong }}
              >
                {user?.username || "Username"}
              </h2>
              <p className="text-sm mt-0.5" style={{ color: muted }}>
                {user?.email || ""}
              </p>
            </Motion.div>

            {/* Stats row */}
            <Motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex items-center gap-1 px-4 py-2 rounded-2xl"
              style={{
                background: isDark
                  ? "rgba(124,58,237,0.12)"
                  : "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.2)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-semibold text-purple-400">
                {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}{" "}
                purchased
              </span>
            </Motion.div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {tabs.map((tab, i) => (
              <Motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all rounded-t-xl"
                style={{
                  color: activeTab === tab.id ? "#a78bfa" : muted,
                  background:
                    activeTab === tab.id
                      ? isDark
                        ? "rgba(124,58,237,0.12)"
                        : "rgba(124,58,237,0.07)"
                      : "transparent",
                }}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <Motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #7c3aed, #ec4899)",
                    }}
                  />
                )}
              </Motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-5 py-8">
        <AnimatePresence mode="wait">
          {/* ── Tickets tab ─────────────────────────────────────────────── */}
          {activeTab === "tickets" && (
            <Motion.div
              key="tickets"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {/* QR Modal */}
              <AnimatePresence>
                {selectedQR && (
                  <Motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{
                      background: "rgba(0,0,0,0.75)",
                      backdropFilter: "blur(12px)",
                    }}
                    onClick={() => setSelectedQR(null)}
                  >
                    <Motion.div
                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.9, opacity: 0, y: 20 }}
                      transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 24,
                      }}
                      className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
                      style={{
                        background: isDark ? "#13121a" : "#ffffff",
                        border: `1px solid ${border}`,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Modal header */}
                      <div
                        className="px-6 pt-6 pb-4 flex items-center justify-between"
                        style={{ borderBottom: `1px solid ${border}` }}
                      >
                        <div>
                          <h3
                            className="font-bold text-base"
                            style={{ color: strong }}
                          >
                            Your Ticket
                          </h3>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: muted }}
                          >
                            {selectedQR.eventId?.title || "Event"}
                          </p>
                        </div>
                        <Motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedQR(null)}
                          className="w-8 h-8 flex items-center justify-center rounded-full"
                          style={{
                            background: isDark
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(0,0,0,0.06)",
                          }}
                        >
                          <X className="w-4 h-4" style={{ color: muted }} />
                        </Motion.button>
                      </div>

                      {/* QR section */}
                      <div className="px-6 py-5 flex flex-col items-center gap-4">
                        <div
                          className="p-3 rounded-2xl"
                          style={{
                            background: "#ffffff",
                            boxShadow: "0 8px 32px rgba(124,58,237,0.15)",
                          }}
                        >
                          <img
                            src={selectedQR.qrCode}
                            alt="QR Code"
                            className="w-52 h-52 object-contain"
                          />
                        </div>

                        {selectedQR.ticketCode && (
                          <div
                            className="w-full px-5 py-3 rounded-2xl flex items-center justify-between"
                            style={{
                              background: isDark
                                ? "rgba(124,58,237,0.1)"
                                : "rgba(124,58,237,0.06)",
                              border: "1px solid rgba(124,58,237,0.2)",
                            }}
                          >
                            <span
                              className="text-xs font-medium"
                              style={{ color: muted }}
                            >
                              Ticket Code
                            </span>
                            <span
                              className="font-mono text-base font-black tracking-[0.25em]"
                              style={{ color: "#a78bfa" }}
                            >
                              {selectedQR.ticketCode}
                            </span>
                          </div>
                        )}

                        <p
                          className="text-xs text-center"
                          style={{ color: muted }}
                        >
                          Present this QR code at the venue entrance
                        </p>

                        {/* Passly pill */}
                        <div
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full"
                          style={{
                            background:
                              "linear-gradient(135deg, #7c3aed, #ec4899)",
                          }}
                        >
                          <span className="text-white/75 text-xs">
                            Powered by
                          </span>
                          <span className="text-white text-xs font-black tracking-wider">
                            Passly
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="px-6 pb-6 space-y-2.5">
                        <Motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleDownloadImage}
                          className="w-full py-3 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2 relative overflow-hidden"
                          style={{
                            background:
                              "linear-gradient(135deg, #7c3aed, #ec4899)",
                            boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
                          }}
                        >
                          🖼️ Download Ticket Image
                        </Motion.button>

                        <Motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleDownloadPDF}
                          disabled={pdfLoading}
                          className="w-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                          style={{
                            background: "transparent",
                            border: "1.5px solid rgba(124,58,237,0.4)",
                            color: "#a78bfa",
                          }}
                        >
                          {pdfLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />{" "}
                              Generating…
                            </>
                          ) : (
                            "🧾 Download PDF"
                          )}
                        </Motion.button>

                        <Motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleShare}
                          className="w-full py-3 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2"
                          style={{
                            background:
                              "linear-gradient(135deg, #10b981, #059669)",
                            boxShadow: "0 4px 20px rgba(16,185,129,0.25)",
                          }}
                        >
                          📲 Share via WhatsApp
                        </Motion.button>
                      </div>
                    </Motion.div>
                  </Motion.div>
                )}
              </AnimatePresence>

              {/* Filter bar */}
              <div className="flex items-center gap-3 mb-7">
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
                  style={{ color: muted }}
                >
                  <Filter className="w-4 h-4" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["all", "active", "attended", "cancelled"].map((f) => (
                    <Motion.button
                      key={f}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setTicketFilter(f)}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all"
                      style={{
                        background:
                          ticketFilter === f
                            ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                            : isDark
                              ? "rgba(255,255,255,0.06)"
                              : "rgba(0,0,0,0.05)",
                        color: ticketFilter === f ? "#ffffff" : muted,
                        border:
                          ticketFilter === f ? "none" : `1px solid ${border}`,
                      }}
                    >
                      {f === "all" ? "All Tickets" : f}
                    </Motion.button>
                  ))}
                </div>
              </div>

              {/* Tickets grid */}
              {filteredTickets.length === 0 ? (
                <Motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 gap-4"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      background: isDark
                        ? "rgba(124,58,237,0.1)"
                        : "rgba(124,58,237,0.07)",
                    }}
                  >
                    <Ticket className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="font-semibold" style={{ color: muted }}>
                    No tickets found
                  </p>
                  <p className="text-sm" style={{ color: muted }}>
                    Your purchased tickets will appear here
                  </p>
                </Motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredTickets.map((ticket, i) => {
                    const st = STATUS[ticket.status] || STATUS.pending;
                    return (
                      <Motion.div
                        key={ticket._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="rounded-3xl overflow-hidden flex flex-col"
                        style={{
                          background: surface,
                          border: `1px solid ${border}`,
                          boxShadow: isDark
                            ? "0 8px 32px rgba(0,0,0,0.4)"
                            : "0 4px 24px rgba(0,0,0,0.08)",
                        }}
                      >
                        {/* Image */}
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={
                              ticket.eventId?.media?.[0] ||
                              "https://via.placeholder.com/400x200"
                            }
                            alt={ticket.eventId?.title || "Event"}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          {/* Gradient over image */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                          {/* Status badge */}
                          <div
                            className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${st.bg} ${st.text}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${st.dot}`}
                            />
                            {st.label}
                          </div>

                          {/* Price over image */}
                          <div className="absolute bottom-3 left-3">
                            <span className="text-white font-black text-lg drop-shadow-lg">
                              ₦{getDisplayPrice(ticket).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col gap-3 flex-1">
                          <h3
                            className="font-bold text-base leading-snug"
                            style={{ color: strong }}
                          >
                            {ticket.eventId?.title || "Event"}
                          </h3>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <Calendar
                                className="w-3.5 h-3.5 flex-shrink-0"
                                style={{ color: muted }}
                              />
                              <span
                                className="text-xs"
                                style={{ color: muted }}
                              >
                                {ticket.eventId?.date
                                  ? new Date(
                                      ticket.eventId.date,
                                    ).toLocaleDateString("en-NG", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "TBA"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin
                                className="w-3.5 h-3.5 flex-shrink-0"
                                style={{ color: muted }}
                              />
                              <span
                                className="text-xs truncate"
                                style={{ color: muted }}
                              >
                                {ticket.eventId?.location || "TBA"}
                              </span>
                            </div>
                          </div>

                          {/* Ticket type + code */}
                          <div
                            className="flex items-center justify-between pt-1 pb-1"
                            style={{ borderTop: `1px solid ${border}` }}
                          >
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded-lg"
                              style={{
                                background: isDark
                                  ? "rgba(124,58,237,0.12)"
                                  : "rgba(124,58,237,0.08)",
                                color: "#a78bfa",
                              }}
                            >
                              {ticket.ticketTypeName || "General"}
                            </span>
                            {ticket.ticketCode && (
                              <span
                                className="font-mono text-xs font-bold tracking-widest"
                                style={{ color: muted }}
                              >
                                {ticket.ticketCode}
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          {ticket.qrCode ? (
                            <div className="flex gap-2 mt-auto pt-1">
                              <Motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setSelectedQR(ticket)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-xs font-bold text-white"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #7c3aed, #ec4899)",
                                  boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
                                }}
                              >
                                <QrCode className="w-3.5 h-3.5" />
                                View Ticket
                              </Motion.button>
                              <Motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => handleResendEmail(ticket)}
                                disabled={
                                  emailSending === ticket._id ||
                                  emailSent === ticket._id
                                }
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-xs font-bold transition-all disabled:opacity-60"
                                style={{
                                  background:
                                    emailSent === ticket._id
                                      ? "linear-gradient(135deg, #10b981, #059669)"
                                      : "transparent",
                                  color:
                                    emailSent === ticket._id
                                      ? "#ffffff"
                                      : "#a78bfa",
                                  border:
                                    emailSent === ticket._id
                                      ? "none"
                                      : "1.5px solid rgba(124,58,237,0.3)",
                                }}
                              >
                                <Mail className="w-3.5 h-3.5" />
                                {emailSent === ticket._id
                                  ? "Sent!"
                                  : emailSending === ticket._id
                                    ? "..."
                                    : "Email"}
                              </Motion.button>
                            </div>
                          ) : (
                            <div
                              className="mt-auto pt-2 text-center text-xs"
                              style={{ color: muted }}
                            >
                              No QR code available
                            </div>
                          )}
                        </div>
                      </Motion.div>
                    );
                  })}
                </div>
              )}
            </Motion.div>
          )}

          {/* ── Settings tab ────────────────────────────────────────────── */}
          {activeTab === "settings" && (
            <Motion.div
              key="settings"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <ProfileSettings user={user} setUser={setUser} />
            </Motion.div>
          )}

          {/* ── Help tab ────────────────────────────────────────────────── */}
          {activeTab === "help" && (
            <Motion.div
              key="help"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="max-w-2xl mx-auto"
            >
              <div
                className="rounded-3xl overflow-hidden"
                style={{ background: surface, border: `1px solid ${border}` }}
              >
                <div
                  className="px-6 py-5"
                  style={{ borderBottom: `1px solid ${border}` }}
                >
                  <h2 className="text-xl font-bold" style={{ color: strong }}>
                    Help & Support
                  </h2>
                  <p className="text-sm mt-1" style={{ color: muted }}>
                    Find answers to common questions
                  </p>
                </div>

                <div className="divide-y" style={{ borderColor: border }}>
                  {[
                    {
                      q: "How do I purchase tickets?",
                      a: "Browse events on the home page, select an event, choose your ticket type, and complete the checkout process.",
                    },
                    {
                      q: "How do I get a refund?",
                      a: "Contact the event organizer through the event page or reach out to our support team for refund requests.",
                    },
                    {
                      q: "Where is my QR code?",
                      a: "Your QR code is available in the My Tickets tab. Click 'View Ticket' on any ticket to see its QR code.",
                    },
                  ].map((item, i) => (
                    <Motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="px-6 py-5 flex items-start justify-between gap-4 group cursor-pointer hover:bg-purple-500/5 transition-colors"
                    >
                      <div>
                        <h3
                          className="font-semibold text-sm mb-1"
                          style={{ color: strong }}
                        >
                          {item.q}
                        </h3>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: muted }}
                        >
                          {item.a}
                        </p>
                      </div>
                      <ChevronRight
                        className="w-4 h-4 flex-shrink-0 mt-0.5 group-hover:text-purple-400 transition-colors"
                        style={{ color: muted }}
                      />
                    </Motion.div>
                  ))}
                </div>

                <div className="px-6 py-5">
                  <Motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                      boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
                    }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Contact Support
                  </Motion.button>
                </div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
