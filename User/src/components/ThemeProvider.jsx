// // src/components/ThemeProvider.jsx
// import React, { useState, useEffect, useContext } from "react";
// import { ThemeContext } from "../context/ThemeContext";

// // 2️⃣ Export the provider
// export const ThemeProvider = ({ children }) => {
//   const getInitialTheme = () => {
//     if (typeof window === "undefined") return "light";
//     const savedTheme = localStorage.getItem("theme");
//     if (
//       savedTheme === "dark" ||
//       (!savedTheme &&
//         window.matchMedia &&
//         window.matchMedia("(prefers-color-scheme: dark)").matches)
//     ) {
//       return "dark";
//     }
//     return "light";
//   };

//   const [theme, setTheme] = useState(() => {
//     try {
//       return getInitialTheme();
//     } catch {
//       return "light";
//     }
//   });

//   // Sync DOM class and localStorage when theme changes
//   useEffect(() => {
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//     try {
//       localStorage.setItem("theme", theme);
//     } catch {
//       /* ignore storage errors */
//     }
//   }, [theme]);

//   const toggleTheme = () =>
//     setTheme((prev) => (prev === "dark" ? "light" : "dark"));
//   const isDark = theme === "dark";

//   return (
//     <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// // 3️⃣ Create a convenient hook to use anywhere
// export const useTheme = () => useContext(ThemeContext);

// src/components/ThemeProvider.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

// 1. Create context right here (no external file)
const ThemeContext = createContext({
  theme: "light",
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === "dark", toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Export the hook
export const useTheme = () => useContext(ThemeContext);