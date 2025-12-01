"use client";

import React from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { Icon } from "./Icon";
import { AvatarSize, AvatarView, AvatarTheme, AvatarShape, HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
// import { GravityIcon } from "@/types/icons";

interface AvatarProps {
  imageUrl?: string;
  icon?: string;
  text?: string;
  size?: AvatarSize;
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
}

export const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  icon,
  text,
  size,
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
}) => {
  const { theme, branding } = useGlobal();

  const getSizeClasses = () => {
    switch (size) {
      case "xs":
        return "w-6 h-6 text-xs";
      case "s":
        return "w-8 h-8 text-sm";
      case "m":
        return "w-10 h-10 text-base";
      case "l":
        return "w-12 h-12 text-lg";
      case "xl":
        return "w-16 h-16 text-xl";
    }
  };

  const getBackgroundColor = () => {
    if (backgroundColor) return backgroundColor;

    // For outlined view, use transparent or base color instead of brand color
    if (view === "outlined") {
      const isDark = theme === "dark" || theme === "dark-hc";
      return isDark ? "#1F2937" : "#F9FAFB";
    }

    if (avatarTheme === "brand") {
      return branding.brandColor;
    }

    const isDark = theme === "dark" || theme === "dark-hc";
    return isDark ? "#4B5563" : "#E5E7EB";
  };

  const getTextColor = () => {
    if (color) return color;

    // For outlined view with brand theme, use brand color for text/icon
    if (view === "outlined" && avatarTheme === "brand") {
      return branding.brandColor;
    }

    if (avatarTheme === "brand") {
      return "white";
    }

    const isDark = theme === "dark" || theme === "dark-hc";
    return isDark ? "white" : "#1F2937";
  };

  const getBorderStyle = () => {
    if (view === "outlined") {
      return {
        borderWidth: "2px",
        borderColor: borderColor || (avatarTheme === "brand" ? branding.brandColor : theme === "dark" || theme === "dark-hc" ? "#6B7280" : "#D1D5DB"),
      };
    }
    
    if (withImageBorder && imageUrl) {
      return {
        borderWidth: "2px",
        borderColor: borderColor || branding.brandColor,
      };
    }
    
    return {};
  };

  const avatarElement = (
    <div
      className={`
        ${getSizeClasses()}
        ${shape === "circle" ? "rounded-full" : "rounded-lg"}
        flex items-center justify-center
        font-semibold
        overflow-hidden
        transition-all
        ${view === "outlined" ? "border-2" : ""}
        ${className}
      `}
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
          className="w-full h-full object-cover"
          onError={(e) => {
            if (fallbackImgUrl) {
              e.currentTarget.src = fallbackImgUrl;
            }
          }}
        />
      ) : icon ? (
        <Icon data={icon} size={size === "xs" ? 12 : size === "s" ? 14 : size === "m" ? 16 : size === "l" ? 20 : 24} />
      ) : text ? (
        <span>{text.charAt(0).toUpperCase()}</span>
      ) : (
        <Icon data="user" size={size === "xs" ? 12 : size === "s" ? 14 : size === "m" ? 16 : size === "l" ? 20 : 24} />
      )}
    </div>
  );

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) return element;

    const isDark = theme === "dark" || theme === "dark-hc";
    const headerClasses = `text-sm font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`;

    switch (headerPosition) {
      case "top":
        return (
          <div className="flex flex-col items-center">
            <div className={headerClasses}>{headerText}</div>
            {element}
          </div>
        );
      case "bottom":
        return (
          <div className="flex flex-col items-center">
            {element}
            <div className={`${headerClasses} mt-1 mb-0`}>{headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className="flex items-center gap-2">
            <div className={`${headerClasses} mb-0`}>{headerText}</div>
            {element}
          </div>
        );
      case "right":
        return (
          <div className="flex items-center gap-2">
            {element}
            <div className={`${headerClasses} mb-0`}>{headerText}</div>
          </div>
        );
    }
  };

  const finalElement = renderWithHeader(avatarElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
