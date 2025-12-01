"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { Icon } from "./Icon";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass, getBorderRadiusClass } from "@/app/utils/branding";

interface DropdownProps {
  static?: boolean;
  dynamic?: boolean;
  multiselect?: boolean;
  multiple?: boolean;
  isArray?: boolean;
  staticProps?: string[];
  dynamicProps?: string;
  width?: string;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
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
}

export const Dropdown: React.FC<DropdownProps> = ({
  static: isStatic = false,
  dynamic = false,
  multiselect = false,
  multiple = false,
  isArray = false,
  staticProps = [],
  dynamicProps,
  width = "100%",
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
}) => {
  const isMultiple = multiselect || multiple;
  const { theme, direction, branding } = useGlobal();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const dropdownElement = (
    <div 
      ref={dropdownRef} 
      className={`relative w-full ${className}`} 
      style={{ width }}
    >
      {filterable ? (
        <div className="relative w-full">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            onFocus={() => !disabled && setIsOpen(true)}
            placeholder={selectedValues.length > 0
              ? isMultiple
                ? `${selectedValues.length} selected`
                : selectedValues[0]
              : placeholder
            }
            disabled={disabled}
            className={`
              w-full
              px-4 py-2
              ${hasClear && selectedValues.length > 0 ? "pr-16" : "pr-10"}
              ${getBorderRadiusClass(branding.borderRadius)}
              ${getFontSizeClass(branding.fontSize)}
              border-2
              ${getBorderColor()}
              ${isDark ? "bg-gray-800 text-white placeholder-gray-400" : "bg-white text-gray-900 placeholder-gray-500"}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              transition-colors
              focus:outline-none
            `}
            style={{
              borderColor: validationState === "none" && isOpen ? branding.brandColor : undefined,
            }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {hasClear && selectedValues.length > 0 && !disabled && (
              <button
                onClick={handleClear}
                className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors ${getBorderRadiusClass(branding.borderRadius)}`}
                type="button"
              >
                <Icon data="FaTimes" size={14} />
              </button>
            )}
            <button
              onClick={() => !disabled && setIsOpen(!isOpen)}
              className="p-1 cursor-pointer"
              type="button"
              disabled={disabled}
            >
              <Icon data={isOpen ? "FaAngleUp" : "FaAngleDown"} size={16} />
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
            ${getBorderRadiusClass(branding.borderRadius)}
            ${getFontSizeClass(branding.fontSize)}
            border-2
            ${getBorderColor()}
            flex items-center justify-between
            ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            transition-colors
          `}
          style={{
            borderColor: validationState === "none" && isOpen ? branding.brandColor : undefined,
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
                className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors ${getBorderRadiusClass(branding.borderRadius)}`}
              >
                <Icon data="FaTimes" size={14} />
              </div>
            )}
            <Icon data={isOpen ? "FaAngleUp" : "FaAngleDown"} size={16} />
          </div>
        </button>
      )}

      {isOpen && (
        <div
          className={`
            absolute
            w-full
            mt-1
            ${getBorderRadiusClass(branding.borderRadius)}
            border-2
            ${isDark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"}
            shadow-lg
            max-h-60
            overflow-auto
            z-50
          `}
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
                  ${getFontSizeClass(branding.fontSize)}
                  flex items-center justify-between
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
                <span>{option}</span>
                {isMultiple && isSelected && <Icon data="FaCheck" size={16} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderWithHeader = (element: React.ReactNode) => {
    const elementWithError = (
      <>
        {element}
        {validationState === "invalid" && errorMessage && (
          <div className={`mt-1 ${getFontSizeClass(branding.fontSize)} text-red-500`}>
            {errorMessage}
          </div>
        )}
      </>
    );

    if (!headerText) return elementWithError;

    const headerClasses = `${getFontSizeClass(branding.fontSize)} font-semibold mb-2 ${
      isDark ? "text-gray-300" : "text-gray-700"
    }`;

    switch (headerPosition) {
      case "top":
        return (
          <div className="flex flex-col w-full">
            <div className={headerClasses}>{headerText}</div>
            {elementWithError}
          </div>
        );
      case "bottom":
        return (
          <div className="flex flex-col w-full">
            {elementWithError}
            <div className={`${headerClasses} mt-2 mb-0`}>{headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className="flex items-start gap-4 w-full">
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
            <div className="flex-1">{elementWithError}</div>
          </div>
        );
      case "right":
        return (
          <div className="flex items-start gap-4 w-full">
            <div className="flex-1">{elementWithError}</div>
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
          </div>
        );
    }
  };

  const finalElement = renderWithHeader(dropdownElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};