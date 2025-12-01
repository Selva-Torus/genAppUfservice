"use client";

import React, { useState } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { Icon } from "./Icon";
import { GravityIcon } from "@/types/icons";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass, getBorderRadiusClass } from "@/app/utils/branding";

type TabSize = "m" | "l" | "xl";
type TabDirection = "horizontal" | "vertical";

interface TabItem {
  id: string;
  title: string;
  icon?: GravityIcon;
  content?: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  direction?: TabDirection;
  size?: TabSize;
  disabled?: boolean;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  defaultActiveId?: string;
  onChange?: (id: any) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  direction,
  size,
  disabled = false,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  defaultActiveId,
  onChange=()=>{},
  className = "",
}) => {
  const { theme, branding } = useGlobal();
  const [activeTab, setActiveTab] = useState(defaultActiveId || items[0]?.id || "");

  const handleTabClick = (id: string) => {
      onChange(id);
      setActiveTab(id);
    
  };

  const getSizeClasses = () => {
    const fontSize = getFontSizeClass(branding.fontSize);
    switch (size) {
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

  const activeContent = items.find(item => item.id === activeTab)?.content;

  const tabsElement = (
    <div className={`w-full ${direction === "vertical" ? "flex gap-4" : ""} ${className}`}>
      <div
        className={`
          flex
          ${direction === "vertical" ? "flex-col" : "flex-row"}
          ${isDark ? "bg-gray-800" : "bg-gray-100"}
          ${getBorderRadiusClass(branding.borderRadius)}
          p-1
          ${direction === "vertical" ? "w-auto" : "w-full"}
        `}
      >
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={()=> handleTabClick(item.id)}
              disabled={disabled}
              className={`
                ${getSizeClasses()}
                ${getBorderRadiusClass(branding.borderRadius)}
                flex items-center gap-2
                font-medium
                whitespace-nowrap
                transition-all
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${isActive
                  ? "text-white shadow-sm"
                  : isDark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
                }
              `}
              style={{
                backgroundColor: isActive ? branding.brandColor : "transparent",
              }}
            >
              {item.icon && <Icon data={item.icon} size={size === "xl" ? 20 : size === "l" ? 18 : 16} />}
              {item.title}
            </button>
          );
        })}
      </div>

      {activeContent && (
        <div className={`mt-4 ${direction === "vertical" ? "flex-1 mt-0" : ""}`}>
          {activeContent}
        </div>
      )}
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
          <div className="flex flex-col w-full">
            <div className={headerClasses}>{headerText}</div>
            {element}
          </div>
        );
      case "bottom":
        return (
          <div className="flex flex-col w-full">
            {element}
            <div className={`${headerClasses} mt-2 mb-0`}>{headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className="flex items-start gap-4 w-full">
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
            <div className="flex-1">{element}</div>
          </div>
        );
      case "right":
        return (
          <div className="flex items-start gap-4 w-full">
            <div className="flex-1">{element}</div>
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
          </div>
        );
    }
  };

  const finalElement = renderWithHeader(tabsElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
