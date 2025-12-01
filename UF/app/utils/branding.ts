import { FontSize, BorderRadiusSize, Branding } from "@/types/global";

export const getFontSizeClass = (fontSize: FontSize): string => {
  switch (fontSize) {
    case "Small":
      return "text-sm";
    case "Medium":
      return "text-base";
    case "Large":
      return "text-lg";
    case "Extra Large":
      return "text-xl";
  }
};

export const getBorderRadiusClass = (borderRadius: BorderRadiusSize): string => {
  switch (borderRadius) {
    case "none":
      return "rounded-none";
    case "xs":
      return "rounded-sm";
    case "s":
      return "rounded";
    case "m":
      return "rounded-md";
    case "l":
      return "rounded-lg";
    case "xl":
      return "rounded-xl";
  }
};

export const getBrandingStyles = (branding: Branding) => {
  return {
    "--brand-color": branding.brandColor,
    "--selection-color": branding.selectionColor,
    "--hover-color": branding.hoverColor,
  } as React.CSSProperties;
};

export const applyBrandColor = (color: string, opacity: number = 1): string => {
  // Convert hex to rgba for opacity support
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const lightenColor = (color: string, amount: number = 0.1): string => {
  const hex = color.replace("#", "");
  const r = Math.min(255, parseInt(hex.substring(0, 2), 16) + amount * 255);
  const g = Math.min(255, parseInt(hex.substring(2, 4), 16) + amount * 255);
  const b = Math.min(255, parseInt(hex.substring(4, 6), 16) + amount * 255);
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
};

export const darkenColor = (color: string, amount: number = 0.1): string => {
  const hex = color.replace("#", "");
  const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - amount * 255);
  const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - amount * 255);
  const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - amount * 255);
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
};
