"use client";

import React, { useState } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";

interface ListItem {
  title: string;
  disabled?: boolean;
}

interface ListProps {
  sortable: boolean;
  items: string[] | ListItem[];
  selecteditemindex?: number;
  dynamic?: boolean;
  filterable?: boolean;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  onItemClick?: (item: any) => void;
  className?: string;
  fillContainer?: boolean;
  contentAlign?: ContentAlign;
}
type ContentAlign = "left" | "center" | "right";
export const List: React.FC<ListProps> = ({
  sortable,
  items: initialItems,
  selecteditemindex,
  dynamic = false,
  filterable = false,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  onItemClick=() => {},
  className = "",
  fillContainer = true,
  contentAlign = "center",
}) => {
  const { theme } = useGlobal();
  const [items, setItems] = useState(initialItems);
  const [selectedIndex, setSelectedIndex] = useState(selecteditemindex);
  const [searchQuery, setSearchQuery] = useState("");
  
  const isListItem = (item: string | ListItem): item is ListItem => {
    return typeof item === 'object' && 'title' in item;
  };

  const getItemTitle = (item: string | ListItem): string => {
    return isListItem(item) ? item.title : item;
  };

  const isItemDisabled = (item: string | ListItem): boolean => {
    return isListItem(item) ? item.disabled === true : false;
  };

  const handleItemClick = (index: number, item: string| ListItem) => {
    if (isItemDisabled(item)) return;
    setSelectedIndex(index);
    onItemClick(item);
  };

  const isDark = theme === "dark" || theme === "dark-hc";

  const filteredItems = filterable
    ? items.filter((item) => getItemTitle(item).toLowerCase().includes(searchQuery.toLowerCase()))
    : items;

  const searchInput = filterable && (
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search..."
      className={`
        px-4 py-2
        w-full
        border-2
        ${isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}
        transition-colors
        focus:outline-none
        mb-2
      `}
      style={{
        fontSize: "var(--font-size)",
        borderRadius: "var(--border-radius)",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--brand-color)";
        e.currentTarget.style.boxShadow = "0 0 0 2px var(--brand-color-transparent)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = isDark ? "#4B5563" : "#D1D5DB";
        e.currentTarget.style.boxShadow = "none";
      }}
    />
  );

  const getFillClasses = () => {
    if (!fillContainer) return "";
    return "w-full h-full";
  };

  const getContentAlignClasses = () => {
    switch (contentAlign) {
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      case "center":
      default:
        return "text-center";
    }
  };

  const listElement = (
    <div className={`${fillContainer ? "flex" : "inline-flex"} flex-col ${getFillClasses()}`}>
      {searchInput}
      <ul
        className={`
          overflow-auto
          ${isDark ? "bg-gray-800" : "bg-white"}
          border-2
          ${isDark ? "border-gray-600" : "border-gray-300"}
          ${fillContainer ? "flex-1 min-h-0" : ""}
          ${className}
        `}

        style={{
          borderRadius: "var(--border-radius)",
        }}
      >
        {filteredItems.map((item, index) => {
          const isSelected = selectedIndex === index;
      const disabled = isItemDisabled(item);
          const title = getItemTitle(item);
          return (
            <li
              key={index}
              onClick={() => handleItemClick(index, item)}
              className={`
                px-4 py-2
                border-b
                ${isDark ? "border-gray-700" : "border-gray-200"}
                ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                transition-colors
                ${getContentAlignClasses()}
                ${isSelected
                  ? `text-white`
                  : isDark ? "text-gray-200 hover:[background-color:var(--hover-color)]" : "text-gray-700 hover:[background-color:var(--hover-color)]"
                }
                ${disabled ? "!hover:bg-transparent" : ""}
              `}
              style={{
                fontSize: "var(--font-size)",
                backgroundColor: isSelected ? "var(--selection-color)" : undefined,
              }}
            >
              {title}
            </li>
          );
        })}
      </ul>
    </div>
  );

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) return <div className={`${getFillClasses()} ${className}`}>{element}</div>;

    const headerClasses = `font-semibold mb-2 ${
      isDark ? "text-gray-300" : "text-gray-700"
    }`;

    const headerStyle = { fontSize: "var(--font-size)" };

    switch (headerPosition) {
      case "top":
        return (
          <div className={`${fillContainer ? "flex" : "inline-flex"} flex-col ${getFillClasses()} ${className}`}>
            <div className={headerClasses} style={headerStyle}>{headerText}</div>
            <div className={fillContainer ? "flex-1 min-h-0" : ""}>{element}</div>
          </div>
        );
      case "bottom":
        return (
          <div className={`${fillContainer ? "flex" : "inline-flex"} flex-col ${getFillClasses()} ${className}`}>
            <div className={fillContainer ? "flex-1 min-h-0" : ""}>{element}</div>
            <div className={`${headerClasses} mt-2 mb-0`} style={headerStyle}>{headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className={`${fillContainer ? "flex" : "inline-flex"} items-start ${getFillClasses()} gap-4 ${className}`}>
            <div className={`${headerClasses} mb-0 whitespace-nowrap flex-shrink-0`} style={headerStyle}>
              {headerText}
            </div>
            <div className={fillContainer ? "flex-1 min-w-0 h-full" : ""}>{element}</div>
          </div>
        );
      case "right":
        return (
          <div className={`${fillContainer ? "flex" : "inline-flex"} items-start ${getFillClasses()} gap-4 ${className}`}>
            <div className={fillContainer ? "flex-1 min-w-0 h-full" : ""}>{element}</div>
            <div className={`${headerClasses} mb-0 whitespace-nowrap flex-shrink-0`} style={headerStyle}>
              {headerText}
            </div>
          </div>
        );
    }
  };

  const finalElement = (<div className={`${fillContainer ? "w-full h-full" : ""} `}>{renderWithHeader(listElement)}</div>);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}  >
              {finalElement}
            </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
