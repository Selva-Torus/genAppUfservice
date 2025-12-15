"use client";

import React, { useState } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { ComponentSize, HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass, getBorderRadiusClass } from "@/app/utils/branding";

interface RadioButtonItem {
  value: string;
  content: string;
}

interface RadioButtonProps {
  size: ComponentSize;
  disabled?: boolean;
  items: RadioButtonItem[];
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  onChange?: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
  defaultValue?: string;
  className?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  size,
  disabled = false,
  items,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  onChange,
  onBlur,
  onFocus,
  defaultValue,
  className = "",
}) => {
  const { theme, direction, branding } = useGlobal();
  const [selectedValue, setSelectedValue] = useState(defaultValue || items[0]?.value || "");

  const handleChange = (value: string) => {
    if (!disabled) {
      setSelectedValue(value);
      onChange?.(value);
    }
  };

  const getSizeClasses = () => {
    const fontSize = getFontSizeClass(branding.fontSize);
    switch (size) {
      case "xs":
        return `px-2 py-1 ${fontSize === "text-xl" ? "text-sm" : fontSize === "text-lg" ? "text-xs" : "text-xs"}`;
      case "s":
        return `px-3 py-1.5 ${fontSize === "text-xl" ? "text-base" : fontSize === "text-lg" ? "text-sm" : "text-xs"}`;
      case "m":
        return `px-4 py-2 ${fontSize}`;
      case "l":
        return `px-5 py-2.5 ${fontSize === "text-sm" ? "text-base" : fontSize === "text-base" ? "text-lg" : "text-xl"}`;
      case "xl":
        return `px-6 py-3 ${fontSize === "text-sm" ? "text-lg" : fontSize === "text-base" ? "text-xl" : "text-2xl"}`;
      default:
        return `px-4 py-2 ${fontSize}`;
    }
  };

  const isDark = theme === "dark" || theme === "dark-hc";

  const radioButtonElement = (
    <div className={`inline-flex [border-radius:var(--border-radius)] overflow-hidden ${
      isDark ? "bg-gray-800" : "bg-gray-100"
    } p-1 ${direction === "RTL" ? "flex-row-reverse" : ""}`}>
      {items.map((item) => {
        const isSelected = selectedValue === item.value;
        return (
          <button
            key={item.value}
            onClick={() => handleChange(item.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled}
            className={`
              ${getSizeClasses()}
              [border-radius:var(--border-radius)]
              font-medium
              transition-all
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              ${isSelected
                ? `text-white`
                : isDark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
              }
            `}
            style={{
              backgroundColor: isSelected ? "var(--brand-color)" : "transparent",
            }}
          >
            {item.content}
          </button>
        );
      })}
    </div>
  );

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) return <div className={className}>{element}</div>;

    const headerClasses = ` font-semibold mb-2 ${
      isDark ? "text-gray-300" : "text-gray-700"
    }`;

    switch (headerPosition) {
      case "top":
        return (
          <div className={`inline-flex flex-col ${className}`}>
            <div className={headerClasses}>{headerText}</div>
            {element}
          </div>
        );
      case "bottom":
        return (
          <div className={`inline-flex flex-col ${className}`}>
            {element}
            <div className={`${headerClasses} mt-2 mb-0`}>{headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className={`inline-flex items-center gap-4 ${className}`}>
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
            {element}
          </div>
        );
      case "right":
        return (
          <div className={`inline-flex items-center gap-4 ${className}`}>
            {element}
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
          </div>
        );
    }
  };

  const finalElement = renderWithHeader(radioButtonElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip
        title={tooltipProps.title}
        placement={tooltipProps.placement}
        triggerClassName="inline-flex"
      >
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
