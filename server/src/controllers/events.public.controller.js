import Event from "../models/Event.js";
import Comment from "../models/Comment.js";

// GET /api/events - Public event feed
export const getPublicEvents = async (req, res) => {
  try {
    const events = await Event.find({})
      .select(
        "_id title date time location media ticketTypes totalTickets createdAt",
      )
      .sort({ createdAt: -1 }) // newest first
      .lean();

    // Flatten media into imageUrl/videoUrl if needed (optional)
    const formattedEvents = events.map((event) => ({
      ...event,
      imageUrl:
        event.media?.find((url) => url.match(/\.(jpg|jpeg|png|gif)$/i)) || null,
      videoUrl:
        event.media?.find((url) => url.match(/\.(mp4|webm|mov)$/i)) || null,
      media: undefined, // remove full array if not needed
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

// GET /api/events/:id - Public event details
export const getPublicEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .select(
        "title description date time location media ticketTypes totalTickets createdAt",
      )
      .lean();

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // Optional: add image/video separation
    event.imageUrl =
      event.media?.find((url) => url.match(/\.(jpg|jpeg|png|gif)$/i)) || null;
    event.videoUrl =
      event.media?.find((url) => url.match(/\.(mp4|webm|mov)$/i)) || null;
    delete event.media;

    res.status(200).json({
      success: true,
      event,
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

    // Optional: verify event exists
    const eventExists = await Event.exists({ _id: eventId });
    if (!eventExists) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    const comments = await Comment.find({ event: eventId })
      .populate("user", "username profileImage")
      .select("content createdAt user")
      .sort({ createdAt: -1 }) // newest first
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
