"use client";

import React from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { Icon } from "./Icon";
import { GravityIcon } from "@/types/icons";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass, getBorderRadiusClass } from "@/app/utils/branding";

type LabelSize = "xs" | "s" | "m";
type LabelTheme = "normal" | "info" | "danger" | "warning" | "success" | "utility" | "unknown" | "clear";

interface LabelProps {
  size: LabelSize;
  theme: LabelTheme;
  interactive?: boolean;
  copy?: boolean;
  disabled?: boolean;
  icon?: string;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({
  size,
  theme: labelTheme,
  interactive = false,
  copy = false,
  disabled = false,
  icon,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  children,
  onClick,
  className = "",
}) => {
  const { theme, branding } = useGlobal();

  const handleCopy = () => {
    if (copy && children) {
      navigator.clipboard.writeText(children.toString());
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "xs":
        return "px-1.5 py-0.5 text-xs";
      case "s":
        return "px-2 py-1 text-sm";
      case "m":
        return "px-3 py-1.5 text-base";
      default:
        return "px-2 py-1 text-sm";
    }
  };

  const getThemeColors = () => {
    const isDark = theme === "dark" || theme === "dark-hc";

    switch (labelTheme) {
      case "info":
        return { bg: isDark ? "#1E3A8A" : "#DBEAFE", text: isDark ? "#BFDBFE" : "#1E40AF" };
      case "danger":
        return { bg: isDark ? "#991B1B" : "#FEE2E2", text: isDark ? "#FECACA" : "#991B1B" };
      case "warning":
        return { bg: isDark ? "#854D0E" : "#FEF3C7", text: isDark ? "#FDE68A" : "#854D0E" };
      case "success":
        return { bg: isDark ? "#166534" : "#DCFCE7", text: isDark ? "#BBF7D0" : "#166534" };
      case "utility":
        return { bg: isDark ? "#374151" : "#F3F4F6", text: isDark ? "#D1D5DB" : "#374151" };
      case "unknown":
        return { bg: isDark ? "#4B5563" : "#E5E7EB", text: isDark ? "#9CA3AF" : "#6B7280" };
      case "clear":
        return { bg: "transparent", text: isDark ? "#F9FAFB" : "#111827" };
      default:
        return { bg: isDark ? "#1F2937" : "#F3F4F6", text: isDark ? "#F9FAFB" : "#111827" };
    }
  };

  const colors = getThemeColors();
  const isDark = theme === "dark" || theme === "dark-hc";

  const labelElement = (
    <span
      onClick={disabled ? undefined : (copy ? handleCopy : onClick)}
      className={`
        ${getSizeClasses()}
        ${getBorderRadiusClass(branding.borderRadius)}
        inline-flex items-center gap-1
        font-medium
        ${disabled ? "opacity-50 cursor-not-allowed" : (interactive || copy || onClick) ? "cursor-pointer hover:opacity-80" : ""}
        transition-all
        ${className}
      `}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {icon && <Icon data={icon} size={size === "xs" ? 12 : size === "s" ? 14 : 16} />}
      {children}
    </span>
  );

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) return element;

    const headerClasses = `${getFontSizeClass(branding.fontSize)} font-semibold mb-1 ${
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
            <div className={`${headerClasses} mt-1 mb-0`}>{headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className="flex items-center gap-2">
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
            {element}
          </div>
        );
      case "right":
        return (
          <div className="flex items-center gap-2">
            {element}
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
          </div>
        );
    }
  };

  const finalElement = renderWithHeader(labelElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
