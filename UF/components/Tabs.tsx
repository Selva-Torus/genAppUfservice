"use client";

import React, { useState } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { Icon } from "./Icon";
import { GravityIcon } from "@/types/icons";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass, getBorderRadiusClass } from "@/app/utils/branding";

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

  const fontSizeClass = getFontSizeClass(branding.fontSize);
  const getSizeClasses = () => {
    return `px-4 py-2 ${fontSizeClass}`;
  };

  const isDark = theme === "dark" || theme === "dark-hc";

  const activeContent = items.find(item => item.id === activeTab)?.content;

  // Helper to convert hex to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex?.slice(1, 3), 16);
    const g = parseInt(hex?.slice(3, 5), 16);
    const b = parseInt(hex?.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const tabsElement = (
    <div className={`w-full h-full flex ${direction === "vertical" ? "flex-row gap-4" : "flex-col"}`}>
      <div
        className={`
          flex-shrink-0
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
                [border-radius:var(--border-radius)]

                flex items-center justify-center gap-2
                font-medium
                whitespace-nowrap
                transition-all
                ${direction === "vertical" ? "" : "flex-1"}
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${isActive
                  ? "text-white shadow-sm"
                  : isDark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"
                }
              `}
              style={{
                backgroundColor: isActive ? branding.brandColor : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!disabled && !isActive) {
                  e.currentTarget.style.backgroundColor = hexToRgba(branding.hoverColor, 0.25);
                }
              }}
              onMouseLeave={(e) => {
                if (!disabled && !isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
              onFocus={(e) => {
                if (!isActive) {
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${hexToRgba(branding.selectionColor, 0.3)}`;
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {item.icon && <Icon data={item.icon} size={16} />}
              {item.title}
            </button>
          );
        })}
      </div>

      {activeContent && (
        <div className={`flex-1 min-h-0 overflow-auto ${direction === "vertical" ? "" : "mt-4"}`}>
          {activeContent}
        </div>
      )}
    </div>
  );

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) return element;

    const headerClasses = `${fontSizeClass} font-semibold mb-2 ${
      isDark ? "text-gray-300" : "text-gray-700"
    }`;

    switch (headerPosition) {
      case "top":
        return (
          <div className={`flex flex-col w-full h-full ${className}`}>
            <div className={headerClasses}>{headerText}</div>
            {element}
          </div>
        );
      case "bottom":
        return (
          <div className={`flex flex-col w-full h-full ${className}`}>
            {element}
            <div className={`${headerClasses} mt-2 mb-0`}>{headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className={`flex items-start gap-4 w-full h-full ${className}`}>
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
            <div className="flex-1 h-full">{element}</div>
          </div>
        );
      case "right":
        return (
          <div className={`flex items-start gap-4 w-full h-full ${className}`}>
            <div className="flex-1 h-full">{element}</div>
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
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement} triggerClassName="h-full w-full">
        <div className={`h-full w-full ${className}`}>{finalElement}</div>
      </Tooltip>
    );
  }

  return <div className={`h-full w-full ${className}`}>{finalElement}</div>;
};
 