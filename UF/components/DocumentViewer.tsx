"use client";
import React from "react";
import { CSSProperties } from "react";
import { DocumentViewer } from "react-documents";
import { Tooltip } from "./Tooltip";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { Text } from "./Text";

export declare type viewerType = 'google' | 'office' | 'mammoth' | 'pdf' | 'url';

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
    height?: string;
    width?: string;
    enableEncryption?: boolean;
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
    height,
    width,
    enableEncryption
}) => {
    const documentViewerElement = (
        <div className="w-full h-full">
        {!url?(
        <div className="items-center justify-center text-center bg-gray-50 rounded-xl border border-red-500 shadow-sm p-2">
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
            {...{ height, width, enableEncryption } as any}
        />)
        }
        </div>
    );

    const renderWithHeader = (element: React.ReactNode) => {
        if (!headerText) return element;

        const headerClasses = "text-base font-semibold mb-2 text-gray-700 dark:text-gray-300";

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

    const finalElement = renderWithHeader(documentViewerElement);

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