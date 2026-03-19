// scripts/migrate-ticket-codes.js
// Run once: node scripts/migrate-ticket-codes.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Ticket from "../models/Ticket.js";

dotenv.config();

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const generateCode = () =>
  Array.from(
    { length: 5 },
    () => CHARS[Math.floor(Math.random() * CHARS.length)],
  ).join("");

const migrate = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to:", mongoose.connection.name);

  // Only tickets that don't have a ticketCode yet
  const tickets = await Ticket.find({ ticketCode: { $exists: false } });
  console.log(`Found ${tickets.length} tickets without a ticketCode`);

  const usedCodes = new Set(
    (await Ticket.find({ ticketCode: { $exists: true } }, "ticketCode")).map(
      (t) => t.ticketCode,
    ),
  );

  let updated = 0;
  for (const ticket of tickets) {
    let code;
    do {
      code = generateCode();
    } while (usedCodes.has(code));

    usedCodes.add(code);
    ticket.ticketCode = code;
    await ticket.save();
    updated++;
    console.log(`✅ ${ticket._id} → ${code}`);
  }

  console.log(`\nDone. ${updated} tickets updated.`);
  process.exit(0);
};

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
