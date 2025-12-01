"use client";

import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useGlobal } from "@/context/GlobalContext";
import { useEventBus } from "@/context/EventBusContext";
import { Tooltip } from "./Tooltip";
import { HeaderPosition, TooltipProps as TooltipPropsType, ComponentEvents } from "@/types/global";
import { getFontSizeClass, getBorderRadiusClass } from "@/app/utils/branding";

export interface SignatureRef {
  clear: () => void;
  toDataURL: (type?: string, encoderOptions?: number) => string;
  fromDataURL: (dataURL: string) => void;
  isEmpty: () => boolean;
}

interface SignatureProps {
  nodeId?: string;
  value?: string;
  title?: string;
  height?: number;
  width?: number;
  headerText?: string;
  headerPosition?: HeaderPosition;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  disabled?: boolean;
  readOnly?: boolean;
  require?: boolean;
  penColor?: string;
  backgroundColor?: string;
  clearButtonText?: string;
  onChange?: (signature: string) => void;
  onEnd?: () => void;
  events?: ComponentEvents[];
  className?: string;
}

export const Signature = forwardRef<SignatureRef, SignatureProps>(({
  nodeId,
  value = "",
  title,
  height = 200,
  width,
  headerText,
  headerPosition = "top",
  needTooltip = false,
  tooltipProps,
  disabled = false,
  readOnly = false,
  require = false,
  penColor,
  backgroundColor,
  clearButtonText = "Clear",
  onChange,
  onEnd,
  events,
  className = "",
}, ref) => {
  const { theme, branding } = useGlobal();
  const eventBus = useEventBus();
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isDisabled, setIsDisabled] = useState(disabled);
  const [isVisible, setIsVisible] = useState(true);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    clear: () => {
      sigCanvas.current?.clear();
    },
    toDataURL: (type?: string, encoderOptions?: number) => {
      return sigCanvas.current?.toDataURL(type, encoderOptions) || "";
    },
    fromDataURL: (dataURL: string) => {
      sigCanvas.current?.fromDataURL(dataURL);
    },
    isEmpty: () => {
      return sigCanvas.current?.isEmpty() ?? true;
    },
  }));

  // Load existing signature
  useEffect(() => {
    if (sigCanvas.current && value) {
      sigCanvas.current.fromDataURL(value);
    }
  }, [value]);

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
                handleClear();
                break;
              case "refreshElement":
                if (payload.data?.value !== undefined) {
                  if (sigCanvas.current) {
                    if (payload.data.value) {
                      sigCanvas.current.fromDataURL(payload.data.value);
                    } else {
                      sigCanvas.current.clear();
                    }
                  }
                }
                break;
              default:
                console.log(`Signature ${nodeId} received event: ${listener.key}`, payload);
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

  const handleEnd = () => {
    if (sigCanvas.current && !isDisabled && !readOnly) {
      const signature = sigCanvas.current.toDataURL();
      onChange?.(signature);
      onEnd?.();

      // Emit rise events when signature ends
      const onEndEvent = events?.find(e => e.name === "onEnd" || e.name === "onChange");
      if (onEndEvent?.enabled && onEndEvent.rise && nodeId) {
        onEndEvent.rise.forEach(riseEvent => {
          eventBus.emit(riseEvent.key, {
            nodeId,
            data: { value: signature },
          });
        });
      }
    }
  };

  const handleClear = () => {
    if (sigCanvas.current && !isDisabled && !readOnly) {
      sigCanvas.current.clear();
      onChange?.("");

      // Emit rise events when cleared
      const onChangeEvent = events?.find(e => e.name === "onChange");
      if (onChangeEvent?.enabled && onChangeEvent.rise && nodeId) {
        onChangeEvent.rise.forEach(riseEvent => {
          eventBus.emit(riseEvent.key, {
            nodeId,
            data: { value: "" },
          });
        });
      }
    }
  };

  const isDark = theme === "dark" || theme === "dark-hc";

  // Determine pen and background colors based on theme
  const defaultPenColor = penColor || (isDark ? "#fff" : "#000");
  const defaultBackgroundColor = backgroundColor || (isDark ? "#1F2937" : "#fff");

  const signatureElement = (
    <div className={`w-full ${className}`}>
      {title && (
        <h3
          className={`mb-2 ${getFontSizeClass(branding.fontSize)} font-semibold ${
            isDark ? "text-gray-200" : "text-gray-700"
          }`}
          style={{ fontFamily: "var(--font-body)" }}
        >
          {title}
        </h3>
      )}

      <div className="relative">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            width: width || 500,
            height: height,
            className: `
              border-2
              ${getBorderRadiusClass(branding.borderRadius)}
              ${isDark ? "border-gray-600" : "border-gray-300"}
              ${isDisabled || readOnly ? "cursor-not-allowed opacity-50" : "cursor-crosshair"}
            `,
            style: {
              width: width ? `${width}px` : "100%",
              height: `${height}px`,
            },
          }}
          penColor={defaultPenColor}
          backgroundColor={defaultBackgroundColor}
          onEnd={handleEnd}
          clearOnResize={false}
        />
      </div>
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
            <div className={headerClasses} style={{ fontFamily: "var(--font-body)" }}>
              {headerContent}
            </div>
            {element}
          </div>
        );
      case "bottom":
        return (
          <div className="flex flex-col w-full">
            {element}
            <div className={`${headerClasses} mt-1 mb-0`} style={{ fontFamily: "var(--font-body)" }}>
              {headerContent}
            </div>
          </div>
        );
      case "left":
        return (
          <div className="flex items-start gap-4 w-full">
            <div className={`${headerClasses} mb-0 whitespace-nowrap`} style={{ fontFamily: "var(--font-body)" }}>
              {headerContent}
            </div>
            <div className="flex-1">{element}</div>
          </div>
        );
      case "right":
        return (
          <div className="flex items-start gap-4 w-full">
            <div className="flex-1">{element}</div>
            <div className={`${headerClasses} mb-0 whitespace-nowrap`} style={{ fontFamily: "var(--font-body)" }}>
              {headerContent}
            </div>
          </div>
        );
    }
  };

  const finalElement = renderWithHeader(signatureElement);

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
});

Signature.displayName = "Signature";
 