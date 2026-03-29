// Simple theme utilities for Tailwind `dark` mode
// We only touch the DOM class and localStorage – no backend changes.

const THEME_KEY = "skillafrik-theme";

export function applyTheme(theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
    window.localStorage.setItem(THEME_KEY, "dark");
  } else {
    root.classList.remove("dark");
    window.localStorage.setItem(THEME_KEY, "light");
  }
}

export function getInitialTheme() {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

