import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "default");

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const darkenColor = (hex, amount = 0.4) => {
    hex = hex.replace("#", "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const darken = (channel) => Math.max(0, Math.floor(channel * (1 - amount)));

    const toHex = (c) => c.toString(16).padStart(2, "0");

    return "#" + toHex(darken(r)) + toHex(darken(g)) + toHex(darken(b));
  };

  const lightenColor = (hex, amount = 0.3) => {
    hex = hex.replace("#", "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const lighten = (channel) => Math.min(255, Math.floor(channel + (255 - channel) * amount));

    const toHex = (c) => c.toString(16).padStart(2, "0");

    return "#" + toHex(lighten(r)) + toHex(lighten(g)) + toHex(lighten(b));
  };

  const applyTheme = (name) => {
    const themes = {
      default: {
        "--color-primary": "#3982AC",
        "--color-primary-darker": `${darkenColor("#3982AC", 0.2)}`,
        "--color-primary-lighten": `${lightenColor("#3982AC", 0.2)}`,
      },
    };

    Object.entries(themes[name]).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
