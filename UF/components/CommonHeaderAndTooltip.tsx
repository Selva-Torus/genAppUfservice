"use client";

import React from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass, getBorderRadiusClass } from "@/app/utils/branding";



interface CommonHeaderAndTooltip {
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  className?: string;
  children?: React.ReactNode;
}

export const CommonHeaderAndTooltip: React.FC<CommonHeaderAndTooltip> = ({
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
   className = "",
   children,    
}) => {
  const { theme, branding } = useGlobal();
  const fontSizeClass = getFontSizeClass(branding.fontSize);
  const isDark = theme === "dark" || theme === "dark-hc";
  const tabsElement = (
    <div className="w-full h-full">{children}</div>
  );
  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) return element;

    const headerClasses = `${fontSizeClass} font-semibold mb-2 ${
      isDark ? "text-gray-300" : "text-gray-700"
    }`;

    switch (headerPosition) {
      case "top":
        return (
          <div className={`flex flex-col w-full h-full ${className}`}>
            <div className={headerClasses}>{headerText}</div>
            {element}
          </div>
        );
      case "bottom":
        return (
          <div className={`flex flex-col w-full h-full ${className}`}>
            {element}
            <div className={`${headerClasses} mt-2 mb-0`}>{headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className={`flex items-start gap-4 w-full h-full ${className}`}>
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
            <div className="flex-1 h-full">{element}</div>
          </div>
        );
      case "right":
        return (
          <div className={`flex items-start gap-4 w-full h-full ${className}`}>
            <div className="flex-1 h-full">{element}</div>
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
          </div>
        );
    }
  };

  const finalElement = renderWithHeader(tabsElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement} triggerClassName="h-full w-full">
        <div className={`h-full w-full ${className}`}>{finalElement}</div>
      </Tooltip>
    );
  }

  return <div className={`h-full w-full ${className}`}>{finalElement}</div>;
};
 