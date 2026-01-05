"use client";

import React from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";

type ContentAlign = "left" | "center" | "right";

interface ImageProps {
  url: string;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  alt?: string;
  className?: string;
  fillContainer?: boolean;
  contentAlign?: ContentAlign;
}

export const Image: React.FC<ImageProps> = ({
  url,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  alt = "",
  className = "",
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

  const imageElement = (
    <img
      src={url}
      alt={alt}
      style={{
        width:"100%",
        height:"100%",
        borderRadius: "var(--border-radius)"
      }}
    />
  );

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) {
      return (
        <div className={`${fillContainer ? "flex w-full h-full" : "inline-flex"} ${getContentAlignClasses()} ${getFillClasses()} ${className}`}>
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
          <div className={`${fillContainer ? "flex" : "inline-flex"} flex-col  ${getFillClasses()} ${className}`}>
            <div className={headerClasses} style={headerStyle}>{headerText}</div>
            <div className={fillContainer ? "flex-1 min-h-0" : ""}>{element}</div>
          </div>
        );
      case "bottom":
        return (
          <div className={`${fillContainer ? "flex" : "inline-flex"} flex-col  ${getFillClasses()} ${className}`}>
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

  const finalElement = (<div className={`${fillContainer ? "w-full h-full" : ""} `}>{renderWithHeader(imageElement)}</div>);

  // const finalElement = renderWithHeader(imageElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip
        title={tooltipProps.title}
        placement={tooltipProps.placement}
        triggerClassName="inline-flex"
      >
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
