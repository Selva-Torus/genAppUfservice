"use client";

import React, { useState, useEffect } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass } from "@/app/utils/branding";

type SliderSize = "xs" | "s" | "m" | "l" | "xl";
type ValidationState = "valid" | "invalid";
type TooltipDisplay = "on" | "off" | "auto";

interface SliderProps {
  disabled?: boolean;
  validationState?: ValidationState;
  tooltipDisplay?: TooltipDisplay;
  size?: SliderSize;
  min?: number;
  max?: number;
  step?: number;
  marks?: boolean;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  value?: number;
  onChange?: (value: number) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  disabled = false,
  validationState = "valid",
  tooltipDisplay = "auto",
  size = "m",
  min = 0,
  max = 100,
  step = 1,
  marks = false,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  value = 50,
  onChange,
  onBlur,
  className = "",
}) => {
  const { theme, branding, direction } = useGlobal();
  const [sliderValue, setSliderValue] = useState(value || 50);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setSliderValue(value || 50);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setSliderValue(newValue);
    onChange?.(newValue);
  };

  const getSizeClass = () => {
    switch (size) {
      case "xs":
        return "h-0.5";
      case "s":
        return "h-1";
      case "m":
        return "h-2";
      case "l":
        return "h-3";
      case "xl":
        return "h-4";
      default:
        return "h-2";
    }
  };

  const isDark = theme === "dark" || theme === "dark-hc";

  const getTrackColor = () => {
    if (validationState === "invalid") {
      return "#EF4444";
    }
    return branding.brandColor;
  };

  const sliderElement = (
    <div
      className={`w-full relative ${direction === "RTL" ? "rtl" : ""} ${className}`}
      onMouseEnter={() => {
        if (!disabled && tooltipDisplay === "auto") {
          setShowTooltip(true);
        }
      }}
      onMouseLeave={() => {
        if (tooltipDisplay === "auto") {
          setShowTooltip(false);
        }
      }}
    >
      {/* Tooltip - positioned above, not clipped */}
      {(() => {
        // Explicit tooltip display logic
        if (tooltipDisplay === "off") return null;
        if (tooltipDisplay === "on") {
          return (
            <div
              className={`
                absolute
                top-0
                px-2 py-1
                rounded
                text-xs
                z-20
                pointer-events-none
                whitespace-nowrap
                ${isDark ? "bg-gray-900 text-white" : "bg-gray-800 text-white"}
              `}
              style={{
                left: `${Math.min(Math.max(((sliderValue - min) / (max - min)) * 100, 5), 95)}%`,
                transform: "translate(-50%, -100%)",
                marginTop: "-8px",
              }}
            >
              {sliderValue}
            </div>
          );
        }
        if (tooltipDisplay === "auto" && showTooltip) {
          return (
            <div
              className={`
                absolute
                top-0
                px-2 py-1
                rounded
                text-xs
                z-20
                pointer-events-none
                whitespace-nowrap
                ${isDark ? "bg-gray-900 text-white" : "bg-gray-800 text-white"}
              `}
              style={{
                left: `${Math.min(Math.max(((sliderValue - min) / (max - min)) * 100, 5), 95)}%`,
                transform: "translate(-50%, -100%)",
                marginTop: "-8px",
              }}
            >
              {sliderValue}
            </div>
          );
        }
        return null;
      })()}

      {/* Slider container with overflow control */}
      <div className="w-full relative py-2 overflow-hidden">
        {/* Background track */}
        <div
          className={`absolute w-full ${getSizeClass()} ${
            isDark ? "bg-gray-700" : "bg-gray-300"
          } rounded-full pointer-events-none`}
          style={{ top: "50%", transform: "translateY(-50%)" }}
        />

        {/* Filled track */}
        <div
          className={`absolute ${getSizeClass()} rounded-full pointer-events-none transition-all`}
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            width: `${((sliderValue - min) / (max - min)) * 100}%`,
            backgroundColor: getTrackColor(),
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={sliderValue}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`
            w-full
            ${getSizeClass()}
            appearance-none
            bg-transparent
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            rounded-full
            transition-all
            relative
            z-10
            slider-thumb
            py-2
          `}
          style={{
            accentColor: getTrackColor(),
          }}
        />
      </div>

      {marks ? (() => {
        const totalSteps = Math.floor((max - min) / step);
        const maxMarks = 10; // Maximum number of marks to display

        // Calculate the interval between displayed marks
        const markInterval = totalSteps <= maxMarks ? 1 : Math.ceil(totalSteps / maxMarks);

        // Generate mark values
        const markValues = [];
        for (let i = 0; i <= totalSteps; i += markInterval) {
          const markValue = min + i * step;
          if (markValue <= max) {
            markValues.push(markValue);
          }
        }

        // Always include max if not already included
        if (markValues[markValues.length - 1] !== max) {
          markValues.push(max);
        }

        return (
          <div className="relative w-full h-8 mt-0 pointer-events-none overflow-hidden">
            {markValues.map((markValue, index) => {
              const isFirst = index === 0;
              const isLast = index === markValues.length - 1;
              const position = ((markValue - min) / (max - min)) * 100;

              return (
                <div
                  key={index}
                  className="absolute top-0 flex flex-col"
                  style={{
                    left: `${position}%`,
                    transform: isFirst ? "translateX(0)" : isLast ? "translateX(-100%)" : "translateX(-50%)",
                  }}
                >
                  <div
                    className={`w-0.5 h-2 mx-auto ${isDark ? "bg-gray-600" : "bg-gray-400"}`}
                  />
                  <span
                    className={`text-xs mt-1 block ${isDark ? "text-gray-400" : "text-gray-600"} ${
                      isFirst ? "text-left" : isLast ? "text-right" : "text-center"
                    }`}
                    style={{
                      maxWidth: isFirst || isLast ? "50px" : "40px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {markValue}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })() : (
        <div className="flex justify-between mt-2 px-1">
          <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{min}</span>
          <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{max}</span>
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
          <div className="flex items-center gap-4 w-full">
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
            <div className="flex-1">{element}</div>
          </div>
        );
      case "right":
        return (
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1">{element}</div>
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
          </div>
        );
    }
  };

  const finalElement = renderWithHeader(sliderElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip
        title={tooltipProps.title}
        placement={tooltipProps.placement}
        triggerClassName="block w-full"
      >
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
