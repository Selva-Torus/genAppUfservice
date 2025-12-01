"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Theme, Language, Direction, GlobalProps, Branding, Typography } from "@/types/global";

interface GlobalContextType extends GlobalProps {
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setDirection: (direction: Direction) => void;
  setBranding: (branding: Branding) => void;
  updateBranding: (updates: Partial<Branding>) => void;
  setTypography: (typography: Typography) => void;
  updateTypography: (updates: Partial<Typography>) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Helper to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Helper to set cookie
const setCookie = (name: string, value: string, days: number = 365) => {
  if (typeof window === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize theme from cookie or default to "light"
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = getCookie('cfg_theme');
      return (savedTheme as Theme) || "light";
    }
    return "light";
  });

  const [language, setLanguage] = useState<Language>("English");

  // Initialize direction from cookie or default to "LTR"
  const [direction, setDirectionState] = useState<Direction>(() => {
    if (typeof window !== 'undefined') {
      const savedDirection = getCookie('cfg_direction');
      return (savedDirection as Direction) || "LTR";
    }
    return "LTR";
  });
  const [branding, setBrandingState] = useState<Branding>({
    fontSize: "Medium",
    brandColor: "#00BFFF",
    selectionColor: "#00BFFF",
    hoverColor: "#00BFFF",
    borderRadius: "s",
  });

  const [typography, setTypographyState] = useState<Typography>({
    bodyFont: "Roboto",
    headerFont: "Roboto",
    displayFont: "Roboto",
  });

  // Wrapper to save theme to cookie when it changes
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setCookie('cfg_theme', newTheme);
  };

  // Wrapper to save direction to cookie when it changes
  const setDirection = (newDirection: Direction) => {
    setDirectionState(newDirection);
    setCookie('cfg_direction', newDirection);
  };

  const setBranding = (newBranding: Branding) => {
    setBrandingState(newBranding);
  };

  const updateBranding = (updates: Partial<Branding>) => {
    setBrandingState((prev) => ({ ...prev, ...updates }));
  };

  const setTypography = (newTypography: Typography) => {
    setTypographyState(newTypography);
  };

  const updateTypography = (updates: Partial<Typography>) => {
    setTypographyState((prev) => ({ ...prev, ...updates }));
  };

  // Apply direction to document element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.dir = direction.toLowerCase();
    }
  }, [direction]);

  return (
    <GlobalContext.Provider
      value={{
        theme,
        language,
        direction,
        branding,
        typography,
        setTheme,
        setLanguage,
        setDirection,
        setBranding,
        updateBranding,
        setTypography,
        updateTypography,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};
 