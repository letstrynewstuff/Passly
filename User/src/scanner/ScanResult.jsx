// // // src/scanner/ScanResult.jsx
// // export default function ScanResult({ result, error, onReset }) {
// //   if (!result && !error) return null;

// //   const isSuccess = result?.success;
// //   const ticket = result?.ticket;

// //   return (
// //     <div
// //       className={`p-6 rounded-xl shadow-lg ${
// //         isSuccess ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
// //       } border`}
// //     >
// //       <h2
// //         className={`text-2xl font-bold mb-4 ${
// //           isSuccess ? "text-green-700" : "text-red-700"
// //         }`}
// //       >
// //         {isSuccess
// //           ? "VALID TICKET"
// //           : error || result?.message || "Scan failed"}
// //       </h2>

// //       {isSuccess && ticket && (
// //         <div className="space-y-3 text-gray-800">
// //           <p>
// //             <strong>Attendee:</strong> {ticket.username}
// //           </p>
// //           <p>
// //             <strong>Ticket type:</strong> {ticket.ticketTypeName}
// //           </p>
// //           <p>
// //             <strong>Quantity:</strong> {ticket.quantity}
// //           </p>
// //           <p>
// //             <strong>Event:</strong> {ticket.eventTitle}
// //           </p>
// //           <p>
// //             <strong>Scanned at:</strong>{" "}
// //             {ticket.usedAt
// //               ? new Date(ticket.usedAt).toLocaleString("en-US", {
// //                   dateStyle: "medium",
// //                   timeStyle: "short",
// //                 })
// //               : "—"}
// //           </p>

// //           {/* Who scanned it */}
// //           {ticket.usedBy ? (
// //             <p>
// //               <strong>Scanned by:</strong> {ticket.usedBy.username}{" "}
// //               <span className="text-gray-500 text-sm">
// //                 ({ticket.usedBy.role || "user"})
// //               </span>
// //               {ticket.usedBy.email && (
// //                 <span className="block text-sm text-gray-600 mt-1">
// //                   {ticket.usedBy.email}
// //                 </span>
// //               )}
// //             </p>
// //           ) : (
// //             <p className="text-gray-600 italic">
// //               Scanned by unknown user
// //             </p>
// //           )}
// //         </div>
// //       )}

// //       <button
// //         onClick={onReset}
// //         className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition"
// //       >
// //         Scan Next Ticket
// //       </button>
// //     </div>
// //   );
// // }
// // src/scanner/ScanResult.jsx
// export default function ScanResult({ result, error, onReset }) {
//   if (!result && !error) return null;

//   const isSuccess = result?.success;
//   const isAlreadyUsed = result?.alreadyUsed === true;
//   const ticket = result?.ticket;

//   const displayState = isSuccess ? "valid" : isAlreadyUsed ? "used" : "error";

//   const stateStyles = {
//     valid: {
//       wrapper: "bg-green-50 border-green-300",
//       heading: "text-green-700",
//       icon: "✅",
//       title: "ACCESS GRANTED",
//     },
//     used: {
//       wrapper: "bg-yellow-50 border-yellow-300",
//       heading: "text-yellow-700",
//       icon: "⚠️",
//       title: "ACCESS DENIED — TICKET ALREADY USED",
//     },
//     error: {
//       wrapper: "bg-red-50 border-red-300",
//       heading: "text-red-700",
//       icon: "❌",
//       title: error || result?.message || "Scan failed",
//     },
//   };

//   const style = stateStyles[displayState];

//   return (
//     <div className={`p-6 rounded-xl shadow-lg border ${style.wrapper}`}>
//       {/* Status heading */}
//       <h2 className={`text-2xl font-bold mb-4 ${style.heading}`}>
//         {style.icon} {style.title}
//       </h2>

//       {/* Ticket details — shown for valid and already-used */}
//       {(isSuccess || isAlreadyUsed) && ticket && (
//         <div className="space-y-3 text-gray-800">
//           <p>
//             <strong>Attendee:</strong> {ticket.username}
//           </p>
//           <p>
//             <strong>Ticket type:</strong> {ticket.ticketTypeName}
//           </p>
//           <p>
//             <strong>Quantity:</strong> {ticket.quantity}
//           </p>
//           <p>
//             <strong>Event:</strong> {ticket.eventTitle}
//           </p>

//           {/* Scan time — highlighted yellow if already used */}
//           <p className={isAlreadyUsed ? "font-semibold text-yellow-700" : ""}>
//             <strong>
//               {isAlreadyUsed ? "Previously scanned at:" : "Scanned at:"}
//             </strong>{" "}
//             {ticket.usedAt
//               ? new Date(ticket.usedAt).toLocaleString("en-US", {
//                   dateStyle: "medium",
//                   timeStyle: "short",
//                 })
//               : "—"}
//           </p>

//           {/* Who scanned it */}
//           {ticket.usedBy ? (
//             <p>
//               <strong>Scanned by:</strong> {ticket.usedBy.username}{" "}
//               <span className="text-gray-500 text-sm">
//                 ({ticket.usedBy.role || "user"})
//               </span>
//               {ticket.usedBy.email && (
//                 <span className="block text-sm text-gray-600 mt-1">
//                   {ticket.usedBy.email}
//                 </span>
//               )}
//             </p>
//           ) : (
//             <p className="text-gray-600 italic">Scanned by unknown user</p>
//           )}
//         </div>
//       )}

//       <button
//         onClick={onReset}
//         className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition"
//       >
//         Scan Next Ticket
//       </button>
//     </div>
//   );
// }

// src/scanner/ScanResult.jsx
export default function ScanResult({ result, error, onReset }) {
  if (!result && !error) return null;

  const isSuccess = result?.success;
  const isAlreadyUsed = result?.alreadyUsed === true;
  const ticket = result?.ticket;

  // Person physically operating the scanner device right now
  // const operatorName =
  //   localStorage.getItem("scannerUsername") || "Unknown operator";

  const displayState = isSuccess ? "valid" : isAlreadyUsed ? "used" : "error";

  const stateStyles = {
    valid: {
      wrapper: "bg-green-50 border-green-300",
      heading: "text-green-700",
      icon: "✅",
      title: "ACCESS GRANTED",
    },
    used: {
      wrapper: "bg-yellow-50 border-yellow-300",
      heading: "text-yellow-700",
      icon: "⚠️",
      title: "ACCESS DENIED — TICKET ALREADY USED",
    },
    error: {
      wrapper: "bg-red-50 border-red-300",
      heading: "text-red-700",
      icon: "❌",
      title: error || result?.message || "Scan failed",
    },
  };

  const style = stateStyles[displayState];

  return (
    <div className={`p-6 rounded-xl shadow-lg border ${style.wrapper}`}>
      {/* Status heading */}
      <h2 className={`text-2xl font-bold mb-4 ${style.heading}`}>
        {style.icon} {style.title}
      </h2>

      {/* Ticket details — shown for valid and already-used */}
      {(isSuccess || isAlreadyUsed) && ticket && (
        <div className="space-y-3 text-gray-800">
          <p>
            <strong>Attendee:</strong> {ticket.username}
          </p>
          <p>
            <strong>Ticket type:</strong> {ticket.ticketTypeName}
          </p>
          <p>
            <strong>Quantity:</strong> {ticket.quantity}
          </p>
          <p>
            <strong>Event:</strong> {ticket.eventTitle}
          </p>

          {/* Scan time — highlighted yellow if already used */}
          <p className={isAlreadyUsed ? "font-semibold text-yellow-700" : ""}>
            <strong>
              {isAlreadyUsed ? "Previously scanned at:" : "Scanned at:"}
            </strong>{" "}
            {ticket.usedAt
              ? new Date(ticket.usedAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "—"}
          </p>

          {/* Scanned by */}
          {/* {isAlreadyUsed ? (
            // Already used — show who originally scanned it (from DB)
            <p className="font-semibold text-yellow-700">
              <strong>Originally scanned by:</strong>{" "}
              {ticket.usedBy?.username || "Unknown"}
              {ticket.usedBy?.role && (
                <span className="text-yellow-600 text-sm ml-1">
                  ({ticket.usedBy.role})
                </span>
              )}
            </p>
          ) : (
            // Valid — show the current operator name from localStorage
            <p>
              <strong>Scanned by:</strong> {operatorName}
            </p>
          )
          } */}
        </div>
      )}

      <button
        onClick={onReset}
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition"
      >
        Scan Next Ticket
      </button>
    </div>
  );
}
