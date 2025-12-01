"use client";

import React from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { RadioSize, HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass } from "@/app/utils/branding";

interface RadioProps {
  checked?: boolean;
  size?: RadioSize;
  disabled?: boolean;
  content?: string;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  value?: string;
  name?: string;
  onClick?: (checked: boolean) => void;
  onChange?: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Radio: React.FC<RadioProps> = ({
  checked,
  size,
  disabled = false,
  content,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  value = "",
  name,
  onChange,
  onBlur,
  onFocus,
  onClick,
  className = "",
}) => {
  const { theme, direction, branding } = useGlobal();

  const getSizeClasses = () => {
    switch (size) {
      case "s":
        return "w-4 h-4";
      case "m":
        return "w-5 h-5";
      case "l":
        return "w-6 h-6";
      case "xl":
        return "w-7 h-7";
    }
  };

  const getRadioStyles = (): React.CSSProperties => {
    const isDark = theme === "dark" || theme === "dark-hc";
    
    if (disabled) {
      return {
        backgroundColor: isDark ? "#374151" : "#E5E7EB",
        borderColor: isDark ? "#4B5563" : "#D1D5DB",
      };
    }
    
    if (checked) {
      return {
        borderColor: branding.selectionColor,
        borderWidth: size === "s" ? "4px" : size === "m" ? "5px" : size === "l" ? "6px" : "7px",
      };
    }
    
    return {
      backgroundColor: isDark ? "#1F2937" : "white",
      borderColor: isDark ? "#4B5563" : "#D1D5DB",
      borderWidth: "2px",
    };
  };

    const handleClick = (e: React.MouseEvent) => {
    if (!disabled) {
      e.preventDefault();
      onClick?.(!checked);
      onChange?.(value);
    }
  };

  const radioElement = (
    <label
      className={`inline-flex items-center ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${className}`}
      onClick={handleClick}
    >
      <input
        type="radio"
        checked={checked}
        disabled={disabled}
        name={name}
        value={value}
        onChange={() => onChange?.(value)}
        onBlur={onBlur}
        onFocus={onFocus}
        className="sr-only"
      />
      <div
        style={getRadioStyles()}
        className={`${getSizeClasses()} rounded-full border transition-all`}
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
      />
      {content && (
        <span
          className={`${direction === "RTL" ? "mr-2" : "ml-2"} ${getFontSizeClass(branding.fontSize)} ${
            theme === "dark" || theme === "dark-hc" ? "text-gray-200" : "text-gray-900"
          }`}
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

  const finalElement = renderWithHeader(radioElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
