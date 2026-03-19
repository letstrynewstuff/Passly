// src/models/Event.js
import mongoose from "mongoose";

const ticketCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantityAvailable: {
      type: Number,
      required: true,
      min: 0,
    },
    quantitySold: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    saleStart: {
      type: Date,
    },
    saleEnd: {
      type: Date,
    },
  },
  { _id: true }, // Each ticket category gets its own ID
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    time: {
      type: String,
      trim: true,
    },
    media: {
      type: [String],
      default: [],
    },

    // 🔥 NEW PRODUCTION STRUCTURE
    ticketCategories: {
      type: [ticketCategorySchema],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    isSoldOut: {
      type: Boolean,
      default: false,
    },
    // ✅ Added for admin moderation
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "deleted"],
      default: "approved",
    },
  },
  { timestamps: true },
);
// eventSchema.pre("save", function (next) {
//   const totalAvailable = this.ticketCategories.reduce(
//     (acc, ticket) => acc + ticket.quantityAvailable,
//     0,
//   );

//   const totalSold = this.ticketCategories.reduce(
//     (acc, ticket) => acc + ticket.quantitySold,
//     0,
//   );

//   this.isSoldOut = totalAvailable > 0 && totalSold >= totalAvailable;

//   next();
// });
eventSchema.pre("save", function () {
  const totalAvailable = this.ticketCategories.reduce(
    (acc, ticket) => acc + ticket.quantityAvailable,
    0,
  );

  const totalSold = this.ticketCategories.reduce(
    (acc, ticket) => acc + ticket.quantitySold,
    0,
  );

  this.isSoldOut = totalAvailable > 0 && totalSold >= totalAvailable;
});

export default mongoose.model("Event", eventSchema);
