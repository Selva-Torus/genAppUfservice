"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { Icon } from "./Icon";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass } from "@/app/utils/branding";
import { CommonHeaderAndTooltip } from "./CommonHeaderAndTooltip";
import { useInfoMsg } from "@/app/components/infoMsgHandler";

type ContentAlign = "left" | "center" | "right";

interface DropdownProps {
  static?: boolean;
  dynamic?: boolean;
  multiselect?: boolean;
  multiple?: boolean;
  isArray?: boolean;
  staticProps?: string[];
  dynamicProps?: string;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: any
  headerPosition?: HeaderPosition;
  onChange?: (selected: string | string[]) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  filterable?: boolean;
  hasClear?: boolean;
  value?: string | string[];
  validationState?: "valid" | "invalid" | "none";
  errorMessage?: string;
  fillContainer?: boolean;
  contentAlign?: ContentAlign;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  static: isStatic = false,
  dynamic = false,
  multiselect = false,
  multiple = false,
  isArray = false,
  staticProps = [],
  dynamicProps,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  onChange,
  className = "",
  disabled = false,
  placeholder = "Select...",
  filterable = false,
  hasClear = false,
  value,
  validationState = "none",
  errorMessage,
  fillContainer = true,
  contentAlign = "center",
  onLoadMore,
  isLoadingMore = false,
}) => {
  const isMultiple = multiselect || multiple;
  const { theme, direction,branding } = useGlobal();
  const showToast = useInfoMsg();

  useEffect(() => {
    if (validationState === "invalid" && errorMessage) {
      showToast(errorMessage, "danger");
    }
  }, [validationState, errorMessage]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

  // Infinite scroll: fire onLoadMore only when scrolling DOWN and reaching the bottom
  useEffect(() => {
    const el = listRef.current;
    if (!el || !onLoadMore) return;
    let prevScrollTop = el.scrollTop;
    const handleScroll = () => {
      const isScrollingDown = el.scrollTop > prevScrollTop;
      prevScrollTop = el.scrollTop;
      if (isScrollingDown && el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
        onLoadMore();
      }
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [isOpen, onLoadMore]);

  // Sync internal state with external value prop
  useEffect(() => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        setSelectedValues(value);
      } else {
        setSelectedValues(value ? [value] : []);
      }
    }
  }, [value]);

  // Handle parent container overflow (including nested parents)
  useEffect(() => {
    if (!dropdownRef.current) return;

    // Find all parent containers that have overflow settings
    const parentsToModify: Array<{ element: HTMLElement; originalOverflow: string }> = [];
    let currentElement = dropdownRef.current.parentElement;

    // Traverse up the DOM tree to find all parents with overflow
    while (currentElement) {
      const styles = window.getComputedStyle(currentElement);
      const hasOverflow = styles.overflow !== 'visible' || 
                         styles.overflowY !== 'visible' || 
                         styles.overflowX !== 'visible';

      if (hasOverflow) {
        parentsToModify.push({
          element: currentElement,
          originalOverflow: currentElement.style.overflow
        });
      }

      // Stop at the grid container or after 10 levels
      if (styles.display === 'grid' && parentsToModify.length > 0) {
        break;
      }
      
      if (parentsToModify.length >= 10) break;
      
      currentElement = currentElement.parentElement;
    }

    // Set overflow based on dropdown state
    if (isOpen) {
      parentsToModify.forEach(({ element }) => {
        element.style.overflow = 'visible';
      });
    } else {
      parentsToModify.forEach(({ element, originalOverflow }) => {
        element.style.overflow = originalOverflow || 'auto';
      });
    }

    // Cleanup: restore original overflow when component unmounts
    return () => {
      parentsToModify.forEach(({ element, originalOverflow }) => {
        if (element) {
          element.style.overflow = originalOverflow;
        }
      });
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const options = isStatic ? staticProps : dynamic ? [] : staticProps;

  const filteredOptions = filterable
    ? options.filter(option =>
        option.toLowerCase().includes(filterText.toLowerCase())
      )
    : options;

  const handleSelect = (value: string) => {
    if (isMultiple) {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      setSelectedValues(newValues);
      onChange?.(newValues);
    } else {
      setSelectedValues([value]);
      onChange?.(value);
      setIsOpen(false);
      setFilterText("");
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues([]);
    setFilterText("");
    onChange?.(isMultiple ? [] : "");
  };

  const isDark = theme === "dark" || theme === "dark-hc";

  const getBorderColor = () => {
    if (validationState === "invalid") return "border-red-500";
    if (validationState === "valid") return "border-green-500";
    if (isOpen) return "";
    return isDark ? "border-gray-600" : "border-gray-300";
  };

  const getFillClasses = () => {
    if (!fillContainer) return "";
    return "w-full h-full";
  };

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

  const getIconSize = () => {
    if (fillContainer) {
      // When fillContainer is true, scale icon with branding fontSize
      const baseFontSize = fontSizeClass;
      switch (baseFontSize) {
        case "text-sm":
          return 22;
        case "text-base":
          return 30;
        case "text-lg":
          return 38;
        case "text-xl":
          return 46;
      }
    }
  };

  const fontSizeClass = getFontSizeClass(branding.fontSize);

  const dropdownElement = (
    <div 
      ref={dropdownRef} 
      className={`relative 
      ${getContentAlignClasses()}
      ${getFillClasses()}
      ${className}
       `} 
    >
      {filterable ? (
        <div className="relative w-full h-full">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder={selectedValues.length > 0
              ? isMultiple
                ? `${selectedValues.length} selected`
                : selectedValues[0]
              : placeholder
            }
            disabled={disabled}
            className={`
              w-full
              h-full
              px-4 py-2
              ${hasClear && selectedValues.length > 0 ? "pr-16" : "pr-10"}
              border-2
              ${getBorderColor()}
              ${fontSizeClass}
              ${isDark ? "bg-gray-800 text-white placeholder-white" : "bg-white text-black placeholder-black"}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              transition-colors
              focus:outline-none
              ${className}
            `}
            style={{
              borderRadius: "var(--border-radius)",
              borderColor: validationState === "none" && isOpen ? branding.selectionColor : undefined,
            }}
            onMouseEnter={e => {
              if (!disabled && validationState === "none" && !isOpen) {
                e.currentTarget.style.borderColor = branding.hoverColor
              }
            }}
            onMouseLeave={e => {
              if (!disabled && validationState === "none" && !isOpen) {
                e.currentTarget.style.borderColor = ''
              }
            }}
            onFocus={() => {
              if (!disabled) {
                setIsOpen(true)
              }
            }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {hasClear && selectedValues.length > 0 && !disabled && (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                style={{ borderRadius: "var(--border-radius)" }}
                type="button"
              >
                <Icon data="IoIosClose" size={getIconSize()} />
              </button>
            )}
            <button
              onClick={() => !disabled && setIsOpen(!isOpen)}
              className="p-1 cursor-pointer"
              type="button"
              disabled={disabled}
            >
              <Icon data={isOpen ? "IoIosArrowUp" : "IoIosArrowDown"} size={getIconSize()}  />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full
            px-4 py-2
            border-2
            ${getBorderColor()}
            flex items-center justify-between
            ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            transition-colors
            ${fontSizeClass}
            ${className}
          `}
          style={{
            borderRadius: "var(--border-radius)",
            borderColor: validationState === "none" && isOpen ? branding.selectionColor : undefined,
          }}
          onMouseEnter={e => {
            if (!disabled && validationState === "none" && !isOpen) {
              e.currentTarget.style.borderColor = branding.hoverColor
            }
          }}
          onMouseLeave={e => {
            if (!disabled && validationState === "none" && !isOpen) {
              e.currentTarget.style.borderColor = ''
            }
          }}
        >
          <span className="w-4/5 truncate">
            {selectedValues.length > 0
              ? isMultiple
                ? `${selectedValues.length} selected`
                : selectedValues[0]
              : placeholder}
          </span>
          <div className="flex items-center gap-2">
            {hasClear && selectedValues.length > 0 && !disabled && (
              <div
                onClick={handleClear}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                style={{ borderRadius: "var(--border-radius)" }}
              >
                <Icon data="IoIosClose" size={getIconSize()} />
              </div>
            )}
            <Icon data={isOpen ? "IoIosArrowUp" : "IoIosArrowDown"} size={getIconSize()}  />
          </div>
        </button>
      )}

      {isOpen && (
        <div
        ref={listRef}
          className={`
            absolute
            w-full
            mt-1
            border-2
            ${isDark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"}
            shadow-lg
            max-h-60
            overflow-auto
            z-50
          `}
          style={{ borderRadius: "var(--border-radius)" }}
        >
          {filteredOptions.map((option, index) => {
            const isSelected = selectedValues.includes(option);
            return (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className={`
                  px-4 py-2
                  cursor-pointer
                  flex items-center justify-between
                  transition-colors
                  ${isSelected
                    ? `text-white`
                    : isDark ? "text-gray-200 hover:[background-color:var(--hover-color)]" : "text-gray-700 hover:[background-color:var(--hover-color)]"
                  }
                  ${fontSizeClass}
                  ${className}
                `}
                style={{
                  backgroundColor: isSelected ? branding.selectionColor : undefined,
                }}
              >
                <span>{option}</span>
                {isMultiple && isSelected && <Icon fillContainer={false} data="FaCheck" size={getIconSize()} />}
              </div>
            );
          })}
          {isLoadingMore && (
            <div className={`px-4 py-2 text-center text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Loading...
            </div>
          )}
        </div>
      )}
    </div>
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
      {dropdownElement}
    </CommonHeaderAndTooltip>
  )
};