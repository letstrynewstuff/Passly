// // src/components/Logistics.jsx
// import React from "react";
// import { motion as Motion } from "framer-motion";
// import { Car, Shield, X } from "lucide-react";

// // ─── Tier definitions ─────────────────────────────────────────────────────────
// export const LOGISTICS_TIERS = [
//   {
//     id: "sedan",
//     name: "Sedan",
//     price: 58978,
//     capacity: "1–4 passengers",
//     description: "Comfortable saloon car. Perfect for small groups or couples.",
//     icon: "🚗",
//     color: "from-blue-500/20 to-blue-600/10",
//     border: "border-blue-500/30",
//     accent: "text-blue-400",
//     ring: "ring-blue-500",
//   },
//   {
//     id: "suv",
//     name: "SUV",
//     price: 103639,
//     capacity: "1–7 passengers",
//     description:
//       "Spacious SUV for families or friend groups who travel in style.",
//     icon: "🚙",
//     color: "from-purple-500/20 to-purple-600/10",
//     border: "border-purple-500/30",
//     accent: "text-purple-400",
//     ring: "ring-purple-500",
//     popular: true,
//   },
//   {
//     id: "party_bus",
//     name: "Party Bus",
//     price: 200000,
//     capacity: "Up to 20 passengers",
//     description:
//       "Arrive as a crew. Full entertainment setup — the party starts on the way.",
//     icon: "🚌",
//     color: "from-pink-500/20 to-pink-600/10",
//     border: "border-pink-500/30",
//     accent: "text-pink-400",
//     ring: "ring-pink-500",
//   },
// ];

// // ─── Component ────────────────────────────────────────────────────────────────
// const Logistics = ({ selected, onChange }) => {
//   // selected: null | tier id string ("sedan" | "suv" | "party_bus")
//   // onChange: (tier | null) => void

//   const handleSelect = (tier) => {
//     // clicking the already-selected tier deselects it
//     onChange(selected?.id === tier.id ? null : tier);
//   };

//   return (
//     <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
//       {/* Header */}
//       <div className="p-5 border-b border-gray-800">
//         <div className="flex items-center gap-2 mb-1">
//           <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
//             <Car className="w-3.5 h-3.5 text-emerald-400" />
//           </div>
//           <span className="text-sm font-medium text-gray-300">
//             Logistics Service
//             <span className="ml-2 text-xs text-gray-500 font-normal">
//               (Optional)
//             </span>
//           </span>
//         </div>

//         {/* Memo */}
//         <div className="mt-3 flex items-start gap-2 bg-emerald-500/8 border border-emerald-500/20 rounded-xl px-3 py-2.5">
//           <Shield className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
//           <p className="text-xs text-emerald-300/80 leading-relaxed">
//             Full event transport service — your driver picks you up, waits
//             during the event, and brings you safely home. Round trip included.
//           </p>
//         </div>
//       </div>

//       {/* Tier cards */}
//       <div className="p-5 space-y-3">
//         {LOGISTICS_TIERS.map((tier, i) => {
//           const isSelected = selected?.id === tier.id;
//           return (
//             <Motion.button
//               key={tier.id}
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.06 }}
//               onClick={() => handleSelect(tier)}
//               className={`w-full text-left rounded-xl border p-4 transition-all duration-200
//                 bg-gradient-to-br ${tier.color} ${tier.border}
//                 ${
//                   isSelected
//                     ? `ring-2 ${tier.ring} border-transparent`
//                     : "hover:border-gray-600"
//                 }`}
//             >
//               <div className="flex items-center gap-3">
//                 {/* Icon */}
//                 <span className="text-2xl leading-none">{tier.icon}</span>

//                 {/* Info */}
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <span
//                       className={`font-semibold text-sm ${isSelected ? tier.accent : "text-white"}`}
//                     >
//                       {tier.name}
//                     </span>
//                     {tier.popular && (
//                       <span className="text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded-full">
//                         Popular
//                       </span>
//                     )}
//                     <span className="text-xs text-gray-500">
//                       {tier.capacity}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
//                     {tier.description}
//                   </p>
//                 </div>

//                 {/* Price + selector */}
//                 <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
//                   <span className={`text-sm font-bold ${tier.accent}`}>
//                     ₦{tier.price.toLocaleString()}
//                   </span>
//                   {/* Checkbox visual */}
//                   <div
//                     className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
//                     ${
//                       isSelected
//                         ? `bg-current border-current ${tier.accent}`
//                         : "border-gray-600 bg-transparent"
//                     }`}
//                   >
//                     {isSelected && (
//                       <svg
//                         className="w-2.5 h-2.5 text-white"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={3}
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M5 13l4 4L19 7"
//                         />
//                       </svg>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </Motion.button>
//           );
//         })}

//         {/* Clear selection */}
//         {selected && (
//           <Motion.button
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             onClick={() => onChange(null)}
//             className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition py-1"
//           >
//             <X className="w-3 h-3" />
//             Remove logistics
//           </Motion.button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Logistics;


// src/components/Logistics.jsx
import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Car, Shield, X, Phone } from "lucide-react";

// ─── Tier definitions ─────────────────────────────────────────────────────────
export const LOGISTICS_TIERS = [
  {
    id: "sedan",
    name: "Sedan",
    price: 58978,
    capacity: "1–4 passengers",
    description: "Comfortable saloon car. Perfect for small groups or couples.",
    icon: "🚗",
    color: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/30",
    accent: "text-blue-400",
    ring: "ring-blue-500",
  },
  {
    id: "suv",
    name: "SUV",
    price: 103639,
    capacity: "1–7 passengers",
    description: "Spacious SUV for families or friend groups who travel in style.",
    icon: "🚙",
    color: "from-purple-500/20 to-purple-600/10",
    border: "border-purple-500/30",
    accent: "text-purple-400",
    ring: "ring-purple-500",
    popular: true,
  },
  {
    id: "party_bus",
    name: "Party Bus",
    price: 200000,
    capacity: "Up to 20 passengers",
    description: "Arrive as a crew. Full entertainment setup — the party starts on the way.",
    icon: "🚌",
    color: "from-pink-500/20 to-pink-600/10",
    border: "border-pink-500/30",
    accent: "text-pink-400",
    ring: "ring-pink-500",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
// Props:
//   selected  — null | { id, name, price, phone }
//   onChange  — (tier | null) => void
//               tier includes { id, name, price, icon, phone }

const Logistics = ({ selected, onChange }) => {
  const [phone, setPhone] = useState(selected?.phone || "");
  const [phoneError, setPhoneError] = useState("");

  const validatePhone = (value) => {
    const cleaned = value.replace(/\s/g, "");
    if (!cleaned) return "Phone number is required for logistics booking";
    if (!/^(\+234|0)[789][01]\d{8}$/.test(cleaned))
      return "Enter a valid Nigerian number (e.g. 08012345678)";
    return "";
  };

  const handleSelect = (tier) => {
    if (selected?.id === tier.id) {
      // deselect
      onChange(null);
      setPhone("");
      setPhoneError("");
    } else {
      // select new tier — carry phone if already entered
      onChange({ ...tier, phone: phone.trim() });
    }
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    const err = validatePhone(value);
    setPhoneError(err);
    // Keep parent in sync with latest phone value
    if (selected) {
      onChange({ ...selected, phone: value.trim() });
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <Car className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-sm font-medium text-gray-300">
            Logistics Service
            <span className="ml-2 text-xs text-gray-500 font-normal">(Optional)</span>
          </span>
        </div>

        <div className="mt-3 flex items-start gap-2 bg-emerald-500/8 border border-emerald-500/20 rounded-xl px-3 py-2.5">
          <Shield className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-emerald-300/80 leading-relaxed">
            Full event transport service — your driver picks you up, waits during the event,
            and brings you safely home. Round trip included.
          </p>
        </div>
      </div>

      {/* Tier cards */}
      <div className="p-5 space-y-3">
        {LOGISTICS_TIERS.map((tier, i) => {
          const isSelected = selected?.id === tier.id;
          return (
            <Motion.button
              key={tier.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => handleSelect(tier)}
              className={`w-full text-left rounded-xl border p-4 transition-all duration-200
                bg-gradient-to-br ${tier.color} ${tier.border}
                ${isSelected ? `ring-2 ${tier.ring} border-transparent` : "hover:border-gray-600"}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl leading-none">{tier.icon}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-semibold text-sm ${isSelected ? tier.accent : "text-white"}`}>
                      {tier.name}
                    </span>
                    {tier.popular && (
                      <span className="text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                    <span className="text-xs text-gray-500">{tier.capacity}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{tier.description}</p>
                </div>

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className={`text-sm font-bold ${tier.accent}`}>
                    ₦{tier.price.toLocaleString()}
                  </span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${isSelected ? `bg-current border-current ${tier.accent}` : "border-gray-600 bg-transparent"}`}
                  >
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </Motion.button>
          );
        })}

        {/* ── Phone number field — appears when a tier is selected ─────── */}
        <AnimatePresence>
          {selected && (
            <Motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="pt-1 pb-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/15 flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  Your Phone Number
                  <span className="text-red-400">*</span>
                </label>

                <div className="relative">
                  {/* Nigeria flag + prefix */}
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                    <span className="text-base leading-none">🇳🇬</span>
                    <span className="text-xs text-gray-500 font-medium">+234</span>
                    <div className="w-px h-4 bg-gray-700 mx-0.5" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="08012345678"
                    maxLength={14}
                    className={`w-full pl-20 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all
                      bg-gray-800 border ${phoneError ? "border-red-500/60 focus:border-red-500" : "border-gray-700 focus:border-purple-500"}
                      focus:ring-2 ${phoneError ? "focus:ring-red-500/20" : "focus:ring-purple-500/20"}`}
                  />
                </div>

                {phoneError ? (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <span>⚠</span> {phoneError}
                  </p>
                ) : phone && !phoneError ? (
                  <p className="mt-1.5 text-xs text-emerald-400 flex items-center gap-1">
                    <span>✓</span> Driver will contact you at this number
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-gray-600">
                    Your driver will call this number on event day
                  </p>
                )}
              </div>
            </Motion.div>
          )}
        </AnimatePresence>

        {/* Clear selection */}
        {selected && (
          <Motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => { onChange(null); setPhone(""); setPhoneError(""); }}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition py-1"
          >
            <X className="w-3 h-3" />
            Remove logistics
          </Motion.button>
        )}
      </div>
    </div>
  );
};

export default Logistics;