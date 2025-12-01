"use client";

import React from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { SwitchSize, HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass } from "@/app/utils/branding";

interface SwitchProps {
  checked: boolean;
  size: SwitchSize;
  disabled?: boolean;
  content?: string;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  size,
  disabled = false,
  content,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  onChange,
  className = "",
}) => {
  const { theme, direction, branding } = useGlobal();

  const getSizeClasses = () => {
    switch (size) {
      case "m":
        return { container: "w-11 h-6", thumb: "w-5 h-5", translate: checked ? "translate-x-5" : "translate-x-0.5" };
      case "l":
        return { container: "w-14 h-7", thumb: "w-6 h-6", translate: checked ? "translate-x-7" : "translate-x-0.5" };
    }
  };

  const getSwitchStyles = (): React.CSSProperties => {
    const isDark = theme === "dark" || theme === "dark-hc";
    
    if (disabled) {
      return {
        backgroundColor: isDark ? "#374151" : "#E5E7EB",
        opacity: 0.5,
      };
    }
    
    if (checked) {
      return {
        backgroundColor: branding.selectionColor,
      };
    }
    
    return {
      backgroundColor: isDark ? "#4B5563" : "#D1D5DB",
    };
  };

  const sizes = getSizeClasses();

  const switchElement = (
    <label
      className={`inline-flex items-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      <div
        className={`${sizes.container} rounded-full relative transition-colors duration-200 ease-in-out`}
        style={getSwitchStyles()}
        onClick={() => !disabled && onChange?.(!checked)}
      >
        <div
          className={`${sizes.thumb} bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out absolute top-0.5 ${sizes.translate}`}
        />
      </div>
      {content && (
        <span
          className={`${direction === "RTL" ? "mr-3" : "ml-3"} ${getFontSizeClass(branding.fontSize)} ${
            theme === "dark" || theme === "dark-hc" ? "text-gray-200" : "text-gray-900"
          } ${disabled ? "opacity-50" : ""}`}
        >
          {content}
        </span>
      )}
    </label>
  );

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) return element;

    const headerClasses = `${getFontSizeClass(branding.fontSize)} font-semibold mb-1 ${
      theme === "dark" || theme === "dark-hc" ? "text-gray-300" : "text-gray-700"
    }`;

    switch (headerPosition) {
      case "top":
        return (
          <div className="flex flex-col">
            <div className={headerClasses}>{headerText}</div>
            {element}
          </div>
        );
      case "bottom":
        return (
          <div className="flex flex-col">
            {element}
            <div className={`${headerClasses} mt-1 mb-0`}>{headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className="flex items-center">
            <div className={`${headerClasses} mb-0 ${direction === "RTL" ? "ml-2" : "mr-2"}`}>
              {headerText}
            </div>
            {element}
          </div>
        );
      case "right":
        return (
          <div className="flex items-center">
            {element}
            <div className={`${headerClasses} mb-0 ${direction === "RTL" ? "mr-2" : "ml-2"}`}>
              {headerText}
            </div>
          </div>
        );
    }
  };

  const finalElement = renderWithHeader(switchElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
