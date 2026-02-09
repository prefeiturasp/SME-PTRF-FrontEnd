import React, { createContext, useContext, useEffect, useState } from "react";
import { ConfigProvider } from "antd";
import locale from "antd/locale/pt_BR";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "#01585e");

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

    const antdTheme = {
    token: {
      colorPrimary: "orange",
      borderRadius: 4,
      colorError: "rgba(184, 0, 0, 1)",
    },
    components: {
      Alert: {
        defaultPadding: "2px 4px",
        withDescriptionIconSize: 18,
        withDescriptionPadding: "3px 6px",
      },
      Input: {
        controlHeight: 38,
      },
      InputNumber: {
        controlHeight: 38,
      },
      Select: {
        controlHeight: 38,
      },
      DatePicker: {
        controlHeight: 38,
      },
      Button: {
        colorPrimary: theme,
        colorPrimaryHover: lightenColor(theme, 0.2),
        colorPrimaryActive:  darkenColor(theme, 0.2),
        colorBorder: theme,
        colorText: theme,
      },
    },
  };


  const applyTheme = (color = "#01585e") => {
    const themes = {
      default: {
        "--color-fallback": "#01585e",
        "--color-primary": color,
        "--color-primary-darker": `${darkenColor(color, 0.2)}`,
        "--color-primary-lighten": `${lightenColor(color, 0.2)}`,
      },
    };

    Object.entries(themes["default"]).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ConfigProvider theme={antdTheme} locale={locale}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
