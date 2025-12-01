"use client";

import React, { useState } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { Radio } from "./Radio";
import { CheckboxSize, HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass } from "@/app/utils/branding";

interface RadioGroupItem {
  value: string;
  content: string;
}

interface RadioGroupProps {
  size: CheckboxSize;
  disabled?: boolean;
  direction?: "horizontal" | "vertical";
  items: RadioGroupItem[];
  value?: string;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  onChange?: (value: string) => void;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  size,
  disabled = false,
  direction = "vertical",
  items,
  value = "",
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  onChange,
  className = "",
}) => {
  const { theme, direction: globalDirection, branding } = useGlobal();
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  const isDark = theme === "dark" || theme === "dark-hc";
  const radioSize = size === "m" ? "m" : "l";

  const radioGroupElement = (
    <div
      className={`flex ${direction === "horizontal" ? "flex-row flex-wrap gap-4" : "flex-col gap-3"} ${className}`}
    >
      {items.map((item) => (
        <Radio
          key={item.value}
          checked={selectedValue === item.value}
          size={radioSize}
          disabled={disabled}
          content={item.content}
          value={item.value}
          name="radio-group"
          onChange={handleChange}
        />
      ))}
    </div>
  );

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) return element;

    const headerClasses = `${getFontSizeClass(branding.fontSize)} font-semibold mb-2 ${
      isDark ? "text-gray-300" : "text-gray-700"
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
            <div className={`${headerClasses} mt-2 mb-0`}>{headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className="flex items-start gap-4">
            <div className={`${headerClasses} mb-0 whitespace-nowrap pt-1`}>
              {headerText}
            </div>
            {element}
          </div>
        );
      case "right":
        return (
          <div className="flex items-start gap-4">
            {element}
            <div className={`${headerClasses} mb-0 whitespace-nowrap pt-1`}>
              {headerText}
            </div>
          </div>
        );
    }
  };

  const finalElement = renderWithHeader(radioGroupElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
