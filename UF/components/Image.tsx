"use client";

import React from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { CommonHeaderAndTooltip } from "./CommonHeaderAndTooltip";

type ContentAlign = "left" | "center" | "right";

interface ImageProps {
  url: string;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  alt?: string;
  className?: string;
  fillContainer?: boolean;
  contentAlign?: ContentAlign;
}

export const Image: React.FC<ImageProps> = ({
  url,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  alt = "",
  className = "",
  fillContainer = true,
  contentAlign = "center",
}) => {
  const { theme } = useGlobal();

  const isDark = theme === "dark" || theme === "dark-hc";

  const getFillClasses = () => {
    if (!fillContainer) return "";
    return "w-full h-full";
  };

  const getContentAlignClasses = () => {
    switch (contentAlign) {
      case "left":
        return "justify-start items-start";
      case "right":
        return "justify-end items-end";
      case "center":
      default:
        return "justify-center items-center";
    }
  };

  const imageElement = (
    <img
      src={url}
      alt={alt}
      style={{
        width:"100%",
        height:"100%",
        borderRadius: "var(--border-radius)"
      }}
    />
  );


  return (
           <CommonHeaderAndTooltip
             needTooltip={needTooltip}
             tooltipProps={tooltipProps}
             headerText={headerText}
             headerPosition={headerPosition}
             className={className}
             fillContainer={fillContainer}
           >
             {imageElement}
           </CommonHeaderAndTooltip>
         )
};
