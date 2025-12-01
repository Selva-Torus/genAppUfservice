"use client";

import React from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { ProgressTheme, ProgressSize, HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass } from "@/app/utils/branding";

interface ProgressProps {
  theme: ProgressTheme;
  size: ProgressSize;
  isDynamic?: boolean;
  text?: string;
  value: number;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  theme: progressTheme,
  size,
  isDynamic = false,
  text,
  value,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  className = "",
}) => {
  const { theme, direction, branding } = useGlobal();

  const getHeightClass = () => {
    switch (size) {
      case "xs":
        return "h-1";
      case "s":
        return "h-2";
      case "m":
        return "h-3";
    }
  };

  const getProgressColor = () => {
    switch (progressTheme) {
      case "default":
        return branding.brandColor;
      case "info":
        return "#3B82F6";
      case "success":
        return "#10B981";
      case "warning":
        return "#F59E0B";
      case "danger":
        return "#EF4444";
      case "misc":
        return "#8B5CF6";
    }
  };

  const isDark = theme === "dark" || theme === "dark-hc";
  const clampedValue = Math.min(100, Math.max(0, value));

  const progressElement = (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        {text && (
          <span className={`${getFontSizeClass(branding.fontSize)} ${isDark ? "text-gray-200" : "text-gray-900"}`}>
            {text}
          </span>
        )}
        {isDynamic && (
          <span className={`${getFontSizeClass(branding.fontSize)} font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}>
            {clampedValue}%
          </span>
        )}
      </div>
      <div
        className={`w-full ${getHeightClass()} ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded-full overflow-hidden`}
      >
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${clampedValue}%`,
            backgroundColor: getProgressColor(),
          }}
        />
      </div>
    </div>
  );

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) return element;

    const headerClasses = `${getFontSizeClass(branding.fontSize)} font-semibold mb-1 ${
      isDark ? "text-gray-300" : "text-gray-700"
    }`;

    switch (headerPosition) {
      case "top":
        return (
          <div className="flex flex-col w-full">
            <div className={headerClasses}>{headerText}</div>
            {element}
          </div>
        );
      case "bottom":
        return (
          <div className="flex flex-col w-full">
            {element}
            <div className={`${headerClasses} mt-2 mb-0`}>{headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className="flex items-center w-full gap-4">
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
            <div className="flex-1">{element}</div>
          </div>
        );
      case "right":
        return (
          <div className="flex items-center w-full gap-4">
            <div className="flex-1">{element}</div>
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
          </div>
        );
    }
  };

  const finalElement = renderWithHeader(progressElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip
        title={tooltipProps.title}
        placement={tooltipProps.placement}
        triggerClassName="block w-full"
      >
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
