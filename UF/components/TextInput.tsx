"use client";

import React, { useState, useEffect } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { useEventBus } from "@/context/EventBusContext";
import { Tooltip } from "./Tooltip";
import { Icon } from "./Icon";
import { ComponentSize, TextInputType, TextInputView, TextAreaPin, HeaderPosition, TooltipProps as TooltipPropsType, ComponentEvents } from "@/types/global";
import { getFontSizeClass, getBorderRadiusClass } from "@/app/utils/branding";
import { GravityIcon } from "@/types/icons";

interface TextInputProps {
  nodeId?: string;
  disabled?: boolean;
  label?: string;
  pin?: TextAreaPin;
  placeholder?: string;
  size?: ComponentSize;
  type?: TextInputType;
  leftContent?: string;
  rightContent?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  topContent?: boolean;
  readOnly?: boolean;
  view?: TextInputView;
  name?: string;
  value?: string;
  note?: string;
  validationState?: 'valid' | 'invalid';
  errorMessage?: string;
  hasClear?: boolean;
  autoFocus?: boolean;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  require?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
  onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined
  events?: ComponentEvents[];
  className?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  nodeId,
  disabled = false,
  label,
  pin = "round-round",
  placeholder,
  size,
  type = "text",
  leftContent,
  rightContent,
  startContent,
  endContent,
  topContent = false,
  readOnly = false,
  view = "normal",
  name="",
  value = "",
  note,
  validationState,
  errorMessage,
  hasClear = false,
  autoFocus = false,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  require = false,
  onChange,
  onBlur=() => {},
  events,
  className = "",
}) => {
  const { theme, direction, branding } = useGlobal();
  const eventBus = useEventBus();
  const [internalValue, setInternalValue] = useState(value);
  const [isDisabled, setIsDisabled] = useState(disabled);
  const [isVisible, setIsVisible] = useState(true);

  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    // onChange?.(newValue);

    // Emit rise events when onChange occurs
    const onChangeEvent = events?.find(e => e.name === "onChange");
    if (onChangeEvent?.enabled && onChangeEvent.rise && nodeId) {
      onChangeEvent.rise.forEach(riseEvent => {
        eventBus.emit(riseEvent.key, {
          nodeId,
          data: { value: newValue },
        });
      });
    }
  };

  // Subscribe to riseListen events
  useEffect(() => {
    if (!nodeId || !events) return;

    const unsubscribers: (() => void)[] = [];

    events.forEach(event => {
      if (event.enabled && event.riseListen) {
        event.riseListen.forEach(listener => {
          const subscribe = listener.listenerType === "type1"
            ? eventBus.subscribeGlobal
            : (key: string, cb: any) => eventBus.subscribe(key, nodeId, cb);

          const unsubscribe = subscribe(listener.key, (payload) => {
            // Handle different event types
            switch (listener.key) {
              case "hideElement":
                setIsVisible(false);
                break;
              case "showElement":
                setIsVisible(true);
                break;
              case "disableElement":
                setIsDisabled(true);
                break;
              case "enableElement":
                setIsDisabled(false);
                break;
              case "clearHandler":
                setInternalValue("");
                // onChange?.("");
                break;
              case "refreshElement":
                // Refresh could reload value from memory or reset to initial
                if (payload.data?.value !== undefined) {
                  setInternalValue(payload.data.value);
                }
                break;
              default:
                // For custom events, just log them
                console.log(`TextInput ${nodeId} received event: ${listener.key}`, payload);
            }
          });

          unsubscribers.push(unsubscribe);
        });
      }
    });

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [nodeId, events, eventBus]);

  const getSizeClasses = () => {
    const fontSize = getFontSizeClass(branding.fontSize);
    switch (size) {
      case "xs":
    return `px-2 py-1 ${fontSize === "text-xl"? "text-sm": fontSize === "text-lg"? "text-xs": "text-[10px]"}`;
      case "s":
        return `px-3 py-1.5 ${fontSize === "text-xl" ? "text-base" : fontSize === "text-lg" ? "text-sm" : "text-xs"}`;
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

  const getPinClasses = () => {
    const baseRadius = getBorderRadiusClass(branding.borderRadius);
    
    if (pin === "clear-clear") {
      return baseRadius;
    }
    
    const [left, right] = pin.split("-");
    const leftRadius =
      left === "round" ? "rounded-l-full" :
      left === "brick" ? "rounded-l-none" :
      `rounded-l${baseRadius.replace("rounded", "")}`;
    const rightRadius =
      right === "round" ? "rounded-r-full" :
      right === "brick" ? "rounded-r-none" :
      `rounded-r${baseRadius.replace("rounded", "")}`;
    
    return `${leftRadius} ${rightRadius}`;
  };

  const getInputStyles = (): React.CSSProperties => {
    const isDark = theme === "dark" || theme === "dark-hc";
    const styles: React.CSSProperties = {};

    if (validationState === 'invalid' || errorMessage) {
      styles.borderColor = "#EF4444";
    } else if (validationState === 'valid') {
      styles.borderColor = "#10B981";
    } else if (view === "normal") {
      styles.borderColor = isDark ? "#4B5563" : "#D1D5DB";
    } else if (view === "clear") {
      styles.borderColor = "transparent";
    }

    return styles;
  };

  const isDark = theme === "dark" || theme === "dark-hc";

  const inputElement = (
    <div className="w-full">
      {label && topContent && (
        <label
          className={`block mb-2 ${getFontSizeClass(branding.fontSize)} font-medium ${
            isDark ? "text-gray-200" : "text-gray-900"
          }`}
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {(startContent || leftContent) && (
          <div className={`absolute ${direction === "RTL" ? "right-3" : "left-3"} ${
            isDark ? "text-gray-400" : "text-gray-500"
          } flex items-center`}>
            {startContent || leftContent}
          </div>
        )}
        
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={isDisabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          // style={getInputStyles()}
          className={`
            w-full
            ${getSizeClasses()}
            ${getPinClasses()}
            ${view === "normal" ? "border-2" : view === "clear" ? "border-2 border-transparent" : "border-0 border-b-2"}
            ${(startContent || leftContent) ? (direction === "RTL" ? "pr-10" : "pl-10") : ""}
            ${(endContent || rightContent || hasClear) ? (direction === "RTL" ? "pl-10" : "pr-10") : ""}
            ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
            ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
            transition-all
            focus:outline-none
            ${className}
          `}
          style={{
            fontFamily: 'var(--font-body)',
            ...getInputStyles(),
            ...(!errorMessage && view === "normal" ? {
             // outlineColor: branding.brandColor,
             // boxShadow: `0 0 0 2px ${branding.brandColor}20`
            } : {})
          }}
          onFocus={(e) => {
            if (!errorMessage && !validationState) {
              e.currentTarget.style.borderColor = branding.brandColor;
              if (view === "clear") {
                e.currentTarget.style.boxShadow = "none";
              }
            }
          }}
          onBlur={(e) => {
            if (!errorMessage && !validationState) {
              if (view === "clear") {
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.boxShadow = "none";
              } else {
                e.currentTarget.style.borderColor = isDark ? "#4B5563" : "#D1D5DB";
              }
            }
            onBlur(e)
          }}
        />
       
        {(endContent || rightContent || (hasClear && internalValue)) && (
          <div className={`absolute ${direction === "RTL" ? "left-3" : "right-3"} flex items-center gap-2`}>
            {hasClear && internalValue && (
              <button
                onClick={() => handleChange("")}
                className={`${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"} transition-colors`}
              >
                <Icon data="close" size={16} />
              </button>
            )}
            {endContent && (
              <div className={`flex items-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {endContent}
              </div>
            )}
            {!endContent && rightContent && (
              <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                {rightContent}
              </span>
            )}
          </div>
        )}
      </div>
      
      {(note || errorMessage || validationState === 'invalid') && (
        <div className={`mt-1 text-sm ${(validationState === 'invalid' || errorMessage) ? "text-red-500" : isDark ? "text-gray-400" : "text-gray-600"}`}>
          {errorMessage || note}
        </div>
      )}
    </div>
  );

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) return element;

    const headerClasses = `${getFontSizeClass(branding.fontSize)} font-semibold mb-1 ${
      isDark ? "text-gray-300" : "text-gray-700"
    }`;

    const headerContent = (
      <>
        {headerText}
        {require && <span className="text-red-500 ml-1">*</span>}
      </>
    );

    switch (headerPosition) {
      case "top":
        return (
          <div className="flex flex-col w-full">
            <div className={headerClasses}>{headerContent}</div>
            {element}
          </div>
        );
      case "bottom":
        return (
          <div className="flex flex-col w-full">
            {element}
            <div className={`${headerClasses} mt-1 mb-0`}>{headerContent}</div>
          </div>
        );
      case "left":
        return (
          <div className="flex items-center w-full">
            <div className={`${headerClasses} mb-0 ${direction === "RTL" ? "ml-4" : "mr-4"} whitespace-nowrap`}>
              {headerContent}
            </div>
            <div className="flex-1">{element}</div>
          </div>
        );
      case "right":
        return (
          <div className="flex items-center w-full">
            <div className="flex-1">{element}</div>
            <div className={`${headerClasses} mb-0 ${direction === "RTL" ? "mr-4" : "ml-4"} whitespace-nowrap`}>
              {headerContent}
            </div>
          </div>
        );
    }
  };

  const finalElement = renderWithHeader(inputElement);

  // Don't render if hidden by event
  if (!isVisible) {
    return null;
  }

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
