"use client";

import React, { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { eventBus } from "@/app/eventBus";
import { Tooltip } from "./Tooltip";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { ComponentSize, HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass, getBorderRadiusClass } from "@/app/utils/branding";

type ModalPosition =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center-left"
  | "center-right";

type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full" | "auto";

interface ModalProps {
  open: boolean;
  onClose: () => void;
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
  position?: ModalPosition;
  showOverlay?: boolean;
  modalName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,

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
  position = "center",
  showOverlay = true,
  modalName,
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

  // Listen for closeModal event and close if modalName matches
  useEffect(() => {
    if (!modalName) return;

    const handleCloseModal = (name: string) => {
      if (name === modalName) {
        onClose();
      }
    };

    eventBus.on('closeModal', handleCloseModal);
    return () => {
      eventBus.off('closeModal', handleCloseModal);
    };
  }, [modalName, onClose]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const getPositionClasses = (): string => {
    switch (position) {
      case "top":
        return "items-start justify-center pt-8";
      case "bottom":
        return "items-end justify-center pb-8";
      case "left":
        return "items-center justify-start pl-8";
      case "right":
        return "items-center justify-end pr-8";
      case "top-left":
        return "items-start justify-start pt-8 pl-8";
      case "top-right":
        return "items-start justify-end pt-8 pr-8";
      case "bottom-left":
        return "items-end justify-start pb-8 pl-8";
      case "bottom-right":
        return "items-end justify-end pb-8 pr-8";
      case "center-left":
        return "items-center justify-start pl-8";
      case "center-right":
        return "items-center justify-end pr-8";
      case "center":
      default:
        return "items-center justify-center";
    }
  };

  const overlayStyles: React.CSSProperties = showOverlay
    ? {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }
    : {};

  const modalElement = (
    <div
      className={`fixed inset-0 z-50 flex rounded-lg ${getPositionClasses()}`}
      style={overlayStyles}
      onClick={handleOverlayClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`
          ${className}
          animate-scaleIn
          flex flex-col
          ${isHighContrast ? 'border-2' : 'border'}
          transition-all duration-300 ease-in-out
          hover:shadow-2xl
          rounded-lg
        `}
        style={{
          backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
          borderColor: isDark ? "#4B5563" : "#E5E7EB",
          color: isDark ? "#F9FAFB" : "#111827",
          maxHeight: "90vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={`
              flex items-center justify-between
              mt-4
              px-6
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
                className={`text-xl font-semibold`}
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
                  p-1
                  ${getBorderRadiusClass(branding.borderRadius)}
                  transition-all duration-200
                  ${isDark ? "hover:bg-gray-700 hover:shadow-lg" : "hover:bg-gray-100 hover:shadow-md"}
                `}                
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