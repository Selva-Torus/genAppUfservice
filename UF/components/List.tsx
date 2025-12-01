"use client";

import React, { useState } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass, getBorderRadiusClass } from "@/app/utils/branding";

interface ListProps {
  sortable: boolean;
  items: string[];
  itemsHeight?: number;
  selecteditemindex?: number;
  dynamic?: boolean;
  filterable?: boolean;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  onItemClick?: (item: any) => void;
  className?: string;
}

export const List: React.FC<ListProps> = ({
  sortable,
  items: initialItems,
  itemsHeight,
  selecteditemindex,
  dynamic = false,
  filterable = false,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  onItemClick=() => {},
  className = "",
}) => {
  const { theme, branding } = useGlobal();
  const [items, setItems] = useState(initialItems);
  const [selectedIndex, setSelectedIndex] = useState(selecteditemindex);
  const [searchQuery, setSearchQuery] = useState("");

  const handleItemClick = (index: number, item: string) => {
    setSelectedIndex(items.indexOf(item));
    onItemClick(item);
  };

  const isDark = theme === "dark" || theme === "dark-hc";

  const filteredItems = filterable
    ? items.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
    : items;

  const searchInput = filterable && (
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search..."
      className={`
        ${getFontSizeClass(branding.fontSize)}
        px-4 py-2
        w-full
        border-2
        ${getBorderRadiusClass(branding.borderRadius)}
        ${isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}
        transition-colors
        focus:outline-none
        mb-2
      `}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = branding.brandColor;
        e.currentTarget.style.boxShadow = `0 0 0 2px ${branding.brandColor}20`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = isDark ? "#4B5563" : "#D1D5DB";
        e.currentTarget.style.boxShadow = "none";
      }}
    />
  );

  const listElement = (
    <div className="w-full">
      {searchInput}
      <ul
        className={`
          ${getBorderRadiusClass(branding.borderRadius)}
          overflow-auto
          ${isDark ? "bg-gray-800" : "bg-white"}
          border-2
          ${isDark ? "border-gray-600" : "border-gray-300"}
          ${className}
        `}
        style={{ maxHeight: itemsHeight ? `${itemsHeight}px` : "auto" }}
      >
        {filteredItems.map((item, index) => {
          const isSelected = selectedIndex === index;
          return (
            <li
              key={index}
              onClick={() => handleItemClick(index, item)}
              className={`
                ${getFontSizeClass(branding.fontSize)}
                px-4 py-2
                border-b
                ${isDark ? "border-gray-700" : "border-gray-200"}
                cursor-pointer
                transition-colors
                ${isSelected
                  ? `text-white`
                  : isDark ? "text-gray-200 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
                }
              `}
              style={{
                backgroundColor: isSelected ? branding.brandColor : undefined,
              }}
            >
              {item}
            </li>
          );
        })}
      </ul>
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

  const finalElement = renderWithHeader(listElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
