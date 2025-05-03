"use client";

import React, { createContext, useContext, useState } from "react";
import { getRandomTheme } from "./constants";

interface ThemeContextType {
  currentTheme: string;
  selectNewTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTheme, setCurrentTheme] = useState<string>(getRandomTheme());

  const selectNewTheme = () => {
    setCurrentTheme(getRandomTheme());
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, selectNewTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
