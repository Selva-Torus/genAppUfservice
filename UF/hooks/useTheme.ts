import { useGlobal } from "@/context/GlobalContext";

export const useTheme = () => {
  const { theme, setTheme, branding, direction, language } = useGlobal();

  const isDark = theme === "dark" || theme === "dark-hc";
  const isLight = theme === "light" || theme === "light-hc";
  const isHighContrast = theme === "light-hc" || theme === "dark-hc";

  // Get theme-aware color classes
  const bgColor = isDark ? "bg-gray-800" : "bg-white";
  const textColor = isDark ? "text-white" : "text-black";
  const borderColor = isDark ? "border-gray-600" : "border-gray-300";
  const hoverBgColor = isDark ? "hover:bg-gray-700" : "hover:bg-gray-100";

  // Get theme-aware inline styles
  const bgStyle = isDark ? "#1f2937" : "#ffffff";
  const textStyle = isDark ? "#ffffff" : "#000000";
  const borderStyle = isDark ? "#4B5563" : "#D1D5DB";

  return {
    theme,
    setTheme,
    isDark,
    isLight,
    isHighContrast,
    branding,
    direction,
    language,
    // Utility classes
    bgColor,
    textColor,
    borderColor,
    hoverBgColor,
    // Inline styles
    bgStyle,
    textStyle,
    borderStyle,
  };
};
