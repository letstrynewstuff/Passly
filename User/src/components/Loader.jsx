// src/components/Loader.jsx
import React from "react";
import { motion as Motion } from "framer-motion";

const Loader = ({ type = "page", count = 3, size = "medium" }) => {
  // Spinner size variants (used for finger width/height)
  const spinnerSizes = {
    small: "w-3 h-12",
    medium: "w-5 h-16",
    large: "w-7 h-24",
  };

  // Single finger animation variant
  const fingerVariants = {
    hidden: { scaleY: 0.4, opacity: 0.3 },
    visible: (i) => ({
      scaleY: [0.4, 1, 0.4],
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        delay: i * 0.15,
        ease: "easeInOut",
      },
    }),
  };

  // Card skeleton shimmer animation
  const shimmer = {
    hidden: { backgroundPosition: "200% 0" },
    visible: {
      backgroundPosition: "-200% 0",
      transition: {
        duration: 1.8,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  if (type === "card") {
    return (
      <div className="space-y-6 py-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden bg-gray-800/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl"
          >
            {/* Poster placeholder */}
            <div className="aspect-video w-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse" />

            {/* Content placeholders */}
            <div className="p-5 space-y-4">
              <Motion.div
                className="h-7 w-4/5 rounded-lg bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%]"
                variants={shimmer}
                initial="hidden"
                animate="visible"
              />
              <div className="space-y-3">
                <Motion.div
                  className="h-4 w-3/4 rounded bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%]"
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                />
                <Motion.div
                  className="h-4 w-2/3 rounded bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%]"
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: full-page centered animated fingers loader
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50">
      <div className="flex items-end gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Motion.div
            key={i}
            className={`${spinnerSizes[size]} bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-full origin-bottom`}
            custom={i}
            variants={fingerVariants}
            initial="hidden"
            animate="visible"
          />
        ))}
      </div>

      <Motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute mt-28 text-cyan-400 font-medium tracking-wider text-lg"
      >
        LOADING
      </Motion.p>
    </div>
  );
};

export default Loader;
