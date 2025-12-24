"use client";

import React from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import * as ReactIconsMd from "react-icons/md";
import * as ReactIconsIo from "react-icons/io";
import * as ReactIconsFa from "react-icons/fa";
import * as ReactIconsIo5 from "react-icons/io5";

type ContentAlign = "left" | "center" | "right";

interface IconProps {
  data?: string;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  size?: number;
  headerPosition?: HeaderPosition;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  fillContainer?: boolean;
  contentAlign?: ContentAlign;
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
  size,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  className = "",
  onClick,
  fillContainer = true,
  contentAlign = "center",
}) => {
  const { theme } = useGlobal();
  const isDark = theme === "dark" || theme === "dark-hc";

  const getFillClasses = () => {
    if (!fillContainer) return "";
    return "w-full h-full";
  };

  const getContentAlignClasses = () => {
    switch (contentAlign) {
      case "left":
        return "justify-start items-start";
      case "right":
        return "justify-end items-end";
      case "center":
      default:
        return "justify-center items-center";
    }
  };
  
  const IconComponent = getIconComponent(data);
  
const iconElement = IconComponent ? (
  <div
    className={`
      ${fillContainer ? "w-full h-full" : "inline-flex"}
      flex items-center justify-center
    `}
    onClick={onClick}
  >
    <IconComponent className="w-full h-full"/>
  </div>
) : (
  <div
    className="flex items-center justify-center"
    onClick={onClick}
  >
    <svg
      width={size || "100%"}
      height={size || "100%"}
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
    if (!headerText) {
      return (
        <div className={`${fillContainer ? "flex" : "inline-flex"} ${getContentAlignClasses()} ${getFillClasses()} ${className}`}>
          {element}
        </div>
      );
    }

    const headerClasses = `font-semibold mb-2 ${
      isDark ? "text-gray-300" : "text-gray-700"
    }`;

    const headerStyle = { fontSize: "var(--font-size)" };

    switch (headerPosition) {
      case "top":
        return (
          <div className={`${fillContainer ? "flex" : "inline-flex"} flex-col ${getContentAlignClasses()} ${getFillClasses()} ${className}`}>
            <div className={headerClasses} style={headerStyle}>{headerText}</div>
            <div className={fillContainer ? "flex-1 min-h-0" : ""}>{element}</div>
          </div>
        );
      case "bottom":
        return (
          <div className={`${fillContainer ? "flex" : "inline-flex"} flex-col ${getContentAlignClasses()} ${getFillClasses()} ${className}`}>
            <div className={fillContainer ? "flex-1 min-h-0" : ""}>{element}</div>
            <div className={`${headerClasses} mt-2 mb-0`} style={headerStyle}>{headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className={`${fillContainer ? "flex" : "inline-flex"} items-start ${getFillClasses()} gap-4 ${className}`}>
            <div className={`${headerClasses} mb-0 whitespace-nowrap flex-shrink-0`} style={headerStyle}>
              {headerText}
            </div>
            <div className={fillContainer ? "flex-1 min-w-0 h-full" : ""}>{element}</div>
          </div>
        );
      case "right":
        return (
          <div className={`${fillContainer ? "flex" : "inline-flex"} items-start ${getFillClasses()} gap-4 ${className}`}>
            <div className={fillContainer ? "flex-1 min-w-0 h-full" : ""}>{element}</div>
            <div className={`${headerClasses} mb-0 whitespace-nowrap flex-shrink-0`} style={headerStyle}>
              {headerText}
            </div>
          </div>
        );
    }
  };

  // const finalElement = renderWithHeader(iconElement);
  const finalElement = (<div className={`${getFillClasses()} ${className }`}>{renderWithHeader(iconElement)}</div>);


  if (needTooltip && tooltipProps) {
    return (
      <Tooltip
        title={tooltipProps.title}
        placement={tooltipProps.placement}
      >
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
