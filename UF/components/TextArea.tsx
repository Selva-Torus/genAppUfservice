"use client";

import React, { useState } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { ComponentSize, TextAreaPin, HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass, getBorderRadiusClass } from "@/app/utils/branding";

interface TextAreaProps {
  disabled?: boolean;
  minRows: number;
  maxRows: number;
  pin?: TextAreaPin;
  placeholder?: string;
  readOnly?: boolean;
  size: ComponentSize;
  value?: string;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  onChange?: (value: any) => void;
  onBlur?: (value: any) => void;
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  disabled = false,
  minRows,
  maxRows,
  pin = "",
  placeholder,
  readOnly = false,
  size,
  value = "",
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  onChange,
  onBlur,
  className = "",
}) => {
  const { theme, direction, branding } = useGlobal();
  const [internalValue, setInternalValue] = useState(value);
  const getSizeClasses = () => {
    const fontSize = getFontSizeClass(branding.fontSize);
    switch (size) {
      case "s":
        return `px-3 py-2 ${fontSize === "text-xl" ? "text-base" : fontSize === "text-lg" ? "text-sm" : "text-xs"}`;
      case "m":
        return `px-4 py-2.5 ${fontSize}`;
      case "l":
        return `px-5 py-3 ${fontSize === "text-sm" ? "text-base" : fontSize === "text-base" ? "text-lg" : "text-xl"}`;
      case "xl":
        return `px-6 py-4 ${fontSize === "text-sm" ? "text-lg" : fontSize === "text-base" ? "text-xl" : "text-2xl"}`;
      default:
        return `px-4 py-2.5 ${fontSize}`;
    }
  };

  const getPinClasses = () => {
    if (!pin) return "";
    const baseRadius = getBorderRadiusClass(branding.borderRadius);
    
    if (pin === "clear-clear") {
      return baseRadius;
    }
    
    const [left, right] = pin.split("-");
    const leftRadius =
      left === "round" ? "rounded-l-2xl" :
      left === "brick" ? "rounded-l-none" :
      `rounded-l${baseRadius.replace("rounded", "")}`;
    const rightRadius =
      right === "round" ? "rounded-r-2xl" :
      right === "brick" ? "rounded-r-none" :
      `rounded-r${baseRadius.replace("rounded", "")}`;
    
    return `${leftRadius} ${rightRadius}`;
  };

  const isDark = theme === "dark" || theme === "dark-hc";

  const textAreaElement = (
    <div className={`w-full `}>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}

        rows={minRows}
        style={{
          maxHeight: `${maxRows * 1.5}em`,
          resize: "vertical",
        }}
        className={`
          w-full
          ${getSizeClasses()}
          ${getPinClasses()}
          ${className}
          border-2
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-opacity-50
        `}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--brand-color)";
          e.currentTarget.style.boxShadow = `0 0 0 2px var(--brand-color) 20`;
        }}
        onBlur={onBlur}
      />
    </div>
  );

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) return <div className={className} >{element}</div>;

    const headerClasses = ` font-semibold mb-1 ${
      isDark ? "text-gray-300" : "text-gray-700"
    }`;

    switch (headerPosition) {
      case "top":
        return (
          <div className={`flex flex-col w-full ${className}`}>
            <div className={headerClasses}>{headerText}</div>
            {element}
          </div>
        );
      case "bottom":
        return (
          <div className={`flex flex-col w-full ${className}`}>
            {element}
            <div className={`${headerClasses} mt-2 mb-0`}>{headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className={`flex items-start gap-4 w-full ${className}`}>
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
            <div className="flex-1">{element}</div>
          </div>
        );
      case "right":
        return (
          <div className={`flex items-start gap-4 w-full ${className}`}>
            <div className="flex-1">{element}</div>
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
          </div>
        );
    }
  };

  const finalElement = renderWithHeader(textAreaElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
