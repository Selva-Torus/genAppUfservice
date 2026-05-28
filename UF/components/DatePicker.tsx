"use client";

import React, { useState, useRef } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
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
  required = false
}) => {
  const { theme, direction, branding,displayFormat } = useGlobal();
  const showToast = useInfoMsg();
  const prevValidationState = useRef(validationState);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (validationState === "invalid" && errorMessage && prevValidationState.current !== "invalid") {
      showToast(errorMessage, "danger");
    }
    prevValidationState.current = validationState;
  }, [validationState, errorMessage]);

  const getDateString = (val: string | Date | null): string => {
    if (!val) return "";
    if (val instanceof Date) return val.toISOString().split("T")[0];
    if (typeof val === "string") {
      try {
        const date = new Date(val);
        return date.toISOString().split("T")[0];
      } catch {
        return val;
      }
    }
    return "";
  };

  // Display-only formatting — onChange always emits raw YYYY-MM-DD
  const formatDateDisplay = (dateStr: string): string => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    switch (displayFormat?.datePickerProperty?.dateDisplayFormat||"DD-MM-YYYY") {
      case "DD-MM-YYYY": return `${day}-${month}-${year}`;
      case "d,M,yyyy":      return `${parseInt(day)},${parseInt(month)},${year}`;
      default:           return `${year}-${month}-${day}`;
    }
  };

  const [dateValue, setDateValue] = useState(getDateString(value));

  React.useEffect(() => {
    setDateValue(getDateString(value));
  }, [value]);

  const handleChange = (newValue: string) => {
    setDateValue(newValue);
    onChange?.(newValue);
    onUpdate?.(newValue);
  };

  const openPicker = () => {
    if (disabled || readOnly) return;
    try {
      hiddenInputRef.current?.showPicker();
    } catch {
      hiddenInputRef.current?.click();
    }
  };

  const setBorderColor = (color: string) => {
    if (wrapperRef.current) wrapperRef.current.style.borderColor = color;
  };

  const getContentAlignClasses = () => {
    switch (contentAlign) {
      case "left":   return "justify-start";
      case "right":  return "justify-end";
      default:       return "justify-center";
    }
  };

  const isDark = theme === "dark" || theme === "dark-hc";

  const datePickerElement = (
    <div
      className={`flex flex-col ${getContentAlignClasses()} ${fillContainer ? "w-full h-full" : ""}  overflow-hidden`}
      style={style}
    >
      {label && (
        <label className={`${getContentAlignClasses()} block mb-2 font-medium flex-shrink-0 ${isDark ? "text-gray-200" : "text-gray-700"} ${className}`}>
          {label}
        </label>
      )}

      {/* Display box — always shows our formatted text, browser locale never interferes */}
      <div
        ref={wrapperRef}
        onClick={openPicker}
        className={`
          relative flex-1 min-h-0 flex items-center
          border-2 px-2
          ${disabled ? "opacity-50 cursor-not-allowed" : readOnly ? "cursor-default" : "cursor-pointer"}
          ${validationState === "invalid" ? "border-red-500" : isDark ? "border-gray-600" : "border-gray-300"}
          ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
          ${fillContainer ? "w-full h-full" : ""}
          ${getContentAlignClasses()}
          transition-colors
          ${className}
        `}
        style={{ borderRadius: "var(--border-radius)", overflow: "hidden" }}
        onMouseEnter={() => {
          if (!disabled && !readOnly && validationState !== "invalid") setBorderColor(branding.hoverColor);
        }}
        onMouseLeave={() => {
          if (!disabled && !readOnly && validationState !== "invalid") setBorderColor("");
        }}
      >
        <span className={`pointer-events-none select-none flex-1 ${!dateValue ? (isDark ? "text-gray-500" : "text-gray-400") : ""}`}>
          {dateValue ? formatDateDisplay(dateValue) : (displayFormat?.datePickerProperty?.dateDisplayFormat||"DD-MM-YYYY").toLowerCase()}
        </span>

        {/* Calendar icon */}
        <svg className="w-4 h-4 opacity-50 flex-shrink-0 ml-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2"/>
          <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round"/>
          <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round"/>
          <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
        </svg>

        {/* Hidden native date input — only used for picker UI */}
        <input
          ref={hiddenInputRef}
          type="date"
          value={dateValue}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
          readOnly={readOnly}
          tabIndex={-1}
          className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
          onFocus={() => {
            if (!disabled && !readOnly && validationState !== "invalid") setBorderColor(branding.selectionColor);
          }}
          onBlur={(e) => {
            if (!disabled && !readOnly && validationState !== "invalid") setBorderColor("");
            onBlur?.(e);
          }}
        />
      </div>
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
  );
};
