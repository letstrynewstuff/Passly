// // src/controllers/events.controller.js
// import Event from "../models/Event.js";
// import cloudinary from "../config/cloudinary.js";
// import fs from "fs/promises";

// /* =========================
//    GET ALL EVENTS (Published Only)
// ========================= */
// export const getAllEvents = async (req, res) => {
//   try {
//     const events = await Event.find({ isPublished: true })
//       .populate("createdBy", "username companyName")
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, events });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* =========================
//    GET SINGLE EVENT
// ========================= */
// export const getEventById = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id).populate(
//       "createdBy",
//       "username companyName",
//     );

//     if (!event)
//       return res.status(404).json({
//         success: false,
//         message: "Event not found",
//       });

//     res.status(200).json({ success: true, event });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* =========================
//    CREATE EVENT
// ========================= */
// export const createEvent = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       location,
//       date,
//       time,
//       tags,
//       ticketCategories,
//       isPublished,
//     } = req.body;

//     /* ---- Upload Media to Cloudinary ---- */
//     let mediaUrls = [];

//     // if (req.files && req.files.length > 0) 
//     if (req.file) {
//       const uploadedMedia = await Promise.all(
//         req.files.map((file) =>
//           cloudinary.uploader.upload(file.path, {
//             folder: "events",
//           }),
//         ),
//       );

//       // mediaUrls = uploadedMedia.map((file) => file.secure_url);
//       mediaUrls = [uploaded.secure_url];

//       // remove temp files
//       await Promise.all(req.files.map((file) => fs.unlink(file.path)));
//     }

//     /* ---- Parse JSON fields (because FormData sends strings) ---- */
//     const parsedTags = tags
//       ? tags
//           .split(",")
//           .map((t) => t.trim())
//           .filter(Boolean)
//       : [];
//     const parsedTickets = ticketCategories ? JSON.parse(ticketCategories) : [];

//     const event = await Event.create({
//       title,
//       description,
//       location,
//       date,
//       time,
//       media: mediaUrls,
//       tags: parsedTags,
//       ticketCategories: parsedTickets,
//       createdBy: req.user.id,
//       isPublished: isPublished === "true",
//     });

//     res.status(201).json({ success: true, event });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* =========================
//    UPDATE EVENT
// ========================= */
// export const updateEvent = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);

//     if (!event)
//       return res.status(404).json({
//         success: false,
//         message: "Event not found",
//       });

//     if (event.createdBy.toString() !== req.user.id)
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized",
//       });

//     /* ---- Upload new media if provided ---- */
//     let mediaUrls = event.media;

//     // if (req.files && req.files.length > 0) 
//     if (req.file) {
//       // const uploadedMedia = await Promise.all(
//       //   req.files.map((file) =>
//       //     cloudinary.uploader.upload(file.path, {
//       //       folder: "events",
//       //     }),
//       //   ),
//       // );
//       const uploaded = await cloudinary.uploader.upload(req.file.path, {
//         folder: "events",
//       });

//       // mediaUrls = [
//       //   ...mediaUrls,
//       //   ...uploadedMedia.map((file) => file.secure_url),
//       // ];
//       mediaUrls = [uploaded.secure_url];

//       // await Promise.all(req.files.map((file) => fs.unlink(file.path)));
//       await fs.unlink(req.file.path);
//     }

//     /* ---- Parse fields ---- */
//     const parsedTags = tags
//       ? tags
//           .split(",")
//           .map((t) => t.trim())
//           .filter(Boolean)
//       : [];

//     const parsedTickets = req.body.ticketCategories
//       ? JSON.parse(req.body.ticketCategories)
//       : event.ticketCategories;

//     event.title = req.body.title || event.title;
//     event.description = req.body.description || event.description;
//     event.location = req.body.location || event.location;
//     event.date = req.body.date || event.date;
//     event.time = req.body.time || event.time;
//     event.tags = parsedTags;
//     event.ticketCategories = parsedTickets;
//     event.media = mediaUrls;

//     if (req.body.isPublished !== undefined) {
//       event.isPublished = req.body.isPublished === "true";
//     }

//     await event.save();

//     res.status(200).json({ success: true, event });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* =========================
//    GET MY EVENTS (Planner)
// ========================= */
// export const getMyEvents = async (req, res) => {
//   try {
//     const events = await Event.find({ createdBy: req.user.id }).sort({
//       createdAt: -1,
//     });

//     res.status(200).json({ success: true, events });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* =========================
//    DELETE EVENT
// ========================= */
// export const deleteEvent = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);

//     if (!event)
//       return res.status(404).json({
//         success: false,
//         message: "Event not found",
//       });

//     if (event.createdBy.toString() !== req.user.id)
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized",
//       });

//     await event.deleteOne();

//     res.status(200).json({
//       success: true,
//       message: "Event deleted",
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // import Event from "../models/Event.js";
// // import cloudinary from "../config/cloudinary.js";
// // import fs from "fs/promises"; // to remove temp files after upload

// // // Get all events
// // export const getAllEvents = async (req, res) => {
// //   try {
// //     const events = await Event.find({}).populate(
// //       "createdBy",
// //       "username companyName",
// //     );
// //     res.status(200).json({ success: true, events });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };

// // // Get single event by ID
// // export const getEventById = async (req, res) => {
// //   try {
// //     const event = await Event.findById(req.params.id).populate(
// //       "createdBy",
// //       "username companyName",
// //     );
// //     if (!event)
// //       return res
// //         .status(404)
// //         .json({ success: false, message: "Event not found" });

// //     res.status(200).json({ success: true, event });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };

// // // Create Event with media upload to Cloudinary
// // export const createEvent = async (req, res) => {
// //   try {
// //     const {
// //       title,
// //       description,
// //       location,
// //       date,
// //       time,
// //       ticketTypes,
// //       prices,
// //       totalTickets,
// //       tags,
// //     } = req.body;

// //     // Upload files to Cloudinary if any
// //     let mediaUrls = [];
// //     if (req.files && req.files.length > 0) {
// //       const uploadedMedia = await Promise.all(
// //         req.files.map((file) =>
// //           cloudinary.uploader.upload(file.path, {
// //             resource_type: "auto", // handles both images and videos
// //             folder: "events",
// //           }),
// //         ),
// //       );

// //       mediaUrls = uploadedMedia.map((file) => file.secure_url);

// //       // Remove temporary files after upload
// //       await Promise.all(req.files.map((file) => fs.unlink(file.path)));
// //     }

// //     const newEvent = new Event({
// //       title,
// //       description,
// //       location,
// //       date,
// //       time,
// //       media: mediaUrls,
// //       ticketTypes,
// //       prices,
// //       totalTickets,
// //       tags,
// //       createdBy: req.user.id,
// //     });

// //     await newEvent.save();
// //     res.status(201).json({ success: true, event: newEvent });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };

// // // Update Event with optional media upload
// // export const updateEvent = async (req, res) => {
// //   try {
// //     const event = await Event.findById(req.params.id);
// //     if (!event)
// //       return res
// //         .status(404)
// //         .json({ success: false, message: "Event not found" });

// //     if (event.createdBy.toString() !== req.user.id)
// //       return res
// //         .status(403)
// //         .json({ success: false, message: "Not authorized to edit this event" });

// //     let mediaUrls = event.media || [];

// //     // Upload new files to Cloudinary if provided
// //     if (req.files && req.files.length > 0) {
// //       const uploadedMedia = await Promise.all(
// //         req.files.map((file) =>
// //           cloudinary.uploader.upload(file.path, {
// //             resource_type: "auto",
// //             folder: "events",
// //           }),
// //         ),
// //       );

// //       mediaUrls = [
// //         ...mediaUrls,
// //         ...uploadedMedia.map((file) => file.secure_url),
// //       ];

// //       // Remove temporary files after upload
// //       await Promise.all(req.files.map((file) => fs.unlink(file.path)));
// //     }

// //     const updatedEvent = await Event.findByIdAndUpdate(
// //       req.params.id,
// //       { ...req.body, media: mediaUrls },
// //       { new: true },
// //     );

// //     res.status(200).json({ success: true, event: updatedEvent });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };
// // // Get events created by logged-in planner
// // export const getMyEvents = async (req, res) => {
// //   try {
// //     const events = await Event.find({ createdBy: req.user.id })
// //       .sort({ createdAt: -1 });

// //     res.status(200).json({ success: true, events });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };

// // // Delete Event
// // export const deleteEvent = async (req, res) => {
// //   try {
// //     const event = await Event.findById(req.params.id);
// //     if (!event)
// //       return res
// //         .status(404)
// //         .json({ success: false, message: "Event not found" });

// //     if (event.createdBy.toString() !== req.user.id)
// //       return res
// //         .status(403)
// //         .json({
// //           success: false,
// //           message: "Not authorized to delete this event",
// //         });

// //     await Event.findByIdAndDelete(req.params.id);
// //     res.status(200).json({ success: true, message: "Event deleted" });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };


// src/controllers/events.controller.js

import Event from "../models/Event.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";

/* =========================
   GET ALL EVENTS (Published Only)
========================= */
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ isPublished: true })
      .populate("createdBy", "username companyName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const getAllEvents = async (req, res) => {
//   try {
//     const allEvents = await Event.find();
//     console.log("ALL EVENTS IN DB:", allEvents);

//     const events = await Event.find({ isPublished: true });
//     console.log("PUBLISHED EVENTS:", events);

//     res.status(200).json({ success: true, events });
//   } catch (error) {
//     console.log("ERROR:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
/* =========================
   GET SINGLE EVENT
========================= */
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "username companyName"
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   CREATE EVENT
========================= */
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      date,
      time,
      tags,
      ticketCategories,
      isPublished,
    } = req.body;

    /* ---- Upload Media (single file) ---- */
    let mediaUrls = [];

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "events",
      });

      mediaUrls = [uploaded.secure_url];

      // delete temp file
      await fs.unlink(req.file.path);
    }

    /* ---- Parse Tags ---- */
    const parsedTags = tags
      ? tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    /* ---- Parse Ticket Categories Safely ---- */
    let parsedTickets = [];

    if (ticketCategories) {
      try {
        parsedTickets = JSON.parse(ticketCategories);
        if (!Array.isArray(parsedTickets)) parsedTickets = [];
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid ticketCategories format",
        });
      }
    }

    const event = await Event.create({
      title,
      description,
      location,
      date,
      time,
      media: mediaUrls,
      tags: parsedTags,
      ticketCategories: parsedTickets,
      createdBy: req.user.id,
      // isPublished: isPublished === "true",
      isPublished: Boolean(req.body.isPublished),
    });

    res.status(201).json({ success: true, event });
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   UPDATE EVENT
========================= */
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    /* ---- Upload new media if provided ---- */
    let mediaUrls = event.media;

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "events",
      });

      mediaUrls = [uploaded.secure_url];

      await fs.unlink(req.file.path);
    }

    /* ---- Parse Tags ---- */
    const parsedTags = req.body.tags
      ? req.body.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : event.tags;

    /* ---- Parse Ticket Categories Safely ---- */
    let parsedTickets = event.ticketCategories;

    if (req.body.ticketCategories) {
      try {
        parsedTickets = JSON.parse(req.body.ticketCategories);
        if (!Array.isArray(parsedTickets)) parsedTickets = [];
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid ticketCategories format",
        });
      }
    }

    /* ---- Update Fields ---- */
    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.location = req.body.location || event.location;
    event.date = req.body.date || event.date;
    event.time = req.body.time || event.time;
    event.tags = parsedTags;
    event.ticketCategories = parsedTickets;
    event.media = mediaUrls;

    // if (req.body.isPublished !== undefined) {
    //   event.isPublished = req.body.isPublished === "true";
    // }
    event.isPublished = Boolean(req.body.isPublished);

    await event.save();

    res.status(200).json({ success: true, event });
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   GET MY EVENTS (Planner)
========================= */
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   DELETE EVENT
========================= */
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: "Event deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};