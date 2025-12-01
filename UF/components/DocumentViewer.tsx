"use client";
import { CSSProperties } from "react";
import { DocumentViewer } from "react-documents";

export declare type viewerType = 'google' | 'office' | 'mammoth' | 'pdf' | 'url';


interface DocViewerProps {
    loaded?: () => void;
    url: string;
    queryParams: string;
    viewerUrl: string;
    googleCheckInterval: number;
    googleMaxChecks: number;
    googleCheckContentLoaded: boolean;
    viewer: viewerType;
    overrideLocalhost: string;
    style?: CSSProperties | undefined;
    className?: string | undefined;
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
    style
}) => {
    return (
        <div className="w-full h-full">
            <DocumentViewer
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
            />
        </div>
    );
};

export default DocViewer;