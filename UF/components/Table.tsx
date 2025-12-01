"use client";

import React, { useState, useEffect } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { Icon } from "./Icon";
import { getFontSizeClass, getBorderRadiusClass } from"@/app/utils/branding";
import { BiSort } from "react-icons/bi";

interface RenderRowActionsProps {
  item: any;
  index: number;
}

interface TableProps {
  tablename?: string;
  primarykey?: string;
  parenttableprimarykey?: string;
  parenttablename?: string;
  isPivotTable?: boolean;
  search?: boolean;
  tableActions?: boolean;
  tableSelection?: boolean;
  tableSettings?: boolean;
  tableSorting?: boolean;
  isHyperLink?: boolean;
  needLocking?: boolean;
  emptyMessage?:string | React.ReactNode;
  data?: any[];
  columns?: any[];
  onRowClick?: (row: any) => void;
  className?: string;
  renderRowActions?: (props: RenderRowActionsProps) => React.ReactNode;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  selectionMode?: 'single' | 'multi';
  getRowId?: (row: any, index: number) => string;
  edgePadding?: boolean;
  settings?: any;
  updateSettings?: (settings: any) => void;
  wordWrap?: boolean;
}

export const Table: React.FC<TableProps> = ({
  tablename,
  primarykey,
  parenttableprimarykey,
  parenttablename,
  isPivotTable = false,
  search = false,
  tableActions = false,
  tableSelection = false,
  tableSettings = false,
  tableSorting = false,
  isHyperLink = false,
  needLocking = false,
  emptyMessage = "No Data Available",
  data = [],
  columns = [],
  onRowClick,
  className = "",
  renderRowActions,
  selectedIds=[],
  onSelectionChange,
  selectionMode = 'multi',
  getRowId,
  edgePadding = true,
  settings,
  updateSettings,
  wordWrap = false,
}) => {
  const { theme, branding } = useGlobal();
  const [internalSelectedIds123, setInternalSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showColumnModal, setShowColumnModal] = useState(false);

  // Normalize columns to handle both string[] and object[] formats
  const normalizedColumns = columns.map((col: any) =>
    typeof col === 'string' ? { id: col, name: col } : col
  );

  const [visibleColumns, setVisibleColumns] = useState<any[]>([]);

  // Update visible columns when columns prop changes - default to all columns selected
  useEffect(() => {
    setVisibleColumns(normalizedColumns);
  }, [columns]);

  // Use controlled selection if selectedIds is provided, otherwise use internal state
  // Helper function to get row ID
  const getRowIdHelper = (row: any, index: number): string => {
    if (getRowId) {
      return getRowId(row, index);
    }
    return index.toString();
  };

  const handleRowSelection = (row: any, index: number) => {
    if (tableSelection && onSelectionChange) {
      const rowId = getRowIdHelper(row, index);

      if (selectionMode === 'single') {
        // Single selection mode: replace selection with clicked row
        if (selectedIds.includes(rowId)) {
          onSelectionChange([]);
        } else {
          onSelectionChange([rowId]);
        }
      } else {
        // Multi selection mode: toggle selection
        if (selectedIds.includes(rowId)) {
          onSelectionChange(selectedIds.filter((id) => id !== rowId));
        } else {
          onSelectionChange([...selectedIds, rowId]);
        }
      }
    }
  };

  const handleSort = (columnId: string) => {
    if (tableSorting) {
      if (sortColumn === columnId) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortColumn(columnId);
        setSortDirection("asc");
      }
    }
  };

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) =>
      prev.some((col) => col.id === columnId)
        ? prev.filter((col) => col.id !== columnId)
        : [...prev, normalizedColumns.find((col) => col.id === columnId)]
    );
  };

  const handleSelectAllColumns = () => {
    setVisibleColumns(normalizedColumns);
  };

  const handleDeselectAllColumns = () => {
    setVisibleColumns([]);
  };

  const filteredData = search
    ? data.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  const sortedData = sortColumn
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return sortDirection === "asc" ? comparison : -comparison;
      })
    : filteredData;

  // Use all sorted data without pagination
  const displayData = sortedData;

  const handleSelectAllRows = () => {
    if (!onSelectionChange) return;

    const allIds = displayData.map((row, index) => getRowIdHelper(row, index));
    const allSelected = allIds.every(id => selectedIds.includes(id));

    if (allSelected) {
      // Deselect all rows
      onSelectionChange(selectedIds.filter(id => !allIds.includes(id)));
    } else {
      // Select all rows
      const newSelectedIds = [...selectedIds];
      allIds.forEach(id => {
        if (!newSelectedIds.includes(id)) {
          newSelectedIds.push(id);
        }
      });
      onSelectionChange(newSelectedIds);
    }
  };

  // Check if all rows are selected
  const allIds = displayData.map((row, index) => getRowIdHelper(row, index));
  const isAllRowsSelected = allIds.length > 0 && allIds.every(id => selectedIds.includes(id));
  const isSomeRowsSelected = allIds.some(id => selectedIds.includes(id)) && !isAllRowsSelected;

  const isDark = theme === "dark" || theme === "dark-hc";

  const tableElement = (
    <div className={`w-full ${edgePadding ? "p-4" : ""} ${className}`}>
      <div className="flex gap-4 mb-4">
        {search && (
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`
                w-full
                px-4 py-2
                ${getBorderRadiusClass(branding.borderRadius)}
                ${getFontSizeClass(branding.fontSize)}
                border-2
                ${isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}
              `}
            />
          </div>
        )}

      </div>

      {/* Column Visibility Modal */}
      {showColumnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`
              ${getBorderRadiusClass(branding.borderRadius)}
              ${isDark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"}
              border-2
              p-6
              w-96
              max-h-[80vh]
              overflow-auto
              shadow-xl
            `}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                Select Columns
              </h3>
              <button
                onClick={() => setShowColumnModal(false)}
                className="hover:opacity-70 transition-opacity"
              >
                <Icon data="IoIosCloseCircleOutline" size={20} />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={handleSelectAllColumns}
                className={`
                  flex-1
                  px-3 py-1.5
                  text-sm
                  ${getBorderRadiusClass(branding.borderRadius)}
                  ${isDark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
                  transition-colors
                `}
              >
                Select All
              </button>
              <button
                onClick={handleDeselectAllColumns}
                className={`
                  flex-1
                  px-3 py-1.5
                  text-sm
                  ${getBorderRadiusClass(branding.borderRadius)}
                  ${isDark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
                  transition-colors
                `}
              >
                Deselect All
              </button>
            </div>

            <div className="space-y-2">
              {normalizedColumns.map((column) => (
                <label
                  key={column.id}
                  className={`
                    flex items-center gap-3
                    p-3
                    ${getBorderRadiusClass(branding.borderRadius)}
                    cursor-pointer
                    transition-colors
                    ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}
                  `}
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns.some((col) => col.id === column.id)}
                    onChange={() => handleColumnToggle(column.id)}
                    className="w-4 h-4 cursor-pointer"
                    style={{
                      accentColor: branding.brandColor,
                    }}
                  />
                  <span className={`${getFontSizeClass(branding.fontSize)} ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    {column.name}
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowColumnModal(false)}
                className={`
                  px-4 py-2
                  ${getBorderRadiusClass(branding.borderRadius)}
                  ${getFontSizeClass(branding.fontSize)}
                  font-medium
                  transition-colors
                  text-white
                `}
                style={{
                  backgroundColor: branding.brandColor,
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table
          className={`
            w-full
            ${getBorderRadiusClass(branding.borderRadius)}
            ${isDark ? "bg-gray-800" : "bg-white"}
          `}
        >
          <thead
            className={`
              ${isDark ? "bg-gray-700" : "bg-gray-100"}
            `}
          >
            <tr>
              {tableSelection && (
                <th className="px-4 py-3 w-12">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isAllRowsSelected}
                      ref={(input) => {
                        if (input) {
                          input.indeterminate = isSomeRowsSelected;
                        }
                      }}
                      onChange={handleSelectAllRows}
                      className="w-4 h-4 cursor-pointer"
                      style={{
                        accentColor: branding.brandColor,
                      }}
                    />
                  </div>
                </th>
              )}
              {visibleColumns.map((column) => (
                <th
                  key={column.id}
                  onClick={() => handleSort(column.id)}
                  className={`
                    px-4 py-3
                    text-left
                    ${getFontSizeClass(branding.fontSize)}
                    font-semibold
                    ${tableSorting ? "cursor-pointer hover:bg-opacity-80" : ""}
                    ${isDark ? "text-gray-200" : "text-gray-700"}
                  `}
                >
                  <div className="flex items-center gap-2">
                    {column.name}
                    {tableSorting && sortColumn === column.id && (
                      <BiSort
                        size={14}
                      />
                    )}
                  </div>
                </th>
              ))}
              {/* Column Visibility Control */}
              {tableSettings && 
              <th className="">
                <button
                  onClick={() => setShowColumnModal(!showColumnModal)}
                  className={`
                    
                    ${getBorderRadiusClass(branding.borderRadius)}
                    flex items-center gap-1
                    transition-colors
                    ${isDark ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
                  `}
                  style={{
                    backgroundColor: showColumnModal ? branding.brandColor : undefined,
                    color: showColumnModal ? 'white' : undefined,
                  }}
                >
                  <Icon data="FaRegSun" size={16} />
                </button>
              </th>}
            </tr>
          </thead>
          <tbody>
              {displayData.length === 0 ? (
                <tr>
                  <td 
                    colSpan={visibleColumns.length + (tableSelection ? 1 : 0) + (tableSettings ? 1 : 0)}
                    className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <span className={`${getFontSizeClass(branding.fontSize)} font-medium`}>
                        {emptyMessage}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (displayData.map((row, index) => {
              const rowId = getRowIdHelper(row, index);
              const isSelected = selectedIds.includes(rowId);

              return (
                <tr
                  key={rowId}
                  onClick={() => {
                    handleRowSelection(row, index);
                    onRowClick?.(row);
                  }}
                  className={`
                    border-t
                    ${isDark ? "border-gray-700" : "border-gray-200"}
                    ${isSelected ? "bg-opacity-20" : ""}
                    ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}
                    transition-colors
                    cursor-pointer
                  `}
                  style={{
                    backgroundColor: isSelected ? `${branding.brandColor}20` : undefined,
                  }}
                >
                  {tableSelection && (
                    <td className="px-4 py-3 w-12">
                      <div className="flex items-center justify-center">
                        <input
                          type={selectionMode === 'single' ? "radio" : "checkbox"}
                          checked={isSelected}
                          onChange={() => handleRowSelection(row, index)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 cursor-pointer"
                          style={{
                            accentColor: branding.brandColor,
                          }}
                        />
                      </div>
                    </td>
                  )}
                  {visibleColumns.map((column) =>
                  { 
                    if(column.type== '__ActionDetails__' && renderRowActions)
                    {
                      return(
                        <td
                          key={column.id}
                          >
                          {renderRowActions({ item: row, index })}
                          </td>
                          )
                        }else {
                          return(
                          
                          <td
                            key={column.id}
                            className={`
                              px-4 py-3
                              ${getFontSizeClass(branding.fontSize)}
                              ${isDark ? "text-gray-300" : "text-gray-700"}
                              ${isHyperLink ? "text-blue-500 underline" : ""}
                              ${wordWrap ? "break-words" : "whitespace-nowrap"}
                            `}
                          >
                            {row[column.id]}
                          </td>
                          )
                        }
                  })}
                </tr>
              );
            }))}

            
          </tbody>
        </table>
      </div>

    </div>
  );

  return <>{tableElement}</>;
};
