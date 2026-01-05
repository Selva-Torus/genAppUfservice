"use client";

import React, { useState } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { Radio } from "./Radio";
import { CheckboxSize, HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass } from "@/app/utils/branding";

type ContentAlign = "left" | "center" | "right";
interface RadioGroupItem {
  value: string;
  content: string;
}

interface RadioGroupProps {
  disabled?: boolean;
  direction?: "horizontal" | "vertical";
  items: RadioGroupItem[];
  value?: string;
  content?: string;
  contentAlign?: ContentAlign;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  onChange?: (value: string) => void;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  disabled = false,
  direction = "vertical",
  items,
  value = "",
  content = "",
  contentAlign = "center",
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
  const radioGroupElement = (
    <div
      className={`w-full h-full flex gap-2 overflow-hidden ${direction === "horizontal" ? "flex-row flex-auto shrink " : "flex-col"}`}
    >
      {items.map((item) => (
        <Radio
          key={item.value}
          checked={selectedValue === item.value}
          disabled={disabled}
          content={item.content}
          className={className}
          value={item.value}
          name="radio-group"
          onChange={handleChange}
        />
      ))}
    </div>
  );

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) return <div className={`h-full w-full`}>{element}</div>

    const headerClasses = `
      flex h-full w-full overflow-hidden text-ellipsis whitespace-nowrap 
      ${isDark ? 'text-gray-300' : 'text-gray-700'} 
      ${getFontSizeClass(branding.fontSize)}
      ${className}
    `
    switch (headerPosition) {
      case 'top':
        return (
          <div className={`${headerClasses} flex-col`}>
            <div className='font-semibold'>{headerText}</div>
            {element}
          </div>
        )
      case 'bottom':
        return (
          <div className={`${headerClasses} flex-col`}>
            {element}
            <div className='mt-1 font-semibold'>{headerText}</div>
          </div>
        )
      case 'left':
        return (
          <div className={`${headerClasses} items-center gap-4`}>
            <div className={`mb-0 min-w-0  font-semibold overflow-hidden`}>{headerText}</div>
            {element}
          </div>
        )
      case 'right':
        return (
          <div className={`${headerClasses} items-center gap-4`}>
            {element}
            <div className={`mb-0 min-w-0 font-semibold overflow-hidden`}>{headerText}</div>
          </div>
        )
    }
  }

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