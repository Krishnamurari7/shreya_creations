"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  isDark: false,
  toggle: () => {},
  setTheme: () => {},
});

function readStoredTheme() {
  try {
    const stored = localStorage.getItem("sc-theme");
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* ignore */
  }
  return "light";
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute("content", isDark ? "#0c0812" : "#FFF9F0");
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setThemeState(readStoredTheme());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    applyTheme(theme);
    try {
      localStorage.setItem("sc-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme, ready]);

  const setTheme = useCallback((next) => {
    setThemeState(next === "dark" ? "dark" : "light");
  }, []);

  const toggle = useCallback(() => {
    setThemeState((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === "dark", toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
