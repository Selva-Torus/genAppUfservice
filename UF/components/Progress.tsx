"use client";

import React from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { ProgressTheme, HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass } from "@/app/utils/branding";

interface ProgressProps {
  theme: ProgressTheme;
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

  // Helper to convert hex to rgba for hover effect
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex?.slice(1, 3), 16);
    const g = parseInt(hex?.slice(3, 5), 16);
    const b = parseInt(hex?.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const isDark = theme === "dark" || theme === "dark-hc";
  const clampedValue = Math.min(100, Math.max(0, value));
  const fontSizeClass = getFontSizeClass(branding.fontSize);
  const progressColor = getProgressColor();

  const progressElement = (
    <div className={`w-full h-full flex flex-col ${className}`}>
      <div className="flex justify-between items-center mb-1">
        {text && (
          <span className={`${fontSizeClass} ${isDark ? "text-gray-200" : "text-gray-900"}`}>
            {text}
          </span>
        )}
        {isDynamic && (
          <span className={`${fontSizeClass} font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}>
            {clampedValue}%
          </span>
        )}
      </div>
      <div
        className={`w-full flex-1 ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded-full overflow-hidden transition-all duration-200`}
        style={{
          borderRadius: "var(--border-radius)",
        }}
      >
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${clampedValue}%`,
            backgroundColor: progressColor,
            borderRadius: "var(--border-radius)",
            boxShadow: `0 0 8px ${hexToRgba(progressColor, 0.4)}`,
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
          <div className="flex flex-col w-full h-full">
            <div className={headerClasses}>{headerText}</div>
            {element}
          </div>
        );
      case "bottom":
        return (
          <div className="flex flex-col w-full h-full">
            {element}
            <div className={`${headerClasses} mt-2 mb-0`}>{headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className="flex items-center w-full h-full gap-4">
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
            <div className="flex-1 h-full">{element}</div>
          </div>
        );
      case "right":
        return (
          <div className="flex items-center w-full h-full gap-4">
            <div className="flex-1 h-full">{element}</div>
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
        triggerClassName="block w-full h-full"
      >
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
