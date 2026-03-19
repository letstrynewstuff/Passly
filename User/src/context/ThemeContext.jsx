import { createContext } from "react";

/**
 * Global Theme Context
 * This file ONLY defines the context
 * State & logic live inside ThemeProvider
 */
export const ThemeContext = createContext({
  theme: "light",
  isDark: false,
  toggleTheme: () => {},
});
