"use client";

import { useState, useEffect } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { Button } from "./Button";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass, getBorderRadiusClass } from "@/app/utils/branding";
import { CommonHeaderAndTooltip } from "./CommonHeaderAndTooltip";

type ContentAlign = 'center' | 'left' | 'right';
type FieldValue = string | number | boolean | null;
type FieldValues = { [key: string]: FieldValue | FieldValues };

interface FieldMetadata {
  type: "text" | "number" | "boolean" | "date" | "dropdown" | "textarea";
  label: string;
  defaultValue: FieldValue;
  options?: readonly string[];
  placeholder?: string;
}

type MetadataConfig = {
  [key: string]: FieldMetadata | NestedMetadataConfig;
};

interface NestedMetadataConfig {
  type: "object";
  label: string;
  fields: MetadataConfig;
}

interface DynamicContentFieldsProps {
  metadata: MetadataConfig;
  onChange: (values: FieldValues) => void;
  onSubmit?: (values: FieldValues) => void;
  values?: FieldValues; // Add external values prop
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  className?: string;
  contentAlign?: ContentAlign;
  
}


export default function DynamicContentFields({
  metadata,
  onChange,
  onSubmit,
  values: externalValues,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  className = "",
  contentAlign = 'left',
}: DynamicContentFieldsProps) {
  const { theme, branding } = useGlobal();
  const isDark = theme === "dark" || theme === "dark-hc";
  const [values, setValues] = useState<FieldValues>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Initialize values from metadata and expand all sections by default
  useEffect(() => {
    const initialValues: FieldValues = {};
    const initialExpanded: Record<string, boolean> = {};

    Object.entries(metadata).forEach(([key, config]) => {
      if (isNestedMetadata(config)) {
        const nestedValues: FieldValues = {};
        Object.entries(config.fields).forEach(([nestedKey, nestedConfig]) => {
          if (isFieldMetadata(nestedConfig)) {
            nestedValues[nestedKey] = nestedConfig.defaultValue;
          }
        });
        initialValues[key] = nestedValues;
        initialExpanded[key] = true; // Expand by default
      } else if (isFieldMetadata(config)) {
        initialValues[key] = config.defaultValue;
      }
    });

    setValues(initialValues);
    setExpandedSections(initialExpanded);
  }, [metadata]);

  // Sync with external values when they change
  useEffect(() => {
    if (externalValues) {
      setValues(externalValues);
    }
  }, [externalValues]);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getTextAlignClasses = () => {
    switch (contentAlign) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      case 'center':
        return 'text-center';
      default:
        return 'text-left';
    }
  };

  const updateValue = (key: string, nestedKey: string | null, value: FieldValue) => {
    setValues((prev) => {
      const newValues = { ...prev };
      if (nestedKey === null) {
        newValues[key] = value;
      } else {
        const nested = newValues[key] as FieldValues;
        newValues[key] = { ...nested, [nestedKey]: value };
      }
      // Notify parent of changes immediately with the new values
      onChange(newValues);
      return newValues;
    });
  };

  const renderInput = (
    key: string,
    nestedKey: string | null,
    fieldConfig: FieldMetadata,
    currentValue: FieldValue
  ) => {
    const inputId = nestedKey ? `field-${key}-${nestedKey}` : `field-${key}`;
    const value = currentValue ?? "";

    const handleChange = (newValue: FieldValue) => {
      updateValue(key, nestedKey, newValue);
    };

    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex?.slice(1, 3), 16);
      const g = parseInt(hex?.slice(3, 5), 16);
      const b = parseInt(hex?.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const inputClassName = `
      w-full px-3 py-2
      ${getFontSizeClass(branding.fontSize)}
      ${getBorderRadiusClass(branding.borderRadius)}
      ${getTextAlignClasses()}
      border-2 transition-all
      ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}
      focus:outline-none focus:ring-2
    `.trim();

    const commonHandlers = {
      onMouseEnter: (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (document.activeElement !== e.currentTarget) {
          e.currentTarget.style.borderColor = branding.hoverColor;
        }
      },
      onMouseLeave: (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (document.activeElement !== e.currentTarget) {
          e.currentTarget.style.borderColor = isDark ? '#4B5563' : '#D1D5DB';
        }
      },
      onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.currentTarget.style.borderColor = branding.selectionColor;
        e.currentTarget.style.boxShadow = `0 0 0 3px ${hexToRgba(branding.selectionColor, 0.2)}`;
      },
      onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.currentTarget.style.borderColor = isDark ? '#4B5563' : '#D1D5DB';
        e.currentTarget.style.boxShadow = 'none';
      },
      style: { fontFamily: 'var(--font-body)' }
    };

    switch (fieldConfig.type) {
      case "textarea":
        return (
          <textarea
            id={inputId}
            value={String(value)}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={fieldConfig.placeholder || "Value"}
            rows={3}
            className={`${inputClassName} resize-y min-h-[60px]`}
            {...commonHandlers}
          />
        );

      case "number":
        return (
          <input
            id={inputId}
            type="number"
            value={value === null ? "" : String(value)}
            onChange={(e) => {
              const val = e.target.value;
              handleChange(val === "" ? null : Number(val));
            }}
            placeholder={fieldConfig.placeholder || "Value"}
            className={inputClassName}
            {...commonHandlers}
          />
        );

      case "boolean":
        return (
          <div className="flex items-center h-9">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id={inputId}
                type="checkbox"
                checked={value === true}
                onChange={(e) => handleChange(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-focus:outline-none peer-focus:ring-2"
                style={{
                  backgroundColor: value === true ? branding.selectionColor : isDark ? '#4B5563' : '#D1D5DB',
                  borderColor: isDark ? '#6B7280' : '#E5E7EB',
                }}
              ></div>
              <span className={`ms-2 ${getFontSizeClass(branding.fontSize)} ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {value === true ? "Yes" : "No"}
              </span>
            </label>
          </div>
        );

      case "date":
        return (
          <input
            id={inputId}
            type="date"
            value={String(value)}
            onChange={(e) => handleChange(e.target.value)}
            className={inputClassName}
            {...commonHandlers}
          />
        );

      case "dropdown":
        return (
          <select
            id={inputId}
            value={String(value)}
            onChange={(e) => handleChange(e.target.value)}
            className={inputClassName}
            {...commonHandlers}
          >
            <option value="">Value</option>
            {fieldConfig.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default: // text
        return (
          <input
            id={inputId}
            type="text"
            value={String(value)}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={fieldConfig.placeholder || "Value"}
            className={inputClassName}
            {...commonHandlers}
          />
        );
    }
  };

  const isNestedMetadata = (config: unknown): config is NestedMetadataConfig => {
    return (
      typeof config === "object" &&
      config !== null &&
      "type" in config &&
      (config as NestedMetadataConfig).type === "object"
    );
  };

  const isFieldMetadata = (config: unknown): config is FieldMetadata => {
    return (
      typeof config === "object" &&
      config !== null &&
      "type" in config &&
      "label" in config &&
      "defaultValue" in config
    );
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  const contentElement = (
    <div className="flex flex-col gap-4 w-full h-full">
      {Object.entries(metadata).map(([key, config]) => {
        if (isNestedMetadata(config)) {
          const isExpanded = expandedSections[key] ?? false;
          return (
            <div
              key={key}
              className={`border-2 ${getBorderRadiusClass(branding.borderRadius)} ${
                isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
              } ${className}`}
            >
              {/* Collapsible Header */}
              <button
                onClick={() => toggleSection(key)}
                className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                  getBorderRadiusClass(branding.borderRadius)
                } ${getFontSizeClass(branding.fontSize)} ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
                style={{
                  fontFamily: 'var(--font-body)'
                }}
              >
                <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {config.label}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  } ${isExpanded ? "transform rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className={`px-4 pb-4 pt-2 border-t ${
                  isDark ? 'border-gray-600' : 'border-gray-100'
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(config.fields).map(([nestedKey, nestedConfig]) => {
                      if (!isFieldMetadata(nestedConfig)) return null;
                      const nestedValues = (values[key] as FieldValues) || {};
                      const currentValue = (nestedValues[nestedKey] ?? nestedConfig.defaultValue) as FieldValue;
                      return (
                        <div key={nestedKey} className="space-y-1.5">
                          <label
                            htmlFor={`field-${key}-${nestedKey}`}
                            className={`block ${getFontSizeClass(branding.fontSize)} font-medium ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}
                            style={{ fontFamily: 'var(--font-body)' }}
                          >
                            {nestedConfig.label}
                          </label>
                          {renderInput(key, nestedKey, nestedConfig, currentValue)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        } else if (isFieldMetadata(config)) {
          // Standalone field (not in a nested object)
          return (
            <div
              key={key}
              className={`border-2 ${getBorderRadiusClass(branding.borderRadius)} p-4 ${
                isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
              } ${className}`}
            >
              <div className="space-y-1.5">
                <label
                  htmlFor={`field-${key}`}
                  className={`block ${getFontSizeClass(branding.fontSize)} font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {config.label}
                </label>
                {renderInput(key, null, config, (values[key] ?? config.defaultValue) as FieldValue)}
              </div>
            </div>
          );
        }
        return null;
      })}

      {/* Save Button */}
      {/* <div className="flex justify-end mt-4 w-[59px]">
        <Button
          view="action"
          onClick={handleSubmit}
          className="px-6 py-2"
        >
          Save
        </Button>
      </div>      */}
    </div>
  );

  return <div className="h-full w-full">
 <CommonHeaderAndTooltip
        needTooltip={needTooltip}
        tooltipProps={tooltipProps}
        headerText={headerText}
        headerPosition={headerPosition}
        className={className}
      >
        {contentElement}
      </CommonHeaderAndTooltip>
</div>;
}
 