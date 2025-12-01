"use client";

import React, { useEffect, useRef } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Tooltip } from "./Tooltip";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { getFontSizeClass } from "@/app/utils/branding";

interface QrCodeProps {
  value: string;
  title?: string;
  size?: number;
  height?: number;
  width?: number;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  className?: string;
}

export const QrCode: React.FC<QrCodeProps> = ({
  value,
  title,
  size,
  height,
  width,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  className = "",
}) => {
  const { theme, branding } = useGlobal();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const finalSize = size || width || height || 200;

  useEffect(() => {
    // Simple QR code generation placeholder
    // In a real implementation, you would use a library like qrcode or qrcode.react
    const canvas = canvasRef.current;
    if (canvas && value) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear canvas
        ctx.fillStyle = theme === "dark" || theme === "dark-hc" ? "#1F2937" : "#FFFFFF";
        ctx.fillRect(0, 0, finalSize, finalSize);

        // Draw a simple placeholder pattern
        ctx.fillStyle = theme === "dark" || theme === "dark-hc" ? "#FFFFFF" : "#000000";
        const cellSize = finalSize / 10;

        // Simple pattern to represent QR code
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 10; j++) {
            if ((i + j) % 2 === 0) {
              ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
          }
        }

        // Add text in center
        ctx.fillStyle = theme === "dark" || theme === "dark-hc" ? "#1F2937" : "#FFFFFF";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText("QR Code", finalSize / 2, finalSize / 2);
        ctx.font = "10px Arial";
        ctx.fillText("(Use QR library)", finalSize / 2, finalSize / 2 + 15);
      }
    }
  }, [value, finalSize, theme]);

  const isDark = theme === "dark" || theme === "dark-hc";

  const qrCodeElement = (
    <div className={`flex flex-col items-center ${className}`}>
      {title && (
        <h3 className={`mb-2 ${getFontSizeClass(branding.fontSize)} font-semibold ${
          isDark ? "text-gray-200" : "text-gray-700"
        }`}>
          {title}
        </h3>
      )}

      <canvas
        ref={canvasRef}
        width={finalSize}
        height={finalSize}
        className="border-2 rounded"
        style={{
          borderColor: isDark ? "#4B5563" : "#D1D5DB",
        }}
      />

      <p className={`mt-2 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        Value: {value}
      </p>
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
          <div className="flex flex-col items-center">
            <div className={headerClasses}>{headerText}</div>
            {element}
          </div>
        );
      case "bottom":
        return (
          <div className="flex flex-col items-center">
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

  const finalElement = renderWithHeader(qrCodeElement);

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
};
