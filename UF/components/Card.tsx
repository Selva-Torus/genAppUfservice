"use client";

import React from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { Icon } from "./Icon";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";

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
  const { theme } = useGlobal();

  const getSizeClasses = () => {
    switch (size) {
      case "m":
        return "p-4";
      case "l":
        return "p-6";
      default:
        return "p-4";
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
        return { bg: "var(--brand-color)", border: "var(--brand-color)", text: isDark ? "#F9FAFB" : "#111827" };
      default:
        return { bg: isDark ? "#1F2937" : "#FFFFFF", border: isDark ? "#4B5563" : "##E5E7EB", text: isDark ? "#F9FAFB" : "#111827" };
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
        borderColor: selected ? "var(--selection-color)" : view === "outlined" || view === "filled" ? colors.border : "transparent",
        color: colors.text,
        fontFamily: "var(--font-body)",
        fontSize: size === "l" ? "var(--font-size-large)" : "var(--font-size)",
        borderRadius: "var(--border-radius)",
        ...(selected ? { '--tw-ring-color': 'var(--selection-color)' } as any : {}),
        ...style,
      }}
    >
      {/* Title Section */}
      {title && (
        <div className="font-semibold border-b pb-2" style={{ borderColor: isDark ? "#374151" : "#E5E7EB", fontSize: "var(--font-size)" }}>
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

    const headerClasses = `font-semibold mb-2 ${
      isDark ? "text-gray-300" : "text-gray-700"
    }`;

    const headerStyle = { fontSize: "var(--font-size)" };

    switch (headerPosition) {
      case "top":
        return (
          <div className="flex flex-col">
            <div className={headerClasses} style={headerStyle}>{headerText}</div>
            {element}
          </div>
        );
      case "bottom":
        return (
          <div className="flex flex-col">
            {element}
            <div className={`${headerClasses} mt-2 mb-0`} style={headerStyle}>{headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className="flex items-start gap-4">
            <div className={`${headerClasses} mb-0 whitespace-nowrap`} style={headerStyle}>
              {headerText}
            </div>
            {element}
          </div>
        );
      case "right":
        return (
          <div className="flex items-start gap-4">
            {element}
            <div className={`${headerClasses} mb-0 whitespace-nowrap`} style={headerStyle}>
              {headerText}
            </div>
          </div>
        );
    }
  };

  const finalElement = (<div className={className}>{renderWithHeader(cardElement)}</div>);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
