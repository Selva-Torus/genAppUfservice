"use client";

import React from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { Icon } from "./Icon";
import { AvatarView, AvatarTheme, AvatarShape, HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass } from "@/app/utils/branding";
import { CommonHeaderAndTooltip } from "./CommonHeaderAndTooltip";
// import { GravityIcon } from "@/types/icons";

type ContentAlign = "left" | "center" | "right";

interface AvatarProps {
  imageUrl?: string;
  icon?: string;
  text?: string;
  view?: AvatarView;
  theme?: AvatarTheme;
  shape?: AvatarShape;
  backgroundColor?: string;
  borderColor?: string;
  fallbackImgUrl?: string;
  alt?: string;
  withImageBorder?: boolean;
  color?: string;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  className?: string;
  fillContainer?: boolean;
  contentAlign?: ContentAlign;
}

export const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  icon,
  text,
  view,
  theme: avatarTheme,
  shape = "circle",
  backgroundColor,
  borderColor,
  fallbackImgUrl,
  alt = "",
  withImageBorder = false,
  color,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  className = "",
  fillContainer = true,
  contentAlign = "center",
}) => {
  const { theme, direction, branding } = useGlobal();

  const getBackgroundColor = () => {
    if (backgroundColor) return backgroundColor;

    // For outlined view, use transparent or base color instead of brand color
    if (view === "outlined") {
      const isDark = theme === "dark" || theme === "dark-hc";
      return isDark ? "#1F2937" : "#F9FAFB";
    }

    if (avatarTheme === "brand") {
      return 'var(--brand-color)';
    }

    const isDark = theme === "dark" || theme === "dark-hc";
    return isDark ? "#4B5563" : "#E5E7EB";
  };

  const getTextColor = () => {
    if (color) return color;

    // For outlined view with brand theme, use brand color for text/icon
    if (view === "outlined" && avatarTheme === "brand") {
      return 'var(--brand-color)';
    }

    if (avatarTheme === "brand") {
      return "white";
    }

    const isDark = theme === "dark" || theme === "dark-hc";
    return isDark ? "white" : "#1F2937";
  };

  const getFillClasses = () => {
    if (!fillContainer) return "";
    return "w-full h-full";
  };

  const getContentAlignClasses = () => {
    switch (contentAlign) {
      case "left":
        return "justify-start";
      case "right":
        return "justify-end";
      case "center":
      default:
        return "justify-center";
    }
  };

  const getBorderStyle = () => {
    if (view === "outlined") {
      return {
        borderWidth: "2px",
        borderColor: borderColor || (avatarTheme === "brand" ? 'var(--brand-color)' : theme === "dark" || theme === "dark-hc" ? "#6B7280" : "#D1D5DB"),
      };
    }
    
    if (withImageBorder && imageUrl) {
      return {
        borderWidth: "2px",
        borderColor: borderColor || 'var(--brand-color)',
      };
    }
    
    return {};
  };

   const getIconSize = () => {
    if (fillContainer) {
      // When fillContainer is true, scale icon with branding fontSize
      const baseFontSize = fontSizeClass;
      switch (baseFontSize) {
        case "text-sm":
          return 22;
        case "text-base":
          return 30;
        case "text-lg":
          return 38;
        case "text-xl":
          return 46;
      }
    }
  };

  const fontSizeClass = getFontSizeClass(branding.fontSize);

  const avatarElement = (
    <div
      className={`
        ${shape === "circle" ? "rounded-full" : "rounded-lg"}
        flex items-center
        font-semibold
        overflow-hidden
        transition-all
        ${view === "outlined" ? "border-2" : ""}
        ${className}
        ${getFillClasses()}
        ${fontSizeClass}
        ${getContentAlignClasses()}
        `}
      dir={direction}
      style={{
        backgroundColor: imageUrl ? "transparent" : getBackgroundColor(),
        color: getTextColor(),
        ...getBorderStyle(),
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className={`h-full object-contain ${contentAlign === "center" ? "w-full" : ""}`}
          onError={(e) => {
            if (fallbackImgUrl) {
              e.currentTarget.src = fallbackImgUrl;
            }
          }}
        />
      ) : icon ? (
        <Icon
          data={icon}
          size={getIconSize()}
          className={`p-2 ${fillContainer} ? "w-full h-full" : ""`}
        />
      ) : text ? (
        <span>{text.charAt(0).toUpperCase()}</span>
      ) : (
        <Icon
          data="user"
          size={getIconSize()}
          className={`p-2 ${fillContainer} ? "w-full h-full" : ""`}
        />
      )}
    </div>
  );

  return (
    <CommonHeaderAndTooltip
      needTooltip={needTooltip}
      tooltipProps={tooltipProps}
      headerText={headerText}
      headerPosition={headerPosition}
      className={className}
      fillContainer={fillContainer}
    >
      {avatarElement}
    </CommonHeaderAndTooltip>
  )
};
