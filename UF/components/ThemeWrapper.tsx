"use client";

import { useEffect, ReactNode } from "react";
import { useTheme } from "@/hooks/useTheme";

interface ThemeWrapperProps {
  children: ReactNode;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  const { theme, isDark, isHighContrast, bgStyle, textStyle } = useTheme();

  useEffect(() => {
    console.log('ThemeWrapper - Current theme:', theme);

    // Apply theme class to document element
    const root = document.documentElement;

    // Remove all theme classes first
    root.classList.remove("light", "dark", "light-hc", "dark-hc");

    // Add current theme class
    root.classList.add(theme);
    console.log('ThemeWrapper - Applied theme class:', theme);

    // Apply background color based on theme
    root.style.backgroundColor = bgStyle;
    root.style.color = textStyle;

    // Apply high contrast styles
    if (isHighContrast) {
      root.style.fontWeight = "500";
      console.log('ThemeWrapper - High contrast mode enabled');
    } else {
      root.style.fontWeight = "normal";
    }
  }, [theme, isDark, isHighContrast, bgStyle, textStyle]);

  return <>{children}</>;
};
