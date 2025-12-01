"use client";

import React from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { Icon } from "./Icon";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass, getBorderRadiusClass } from "@/app/utils/branding";

type CardSize = "m" | "l";
type CardTheme = "normal" | "info" | "success" | "warning" | "danger" | "utility" | "brand";
type CardView = "outlined" | "clear" | "filled" | "raised";
type CardType = "selection" | "action" | "container";
type Alignment = "start" | "center" | "end";

interface CardProps {
  size?: CardSize;
  theme?: CardTheme;
  view?: CardView;
  type?: CardType;
  disabled?: boolean;
  selected?: boolean;
  title?: string;
  prefixValue?: string;
  icon?: string | React.ReactNode;
  alignment?: Alignment;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  size = "m",
  theme: cardTheme = "normal",
  view = "filled",
  type = "container",
  disabled = false,
  selected = false,
  title,
  prefixValue,
  icon,
  alignment = "start",
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  children,
  onClick,
  className = "",
  style = {},
}) => {
  const { theme, branding } = useGlobal();

  const getSizeClasses = () => {
    const fontSize = getFontSizeClass(branding.fontSize);
    switch (size) {
      case "m":
        return `p-4 ${fontSize}`;
      case "l":
        return `p-6 ${fontSize === "text-sm" ? "text-base" : fontSize === "text-base" ? "text-lg" : "text-xl"}`;
      default:
        return `p-4 ${fontSize}`;
    }
  };

  const getThemeColors = () => {
    const isDark = theme === "dark" || theme === "dark-hc";

    switch (cardTheme) {
      case "info":
        return { bg: isDark ? "#1E3A8A" : "#DBEAFE", border: "#3B82F6", text: isDark ? "#BFDBFE" : "#1E40AF" };
      case "success":
        return { bg: isDark ? "#166534" : "#DCFCE7", border: "#22C55E", text: isDark ? "#BBF7D0" : "#166534" };
      case "warning":
        return { bg: isDark ? "#854D0E" : "#FEF3C7", border: "#F59E0B", text: isDark ? "#FDE68A" : "#854D0E" };
      case "danger":
        return { bg: isDark ? "#991B1B" : "#FEE2E2", border: "#EF4444", text: isDark ? "#FECACA" : "#991B1B" };
      case "utility":
        return { bg: isDark ? "#374151" : "#F3F4F6", border: "#6B7280", text: isDark ? "#D1D5DB" : "#374151" };
      case "brand":
        return { bg: isDark ? branding.brandColor  : branding.brandColor , border: branding.brandColor, text: isDark ? "#F9FAFB" : "#111827" };
      default:
        return { bg: isDark ? "#1F2937" : "#FFFFFF", border: isDark ? "#4B5563" : "#E5E7EB", text: isDark ? "#F9FAFB" : "#111827" };
    }
  };

  const getAlignmentClass = () => {
    switch (alignment) {
      case "center":
        return "items-center text-center";
      case "end":
        return "items-end text-right";
      default:
        return "items-start text-left";
    }
  };

  const colors = getThemeColors();
  const isDark = theme === "dark" || theme === "dark-hc";

  const cardElement = (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        ${getSizeClasses()}
        ${getBorderRadiusClass(branding.borderRadius)}
        ${getAlignmentClass()}
        flex flex-col gap-3
        ${view === "outlined" ? "border-2" : view === "raised" ? "shadow-lg" : view === "filled" ? "border" : ""}
        ${selected ? "ring-2 ring-offset-2" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : onClick ? "cursor-pointer hover:shadow-md" : ""}
        ${type === "selection" && selected ? "border-2" : ""}
        transition-all duration-200
        ${className}
      `}
      style={{
        backgroundColor: view === "filled" ? colors.bg : view === "clear" ? "transparent" : isDark ? "#1F2937" : "#FFFFFF",
        borderColor: selected ? branding.brandColor : view === "outlined" || view === "filled" ? colors.border : "transparent",
        color: colors.text,
        fontFamily: "var(--font-body)",
        ...(selected ? { '--tw-ring-color': branding.brandColor } as any : {}),
        ...style,
      }}
    >
      {/* Title Section */}
      {title && (
        <div className={`${getFontSizeClass(branding.fontSize)} font-semibold border-b pb-2`} style={{ borderColor: isDark ? "#374151" : "#E5E7EB" }}>
          {title}
        </div>
      )}

      {/* Icon and Prefix Section */}
      {(icon || prefixValue) && (
        <div className="flex items-center gap-2">
          {icon && (
            typeof icon === "string" ? (
              <Icon data={icon} size={size === "l" ? 24 : 20} />
            ) : (
              icon
            )
          )}
          {prefixValue && (
            <span className="font-semibold">{prefixValue}</span>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="flex-1">
        {children}
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
          <div className="flex items-start gap-4">
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
            {element}
          </div>
        );
      case "right":
        return (
          <div className="flex items-start gap-4">
            {element}
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {headerText}
            </div>
          </div>
        );
    }
  };

  const finalElement = renderWithHeader(cardElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
