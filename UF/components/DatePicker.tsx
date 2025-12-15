"use client";

import React, { useState } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { ComponentSize, HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";

interface DatePickerProps {
  readOnly?: boolean;
  disabled?: boolean;
  size?: ComponentSize;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  value?: string | Date | null;
  onChange?: (date: string) => void;
  onUpdate?: (date: string) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  label?: string;
  style?: React.CSSProperties;
  validationState?: "invalid" | undefined;
  errorMessage?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  readOnly = false,
  disabled = false,
  size = "m",
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  value = "",
  onChange,
  onUpdate,
  onBlur,
  className = "",
  label,
  style,
  validationState,
  errorMessage,
}) => {
  const { theme, direction } = useGlobal();

  // Convert value to string format for input
  const getDateString = (val: string | Date | null): string => {
    if (!val) return "";
    if (val instanceof Date) {
      return val.toISOString().split('T')[0];
    }
    if (typeof val === 'string') {
      try {
        const date = new Date(val);
        return date.toISOString().split('T')[0];
      } catch {
        return val;
      }
    }
    return "";
  };

  const [dateValue, setDateValue] = useState(getDateString(value));

  // Update internal state when value prop changes
  React.useEffect(() => {
    setDateValue(getDateString(value));
  }, [value]);

  const handleChange = (newValue: string) => {
    setDateValue(newValue);
    onChange?.(newValue);
    onUpdate?.(newValue);
  };

  const getSizeClasses = () => {
    switch (size) {
      case "s":
        return "px-3 py-1.5";
      case "m":
        return "px-4 py-2";
      case "l":
        return "px-5 py-2.5";
      case "xl":
        return "px-6 py-3";
      default:
        return "px-4 py-2";
    }
  };

  const getFontSizeForSize = () => {
    switch (size) {
      case "s":
        return "var(--font-size-small)";
      case "m":
        return "var(--font-size)";
      case "l":
        return "var(--font-size-large)";
      case "xl":
        return "var(--font-size-xlarge)";
      default:
        return "var(--font-size)";
    }
  };

  const isDark = theme === "dark" || theme === "dark-hc";

  const datePickerElement = (
    <div className="w-full" style={style}>
      {label && (
        <label
          className={`block mb-2 font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}
          style={{ fontSize: "var(--font-size)" }}
        >
          {label}
        </label>
      )}
      <input
        type="date"
        value={dateValue}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        readOnly={readOnly}
        className={`
          w-full
          ${getSizeClasses()}
          border-2
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${readOnly ? "cursor-default" : ""}
          ${validationState === "invalid" ? "border-red-500" : isDark ? "border-gray-600" : "border-gray-300"}
          ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
          transition-colors
          focus:outline-none
          ${className}
        `}
        style={{
          fontSize: getFontSizeForSize(),
          borderRadius: "var(--border-radius)",
        }}
        onFocus={(e) => {
          if (validationState !== "invalid") {
            e.currentTarget.style.borderColor = "var(--brand-color)";
            e.currentTarget.style.boxShadow = "0 0 0 2px var(--brand-color-transparent)";
          }
        }}
        onBlur={(e) => {
          if (validationState !== "invalid") {
            e.currentTarget.style.borderColor = isDark ? "#4B5563" : "#D1D5DB";
            e.currentTarget.style.boxShadow = "none";
          }
          onBlur?.(e);
        }}
      />
      {validationState === "invalid" && errorMessage && (
        <div className="mt-1 text-sm text-red-500">{errorMessage}</div>
      )}
    </div>
  );

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) return element;

    const headerClasses = `font-semibold mb-2 ${
      isDark ? "text-gray-300" : "text-gray-700"
    }`;

    const headerStyle = { fontSize: "var(--font-size)" };

    switch (headerPosition) {
      case "top":
        return (
          <div className="flex flex-col">
            <div className={headerClasses} style={headerStyle}>{headerText}</div>
            {element}
          </div>
        );
      case "bottom":
        return (
          <div className="flex flex-col">
            {element}
            <div className={`${headerClasses} mt-2 mb-0`} style={headerStyle}>{headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className="flex items-center gap-4">
            <div className={`${headerClasses} mb-0 whitespace-nowrap`} style={headerStyle}>
              {headerText}
            </div>
            {element}
          </div>
        );
      case "right":
        return (
          <div className="flex items-center gap-4">
            {element}
            <div className={`${headerClasses} mb-0 whitespace-nowrap`} style={headerStyle}>
              {headerText}
            </div>
          </div>
        );
    }
  };

  const finalElement = (<div className={className}>{renderWithHeader(datePickerElement)}</div>);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
