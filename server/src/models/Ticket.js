
// // src/models/Ticket.js
// import mongoose from "mongoose";

// const ticketSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     eventId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Event",
//       required: true,
//     },
//     ticketCategoryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },
//     ticketTypeName: {
//       type: String,
//       required: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//       min: 1,
//     },

//     // Ticket-only price (no logistics) — used for planner balance
//     ticketPrice: {
//       type: Number,
//       required: true,
//       default: 0,
//     },

//     // Full amount paid including logistics — shown to admin
//     totalPrice: {
//       type: Number,
//       required: true,
//     },

//     // Optional logistics add-on
//     logistics: {
//       tier: { type: String, default: null },
//       name: { type: String, default: null },
//       price: { type: Number, default: 0 },
//       // Admin fills these in after receiving the order
//       pickupAddress: { type: String, default: null },
//       contactPhone: { type: String, default: null },
//       contactName: { type: String, default: null },
//     },

//     status: {
//       type: String,
//       enum: [
//         "pending",
//         "paid",
//         "active",
//         "used",
//         "cancelled",
//         "failed",
//         "refunded",
//       ],
//       default: "pending",
//     },
//     usedAt: {
//       type: Date,
//       default: null,
//     },

//     usedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },

//     // ✅ UNIQUE INDEX — MongoDB-level duplicate prevention
//     // If verify is called twice simultaneously, the second insert is rejected
//     paymentReference: {
//       type: String,
//       unique: true,
//       sparse: true,
//     },

//     qrCode: String,
//     purchaseDate: Date,
//   },
//   { timestamps: true },
// );

// export default mongoose.model("Ticket", ticketSchema);


// src/models/Ticket.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticketCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    ticketTypeName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // Short 5-char code used for scanning (e.g. A3K9X)
    ticketCode: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
    },

    ticketPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    logistics: {
      tier: { type: String, default: null },
      name: { type: String, default: null },
      price: { type: Number, default: 0 },
      pickupAddress: { type: String, default: null },
      contactPhone: { type: String, default: null },
      contactName: { type: String, default: null },
    },

    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "active",
        "used",
        "cancelled",
        "failed",
        "refunded",
      ],
      default: "pending",
    },
    usedAt: {
      type: Date,
      default: null,
    },

    usedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    paymentReference: {
      type: String,
      unique: true,
      sparse: true,
    },

    qrCode: String,
    purchaseDate: Date,
  },
  { timestamps: true },
);

export default mongoose.model("Ticket", ticketSchema);