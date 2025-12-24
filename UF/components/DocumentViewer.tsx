"use client";
import React from "react";
import { CSSProperties } from "react";
import { DocumentViewer } from "react-documents";
import { Tooltip } from "./Tooltip";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { Text } from "./Text";

export declare type viewerType = 'google' | 'office' | 'mammoth' | 'pdf' | 'url';
type ContentAlign = "left" | "center" | "right";

interface DocViewerProps {
    loaded?: () => void;
    url?: string;
    queryParams?: string;
    viewerUrl?: string;
    googleCheckInterval?: number;
    googleMaxChecks?: number;
    googleCheckContentLoaded?: boolean;
    viewer?: viewerType;
    overrideLocalhost?: string;
    style?: CSSProperties | undefined;
    className?: string | undefined;
    headerText?: string;
    headerPosition?: HeaderPosition;
    tooltipProps?: TooltipPropsType;
    needTooltip?: boolean;
    enableEncryption?: boolean;
    fillContainer?: boolean;
    contentAlign?: ContentAlign;
}

const DocViewer: React.FC<DocViewerProps> = ({
    url,
    viewer = "url",
    queryParams = "",
    googleCheckInterval = 500,
    googleMaxChecks = 5,
    overrideLocalhost = "null",
    googleCheckContentLoaded = true,
    className = "document-viewer",
    style,
    headerText,
    headerPosition = "top",
    tooltipProps,
    needTooltip = false,
    enableEncryption,
    fillContainer = true,
    contentAlign = "center",
}) => {
        const getFillClasses = () => {
    if (!fillContainer) return "";
    return "w-full h-full";
  };
    const getContentAlignClasses = () => {
    switch (contentAlign) {
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      case "center":
      default:
        return "text-center";
    }
  };

    const documentViewerElement = (
        <div className={`w-full h-full ${fillContainer ? "flex" : "inline-flex"} flex-col ${getFillClasses()}`}>
        {!url?(
        <div className={`items-center justify-center bg-gray-50 rounded-xl border border-red-500 shadow-sm p-2 ${getContentAlignClasses()}`}>
            <Text variant="body-1" className="text-lg font-semibold text-gray-700">No Document Found</Text>
            <p className="text-sm text-gray-500">
                The attachment or document you are looking for is unavailable or not uploaded yet.
            </p>
        </div>)
            :
        (<DocumentViewer
            url={url}
            viewer={viewer}
            queryParams={queryParams}
            googleCheckInterval={googleCheckInterval}
            googleMaxChecks={googleMaxChecks}
            overrideLocalhost={overrideLocalhost}
            googleCheckContentLoaded={googleCheckContentLoaded}
            className={className}
            viewerUrl=""
            style={style}
            {...{ enableEncryption } as any}
        />)
        }
        </div>
    );

  

    const renderWithHeader = (element: React.ReactNode) => {
        if (!headerText) return <div className={`${getFillClasses()} ${className}`}>{element}</div>;

        const headerClasses = "text-base font-semibold mb-2 text-gray-700 dark:text-gray-300";

        switch (headerPosition) {
            case "top":
                return (
                    <div className={`${fillContainer ? "flex" : "inline-flex"} flex-col ${getFillClasses()} ${className}`}>
                        <div className={headerClasses}>{headerText}</div>
                        <div className={fillContainer ? "flex-1 min-h-0" : ""}>{element}</div>
                    </div>
                );
            case "bottom":
                return (
                    <div className={`${fillContainer ? "flex" : "inline-flex"} flex-col ${getFillClasses()} ${className}`}>
                        <div className={fillContainer ? "flex-1 min-h-0" : ""}>{element}</div>
                        <div className={`${headerClasses} mt-2 mb-0`}>{headerText}</div>
                    </div>
                );
            case "left":
                return (
                    <div className={`${fillContainer ? "flex" : "inline-flex"} items-start ${getFillClasses()} gap-4 ${className}`}>
                        <div className={`${headerClasses} mb-0 whitespace-nowrap flex-shrink-0`}>
                            {headerText}
                        </div>
                        <div className={fillContainer ? "flex-1 min-w-0 h-full" : ""}>{element}</div>
                    </div>
                );
            case "right":
                return (
                    <div className={`${fillContainer ? "flex" : "inline-flex"} items-start ${getFillClasses()} gap-4 ${className}`}>
                        <div className={fillContainer ? "flex-1 min-w-0 h-full" : ""}>{element}</div>
                        <div className={`${headerClasses} mb-0 whitespace-nowrap flex-shrink-0`}>
                            {headerText}
                        </div>
                    </div>
                );
        }
    };

    const finalElement = (<div className={`${fillContainer ? "w-full h-full" : ""} `}>{renderWithHeader(documentViewerElement)}</div>);

    if (needTooltip && tooltipProps) {
        return (
            <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
                {finalElement}
            </Tooltip>
        );
    }

    return <>{finalElement}</>;
};

export default DocViewer;