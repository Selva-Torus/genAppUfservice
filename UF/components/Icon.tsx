"use client";

import React from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass } from "@/app/utils/branding";
import * as ReactIconsMd from "react-icons/md";
import * as ReactIconsIo from "react-icons/io";
import * as ReactIconsFa from "react-icons/fa";
import * as ReactIconsIo5 from "react-icons/io5";

interface IconProps {
  data?: string;
  size?: number;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  className?: string;
}
const getIconComponent = (iconName?: string) => {
  if (!iconName) return null;
  const MdIcon = (ReactIconsMd as any)[iconName];
  if (MdIcon) return MdIcon;
  const FaIcon = (ReactIconsFa as any)[iconName];
  if (FaIcon) return FaIcon;
  const Io5Icon = (ReactIconsIo5 as any)[iconName];
  if (Io5Icon) return Io5Icon;
  const IoIcon = (ReactIconsIo as any)[iconName];
  if (IoIcon) return IoIcon;
  return null;
};

export const Icon: React.FC<IconProps> = ({
  data,
  size = 45,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  className = ""
}) => {
  const { theme, branding } = useGlobal();
  const isDark = theme === "dark" || theme === "dark-hc";
  
  const IconComponent = getIconComponent(data);
  
  const iconElement = IconComponent ? (
    <IconComponent
      className={className}
      size={size}
    />
  ) : (
    <div
      className={className}
      style={{ width: size, height: size, display: 'inline-block' }}
    >
      {/* Fallback if icon not found */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
  );

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) return element;

    const headerClasses = `${getFontSizeClass(branding.fontSize)} font-semibold mb-2 ${
      isDark ? "text-gray-300" : "text-gray-700"
    }`;

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
            <div className={`${headerClasses} mt-2 mb-0`}>{headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className="flex items-center gap-4">
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
            {element}
          </div>
        );
      case "right":
        return (
          <div className="flex items-center gap-4">
            {element}
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
          </div>
        );
    }
  };

  const finalElement = renderWithHeader(iconElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
