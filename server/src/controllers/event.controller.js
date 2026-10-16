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
//       "username companyName"
//     );

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found",
//       });
//     }

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

//     /* ---- Upload Media (single file) ---- */
//     let mediaUrls = [];

//     if (req.file) {
//       const uploaded = await cloudinary.uploader.upload(req.file.path, {
//         folder: "events",
//       });

//       mediaUrls = [uploaded.secure_url];

//       // delete temp file
//       await fs.unlink(req.file.path);
//     }

//     /* ---- Parse Tags ---- */
//     const parsedTags = tags
//       ? tags.split(",").map((t) => t.trim()).filter(Boolean)
//       : [];

//     /* ---- Parse Ticket Categories Safely ---- */
//     let parsedTickets = [];

//     if (ticketCategories) {
//       try {
//         parsedTickets = JSON.parse(ticketCategories);
//         if (!Array.isArray(parsedTickets)) parsedTickets = [];
//       } catch (err) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid ticketCategories format",
//         });
//       }
//     }

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
//       // isPublished: isPublished === "true",
//       isPublished: Boolean(req.body.isPublished),
//     });

//     res.status(201).json({ success: true, event });
//   } catch (error) {
//     console.error("CREATE EVENT ERROR:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* =========================
//    UPDATE EVENT
// ========================= */
// export const updateEvent = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found",
//       });
//     }

//     if (event.createdBy.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized",
//       });
//     }

//     /* ---- Upload new media if provided ---- */
//     let mediaUrls = event.media;

//     if (req.file) {
//       const uploaded = await cloudinary.uploader.upload(req.file.path, {
//         folder: "events",
//       });

//       mediaUrls = [uploaded.secure_url];

//       await fs.unlink(req.file.path);
//     }

//     /* ---- Parse Tags ---- */
//     const parsedTags = req.body.tags
//       ? req.body.tags.split(",").map((t) => t.trim()).filter(Boolean)
//       : event.tags;

//     /* ---- Parse Ticket Categories Safely ---- */
//     let parsedTickets = event.ticketCategories;

//     if (req.body.ticketCategories) {
//       try {
//         parsedTickets = JSON.parse(req.body.ticketCategories);
//         if (!Array.isArray(parsedTickets)) parsedTickets = [];
//       } catch (err) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid ticketCategories format",
//         });
//       }
//     }

//     /* ---- Update Fields ---- */
//     event.title = req.body.title || event.title;
//     event.description = req.body.description || event.description;
//     event.location = req.body.location || event.location;
//     event.date = req.body.date || event.date;
//     event.time = req.body.time || event.time;
//     event.tags = parsedTags;
//     event.ticketCategories = parsedTickets;
//     event.media = mediaUrls;

//     // if (req.body.isPublished !== undefined) {
//     //   event.isPublished = req.body.isPublished === "true";
//     // }
//     event.isPublished = Boolean(req.body.isPublished);

//     await event.save();

//     res.status(200).json({ success: true, event });
//   } catch (error) {
//     console.error("UPDATE EVENT ERROR:", error);
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

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found",
//       });
//     }

//     if (event.createdBy.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: "Not authorized",
//       });
//     }

//     await event.deleteOne();

//     res.status(200).json({
//       success: true,
//       message: "Event deleted",
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

import Event from "../models/Event.js";
import Comment from "../models/Comment.js";

const IMAGE_RE = /\.(jpe?g|png|gif|webp|avif)(\?.*)?$/i;
const VIDEO_RE = /\.(mp4|webm|mov)(\?.*)?$/i;

// Public base URL of this server (Render in production, localhost locally)
const getBase = (req) => {
  if (process.env.BASE_URL) return process.env.BASE_URL.replace(/\/$/, "");
  const proto = req.headers["x-forwarded-proto"]?.split(",")[0] || req.protocol;
  return `${proto}://${req.get("host")}`;
};

// Seeded URLs were saved with http://localhost:5000, so point them at this server
const fixUrl = (url, base) =>
  typeof url === "string"
    ? url.replace(/^https?:\/\/localhost:\d+/i, base)
    : url;

const formatEvent = (event, base) => {
  const media = (event.media || []).map((u) => fixUrl(u, base));
  return {
    ...event,
    media,
    imageUrl: media.find((u) => IMAGE_RE.test(u)) || null,
    videoUrl: media.find((u) => VIDEO_RE.test(u)) || null,
  };
};


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
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
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

// GET /api/events - Public event feed
export const getPublicEvents = async (req, res) => {
  try {
    const base = getBase(req);

    const events = await Event.find({ isPublished: true, status: "approved" })
      .select(
        "_id title description date time location media ticketCategories createdAt",
      )
      .sort({ createdAt: -1 })
      .lean();

    // Comment counts for every event in one query (so counts show without opening comments)
    const counts = await Comment.aggregate([
      { $match: { event: { $in: events.map((e) => e._id) } } },
      { $group: { _id: "$event", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [String(c._id), c.count]));

    const formattedEvents = events.map((event) => ({
      ...formatEvent(event, base),
      commentCount: countMap.get(String(event._id)) || 0,
    }));

    res.status(200).json({
      success: true,
      count: formattedEvents.length,
      events: formattedEvents,
    });
  } catch (error) {
    console.error("Get public events error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================
   GET ALL EVENTS 
========================= */
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

/* =========================
   GET ALL EVENTS
========================= */
export const getAllEvents = async (req, res) => {
  try {
    const base = getBase(req);

    const events = await Event.find({ isPublished: true })
      .populate("createdBy", "username companyName")
      .sort({ createdAt: -1 })
      .lean();

    // Add image URLs and a comment count to every event
    const formattedEvents = await Promise.all(
      events.map(async (event) => ({
        ...formatEvent(event, base),
        commentCount: await Comment.countDocuments({ event: event._id }),
      })),
    );

    res.status(200).json({
      success: true,
      count: formattedEvents.length,
      events: formattedEvents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
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

// GET /api/events/:id - Public event details
export const getPublicEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .select(
        "title description date time location media ticketCategories createdAt",
      )
      .lean();

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.status(200).json({
      success: true,
      event: formatEvent(event, getBase(req)),
    });
  } catch (error) {
    console.error("Get event by ID error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/events/:id/comments - Public comments for an event
export const getEventComments = async (req, res) => {
  try {
    const { id: eventId } = req.params;

    const eventExists = await Event.exists({ _id: eventId });
    if (!eventExists) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    const comments = await Comment.find({ event: eventId })
      .populate("user", "username profileImage")
      .select("content createdAt user")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error("Get event comments error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
