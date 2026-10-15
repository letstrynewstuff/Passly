// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Event from "../models/Event.js";
// import Comment from "../models/Comment.js";

// dotenv.config();

// const MONGODB_URI = process.env.MONGO_URI;

// // Run with --reset to delete existing events/comments first
// const RESET = process.argv.includes("--reset");

// // TEMP IDS FOR SEEDING (FAKE BUT VALID)
// const TEMP_USER_ID = new mongoose.Types.ObjectId();
// const TEMP_ADMIN_ID = new mongoose.Types.ObjectId();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(MONGODB_URI);
//     console.log("MongoDB connected for seeding...");
//   } catch (err) {
//     console.error("DB connection error:", err);
//     process.exit(1);
//   }
// };

// // Descriptions shown on the buy-ticket screen
// const TICKET_DESCRIPTIONS = {
//   regular: "General admission",
//   vip: "VIP access with priority entry and a reserved area",
//   presale: "Early bird ticket at a discounted price",
//   "stage pass": "Front of stage access",
// };

// // converts { regular: 3000, VIP: 15000 } into your ticketCategories format
// const convertTickets = (t = {}) =>
//   Object.entries(t).map(([type, price]) => {
//     const key = type.toLowerCase();
//     return {
//       name: key === "vip" ? "VIP" : key.charAt(0).toUpperCase() + key.slice(1),
//       price,
//       description: TICKET_DESCRIPTIONS[key] || "",
//       quantityAvailable: 100,
//       quantitySold: 0,
//     };
//   });

// // 20 hardcoded events with comments
// const events = [
//   {
//     id: "1",
//     name: "OUTSYDCVLTR & FRIENDS All White Edition",
//     date: "August 1, 2026",
//     time: "7:00 PM",
//     location: "Victor Uwaifo Creative Hub, Benin City",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample1.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample1.mp4",
//     ticketTypes: { regular: 3000, VIP: 15000, presale: 0 },
//     comments: [
//       { username: "Alice", content: "Can't wait for this!" },
//       { username: "Bob", content: "Who's performing?" },
//       { username: "Charlie", content: "Gonna grab my presale ticket!" },
//       { username: "Diana", content: "Such a vibe last time!" },
//       { username: "Eve", content: "Any age restrictions?" },
//     ],
//   },
//   {
//     id: "2",
//     name: "Wassup Benin",
//     date: "September 12, 2026",
//     time: "8:00 PM",
//     location: "Victor Uwaifo Creative Hub, Benin City",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample2.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample2.mp4",
//     ticketTypes: { regular: 2000, VIP: 12000, presale: 0 },
//     comments: [
//       { username: "Frank", content: "Heard this event is fire!" },
//       { username: "Grace", content: "Booking my VIP ticket now!" },
//       { username: "Hannah", content: "Can't wait to see the lineup!" },
//       { username: "Ian", content: "Will there be after-party?" },
//       { username: "Jill", content: "This is gonna be amazing!" },
//     ],
//   },
//   {
//     id: "3",
//     name: "Benin Nightlife Fest",
//     date: "October 5, 2026",
//     time: "9:00 PM",
//     location: "City Center Arena, Benin City",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample3.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample3.mp4",
//     ticketTypes: { regular: 2500, VIP: 14000, presale: 500 },
//     comments: [
//       { username: "Isaac", content: "This is gonna be epic!" },
//       { username: "Jade", content: "Can I bring friends?" },
//       { username: "Kevin", content: "Best DJ lineup ever!" },
//       { username: "Lara", content: "Can't wait to dance!" },
//       { username: "Mia", content: "Are there discounts?" },
//     ],
//   },
//   {
//     id: "4",
//     name: "Amapiano Vibes Night",
//     date: "October 20, 2026",
//     time: "7:00 PM",
//     location: "Edo Cultural Center",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample4.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample4.mp4",
//     ticketTypes: { regular: 3500, VIP: 18000, presale: 500 },
//     comments: [
//       { username: "Lara", content: "Amapiano all night long!" },
//       { username: "Mia", content: "Can't wait to dance!" },
//       { username: "Nina", content: "Is there parking?" },
//       { username: "Oscar", content: "This is my favorite genre!" },
//       { username: "Paul", content: "Bring friends, this will be lit!" },
//     ],
//   },
//   {
//     id: "5",
//     name: "Rema Live in Benin",
//     date: "November 3, 2026",
//     time: "8:00 PM",
//     location: "Victor Uwaifo Creative Hub",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample5.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample5.mp4",
//     ticketTypes: { regular: 4000, VIP: 20000, presale: 1000 },
//     comments: [
//       { username: "Oscar", content: "Finally seeing Rema live!" },
//       { username: "Paul", content: "Presale tickets gone fast!" },
//       { username: "Quinn", content: "My friends and I are coming!" },
//       { username: "Rita", content: "This will be epic!" },
//       { username: "Steve", content: "Who's opening act?" },
//     ],
//   },
//   {
//     id: "6",
//     name: "Shallipopi Night",
//     date: "November 15, 2026",
//     time: "7:30 PM",
//     location: "City Lounge, Benin",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample6.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample6.mp4",
//     ticketTypes: { regular: 2500, VIP: 15000, presale: 500 },
//     comments: [
//       { username: "Rita", content: "This will be lit!" },
//       { username: "Steve", content: "Are drinks included?" },
//       { username: "Tina", content: "Can't wait!" },
//       { username: "Uma", content: "This is gonna be my night!" },
//       { username: "Victor", content: "Booking now!" },
//     ],
//   },
//   {
//     id: "7",
//     name: "Wizkid Live Experience",
//     date: "November 28, 2026",
//     time: "9:00 PM",
//     location: "Benin Stadium",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample7.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample7.mp4",
//     ticketTypes: { regular: 5000, VIP: 25000, presale: 1000 },
//     comments: [
//       { username: "Will", content: "Wizkid is a legend!" },
//       { username: "Xena", content: "VIP tickets booked!" },
//       { username: "Yara", content: "Can't miss this!" },
//       { username: "Zack", content: "Who's performing opening?" },
//     ],
//   },
//   {
//     id: "8",
//     name: "Burna Boy Concert",
//     date: "December 5, 2026",
//     time: "8:00 PM",
//     location: "Victor Uwaifo Creative Hub",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample8.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample8.mp4",
//     ticketTypes: { regular: 6000, VIP: 30000, presale: 1500 },
//     comments: [
//       { username: "Alice", content: "Finally Burna live!" },
//       { username: "Bob", content: "Ticket secured!" },
//       { username: "Charlie", content: "Friends coming too!" },
//       { username: "Diana", content: "Let's goooo!" },
//     ],
//   },
//   {
//     id: "9",
//     name: "Edo Music Festival",
//     date: "December 12, 2026",
//     time: "7:00 PM",
//     location: "City Cultural Center",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample9.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample9.mp4",
//     ticketTypes: { regular: 3000, VIP: 15000, presale: 500 },
//     comments: [
//       { username: "Eve", content: "Such a vibe!" },
//       { username: "Frank", content: "Can't wait!" },
//       { username: "Grace", content: "Who's performing?" },
//     ],
//   },
//   {
//     id: "10",
//     name: "Amapiano Sunset Party",
//     date: "December 20, 2026",
//     time: "6:00 PM",
//     location: "Beachfront Lounge",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample10.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample10.mp4",
//     ticketTypes: { regular: 2500, VIP: 12000, presale: 0 },
//     comments: [
//       { username: "Hannah", content: "Perfect vibe!" },
//       { username: "Ian", content: "Can't wait to dance!" },
//       { username: "Jill", content: "Booking now!" },
//     ],
//   },
//   {
//     id: "11",
//     name: "DJ Spinall Night",
//     date: "January 5, 2027",
//     time: "8:00 PM",
//     location: "Victor Uwaifo Hub",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample11.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample11.mp4",
//     ticketTypes: { regular: 3500, VIP: 18000, presale: 500 },
//     comments: [
//       { username: "Kevin", content: "DJ Spinall hype!" },
//       { username: "Lara", content: "VIP booked!" },
//       { username: "Mia", content: "This is gonna be fun!" },
//     ],
//   },
//   {
//     id: "12",
//     name: "Benin Jazz Night",
//     date: "January 15, 2027",
//     time: "7:30 PM",
//     location: "City Jazz Club",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample12.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample12.mp4",
//     ticketTypes: { regular: 2000, VIP: 12000, presale: 0 },
//     comments: [
//       { username: "Nina", content: "Jazz vibes are unmatched!" },
//       { username: "Oscar", content: "Can't wait!" },
//       { username: "Paul", content: "Bringing friends!" },
//     ],
//   },
//   {
//     id: "13",
//     name: "Amapiano Kings",
//     date: "February 1, 2027",
//     time: "8:00 PM",
//     location: "Benin City Stadium",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample13.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample13.mp4",
//     ticketTypes: { regular: 4000, VIP: 20000, presale: 1000 },
//     comments: [
//       { username: "Quinn", content: "Best night ever!" },
//       { username: "Rita", content: "VIP tickets booked!" },
//       { username: "Steve", content: "Who’s performing first?" },
//     ],
//   },
//   {
//     id: "14",
//     name: "Edo Festive Night",
//     date: "February 14, 2027",
//     time: "7:00 PM",
//     location: "City Cultural Center",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample14.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample14.mp4",
//     ticketTypes: { regular: 3000, VIP: 15000, presale: 500 },
//     comments: [
//       { username: "Tina", content: "Can’t wait!" },
//       { username: "Uma", content: "Who’s performing?" },
//       { username: "Victor", content: "Booking now!" },
//     ],
//   },
//   {
//     id: "15",
//     name: "Rema Amapiano Live",
//     date: "March 1, 2027",
//     time: "8:00 PM",
//     location: "Victor Uwaifo Hub",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample15.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample15.mp4",
//     ticketTypes: { regular: 4500, VIP: 22000, presale: 1000 },
//     comments: [
//       { username: "Alice", content: "Finally Rema!" },
//       { username: "Bob", content: "VIP booked!" },
//       { username: "Charlie", content: "Best friends coming!" },
//     ],
//   },
//   {
//     id: "16",
//     name: "Shallipopi Vibes",
//     date: "March 10, 2027",
//     time: "7:30 PM",
//     location: "City Lounge Benin",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample16.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample16.mp4",
//     ticketTypes: { regular: 2500, VIP: 15000, presale: 500 },
//     comments: [
//       { username: "Diana", content: "Excited!" },
//       { username: "Eve", content: "Can't wait!" },
//       { username: "Frank", content: "Booking my VIP!" },
//     ],
//   },
//   {
//     id: "17",
//     name: "Wizkid Star Night",
//     date: "March 20, 2027",
//     time: "8:00 PM",
//     location: "Benin Stadium",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample17.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample17.mp4",
//     ticketTypes: { regular: 5000, VIP: 25000, presale: 1000 },
//     comments: [
//       { username: "Grace", content: "Wizkid hype!" },
//       { username: "Hannah", content: "Booking VIP!" },
//       { username: "Ian", content: "Friends joining!" },
//     ],
//   },
//   {
//     id: "18",
//     name: "Burna Boy Vibes",
//     date: "April 1, 2027",
//     time: "9:00 PM",
//     location: "Victor Uwaifo Hub",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample18.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample18.mp4",
//     ticketTypes: { regular: 6000, VIP: 30000, presale: 1500 },
//     comments: [
//       { username: "Jade", content: "Finally Burna!" },
//       { username: "Kevin", content: "VIP booked!" },
//       { username: "Lara", content: "Friends coming!" },
//     ],
//   },
//   {
//     id: "19",
//     name: "Edo Cultural Night",
//     date: "April 15, 2027",
//     time: "7:00 PM",
//     location: "City Cultural Center",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample19.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample19.mp4",
//     ticketTypes: { regular: 3500, VIP: 18000, presale: 500 },
//     comments: [
//       { username: "Mia", content: "Excited!" },
//       { username: "Nina", content: "Can’t wait!" },
//       { username: "Oscar", content: "Booking now!" },
//     ],
//   },
//   {
//     id: "20",
//     name: "Amapiano Kings Finale",
//     date: "April 30, 2027",
//     time: "8:00 PM",
//     location: "Benin City Stadium",
//     imageUrl: "https://res.cloudinary.com/demo/image/upload/sample20.jpg",
//     videoUrl: "https://res.cloudinary.com/demo/video/upload/sample20.mp4",
//     ticketTypes: { regular: 4500, VIP: 22000, presale: 1000 },
//     comments: [
//       { username: "Paul", content: "Finale hype!" },
//       { username: "Quinn", content: "Booking VIP!" },
//       { username: "Rita", content: "Friends joining!" },
//     ],
//   },
// ];

// const seedEvents = async () => {
//   try {
//     await connectDB();

//     if (RESET) {
//       await Event.deleteMany({});
//       await Comment.deleteMany({});
//       console.log("Old events and comments deleted (--reset)");
//     }

//     let created = 0;
//     let skipped = 0;

//     for (let event of events) {
//       const eventDate = new Date(event.date);

//       // skip if this event is already in the database
//       const exists = await Event.findOne({
//         title: event.name,
//         date: eventDate,
//       });
//       if (exists) {
//         skipped++;
//         continue;
//       }

//       const savedEvent = await Event.create({
//         title: event.name,
//         description: `${event.name} at ${event.location}`,
//         location: event.location,
//         date: eventDate,
//         time: event.time,
//         media: [event.imageUrl, event.videoUrl],
//         ticketCategories: convertTickets(event.ticketTypes),
//         createdBy: TEMP_ADMIN_ID,
//         isPublished: true,
//         status: "approved",
//       });

//       for (let c of event.comments) {
//         await Comment.create({
//           event: savedEvent._id,
//           user: TEMP_USER_ID,
//           content: c.content,
//           createdAt: new Date(),
//         });
//       }

//       created++;
//     }

//     console.log(
//       `✅ Seeded ${created} events with comments. Skipped ${skipped} existing.`,
//     );
//     process.exit(0);
//   } catch (err) {
//     console.error("Seeding error:", err);
//     process.exit(1);
//   }
// };

// seedEvents();

import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Event from "../models/Event.js";
import Comment from "../models/Comment.js";

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;
const BASE_URL = (process.env.BASE_URL || "http://localhost:5000").replace(
  /\/$/,
  "",
);

// Run with --reset to delete existing events/comments first
const RESET = process.argv.includes("--reset");

// TEMP IDS FOR SEEDING (FAKE BUT VALID)
const TEMP_USER_ID = new mongoose.Types.ObjectId();
const TEMP_ADMIN_ID = new mongoose.Types.ObjectId();

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected for seeding...");
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
};

// Local flyer images in server/uploads/events, keyed by event id
const IMAGE_FILES = {
  1: "01_all_white_party.png",
  2: "02_wassup_benin.png",
  3: "03_benin_nightlife_fest.png",
  4: "04_amapiano_vibes_night.png",
  5: "05_rema_live.png",
  6: "06_shallipopi_night.png",
  7: "07_wizkid_live.png",
  8: "08_burna_boy_concert.png",
  9: "09_edo_music_festival.png",
  10: "10_amapiano_sunset_party.png",
  11: "11_dj_spinall_night.png",
  12: "12_benin_jazz_night.png",
  13: "13_amapiano_kings.png",
  14: "14_edo_festive_night.png",
  15: "15_rema_amapiano_live.png",
  16: "16_shallipopi_vibes.png",
  17: "17_wizkid_star_night.png",
  18: "18_burna_boy_vibes.png",
  19: "19_edo_cultural_night.png",
  20: "20_amapiano_kings_finale.png",
};

// full URL served by express.static("/uploads") in app.js
const getImageUrl = (id) => {
  const file = IMAGE_FILES[id];
  const filePath = path.join(process.cwd(), "uploads", "events", file);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Missing image file: uploads/events/${file}`);
  }
  return `${BASE_URL}/uploads/events/${file}`;
};

// Descriptions shown on the buy-ticket screen
const TICKET_DESCRIPTIONS = {
  regular: "General admission",
  vip: "VIP access with priority entry and a reserved area",
  presale: "Early bird ticket at a discounted price",
  "stage pass": "Front of stage access",
};

// converts { regular: 3000, VIP: 15000 } into your ticketCategories format
const convertTickets = (t = {}) =>
  Object.entries(t).map(([type, price]) => {
    const key = type.toLowerCase();
    return {
      name: key === "vip" ? "VIP" : key.charAt(0).toUpperCase() + key.slice(1),
      price,
      description: TICKET_DESCRIPTIONS[key] || "",
      quantityAvailable: 100,
      quantitySold: 0,
    };
  });

// 20 hardcoded events with comments
const events = [
  {
    id: "1",
    name: "OUTSYDCVLTR & FRIENDS All White Edition",
    date: "August 1, 2026",
    time: "7:00 PM",
    location: "Victor Uwaifo Creative Hub, Benin City",
    ticketTypes: { regular: 3000, VIP: 15000, presale: 0 },
    comments: [
      { username: "Alice", content: "Can't wait for this!" },
      { username: "Bob", content: "Who's performing?" },
      { username: "Charlie", content: "Gonna grab my presale ticket!" },
      { username: "Diana", content: "Such a vibe last time!" },
      { username: "Eve", content: "Any age restrictions?" },
    ],
  },
  {
    id: "2",
    name: "Wassup Benin",
    date: "September 12, 2026",
    time: "8:00 PM",
    location: "Victor Uwaifo Creative Hub, Benin City",
    ticketTypes: { regular: 2000, VIP: 12000, presale: 0 },
    comments: [
      { username: "Frank", content: "Heard this event is fire!" },
      { username: "Grace", content: "Booking my VIP ticket now!" },
      { username: "Hannah", content: "Can't wait to see the lineup!" },
      { username: "Ian", content: "Will there be after-party?" },
      { username: "Jill", content: "This is gonna be amazing!" },
    ],
  },
  {
    id: "3",
    name: "Benin Nightlife Fest",
    date: "October 5, 2026",
    time: "9:00 PM",
    location: "City Center Arena, Benin City",
    ticketTypes: { regular: 2500, VIP: 14000, presale: 500 },
    comments: [
      { username: "Isaac", content: "This is gonna be epic!" },
      { username: "Jade", content: "Can I bring friends?" },
      { username: "Kevin", content: "Best DJ lineup ever!" },
      { username: "Lara", content: "Can't wait to dance!" },
      { username: "Mia", content: "Are there discounts?" },
    ],
  },
  {
    id: "4",
    name: "Amapiano Vibes Night",
    date: "October 20, 2026",
    time: "7:00 PM",
    location: "Edo Cultural Center",
    ticketTypes: { regular: 3500, VIP: 18000, presale: 500 },
    comments: [
      { username: "Lara", content: "Amapiano all night long!" },
      { username: "Mia", content: "Can't wait to dance!" },
      { username: "Nina", content: "Is there parking?" },
      { username: "Oscar", content: "This is my favorite genre!" },
      { username: "Paul", content: "Bring friends, this will be lit!" },
    ],
  },
  {
    id: "5",
    name: "Rema Live in Benin",
    date: "November 3, 2026",
    time: "8:00 PM",
    location: "Victor Uwaifo Creative Hub",
    ticketTypes: { regular: 4000, VIP: 20000, presale: 1000 },
    comments: [
      { username: "Oscar", content: "Finally seeing Rema live!" },
      { username: "Paul", content: "Presale tickets gone fast!" },
      { username: "Quinn", content: "My friends and I are coming!" },
      { username: "Rita", content: "This will be epic!" },
      { username: "Steve", content: "Who's opening act?" },
    ],
  },
  {
    id: "6",
    name: "Shallipopi Night",
    date: "November 15, 2026",
    time: "7:30 PM",
    location: "City Lounge, Benin",
    ticketTypes: { regular: 2500, VIP: 15000, presale: 500 },
    comments: [
      { username: "Rita", content: "This will be lit!" },
      { username: "Steve", content: "Are drinks included?" },
      { username: "Tina", content: "Can't wait!" },
      { username: "Uma", content: "This is gonna be my night!" },
      { username: "Victor", content: "Booking now!" },
    ],
  },
  {
    id: "7",
    name: "Wizkid Live Experience",
    date: "November 28, 2026",
    time: "9:00 PM",
    location: "Benin Stadium",
    ticketTypes: { regular: 5000, VIP: 25000, presale: 1000 },
    comments: [
      { username: "Will", content: "Wizkid is a legend!" },
      { username: "Xena", content: "VIP tickets booked!" },
      { username: "Yara", content: "Can't miss this!" },
      { username: "Zack", content: "Who's performing opening?" },
    ],
  },
  {
    id: "8",
    name: "Burna Boy Concert",
    date: "December 5, 2026",
    time: "8:00 PM",
    location: "Victor Uwaifo Creative Hub",
    ticketTypes: { regular: 6000, VIP: 30000, presale: 1500 },
    comments: [
      { username: "Alice", content: "Finally Burna live!" },
      { username: "Bob", content: "Ticket secured!" },
      { username: "Charlie", content: "Friends coming too!" },
      { username: "Diana", content: "Let's goooo!" },
    ],
  },
  {
    id: "9",
    name: "Edo Music Festival",
    date: "December 12, 2026",
    time: "7:00 PM",
    location: "City Cultural Center",
    ticketTypes: { regular: 3000, VIP: 15000, presale: 500 },
    comments: [
      { username: "Eve", content: "Such a vibe!" },
      { username: "Frank", content: "Can't wait!" },
      { username: "Grace", content: "Who's performing?" },
    ],
  },
  {
    id: "10",
    name: "Amapiano Sunset Party",
    date: "December 20, 2026",
    time: "6:00 PM",
    location: "Beachfront Lounge",
    ticketTypes: { regular: 2500, VIP: 12000, presale: 0 },
    comments: [
      { username: "Hannah", content: "Perfect vibe!" },
      { username: "Ian", content: "Can't wait to dance!" },
      { username: "Jill", content: "Booking now!" },
    ],
  },
  {
    id: "11",
    name: "DJ Spinall Night",
    date: "January 5, 2027",
    time: "8:00 PM",
    location: "Victor Uwaifo Hub",
    ticketTypes: { regular: 3500, VIP: 18000, presale: 500 },
    comments: [
      { username: "Kevin", content: "DJ Spinall hype!" },
      { username: "Lara", content: "VIP booked!" },
      { username: "Mia", content: "This is gonna be fun!" },
    ],
  },
  {
    id: "12",
    name: "Benin Jazz Night",
    date: "January 15, 2027",
    time: "7:30 PM",
    location: "City Jazz Club",
    ticketTypes: { regular: 2000, VIP: 12000, presale: 0 },
    comments: [
      { username: "Nina", content: "Jazz vibes are unmatched!" },
      { username: "Oscar", content: "Can't wait!" },
      { username: "Paul", content: "Bringing friends!" },
    ],
  },
  {
    id: "13",
    name: "Amapiano Kings",
    date: "February 1, 2027",
    time: "8:00 PM",
    location: "Benin City Stadium",
    ticketTypes: { regular: 4000, VIP: 20000, presale: 1000 },
    comments: [
      { username: "Quinn", content: "Best night ever!" },
      { username: "Rita", content: "VIP tickets booked!" },
      { username: "Steve", content: "Who’s performing first?" },
    ],
  },
  {
    id: "14",
    name: "Edo Festive Night",
    date: "February 14, 2027",
    time: "7:00 PM",
    location: "City Cultural Center",
    ticketTypes: { regular: 3000, VIP: 15000, presale: 500 },
    comments: [
      { username: "Tina", content: "Can’t wait!" },
      { username: "Uma", content: "Who’s performing?" },
      { username: "Victor", content: "Booking now!" },
    ],
  },
  {
    id: "15",
    name: "Rema Amapiano Live",
    date: "March 1, 2027",
    time: "8:00 PM",
    location: "Victor Uwaifo Hub",
    ticketTypes: { regular: 4500, VIP: 22000, presale: 1000 },
    comments: [
      { username: "Alice", content: "Finally Rema!" },
      { username: "Bob", content: "VIP booked!" },
      { username: "Charlie", content: "Best friends coming!" },
    ],
  },
  {
    id: "16",
    name: "Shallipopi Vibes",
    date: "March 10, 2027",
    time: "7:30 PM",
    location: "City Lounge Benin",
    ticketTypes: { regular: 2500, VIP: 15000, presale: 500 },
    comments: [
      { username: "Diana", content: "Excited!" },
      { username: "Eve", content: "Can't wait!" },
      { username: "Frank", content: "Booking my VIP!" },
    ],
  },
  {
    id: "17",
    name: "Wizkid Star Night",
    date: "March 20, 2027",
    time: "8:00 PM",
    location: "Benin Stadium",
    ticketTypes: { regular: 5000, VIP: 25000, presale: 1000 },
    comments: [
      { username: "Grace", content: "Wizkid hype!" },
      { username: "Hannah", content: "Booking VIP!" },
      { username: "Ian", content: "Friends joining!" },
    ],
  },
  {
    id: "18",
    name: "Burna Boy Vibes",
    date: "April 1, 2027",
    time: "9:00 PM",
    location: "Victor Uwaifo Hub",
    ticketTypes: { regular: 6000, VIP: 30000, presale: 1500 },
    comments: [
      { username: "Jade", content: "Finally Burna!" },
      { username: "Kevin", content: "VIP booked!" },
      { username: "Lara", content: "Friends coming!" },
    ],
  },
  {
    id: "19",
    name: "Edo Cultural Night",
    date: "April 15, 2027",
    time: "7:00 PM",
    location: "City Cultural Center",
    ticketTypes: { regular: 3500, VIP: 18000, presale: 500 },
    comments: [
      { username: "Mia", content: "Excited!" },
      { username: "Nina", content: "Can’t wait!" },
      { username: "Oscar", content: "Booking now!" },
    ],
  },
  {
    id: "20",
    name: "Amapiano Kings Finale",
    date: "April 30, 2027",
    time: "8:00 PM",
    location: "Benin City Stadium",
    ticketTypes: { regular: 4500, VIP: 22000, presale: 1000 },
    comments: [
      { username: "Paul", content: "Finale hype!" },
      { username: "Quinn", content: "Booking VIP!" },
      { username: "Rita", content: "Friends joining!" },
    ],
  },
];

const seedEvents = async () => {
  try {
    await connectDB();

    if (RESET) {
      await Event.deleteMany({});
      await Comment.deleteMany({});
      console.log("Old events and comments deleted (--reset)");
    }

    let created = 0;
    let updated = 0;

    for (let event of events) {
      const eventDate = new Date(event.date);
      const media = [getImageUrl(event.id)]; // local image only

      // if the event already exists, fix its image instead of skipping it
      const exists = await Event.findOne({
        title: event.name,
        date: eventDate,
      });
      if (exists) {
        exists.media = media;
        await exists.save();
        updated++;
        continue;
      }

      const savedEvent = await Event.create({
        title: event.name,
        description: `${event.name} at ${event.location}`,
        location: event.location,
        date: eventDate,
        time: event.time,
        media,
        ticketCategories: convertTickets(event.ticketTypes),
        createdBy: TEMP_ADMIN_ID,
        isPublished: true,
        status: "approved",
      });

      for (let c of event.comments) {
        await Comment.create({
          event: savedEvent._id,
          user: TEMP_USER_ID,
          content: c.content,
          createdAt: new Date(),
        });
      }

      created++;
    }

    console.log(
      `✅ Seeded ${created} new events. Updated images on ${updated} existing events.`,
    );
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedEvents();