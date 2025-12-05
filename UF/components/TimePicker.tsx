'use client'
import React, { useState,useContext,useEffect } from 'react'
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution';
import { AxiosService } from '@/app/components/axiosService';
import { Tooltip } from './Tooltip';
import { ComponentSize, HeaderPosition, TooltipProps as TooltipPropsType } from '@/types/global';
import { useGlobal } from '@/context/GlobalContext';
import { getFontSizeClass,getBorderRadiusClass } from '@/app/utils/branding';

interface TimePickerProps {
  timeType?: "normal" | "24hour";
  setting?: "HH:mm" | "HH:mm:ss";
  label?: string;
  state?: string;
  setState?: (fn: (prev: any) => any) => void;
  size?: ComponentSize;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const TimePicker: React.FC<TimePickerProps> = ({
  timeType="normal",
  setting="HH:mm",
  label="",
  state="",
  setState=()=>{},
  size = "m",
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  readOnly = false,
  disabled = false,
  className = "",
  style
}) => {
const { theme, direction, branding } = useGlobal();
  const [hour, setHour] = useState<string>('00')
  const [minute, setMinute] = useState<string>('00')
  const [second, setSecond] = useState<string>('00')
  const [period, setPeriod] = useState<string>('AM');
  const periods = ['AM', 'PM'];

  const [forFirstTime,setForFirstTime]=useState(false)

  const isDark = theme === "dark" || theme === "dark-hc";

  const setTime = () => {
    let time: any =""
    if(timeType="normal")
    {
        if(period=="AM")
        {
            time= `2025-01-23T${hour || '00'}:${minute || '00'}:${second || '00'}Z`
        }else{
            time= `2025-01-23T${parseInt(hour)+12 || '00'}:${minute || '00'}:${second || '00'}Z`
        }

    }else{
        time= `2025-01-23T${hour || '00'}:${minute || '00'}:${second || '00'}Z`
    }
  if(forFirstTime)
    setState((pre: any) => ({ ...pre, [label]: time }))
  setForFirstTime(true)
  }
  useEffect(() => {
    setTime()
  }, [hour, minute, second,period])

  const hours = Array.from({ length: timeType=="normal"?12: 24}, (_, i) =>
    String(i).padStart(2, '0')
  )
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, '0')
  )
  const seconds = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, '0')
  )

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHour(e.target.value)
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMinute(e.target.value)
  }

  const handleSecChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSecond(e.target.value)
  }

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod(e.target.value)
  }

  const getSizeClasses = () => {
    const fontSize = getFontSizeClass(branding.fontSize);
    switch (size) {
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

  const keyset: any = i18n.keyset('language')

  const timePickerElement = (
    <div className="w-full" style={style}>
      {label && (
        <label className={`block mb-2 ${getFontSizeClass(branding.fontSize)} font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          {label}
        </label>
      )}
      <div className={`flex gap-2 ${className}`}>
        {/* Hour Selector */}
        <select
          className={`
            ${getSizeClasses()}
            ${getBorderRadiusClass(branding.borderRadius)}
            border-2
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${readOnly ? "cursor-default" : ""}
            ${isDark ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"}
            transition-colors
            focus:outline-none
          `}
          value={hour}
          onChange={handleHourChange}
          disabled={disabled}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = branding.brandColor;
            e.currentTarget.style.boxShadow = `0 0 0 2px ${branding.brandColor}20`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = isDark ? "#4B5563" : "#D1D5DB";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {hours.map(h => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        {/* Minute Selector */}
        <select
          className={`
            ${getSizeClasses()}
            ${getBorderRadiusClass(branding.borderRadius)}
            border-2
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${readOnly ? "cursor-default" : ""}
            ${isDark ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"}
            transition-colors
            focus:outline-none
          `}
          value={minute}
          onChange={handleMinuteChange}
          disabled={disabled}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = branding.brandColor;
            e.currentTarget.style.boxShadow = `0 0 0 2px ${branding.brandColor}20`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = isDark ? "#4B5563" : "#D1D5DB";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {minutes.map(m => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* Second Selector */}
        {setting=="HH:mm:ss" && (
          <select
            className={`
              ${getSizeClasses()}
              ${getBorderRadiusClass(branding.borderRadius)}
              border-2
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              ${readOnly ? "cursor-default" : ""}
              ${isDark ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"}
              transition-colors
              focus:outline-none
            `}
            value={second}
            onChange={handleSecChange}
            disabled={disabled}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = branding.brandColor;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${branding.brandColor}20`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = isDark ? "#4B5563" : "#D1D5DB";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {seconds.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}

        {/* AM/PM Selector */}
        {timeType=="normal" && (
          <select
            className={`
              ${getSizeClasses()}
              ${getBorderRadiusClass(branding.borderRadius)}
              border-2
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              ${readOnly ? "cursor-default" : ""}
              ${isDark ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"}
              transition-colors
              focus:outline-none
            `}
            value={period}
            onChange={handlePeriodChange}
            disabled={disabled}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = branding.brandColor;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${branding.brandColor}20`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = isDark ? "#4B5563" : "#D1D5DB";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {periods.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        )}
      </div>
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
          <div className="flex flex-col">
            <div className={headerClasses}>{headerText}</div>
            {element}
          </div>
        );
      case "bottom":
        return (
          <div className="flex flex-col">
            {element}
            <div className={`${headerClasses} mt-2 mb-0`}>{headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className="flex items-center gap-4">
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
            {element}
          </div>
        );
      case "right":
        return (
          <div className="flex items-center gap-4">
            {element}
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
          </div>
        );
    }
  };

  const finalElement = renderWithHeader(timePickerElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
}
export default TimePicker