// src/pages/Help.jsx
import React from "react";
import { motion as Motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

const Help = ({ isDark }) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto"
    >
      <div
        className={`rounded-2xl p-6 ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg`}
      >
        <h2
          className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Help & Support
        </h2>

        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
          >
            <h3
              className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              How do I create an event?
            </h3>
            <p
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Navigate to the 'My Events' tab and click 'Create Event'. Fill in
              the event details and publish.
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
          >
            <h3
              className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              How do I track ticket sales?
            </h3>
            <p
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Check the Dashboard or Analytics tab for real-time stats.
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
          >
            <h3
              className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Where can I withdraw earnings?
            </h3>
            <p
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Go to Settings → Balance & Withdraw section to request payout.
            </p>
          </div>

          <Motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg mt-6"
          >
            <MessageSquare className="w-5 h-5" />
            Contact Support
          </Motion.button>
        </div>
      </div>
    </Motion.div>
  );
};

export default Help;
