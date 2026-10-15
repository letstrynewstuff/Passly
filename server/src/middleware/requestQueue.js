// src/middleware/requestQueue.js
import PQueue from "p-queue";

/**
 * Creates a queue wrapper for a controller.
 *  - concurrency : how many requests run at the same time
 *  - maxWaiting  : how many more can wait in line; beyond this we reply 503
 */
export const createRequestQueue = ({ name, concurrency, maxWaiting }) => {
  const queue = new PQueue({ concurrency });
  const activeUsers = new Set(); // blocks double-clicks / duplicate submits

  return (handler) => async (req, res, next) => {
    const userId = req.user?.id ? String(req.user.id) : null;

    // Same user already has a request running or waiting
    if (userId && activeUsers.has(userId)) {
      return res.status(429).json({
        success: false,
        message: "Your previous request is still being processed. Please wait.",
      });
    }

    // Line is full: reject fast instead of overloading the server
    if (queue.size >= maxWaiting) {
      console.warn(`[${name}] queue full (${queue.size} waiting) - rejecting`);
      res.set("Retry-After", "10");
      return res.status(503).json({
        success: false,
        busy: true,
        message:
          "We're very busy right now. Please try again in a few seconds.",
      });
    }

    if (userId) activeUsers.add(userId);

    try {
      await queue.add(async () => {
        // User gave up and closed the app while waiting? Skip the work.
        if (res.destroyed || res.socket?.destroyed) return;
        await handler(req, res, next);
      });
    } catch (err) {
      console.error(`[${name}] queue error:`, err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: "Server error" });
      }
    } finally {
      if (userId) activeUsers.delete(userId);
    }
  };
};
