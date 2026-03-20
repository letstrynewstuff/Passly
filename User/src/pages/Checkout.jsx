// // src/pages/Checkout.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   initializeTicketPayment,
//   verifyTicketPayment,
// } from "../api/services/ticketApi";
// import Loader from "../components/Loader";
// import Logistics from "../components/Logistics";
// import {
//   ArrowLeft,
//   Ticket,
//   Tag,
//   Hash,
//   ShoppingBag,
//   ChevronDown,
//   CheckCircle,
// } from "lucide-react";

// const Checkout = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { event } = location.state || {};

//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedLogistics, setSelectedLogistics] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [error, setError] = useState(null);
//   const [paymentSuccess, setPaymentSuccess] = useState(false);

//   const verifyCalledRef = useRef(false);

//   useEffect(() => {
//     if (event?.ticketCategories?.length > 0) {
//       setSelectedCategory(event.ticketCategories[0]);
//     }
//   }, [event]);

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const reference = params.get("reference");
//     if (reference && !verifyCalledRef.current) {
//       verifyCalledRef.current = true;
//       handleVerifyPayment(reference);
//     }
//   }, []);

//   const ticketSubtotal = selectedCategory
//     ? selectedCategory.price * quantity
//     : 0;
//   const logisticsPrice = selectedLogistics ? selectedLogistics.price : 0;
//   const grandTotal = ticketSubtotal + logisticsPrice;

//   const handleBuyTicket = async () => {
//     if (!event || !selectedCategory) {
//       setError("Please select a ticket type.");
//       return;
//     }
//     setIsLoading(true);
//     setError(null);
//     try {
//       const payload = {
//         eventId: event._id,
//         ticketType: selectedCategory.name,
//         quantity,
//         logistics: selectedLogistics
//           ? {
//               tier: selectedLogistics.id,
//               name: selectedLogistics.name,
//               price: selectedLogistics.price,
//             }
//           : null,
//       };
//       const data = await initializeTicketPayment(payload);
//       if (data.success) {
//         window.location.href = data.authorizationUrl;
//       } else {
//         setError(data.message || "Payment initialization failed");
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerifyPayment = async (reference) => {
//     setIsVerifying(true);
//     setError(null);
//     try {
//       const data = await verifyTicketPayment(reference);
//       if (data.success) {
//         setPaymentSuccess(true);
//         window.history.replaceState(
//           {},
//           document.title,
//           window.location.pathname,
//         );
//         setTimeout(() => navigate("/feed"), 2500);
//       } else {
//         setError(data.message || "Payment verification failed");
//       }
//     } catch (err) {
//       setError(
//         err?.response?.data?.message || err.message || "Verification failed",
//       );
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   if (isVerifying) {
//     return (
//       <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 px-4">
//         <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
//         <p className="text-white font-semibold text-lg">
//           Confirming your payment…
//         </p>
//         <p className="text-gray-500 text-sm text-center">
//           Please don't close this window
//         </p>
//       </div>
//     );
//   }

//   if (paymentSuccess) {
//     return (
//       <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-5 px-4">
//         <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
//           <CheckCircle className="w-10 h-10 text-emerald-400" />
//         </div>
//         <div className="text-center">
//           <h2 className="text-white font-bold text-2xl mb-2">
//             Payment Successful!
//           </h2>
//           <p className="text-gray-400 text-sm">
//             Your ticket has been confirmed. Check your email for the QR code.
//           </p>
//         </div>
//         <p className="text-gray-600 text-xs">Redirecting you back…</p>
//       </div>
//     );
//   }

//   if (isLoading) return <Loader type="page" />;

//   if (!event) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-900">
//         <div className="text-center">
//           <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
//             <Ticket className="w-8 h-8 text-gray-500" />
//           </div>
//           <p className="text-gray-400 text-lg">No event selected.</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="mt-4 text-purple-400 hover:text-purple-300 underline underline-offset-2 text-sm"
//           >
//             Go back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const soldOut =
//     selectedCategory &&
//     selectedCategory.quantityAvailable - selectedCategory.quantitySold <= 0;

//   return (
//     <div className="min-h-screen bg-gray-950 flex flex-col">
//       {/* Top bar */}
//       <div className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/60 px-4 py-4 flex items-center gap-3">
//         <button
//           onClick={() => navigate(-1)}
//           className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition text-gray-300"
//         >
//           <ArrowLeft className="w-5 h-5" />
//         </button>
//         <span className="text-white font-semibold text-base tracking-wide">
//           Checkout
//         </span>
//       </div>

//       <div className="flex-1 flex items-start justify-center px-4 py-8">
//         <div className="w-full max-w-md space-y-5">
//           {/* Event Banner */}
//           <div className="rounded-2xl overflow-hidden relative shadow-xl shadow-purple-900/20">
//             {event.media?.[0] ? (
//               <>
//                 <img
//                   src={event.media[0]}
//                   alt={event.title}
//                   className="w-full h-40 object-cover"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
//               </>
//             ) : (
//               <div className="w-full h-40 bg-gradient-to-br from-purple-900/60 to-gray-800" />
//             )}
//             <div className="absolute bottom-0 left-0 right-0 p-4">
//               <p className="text-xs font-medium text-purple-400 uppercase tracking-widest mb-1">
//                 Event
//               </p>
//               <h2 className="text-white font-bold text-xl leading-tight">
//                 {event.title}
//               </h2>
//             </div>
//           </div>

//           {/* Error */}
//           {error && (
//             <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-sm flex items-start gap-2">
//               <span className="mt-0.5 shrink-0">⚠</span>
//               <span>{error}</span>
//             </div>
//           )}

//           {/* Ticket Form */}
//           <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
//             {/* Ticket Type */}
//             <div className="p-5 border-b border-gray-800">
//               <div className="flex items-center gap-2 mb-3">
//                 <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center">
//                   <Tag className="w-3.5 h-3.5 text-purple-400" />
//                 </div>
//                 <label className="text-sm font-medium text-gray-300">
//                   Ticket Type
//                 </label>
//               </div>
//               <div className="relative">
//                 <select
//                   value={selectedCategory?._id || ""}
//                   onChange={(e) => {
//                     const cat = event.ticketCategories.find(
//                       (c) => c._id === e.target.value,
//                     );
//                     setSelectedCategory(cat);
//                   }}
//                   className="w-full appearance-none bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-4 py-3 pr-10 text-sm outline-none transition cursor-pointer"
//                 >
//                   {event.ticketCategories.map((cat) => (
//                     <option
//                       key={cat._id}
//                       value={cat._id}
//                       disabled={cat.quantityAvailable - cat.quantitySold <= 0}
//                     >
//                       {cat.name} — ₦{cat.price.toLocaleString()}
//                       {cat.quantityAvailable - cat.quantitySold <= 0
//                         ? " (Sold Out)"
//                         : ""}
//                     </option>
//                   ))}
//                 </select>
//                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
//               </div>
//             </div>

//             {/* Quantity */}
//             <div className="p-5 border-b border-gray-800">
//               <div className="flex items-center gap-2 mb-3">
//                 <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center">
//                   <Hash className="w-3.5 h-3.5 text-purple-400" />
//                 </div>
//                 <label className="text-sm font-medium text-gray-300">
//                   Quantity
//                 </label>
//               </div>
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//                   className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold text-lg flex items-center justify-center transition"
//                 >
//                   −
//                 </button>
//                 <div className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-center text-white font-semibold text-lg">
//                   {quantity}
//                 </div>
//                 <button
//                   onClick={() =>
//                     setQuantity((q) =>
//                       Math.min(
//                         selectedCategory
//                           ? selectedCategory.quantityAvailable -
//                               selectedCategory.quantitySold
//                           : 1,
//                         q + 1,
//                       ),
//                     )
//                   }
//                   className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold text-lg flex items-center justify-center transition"
//                 >
//                   +
//                 </button>
//               </div>
//               {selectedCategory && (
//                 <p className="text-xs text-gray-500 mt-2">
//                   {selectedCategory.quantityAvailable -
//                     selectedCategory.quantitySold}{" "}
//                   tickets remaining
//                 </p>
//               )}
//             </div>

//             {/* Order Summary — logistics line updates here as user selects below */}
//             <div className="p-5">
//               <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">
//                 Order Summary
//               </p>
//               <div className="space-y-2 text-sm">
//                 {selectedCategory && (
//                   <div className="flex justify-between text-gray-400">
//                     <span>
//                       {selectedCategory.name} × {quantity}
//                     </span>
//                     <span>₦{ticketSubtotal.toLocaleString()}</span>
//                   </div>
//                 )}
//                 {selectedLogistics && (
//                   <div className="flex justify-between text-gray-400">
//                     <span>
//                       {selectedLogistics.icon} {selectedLogistics.name}{" "}
//                       Transport
//                     </span>
//                     <span>₦{logisticsPrice.toLocaleString()}</span>
//                   </div>
//                 )}
//                 <div className="h-px bg-gray-800 my-2" />
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-300 font-medium">Total</span>
//                   <span className="text-2xl font-bold text-purple-400">
//                     ₦{grandTotal.toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ✅ Logistics moved ABOVE buy button so total reflects selection before paying */}
//           <Logistics
//             selected={selectedLogistics}
//             onChange={setSelectedLogistics}
//           />

//           {/* Buy Button */}
//           <button
//             onClick={handleBuyTicket}
//             disabled={!selectedCategory || soldOut || isLoading}
//             className="w-full py-4 rounded-2xl font-semibold text-white text-base flex items-center justify-center gap-2.5 transition-all
//               bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400
//               active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed
//               shadow-lg shadow-purple-900/40"
//           >
//             <ShoppingBag className="w-5 h-5" />
//             {soldOut ? "Sold Out" : "Buy Ticket"}
//           </button>

//           <p className="text-center text-xs text-gray-600 pb-4">
//             Secured by Paystack · Your data is protected
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;


// src/pages/Checkout.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  initializeTicketPayment,
  verifyTicketPayment,
} from "../api/services/ticketApi";
import Loader from "../components/Loader";
import Logistics from "../components/Logistics";
import {
  ArrowLeft,
  Ticket,
  Tag,
  Hash,
  ShoppingBag,
  ChevronDown,
  CheckCircle,
} from "lucide-react";

const Checkout = () => {
  const location = useLocation();
  const navigate  = useNavigate();

  const { event } = location.state || {};

  const [selectedCategory,  setSelectedCategory]  = useState(null);
  const [quantity,           setQuantity]           = useState(1);
  const [selectedLogistics,  setSelectedLogistics]  = useState(null);
  const [isLoading,          setIsLoading]          = useState(false);
  const [isVerifying,        setIsVerifying]        = useState(false);
  const [error,              setError]              = useState(null);
  const [paymentSuccess,     setPaymentSuccess]     = useState(false);

  const verifyCalledRef = useRef(false);

  useEffect(() => {
    if (event?.ticketCategories?.length > 0) {
      setSelectedCategory(event.ticketCategories[0]);
    }
  }, [event]);

  useEffect(() => {
    const params    = new URLSearchParams(location.search);
    const reference = params.get("reference");
    if (reference && !verifyCalledRef.current) {
      verifyCalledRef.current = true;
      handleVerifyPayment(reference);
    }
  }, []);

  const ticketSubtotal = selectedCategory ? selectedCategory.price * quantity : 0;
  const logisticsPrice = selectedLogistics ? selectedLogistics.price : 0;
  const grandTotal     = ticketSubtotal + logisticsPrice;

  const handleBuyTicket = async () => {
    if (!event || !selectedCategory) {
      setError("Please select a ticket type.");
      return;
    }

    // ✅ If logistics selected, phone is required and must be valid
    if (selectedLogistics) {
      const phone   = selectedLogistics.phone?.trim() || "";
      const cleaned = phone.replace(/\s/g, "");
      if (!cleaned) {
        setError("Please enter your phone number for the logistics service.");
        return;
      }
      if (!/^(\+234|0)[789][01]\d{8}$/.test(cleaned)) {
        setError("Please enter a valid Nigerian phone number (e.g. 08012345678).");
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        eventId:    event._id,
        ticketType: selectedCategory.name,
        quantity,
        logistics: selectedLogistics
          ? {
              tier:  selectedLogistics.id,
              name:  selectedLogistics.name,
              price: selectedLogistics.price,
              // ✅ phone number forwarded to backend with the rest of logistics
              contactPhone: selectedLogistics.phone?.trim() || "",
            }
          : null,
      };

      const data = await initializeTicketPayment(payload);
      if (data.success) {
        window.location.href = data.authorizationUrl;
      } else {
        setError(data.message || "Payment initialization failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPayment = async (reference) => {
    setIsVerifying(true);
    setError(null);
    try {
      const data = await verifyTicketPayment(reference);
      if (data.success) {
        setPaymentSuccess(true);
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(() => navigate("/feed"), 2500);
      } else {
        setError(data.message || "Payment verification failed");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-white font-semibold text-lg">Confirming your payment…</p>
        <p className="text-gray-500 text-sm text-center">Please don't close this window</p>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="text-center">
          <h2 className="text-white font-bold text-2xl mb-2">Payment Successful!</h2>
          <p className="text-gray-400 text-sm">
            Your ticket has been confirmed. Check your email for the QR code.
          </p>
        </div>
        <p className="text-gray-600 text-xs">Redirecting you back…</p>
      </div>
    );
  }

  if (isLoading) return <Loader type="page" />;

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
            <Ticket className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400 text-lg">No event selected.</p>
          <button onClick={() => navigate(-1)}
            className="mt-4 text-purple-400 hover:text-purple-300 underline underline-offset-2 text-sm"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const soldOut = selectedCategory &&
    selectedCategory.quantityAvailable - selectedCategory.quantitySold <= 0;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/60 px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition text-gray-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-white font-semibold text-base tracking-wide">Checkout</span>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-5">

          {/* Event Banner */}
          <div className="rounded-2xl overflow-hidden relative shadow-xl shadow-purple-900/20">
            {event.media?.[0] ? (
              <>
                <img src={event.media[0]} alt={event.title} className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
              </>
            ) : (
              <div className="w-full h-40 bg-gradient-to-br from-purple-900/60 to-gray-800" />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-xs font-medium text-purple-400 uppercase tracking-widest mb-1">Event</p>
              <h2 className="text-white font-bold text-xl leading-tight">{event.title}</h2>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-sm flex items-start gap-2">
              <span className="mt-0.5 shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Ticket Form */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">

            {/* Ticket Type */}
            <div className="p-5 border-b border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center">
                  <Tag className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <label className="text-sm font-medium text-gray-300">Ticket Type</label>
              </div>
              <div className="relative">
                <select
                  value={selectedCategory?._id || ""}
                  onChange={(e) => {
                    const cat = event.ticketCategories.find((c) => c._id === e.target.value);
                    setSelectedCategory(cat);
                  }}
                  className="w-full appearance-none bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-4 py-3 pr-10 text-sm outline-none transition cursor-pointer"
                >
                  {event.ticketCategories.map((cat) => (
                    <option key={cat._id} value={cat._id} disabled={cat.quantityAvailable - cat.quantitySold <= 0}>
                      {cat.name} — ₦{cat.price.toLocaleString()}
                      {cat.quantityAvailable - cat.quantitySold <= 0 ? " (Sold Out)" : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Quantity */}
            <div className="p-5 border-b border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center">
                  <Hash className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <label className="text-sm font-medium text-gray-300">Quantity</label>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold text-lg flex items-center justify-center transition"
                >−</button>
                <div className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-center text-white font-semibold text-lg">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity((q) => Math.min(selectedCategory ? selectedCategory.quantityAvailable - selectedCategory.quantitySold : 1, q + 1))}
                  className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold text-lg flex items-center justify-center transition"
                >+</button>
              </div>
              {selectedCategory && (
                <p className="text-xs text-gray-500 mt-2">
                  {selectedCategory.quantityAvailable - selectedCategory.quantitySold} tickets remaining
                </p>
              )}
            </div>

            {/* Order Summary */}
            <div className="p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">Order Summary</p>
              <div className="space-y-2 text-sm">
                {selectedCategory && (
                  <div className="flex justify-between text-gray-400">
                    <span>{selectedCategory.name} × {quantity}</span>
                    <span>₦{ticketSubtotal.toLocaleString()}</span>
                  </div>
                )}
                {selectedLogistics && (
                  <div className="flex justify-between text-gray-400">
                    <span>{selectedLogistics.icon} {selectedLogistics.name} Transport</span>
                    <span>₦{logisticsPrice.toLocaleString()}</span>
                  </div>
                )}
                <div className="h-px bg-gray-800 my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Total</span>
                  <span className="text-2xl font-bold text-purple-400">₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Logistics — phone field is inside this component */}
          <Logistics selected={selectedLogistics} onChange={setSelectedLogistics} />

          {/* Buy Button */}
          <button
            onClick={handleBuyTicket}
            disabled={!selectedCategory || soldOut || isLoading}
            className="w-full py-4 rounded-2xl font-semibold text-white text-base flex items-center justify-center gap-2.5 transition-all
              bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400
              active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed
              shadow-lg shadow-purple-900/40"
          >
            <ShoppingBag className="w-5 h-5" />
            {soldOut ? "Sold Out" : "Buy Ticket"}
          </button>

          <p className="text-center text-xs text-gray-600 pb-4">
            Secured by Paystack · Your data is protected
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;