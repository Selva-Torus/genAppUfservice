"use client";

import React from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import {
  CheckboxSize,
  HeaderPosition,
  TooltipProps as TooltipPropsType,
} from "@/types/global";
import { getFontSizeClass, getBorderRadiusClass, applyBrandColor } from "@/app/utils/branding";

interface CheckboxProps {
  checked?: boolean;
  size?: CheckboxSize;
  disabled?: boolean;
  content?: string;
  title?: string;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  onChange?: (checked: boolean) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  value?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  size,
  disabled = false,
  content,
  title,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  onChange,
  onBlur,
  className = "",
  value,
}) => {
  const { theme, direction, branding } = useGlobal();

  const getSizeClasses = () => {
    switch (size) {
      case "m":
        return "w-5 h-5";
      case "l":
        return "w-6 h-6";
    }
  };

  const getCheckboxStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    const isDark = theme === "dark" || theme === "dark-hc";
    
    if (disabled) {
      styles.backgroundColor = isDark ? "#374151" : "#E5E7EB";
      styles.borderColor = isDark ? "#4B5563" : "#D1D5DB";
      styles.color = isDark ? "#6B7280" : "#9CA3AF";
    } else if (checked) {
      styles.backgroundColor = branding.selectionColor;
      styles.borderColor = branding.selectionColor;
      styles.color = "white";
    } else {
      styles.backgroundColor = isDark ? "#1F2937" : "white";
      styles.borderColor = isDark ? "#4B5563" : "#D1D5DB";
      styles.color = "transparent";
    }
    
    return styles;
  };

  const getLabelThemeClasses = () => {
    const isDark = theme === "dark" || theme === "dark-hc";
    return isDark ? "text-gray-200" : "text-gray-900";
  };

  const getCheckboxBorderRadius = () => {
    return getBorderRadiusClass(branding.borderRadius);
  };

  const checkboxElement = (
    <label
      className={`inline-flex items-center ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${className}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          onBlur={onBlur}
          className="sr-only"
        />
        <div
          style={getCheckboxStyles()}
          className={`
            ${getSizeClasses()}
            ${getCheckboxBorderRadius()}
            border-2 transition-all flex items-center justify-center
          `}
          onMouseEnter={(e) => {
            if (!disabled && !checked) {
              e.currentTarget.style.borderColor = branding.hoverColor;
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && !checked) {
              const isDark = theme === "dark" || theme === "dark-hc";
              e.currentTarget.style.borderColor = isDark ? "#4B5563" : "#D1D5DB";
            }
          }}
        >
          {checked && (
            <svg
              className="w-full h-full p-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      {content && (
        <span
          className={`${direction === "RTL" ? "mr-2" : "ml-2"} ${getFontSizeClass(branding.fontSize)} ${getLabelThemeClasses()}`}
        >
          {content}
        </span>
      )}
    </label>
  );

  const renderWithTitle = (element: React.ReactNode) => {
    if (!title) return element;

    const titleSize = branding.fontSize === "Small" ? "text-base" : 
                      branding.fontSize === "Medium" ? "text-lg" :
                      branding.fontSize === "Large" ? "text-xl" : "text-2xl";
    
    const titleClasses = `font-semibold mb-2 ${titleSize} ${
      theme === "dark" || theme === "dark-hc" ? "text-gray-200" : "text-gray-800"
    }`;

    return (
      <div className="flex flex-col">
        <div className={titleClasses}>{title}</div>
        {element}
      </div>
    );
  };

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

  const withTitle = renderWithTitle(checkboxElement);
  const finalElement = renderWithHeader(withTitle);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
