"use client";

import React, { useState } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { Radio } from "./Radio";
import { CheckboxSize, HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass } from "@/app/utils/branding";
import { CommonHeaderAndTooltip } from "./CommonHeaderAndTooltip";

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

  return (
     <CommonHeaderAndTooltip
       needTooltip={needTooltip}
       tooltipProps={tooltipProps}
       headerText={headerText}
       headerPosition={headerPosition}
       className={className}
     >
       {radioGroupElement}
     </CommonHeaderAndTooltip>
   )
};