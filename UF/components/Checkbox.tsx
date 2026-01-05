"use client";

import React from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import {
  HeaderPosition,
  TooltipProps as TooltipPropsType,
} from "@/types/global";
import { getFontSizeClass } from "@/app/utils/branding";

type ContentAlign = "left" | "center" | "right";

interface CheckboxProps {
  checked?: boolean;
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
  fillContainer?: boolean;
  contentAlign?: ContentAlign;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
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
  fillContainer = true,
  contentAlign = "center"
}) => {
  const { theme, direction, branding } = useGlobal();

  const getCheckboxStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    const isDark = theme === "dark" || theme === "dark-hc";

    if (disabled) {
      styles.backgroundColor = isDark ? "#374151" : "#E5E7EB";
      styles.borderColor = isDark ? "#4B5563" : "#D1D5DB";
      styles.color = isDark ? "#6B7280" : "#9CA3AF";
    } else if (checked) {
      styles.backgroundColor = "var(--selection-color)";
      styles.borderColor = "var(--selection-color)";
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

  const getFillClasses = () => {
    if (!fillContainer) return "";
    return "w-full";
  };

  const getContentAlignClasses = () => {
    switch (contentAlign) {
      case "left":
        return "justify-start";
      case "right":
        return "justify-end";
      case "center":
      default:
        return "justify-center";
    }
  };

  const fontSizeClass = getFontSizeClass(branding.fontSize);
  
  const checkboxElement = (
    <label
      className={`
      flex items-center
      ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
      ${getContentAlignClasses()}
      ${fontSizeClass}
      ${getFillClasses()}
      ${fillContainer ? "h-full max-h-full overflow-hidden" : ""}
      ${className}
      `}
    >
      <div
        className={`relative flex-shrink-0 ${fillContainer ? "h-full max-h-full" : ""}`}
        style={fillContainer ? { aspectRatio: "1/1", maxHeight: "100%" } : {}}
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          onBlur={onBlur}
          className="sr-only"
        />
        <div
          style={{
            ...getCheckboxStyles(),
            borderRadius: "var(--border-radius)",
            ...(fillContainer ? { width: "100%", height: "100%" } : {}),
          }}
          className={`
            border-2 transition-all flex items-center justify-center
          `}
          onMouseEnter={(e) => {
            if (!disabled && !checked) {
              e.currentTarget.style.borderColor = "var(--hover-color)";
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && !checked) {
              const isDark = theme === "dark" || theme === "dark-hc";
              e.currentTarget.style.borderColor = isDark ? "#4B5563" : "#D1D5DB";
            }
          }}
        >
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
        </div>
      </div>
      {content && (
        <span
          className={`${direction === "RTL" ? "mr-2" : "ml-2"} ${getLabelThemeClasses()} overflow-hidden text-ellipsis whitespace-nowrap flex-shrink`}
        >
          {content}
        </span>
      )}
    </label>
  );

  const renderWithTitle = (element: React.ReactNode) => {
    if (!title) return element;

    const titleClasses = `${fontSizeClass} font-semibold mb-2 ${
      theme === "dark" || theme === "dark-hc" ? "text-gray-200" : "text-gray-800"
    } ${className}`;

    return (
      <div className="flex flex-col">
        <div className={titleClasses}>{title}</div>
        {element}
      </div>
    );
  };

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) return element;

    const headerClasses = `${fontSizeClass} font-semibold flex-shrink-0 ${
      theme === "dark" || theme === "dark-hc" ? "text-gray-300" : "text-gray-700"
    } ${className}`;

    switch (headerPosition) {
        case "top":
          return (
            <div className={`flex flex-col ${fillContainer ? "w-full h-full overflow-hidden" : ""}`}>
              <div className={`${headerClasses} mb-1`}>{headerText}</div>
              <div className={fillContainer ? "flex-1 min-h-0 flex items-center overflow-hidden" : ""}>{element}</div>
            </div>
          );
        case "bottom":
          return (
            <div className={`flex flex-col ${fillContainer ? "w-full h-full overflow-hidden" : ""}`}>
              <div className={fillContainer ? "flex-1 min-h-0 flex items-center overflow-hidden" : ""}>{element}</div>
              <div className={`${headerClasses} mt-1`}>{headerText}</div>
            </div>
          );
        case "left":
          return (
            <div className={`flex items-center ${fillContainer ? "w-full h-full overflow-hidden" : ""}`}>
              <div
                className={`${headerClasses} ${
                  direction === "RTL" ? "ml-2" : "mr-2"
                }`}
              >
                {headerText}
              </div>
              <div className={fillContainer ? "flex-1 min-w-0 flex items-center h-full overflow-hidden" : ""}>{element}</div>
            </div>
          );
        case "right":
          return (
            <div className={`flex items-center ${fillContainer ? "w-full h-full overflow-hidden" : ""}`}>
              <div className={fillContainer ? "flex-1 min-w-0 flex items-center h-full overflow-hidden" : ""}>{element}</div>
              <div
                className={`${headerClasses} ${
                  direction === "RTL" ? "mr-2" : "ml-2"
                }`}
              >
                {headerText}
              </div>
            </div>
          );
        default:
          return element;
      }
    };

  const finalElement = renderWithHeader(checkboxElement);

  const withTitle = renderWithTitle(checkboxElement);
  
  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
