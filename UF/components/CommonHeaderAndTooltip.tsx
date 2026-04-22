"use client";

import React from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass, getBorderRadiusClass } from "@/app/utils/branding";



interface CommonHeaderAndTooltip {
  needTooltip?: boolean;
  fillContainer?:boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  className?: string;
  children?: React.ReactNode;
  required?: boolean;
}

export const CommonHeaderAndTooltip: React.FC<CommonHeaderAndTooltip> = ({
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  fillContainer = true,
   className = "",
   children,
   required = false,
}) => {
  const { theme,direction, branding } = useGlobal();
  const fontSizeClass = getFontSizeClass(branding.fontSize);
  const isDark = theme === "dark" || theme === "dark-hc";
  const tabsElement = (
    <div className={fillContainer ? "w-full h-full" : ""}>{children}</div>
  );
  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) return element;

    const headerClasses = `${fontSizeClass} font-semibold mb-2 ${
      isDark ? "text-gray-300" : "text-gray-700"
    }`;
    const headerContent = (
      <>
        {headerText}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </>
    );

     switch (headerPosition) {
      case 'top':
        return (
          <div
            className={`flex flex-col ${
              fillContainer ? 'h-full w-full' : ''
            } ${className}`}
          >
            <div className={headerClasses}>{headerContent}</div>
            <div className={fillContainer ? 'min-h-0 flex-1' : ''}>
              {element}
            </div>
          </div>
        )
      case 'bottom':
        return (
          <div
            className={`flex flex-col ${
              fillContainer ? 'h-full w-full' : ''
            } ${className}`}
          >
            <div className={fillContainer ? 'min-h-0 flex-1' : ''}>
              {element}
            </div>
            <div className={`${headerClasses} mb-0 mt-1`}>{headerContent}</div>
          </div>
        )
      case 'left':
        return (
          <div
            className={`flex items-center ${
              fillContainer ? 'h-full w-full' : ''
            } ${className}`}
          >
            <div
              className={`${headerClasses} mb-0 flex-shrink-0 ${
                direction === 'RTL' ? 'ml-2' : 'mr-2'
              }`}
            >
              {headerContent}
            </div>
            <div className={fillContainer ? 'h-full min-w-0 flex-1' : ''}>
              {element}
            </div>
          </div>
        )
      case 'right':
        return (
          <div
            className={`flex items-center ${
              fillContainer ? 'h-full w-full' : ''
            } ${className}`}
          >
            <div className={fillContainer ? 'h-full min-w-0 flex-1' : ''}>
              {element}
            </div>
            <div
              className={`${headerClasses} mb-0 flex-shrink-0 ${
                direction === 'RTL' ? 'mr-2' : 'ml-2'
              }`}
            >
              {headerContent}
            </div>
          </div>
        )
    }
  };

  const finalElement = renderWithHeader(tabsElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement} triggerClassName={fillContainer ? "h-full w-full" : ""}>
        <div className={`${fillContainer ? 'h-full w-full' : ''} ${className}`}>{finalElement}</div>
      </Tooltip>
    );
  }

  return <div className={`${fillContainer ? 'h-full w-full' : ''} ${className}`}>{finalElement}</div>;
};
 