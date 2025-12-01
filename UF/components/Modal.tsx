"use client";

import React, { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Tooltip } from "./Tooltip";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { ComponentSize, HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass, getBorderRadiusClass } from "@/app/utils/branding";

type ModalSize = "s" | "m" | "l" | "xl";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  title?: string | React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  size = "xl",
  title,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children,
  footer,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  className = "",
}) => {
  const { isDark, isHighContrast, branding } = useTheme();

  // Handle escape key
  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  const getSizeClasses = () => {
    const fontSize = getFontSizeClass(branding.fontSize);
    switch (size) {
      case "s":
        return `max-w-md ${fontSize}`;
      case "m":
        return `max-w-lg ${fontSize}`;
      case "l":
        return `max-w-2xl ${fontSize === "text-sm" ? "text-base" : fontSize === "text-base" ? "text-lg" : "text-xl"}`;
      case "xl":
        return `max-w-4xl ${fontSize === "text-sm" ? "text-lg" : fontSize === "text-base" ? "text-xl" : "text-2xl"}`;
      default:
        return `max-w-lg ${fontSize}`;
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalElement = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
      onClick={handleOverlayClick}
    >
      <div
        className={`
          ${getSizeClasses()}
          ${getBorderRadiusClass(branding.borderRadius)}
          animate-scaleIn
          w-full
          flex flex-col
          ${isHighContrast ? 'border-2' : 'border'}
          transition-all duration-300 ease-in-out
          hover:shadow-2xl
          ${className}
        `}
        style={{
          backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
          borderColor: isDark ? "#4B5563" : "#E5E7EB",
          color: isDark ? "#F9FAFB" : "#111827",
          maxHeight: "90vh",
          boxShadow: isDark
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)"
            : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={`
              flex items-center justify-between
              px-6 py-4
              backdrop-blur-sm
            `}
            style={{
              borderColor: isDark ? "#374151" : "#E5E7EB",
              background: isDark
                ? "linear-gradient(to bottom, rgba(31, 41, 55, 0.8), rgba(31, 41, 55, 0.6))"
                : "linear-gradient(to bottom, rgba(249, 250, 251, 0.8), rgba(255, 255, 255, 0.6))",
            }}
          >
            {title && (
              <h2
                className={`${getFontSizeClass(branding.fontSize)} font-semibold`}
                style={{ color: isDark ? "#F9FAFB" : "#111827" }}
              >
                {title}
              </h2>
            )}
            <div className="flex-1" />
            {showCloseButton && (
              <button
                onClick={onClose}
                className={`
                  p-2
                  ${getBorderRadiusClass(branding.borderRadius)}
                  transition-all duration-200
                  ${isDark ? "hover:bg-gray-700 hover:shadow-lg" : "hover:bg-gray-100 hover:shadow-md"}
                  hover:scale-110
                  active:scale-95
                `}
                style={{
                  boxShadow: isDark
                    ? "0 2px 4px rgba(0, 0, 0, 0.2)"
                    : "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
                aria-label="Close modal"
              >
                <Icon data="FaTimes" size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar"
          style={{
            color: isDark ? "#F9FAFB" : "#111827",
            overscrollBehavior: "contain",
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={`
              px-6 py-4
              border-t
              ${isHighContrast ? 'border-t-2' : ''}
              flex items-center justify-end gap-3
              backdrop-blur-sm
            `}
            style={{
              borderColor: isDark ? "#374151" : "#E5E7EB",
              background: isDark
                ? "linear-gradient(to top, rgba(31, 41, 55, 0.8), rgba(31, 41, 55, 0.6))"
                : "linear-gradient(to top, rgba(249, 250, 251, 0.8), rgba(255, 255, 255, 0.6))",
            }}
          >
            {footer}
          </div>
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

  const finalElement = renderWithHeader(modalElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
