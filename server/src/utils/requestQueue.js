// src/utils/requestQueue.js

export class QueueFullError extends Error {
  constructor(name) {
    super(`Queue "${name}" is full`);
    this.name = "QueueFullError";
  }
}

export class QueueTimeoutError extends Error {
  constructor(name) {
    super(`Queue "${name}" wait timed out`);
    this.name = "QueueTimeoutError";
  }
}

/**
 * Limits how many jobs run at the same time. Extra jobs wait in line (FIFO).
 *  - concurrency: jobs allowed to run at once
 *  - maxQueued:   max jobs allowed to wait; beyond this we reject immediately
 *  - maxWaitMs:   max time a job may wait before being rejected
 */
export const createQueue = ({ name, concurrency, maxQueued, maxWaitMs }) => {
  let running = 0;
  const waiting = [];

  const next = () => {
    while (running < concurrency && waiting.length > 0) {
      const job = waiting.shift();
      clearTimeout(job.timer);
      running++;
      Promise.resolve()
        .then(() => job.task())
        .then(job.resolve, job.reject)
        .finally(() => {
          running--;
          next();
        });
    }
  };

  const add = (task) =>
    new Promise((resolve, reject) => {
      if (waiting.length >= maxQueued) {
        return reject(new QueueFullError(name));
      }
      const job = { task, resolve, reject };
      job.timer = setTimeout(() => {
        const i = waiting.indexOf(job);
        if (i !== -1) {
          waiting.splice(i, 1);
          reject(new QueueTimeoutError(name));
        }
      }, maxWaitMs);
      waiting.push(job);
      next();
    });

  const stats = () => ({ name, running, waiting: waiting.length });

  return { add, stats };
};

/**
 * Runs jobs with the same key one after another (a simple keyed lock).
 * Used so two buyers can't update the same event's ticket count at once.
 */
const locks = new Map();

export const runExclusive = (key, fn) => {
  const prev = locks.get(key) || Promise.resolve();
  const run = prev.then(() => fn());
  const tail = run.catch(() => {});
  locks.set(key, tail);
  tail.then(() => {
    if (locks.get(key) === tail) locks.delete(key);
  });
  return run;
};

/**
 * Wraps an Express handler so it runs through a queue.
 * If the queue is full or the wait is too long, replies 503 + Retry-After.
 */
export const withQueue =
  (queue, handler, { skipIfClosed = false, retryAfterSec = 5 } = {}) =>
  async (req, res) => {
    try {
      await queue.add(async () => {
        // If the user already left while waiting, don't do the work
        if (skipIfClosed && (res.destroyed || res.writableEnded)) return;
        await handler(req, res);
      });
    } catch (err) {
      if (err instanceof QueueFullError || err instanceof QueueTimeoutError) {
        console.warn("⏳ Queue overloaded:", queue.stats());
        res.set("Retry-After", String(retryAfterSec));
        return res.status(503).json({
          success: false,
          busy: true,
          retryAfter: retryAfterSec,
          message:
            "We're handling a lot of payments right now. Please try again in a few seconds.",
        });
      }
      console.error("Queue handler error:", err);
      if (!res.headersSent) {
        return res
          .status(500)
          .json({ success: false, message: "Server error" });
      }
    }
  };
