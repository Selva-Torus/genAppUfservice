"use client";

import React, { useState, useRef } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass } from "@/app/utils/branding";
import { CommonHeaderAndTooltip } from "./CommonHeaderAndTooltip";
import { useInfoMsg } from "@/app/components/infoMsgHandler";

type ContentAlign = "left" | "center" | "right";

interface DatePickerProps {
  readOnly?: boolean;
  disabled?: boolean;
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
  fillContainer?: boolean;
  contentAlign?: ContentAlign;
  required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  readOnly = false,
  disabled = false,
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
  fillContainer = true,
  contentAlign = "center",
  required = false,
}) => {
  const { theme, direction,branding } = useGlobal();
  const showToast = useInfoMsg();
  const prevValidationState = useRef(validationState);

  React.useEffect(() => {
    if (validationState === "invalid" && errorMessage && prevValidationState.current !== "invalid") {
      showToast(errorMessage, "danger");
    }
    prevValidationState.current = validationState;
  }, [validationState, errorMessage]);

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

  const isDark = theme === "dark" || theme === "dark-hc";
  const fontSizeClass = getFontSizeClass(branding.fontSize);

  const datePickerElement = (
    <div className={`
    flex flex-col
    ${getContentAlignClasses()}
    ${fillContainer ? "w-full h-full" : ""}
    ${fontSizeClass}
    overflow-hidden
    `}
      style={style}>
      {label && (
        <label
          className={`${fontSizeClass} ${getContentAlignClasses()} block mb-2 font-medium flex-shrink-0 ${isDark ? "text-gray-200" : "text-gray-700"} ${className}`}
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
          w-full flex-1 min-h-0
          border-2 pl-2 pr-2
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${readOnly ? "cursor-default" : ""}
          ${validationState === "invalid" ? "border-red-500" : isDark ? "border-gray-600" : "border-gray-300"}
          ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
          transition-colors
          focus:outline-none
          ${fillContainer ? "w-full h-full" : ""}
          ${fontSizeClass}
          ${getContentAlignClasses()}
          ${className}
        `}
        style={{
          borderRadius: "var(--border-radius)",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          if (!disabled && !readOnly && validationState !== "invalid") {
            e.currentTarget.style.borderColor = branding.hoverColor;
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !readOnly && validationState !== "invalid" && document.activeElement !== e.currentTarget) {
            e.currentTarget.style.borderColor = "";
          }
        }}
        onFocus={(e) => {
          if (!disabled && !readOnly && validationState !== "invalid") {
            e.currentTarget.style.borderColor = branding.selectionColor;
          }
        }}
        onBlur={(e) => {
          if (!disabled && !readOnly && validationState !== "invalid") {
            e.currentTarget.style.borderColor = "";
          }
          onBlur?.(e);
        }}
      />
    </div>
  );

  return (
    <CommonHeaderAndTooltip
      needTooltip={needTooltip}
      tooltipProps={tooltipProps}
      headerText={headerText}
      headerPosition={headerPosition}
      className={className}
      fillContainer={fillContainer}
      required={required}
    >
      {datePickerElement}
    </CommonHeaderAndTooltip>
  )
};