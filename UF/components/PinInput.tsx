"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { ComponentSize, HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";

interface PinInputProps {
  length: number;
  size?: ComponentSize;
  value?: string;
  disabled?: boolean;
  placeholder?: string;
  mask?: boolean;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  className?: string;
}

export const PinInput: React.FC<PinInputProps> = ({
  length,
  size,
  value,
  disabled = false,
  placeholder = "",
  mask = false,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  onChange,
  onBlur,
  className = "",
}) => {
  const { theme, direction } = useGlobal();

  // Initialize state from value prop or empty array
  const getInitialValues = () => {
    if (value) {
      const chars = value.split('').slice(0, length);
      return [...chars, ...Array(length - chars.length).fill('')];
    }
    return Array(length).fill("");
  };

  const [values, setValues] = useState<string[]>(getInitialValues());
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync internal state with external value prop
  useEffect(() => {
    if (value !== undefined) {
      const chars = value.split('').slice(0, length);
      const newValues = [...chars, ...Array(length - chars.length).fill('')];
      setValues(newValues);
    }
  }, [value, length]);

  const handleChange = (index: number, value: string) => {
    // Only allow numeric input
    if (value && !/^\d$/.test(value)) {
      return;
    }

    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
    onChange?.(newValues.join(""));

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "xs":
        return "w-8 h-8";
      case "s":
        return "w-10 h-10";
      case "m":
        return "w-12 h-12";
      case "l":
        return "w-14 h-14";
      case "xl":
        return "w-16 h-16";
      default:
        return "w-12 h-12";
    }
  };

  const getFontSizeForSize = () => {
    switch (size) {
      case "xs":
        return "var(--font-size-small)";
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

  const pinInputElement = (
    <div className={`flex gap-2 ${direction === "RTL" ? "flex-row-reverse" : ""} ${className}`}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el:any) => (inputRefs.current[index] = el)}
          type={mask ? "password" : "text"}
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={values[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            ${getSizeClasses()}
            border-2
            text-center
            font-semibold
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}
            transition-colors
            focus:outline-none
          `}
          style={{
            fontSize: getFontSizeForSize(),
            borderRadius: "var(--border-radius)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--brand-color)";
            e.currentTarget.style.boxShadow = "0 0 0 2px var(--brand-color-transparent)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = isDark ? "#4B5563" : "#D1D5DB";
            e.currentTarget.style.boxShadow = "none";
            // Call onBlur callback with the complete PIN value
            onBlur?.(values.join(""));
          }}
        />
      ))}
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

  const finalElement = (<div className={className}>{renderWithHeader(pinInputElement)}</div>);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
