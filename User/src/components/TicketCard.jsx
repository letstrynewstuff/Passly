// // src/components/TicketCard.jsx
// import React from "react";
// import { Calendar, MapPin, QrCode } from "lucide-react";

// const TicketCard = ({ ticket }) => {
//   // Fallbacks for undefined values
//   const eventTitle = ticket.eventId?.title || "Event";
//   const eventDate = ticket.eventId?.date
//     ? new Date(ticket.eventId.date).toLocaleDateString()
//     : "TBA";
//   const eventLocation = ticket.eventId?.location || "TBA";
//   const ticketType = ticket.ticketTypeName || ticket.ticketType || "General";
//   const price = ticket.totalPrice ?? ticket.price ?? 0;

//   const status =
//     ticket.status?.charAt(0).toUpperCase() + ticket.status?.slice(1) ||
//     "Pending";

//   return (
//     <div className="rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
//       <div className="relative h-40">
//         <img
//           src={ticket.eventId?.media?.[0] || "https://via.placeholder.com/400"}
//           alt={eventTitle}
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute top-2 right-2">
//           <span
//             className={`px-3 py-1 rounded-full text-xs font-semibold ${
//               ticket.status === "upcoming"
//                 ? "bg-green-500 text-white"
//                 : ticket.status === "attended"
//                   ? "bg-blue-500 text-white"
//                   : "bg-red-500 text-white"
//             }`}
//           >
//             {status}
//           </span>
//         </div>
//       </div>
//       <div className="p-4 space-y-2">
//         <h3 className="font-bold text-lg text-gray-900 dark:text-white">
//           {eventTitle}
//         </h3>
//         <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
//           <div className="flex items-center gap-2">
//             <Calendar className="w-4 h-4" />
//             <span>{eventDate}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <MapPin className="w-4 h-4" />
//             <span>{eventLocation}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>{ticketType}</span>
//             <span className="font-bold text-purple-500">
//               ₦{price.toLocaleString()}
//             </span>
//           </div>
//         </div>
//         {ticket.qrCode && (
//           <div className="flex flex-col gap-2 mt-4">
//             <img
//               src={ticket.qrCode}
//               alt="QR Code"
//               className="w-full h-40 object-contain"
//             />
//             <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center justify-center gap-2">
//               <QrCode className="w-5 h-5" />
//               View / Download QR
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TicketCard;

// // src/components/TicketCard.jsx// src/components/TicketCard.jsx
// import React from "react";
// import { Calendar, MapPin, QrCode } from "lucide-react";

// const TicketCard = ({ ticket }) => {
//   const eventTitle = ticket.eventId?.title || "Event";
//   const eventDate = ticket.eventId?.date
//     ? new Date(ticket.eventId.date).toLocaleDateString()
//     : "TBA";
//   const eventLocation = ticket.eventId?.location || "TBA";
//   const ticketType = ticket.ticketTypeName || ticket.ticketType || "General";
//   const price = ticket.totalPrice ?? ticket.price ?? 0;

//   const status =
//     ticket.status?.charAt(0).toUpperCase() + ticket.status?.slice(1) ||
//     "Pending";

//   const handleQRCodeClick = () => {

//     console.log("QR BUTTON CLICKED");
//     if (!ticket.qrCode) return;

//     // Works for both base64 data URLs and regular URLs
//     if (ticket.qrCode.startsWith("data:")) {
//       // Base64 data URL — trigger a download directly
//       const link = document.createElement("a");
//       link.href = ticket.qrCode;
//       link.download = `ticket-qr-${ticket._id}.png`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } else {
//       // Regular URL — open in new tab
//       window.open(ticket.qrCode, "_blank");
//     }
//   };

//   return (
//     <div className="rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
//       <div className="relative h-40">
//         <img
//           src={ticket.eventId?.media?.[0] || "https://via.placeholder.com/400"}
//           alt={eventTitle}
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute top-2 right-2">
//           <span
//             className={`px-3 py-1 rounded-full text-xs font-semibold ${
//               ticket.status === "active"
//                 ? "bg-green-500 text-white"
//                 : ticket.status === "attended"
//                   ? "bg-blue-500 text-white"
//                   : "bg-red-500 text-white"
//             }`}
//           >
//             {status}
//           </span>
//         </div>
//       </div>

//       <div className="p-4 space-y-2">
//         <h3 className="font-bold text-lg text-gray-900 dark:text-white">
//           {eventTitle}
//         </h3>

//         <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
//           <div className="flex items-center gap-2">
//             <Calendar className="w-4 h-4" />
//             <span>{eventDate}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <MapPin className="w-4 h-4" />
//             <span>{eventLocation}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>{ticketType}</span>
//             <span className="font-bold text-purple-500">
//               ₦{price.toLocaleString()}
//             </span>
//           </div>
//         </div>

//         {ticket.qrCode ? (
//           <div className="flex flex-col gap-2 mt-4">
//             <img
//               src={ticket.qrCode}
//               alt="QR Code"
//               className="w-full h-40 object-contain"
//             />
//             <button
//               onClick={handleQRCodeClick}
//               className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center justify-center gap-2"
//             >
//               <QrCode className="w-5 h-5" />
//               View / Download QR
//             </button>
//           </div>
//         ) : (
//           <div className="mt-4 text-sm text-gray-400 text-center">
//             No QR code available
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TicketCard;

// // src/components/TicketCard.jsx
// import React, { useState } from "react";
// import { Calendar, MapPin, QrCode, Mail, X } from "lucide-react";

// const TicketCard = ({ ticket }) => {
//   const [showQR, setShowQR] = useState(false);
//   const [emailSent, setEmailSent] = useState(false);
//   const [sending, setSending] = useState(false);

//   const eventTitle = ticket.eventId?.title || "Event";
//   const eventDate = ticket.eventId?.date
//     ? new Date(ticket.eventId.date).toLocaleDateString()
//     : "TBA";
//   const eventLocation = ticket.eventId?.location || "TBA";
//   const ticketType = ticket.ticketTypeName || ticket.ticketType || "General";
//   const price = ticket.totalPrice ?? ticket.price ?? 0;
//   const status =
//     ticket.status?.charAt(0).toUpperCase() + ticket.status?.slice(1) ||
//     "Pending";

//   const handleDownloadQR = () => {
//     if (!ticket.qrCode) return;
//     const link = document.createElement("a");
//     link.href = ticket.qrCode;
//     link.download = `ticket-qr-${ticket._id}.png`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleSendEmail = async () => {
//     setSending(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(
//         `http://localhost:5000/api/tickets/${ticket._id}/resend-email`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );
//       const data = await res.json();
//       if (data.success) {
//         setEmailSent(true);
//         setTimeout(() => setEmailSent(false), 3000);
//       } else {
//         alert("Failed to send email: " + data.message);
//       }
//     } catch {
//       alert("Error sending email");
//     } finally {
//       setSending(false);
//     }
//   };

//   // return (
//   //   <>
//   //     {/* QR Modal */}
//   //     {showQR && (
//   //       <div
//   //         className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
//   //         onClick={() => setShowQR(false)}
//   //       >
//   //         <div
//   //           className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 flex flex-col items-center gap-4"
//   //           onClick={(e) => e.stopPropagation()}
//   //         >
//   //           <div className="flex justify-between w-full items-center">
//   //             <h3 className="font-bold text-lg">Your QR Code</h3>
//   //             <button onClick={() => setShowQR(false)}>
//   //               <X className="w-5 h-5 text-gray-500" />
//   //             </button>
//   //           </div>
//   //           <img
//   //             src={ticket.qrCode}
//   //             alt="QR Code"
//   //             className="w-64 h-64 object-contain"
//   //           />
//   //           <p className="text-sm text-gray-500 text-center">
//   //             Present this at the venue
//   //           </p>
//   //           <button
//   //             onClick={handleDownloadQR}
//   //             className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium"
//   //           >
//   //             Download QR
//   //           </button>
//   //         </div>
//   //       </div>
//   //     )}

//   //     {/* Ticket Card */}
//   //     <div className="rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
//   //       <div className="relative h-40">
//   //         <img
//   //           src={
//   //             ticket.eventId?.media?.[0] || "https://via.placeholder.com/400"
//   //           }
//   //           alt={eventTitle}
//   //           className="w-full h-full object-cover"
//   //         />
//   //         <div className="absolute top-2 right-2">
//   //           <span
//   //             className={`px-3 py-1 rounded-full text-xs font-semibold ${
//   //               ticket.status === "active"
//   //                 ? "bg-green-500 text-white"
//   //                 : ticket.status === "attended"
//   //                   ? "bg-blue-500 text-white"
//   //                   : "bg-red-500 text-white"
//   //             }`}
//   //           >
//   //             {status}
//   //           </span>
//   //         </div>
//   //       </div>

//   //       <div className="p-4 space-y-2">
//   //         <h3 className="font-bold text-lg text-gray-900 dark:text-white">
//   //           {eventTitle}
//   //         </h3>

//   //         <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
//   //           <div className="flex items-center gap-2">
//   //             <Calendar className="w-4 h-4" />
//   //             <span>{eventDate}</span>
//   //           </div>
//   //           <div className="flex items-center gap-2">
//   //             <MapPin className="w-4 h-4" />
//   //             <span>{eventLocation}</span>
//   //           </div>
//   //           <div className="flex justify-between">
//   //             <span>{ticketType}</span>
//   //             <span className="font-bold text-purple-500">
//   //               ₦{price.toLocaleString()}
//   //             </span>
//   //           </div>
//   //         </div>

//   //         {ticket.qrCode ? (
//   //           <div className="flex gap-2 mt-4">
//   //             <button
//   //               onClick={() => setShowQR(true)}
//   //               className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium"
//   //             >
//   //               <QrCode className="w-4 h-4" />
//   //               View QR
//   //             </button>
//   //             <button
//   //               onClick={handleSendEmail}
//   //               disabled={sending || emailSent}
//   //               className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium border transition-colors ${
//   //                 emailSent
//   //                   ? "bg-green-500 text-white border-green-500"
//   //                   : "border-purple-500 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20"
//   //               }`}
//   //             >
//   //               <Mail className="w-4 h-4" />
//   //               {emailSent ? "Sent!" : sending ? "Sending..." : "Email"}
//   //             </button>
//   //           </div>
//   //         ) : (
//   //           <div className="mt-4 text-sm text-gray-400 text-center">
//   //             No QR code available
//   //           </div>
//   //         )}
//   //       </div>
//   //     </div>
//   //   </>
//   // );

// return <div style={{ color: "red", fontSize: "40px" }}>TEST CARD</div>;
// };

// export default TicketCard;
import React from 'react'

const TicketCard = () => {
  return (
    <div>TicketCard</div>
  )
}

export default TicketCard