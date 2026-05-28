"use client";

import { useState, useRef, useEffect } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Icon } from "./Icon";
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { CommonHeaderAndTooltip } from "./CommonHeaderAndTooltip";
import { useInfoMsg } from "@/app/components/infoMsgHandler";

type ContentAlign = "left" | "center" | "right";

interface ComboboxProps {
  value: string | string[];
  onChange: (value: Record<string, string> | string[]) => void;
  toSave: string;
  toDisplay?: string;
  isStatic?: boolean;
  isArray?: boolean;
  isMultiple?: boolean;
  staticOptions?: string[];
  dynamicData?: Record<string, any>[];
  getPaginationData?: (pageCount?: any, page?: number, searchValue?: string, isFromEvent?: boolean, fromWhere?: "onScroll" | "onSearch") => void;
  initialPage?: number;
  pageCount?: number;
  placeholder?: string;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: any;
  headerPosition?: HeaderPosition;
  className?: string;
  disabled?: boolean;
  validationState?: "valid" | "invalid" | "none";
  errorMessage?: string;
  contentAlign?: ContentAlign;
  onBlur?: (e:any) => void;
  search?:string;
  setSearch?:(e:any) => void;
}

export const Combobox: React.FC<ComboboxProps> = ({
  value,
  onChange,
  toSave,
  toDisplay,
  isStatic = false,
  isArray = false,
  isMultiple = false,
  staticOptions = [],
  dynamicData = [],
  getPaginationData,
  initialPage = 1,
  pageCount,
  placeholder = "Select...",
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = "top",
  className = "",
  disabled = false,
  validationState = "none",
  errorMessage,
  contentAlign = "center",
  onBlur=(e:any)=>{},
  search="",
  setSearch=(e:any)=>{}
}) => {
  const { theme, branding } = useGlobal();
  const isDark = theme === "dark" || theme === "dark-hc";
  const showToast = useInfoMsg();

  useEffect(() => {
    if (validationState === "invalid" && errorMessage) {
      showToast(errorMessage, "danger");
    }
  }, [validationState, errorMessage]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedArray, setSelectedArray] = useState<string[]>(Array.isArray(value) ? value : []);
  const [currentPage, setCurrentPage] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [loadTick, setLoadTick] = useState(0);

  useEffect(() => {
    if (isArray && Array.isArray(value)) setSelectedArray(value);
  }, [isArray, value]);

  const loadingRef = useRef(false);
  const scrollTopRef = useRef(0);
  const listDivRef = useRef<HTMLDivElement>(null);
  const loadPreLengthRef = useRef<number | undefined>(undefined);
  const noMorePagesRef = useRef(false);

  const dynamicOptions = dynamicData.map((row) => ({
    label: String(row[toDisplay ?? toSave] ?? ""),
    value: String(row[toSave] ?? ""),
  }));
  const staticMapped = staticOptions.map((o) => ({ label: o, value: o }));
  const allOptions = isStatic ? [...staticMapped, ...dynamicOptions] : dynamicOptions;
  const options = search
    ? allOptions.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : allOptions;

  useEffect(() => {
    if (loadPreLengthRef.current === undefined) return;
    if (dynamicData.length === loadPreLengthRef.current) {
      noMorePagesRef.current = true;
    } else {
      noMorePagesRef.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadTick]);

  const loadPage = (page: number, searchValue: string = search, fromWhere: "onScroll" | "onSearch" = "onScroll") => {
    if (!page || page < 1 || !pageCount || pageCount < 1) return;
    if (!getPaginationData || loadingRef.current) return;
    const lenBefore = dynamicData.length;
    loadingRef.current = true;
    setIsLoading(true);
    Promise.resolve(getPaginationData(pageCount, page, searchValue, true, fromWhere)).finally(() => {
      loadingRef.current = false;
      setIsLoading(false);
      setCurrentPage(page);
      loadPreLengthRef.current = lenBefore;
      setLoadTick((t) => t + 1);
    });
  };

  const handleOpen = () => {
    if (disabled) return;
    if (isOpen) {
      setIsOpen(false);
  
    } else {
      setIsOpen(true);
      noMorePagesRef.current = false;
      if (!isStatic && !currentPage && !loadingRef.current) {
        loadPage(initialPage);
      }
    }
  };

  const handleListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isStatic) return;
    const el = e.currentTarget;
    const isScrollingDown = el.scrollTop > scrollTopRef.current;
    scrollTopRef.current = el.scrollTop;
    if (
      isScrollingDown &&
      el.scrollHeight - el.scrollTop <= el.clientHeight + 20 &&
      !loadingRef.current &&
      !noMorePagesRef.current
    ) {
      loadPage((currentPage || 1) + 1);
    }
  };

  const handleListWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isStatic) return;
    const el = e.currentTarget;
    if (
      e.deltaY > 0 &&
      !loadingRef.current &&
      !noMorePagesRef.current &&
      el.scrollHeight - el.scrollTop <= el.clientHeight + 20
    ) {
      loadPage((currentPage || 1) + 1);
    }
  };

  


  const getBorderColor = () => {
    if (validationState === "invalid") return "border-red-500";
    if (validationState === "valid") return "border-green-500";
    if (isOpen) return "";
    return isDark ? "border-gray-600" : "border-gray-300";
  };

  const getContentAlignClass = () => {
    switch (contentAlign) {
      case "left": return "justify-start";
      case "right": return "justify-end";
      default: return "justify-center";
    }
  };

const containerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false);

    }
  };

  if (isOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isOpen]);

  const comboboxElement = (
    <div
    ref={containerRef}   // add this
      className={`relative ${getContentAlignClass()} w-full h-full ${className}`}
      tabIndex={-1}
    >
      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={`
          w-full px-4 py-2 border-2 flex items-center justify-between
          ${getBorderColor()}
          ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          transition-colors focus:outline-none
        `}
        style={{
          borderRadius: "var(--border-radius)",
          borderColor: validationState === "none" && isOpen ? branding.selectionColor : undefined,
        }}
        onMouseEnter={(e) => {
          if (!disabled && validationState === "none" && !isOpen)
            e.currentTarget.style.borderColor = branding.hoverColor;
        }}
        onMouseLeave={(e) => {
          if (!disabled && validationState === "none" && !isOpen)
            e.currentTarget.style.borderColor = "";
        }}
      >
        <span className={`w-4/5 truncate ${(isArray ? selectedArray.length === 0 : !value) ? (isDark ? "text-gray-500" : "text-gray-400") : ""}`}>
          {isArray
            ? selectedArray.length > 0 ? `${selectedArray.length} selected` : placeholder
            : (value as string) || placeholder}
        </span>
        <div className="flex items-center gap-1">
          {(isArray ? selectedArray.length > 0 : !!value) && !disabled && (
            <span
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                if (isArray) {
                  setSelectedArray([]);
                  onChange([]);
                } else {
                  onChange({ [toSave]: "", ...(toDisplay ? { [toDisplay]: "" } : {}) });
                }
                onBlur?.("")
              }}
              className={`p-0.5 rounded transition-colors cursor-pointer ${isDark ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
              style={{ borderRadius: "var(--border-radius)" }}
            >
              <Icon data="IoIosClose" fillContainer={false} />
            </span>
          )}
          <Icon data={isOpen ? "IoIosArrowUp" : "IoIosArrowDown"} fillContainer={false} />
        </div>
      </button>

      {isOpen && (
        <div
          ref={listDivRef}
          className={`absolute z-50 w-full mt-1 max-h-60 overflow-y-auto border-2 shadow-lg ${isDark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"}`}
          style={{ borderRadius: "var(--border-radius)" }}
          onScroll={handleListScroll}
          onWheel={handleListWheel}
        >
          <div className="px-2 pt-2 pb-1 sticky top-0" style={{ background: isDark ? "#1f2937" : "#fff" }}>
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => {
                const val = e.target.value;
                setSearch(val);
                if (!isStatic) {
                  noMorePagesRef.current = false;
                  setCurrentPage(undefined);
                  loadPage(1, val, "onSearch");
                }
              }}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder="Search..."
              className={`w-full px-3 py-1 border focus:outline-none  ${isDark ? "bg-gray-700 text-white border-gray-500 placeholder-gray-400" : "bg-white text-black border-gray-300 placeholder-gray-400"}`}
              style={{ borderRadius: "var(--border-radius)" }}
            />
          </div>
          {options.map((option, idx) => (
            <div
              key={`${option.value}-${idx}`}
              className={`px-4 py-2 cursor-pointer transition-colors  ${
                (isArray ? selectedArray.includes(option.value) : option.label === value || option.value === value)
                  ? "text-white"
                  : isDark ? "text-gray-200 hover:[background-color:var(--hover-color)]" : "text-gray-700 hover:[background-color:var(--hover-color)]"
              }`}
              style={{ backgroundColor: (isArray ? selectedArray.includes(option.value) : option.label === value || option.value === value) ? branding.selectionColor : undefined }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (isArray) {
                  if (isMultiple) {
                    // case 3: toggle in/out, keep dropdown open
                    const next = selectedArray.includes(option.value)
                      ? selectedArray.filter((v) => v !== option.value)
                      : [...selectedArray, option.value];
                    setSelectedArray(next);
                    onChange(next);
                    onBlur?.(next)
                  } else {
                    // case 2: replace with single-item array, close dropdown
                    const next = [option.value];
                    setSelectedArray(next);
                    onChange(next);
                    setIsOpen(false);
                    // setSearch("");
                    onBlur?.(next)
                  }
                } else {
                  // case 1: single string
                  onChange({ [toSave]: option.value, ...(toDisplay ? { [toDisplay]: option.label } : {}) });
                  setIsOpen(false);
                  // setSearch("");
                  onBlur?.({ [toSave]: option.value, ...(toDisplay ? { [toDisplay]: option.label } : {}) })
                }
                
              }}
            >
              {option.label}
            </div>
          ))}
          {isLoading && (
            <div className={`px-4 py-2 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Loading...
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <CommonHeaderAndTooltip
      needTooltip={needTooltip}
      tooltipProps={tooltipProps}
      headerText={headerText}
      headerPosition={headerPosition}
      className={className}
      fillContainer={true}
    >
      {comboboxElement}
    </CommonHeaderAndTooltip>
  );
};
