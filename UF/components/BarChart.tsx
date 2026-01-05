'use client'

import { useGlobal } from '@/context/GlobalContext';
import { Tooltip } from '@/components/Tooltip';
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as TooltipDisplay,
  XAxis,
  YAxis
} from 'recharts';

type ContentAlign = "left" | "center" | "right";

export interface BarChartData {
  name: string;
  [key: string]: string | number;
}

export interface BarChartProps {
  data: BarChartData[];
  title?: string;
  showCurrencySign?: string;
  fillContainer?: boolean;
  contentAlign?: ContentAlign;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  colors?: string[];
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title = "",
  showCurrencySign = "",
  fillContainer = true,
  contentAlign = "left",
  needTooltip = false,
  tooltipProps,
  headerText = "",
  headerPosition = "top",
  colors = [
    '#FF9F40',
    '#FF6B6B',
    '#36A2EB',
    '#4CAF50',
    '#9C27B0',
    '#00BCD4'
  ]
}) => {
  const { theme } = useGlobal();

  const getFillClasses = () => {
    if (!fillContainer) return "";
    return "w-full h-full";
  };

  const getContentAlignClasses = () => {
    switch (contentAlign) {
      case "left":
        return "justify-start items-start";
      case "right":
        return "justify-end items-end";
      case "center":
      default:
        return "justify-center items-center";
    }
  };

  // Remove process_id if exists and parse data
  const expenseData = data.map(({ process_id, ...rest }: any) => rest);

  const parsedExpenseData: BarChartData[] = expenseData.map(item => {
    const parsedItem: BarChartData = { name: String(item.name) };
    Object.keys(item).forEach(key => {
      if (key !== 'name') {
        item[key] = item[key] === null ? '0' : item[key];
        const cleanedValue = String(item[key]).replace(/,/g, "");
        parsedItem[key] = parseFloat(cleanedValue as string);
      }
    });
    return parsedItem;
  });

  const totalExpenses = parsedExpenseData.reduce((acc, item) => {
    const { name, ...rest } = item;
    const sum = Object.values(rest as Record<string, number>).reduce(
      (sum, value) => sum + value,
      0
    );
    return acc + sum;
  }, 0);
  const isDark = theme === "dark" || theme === "dark-hc";

  const chartElement = (
    <div className="w-full h-full">
      {title && <h3 className='text-base font-semibold'>{title}</h3>}
      {parsedExpenseData.length > 0 ? (
        <ResponsiveContainer width='100%' height={title ? '90%' : '100%'}>
          <RechartsBarChart data={parsedExpenseData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey="name"
              className="text-xs"
              tickFormatter={(value) => {
                const maxLength = 6;
                return value && value.length > maxLength
                  ? `${value.substring(0, maxLength)}...`
                  : value;
              }}
              interval={0}
            />
            <YAxis
              className="text-xs"
              tickFormatter={(value) => {
                const maxLength = 6;
                return value && value.length > maxLength
                  ? `${value.substring(0, maxLength)}...`
                  : `${value}`;
              }}
            />
           <TooltipDisplay
              formatter={(value, name) => [`${showCurrencySign}${value}`, name]}
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                border: '1px solid',
                borderColor: isDark ? '#374151' : '#d1d5db',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              wrapperStyle={{
                outline: 'none'
              }}
              labelStyle={{
                color: isDark ? '#e5e7eb' : '#374151',
                fontWeight: '600',
                fontSize: '12px',
                marginBottom: '4px'
              }}
              itemStyle={{
                color: isDark ? '#d1d5db' : '#6b7280',
                fontSize: '11px',
                padding: '2px 0'
              }}
            />
            <Legend />
            {Object.keys(parsedExpenseData[0] || {})
              .filter(key => key !== 'name')
              .map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                />
              ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      ) : (
        <p className='text-center text-gray-500'>No data available</p>
      )}
    </div>
  );

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) {
      return (
        <div className={`${fillContainer ? "flex w-full h-full" : "inline-flex"} ${getContentAlignClasses()} ${getFillClasses()}`}>
          {element}
        </div>
      );
    }

    const headerClasses = `font-semibold mb-2 ${
      isDark ? "text-gray-300" : "text-gray-700"
    }`;

    const headerStyle = { fontSize: "var(--font-size)" };

    switch (headerPosition) {
      case "top":
        return (
          <div className={`${fillContainer ? "flex" : "inline-flex"} flex-col ${getFillClasses()}`}>
            <div className={headerClasses} style={headerStyle}>{headerText}</div>
            <div className={fillContainer ? "flex-1 min-h-0" : ""}>{element}</div>
          </div>
        );
      case "bottom":
        return (
          <div className={`${fillContainer ? "flex" : "inline-flex"} flex-col ${getFillClasses()}`}>
            <div className={fillContainer ? "flex-1 min-h-0" : ""}>{element}</div>
            <div className={`${headerClasses} mt-2 mb-0`} style={headerStyle}>{headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className={`${fillContainer ? "flex" : "inline-flex"} items-start ${getFillClasses()} gap-4`}>
            <div className={`${headerClasses} mb-0 whitespace-nowrap flex-shrink-0`} style={headerStyle}>
              {headerText}
            </div>
            <div className={fillContainer ? "flex-1 min-w-0 h-full" : ""}>{element}</div>
          </div>
        );
      case "right":
        return (
          <div className={`${fillContainer ? "flex" : "inline-flex"} items-start ${getFillClasses()} gap-4`}>
            <div className={fillContainer ? "flex-1 min-w-0 h-full" : ""}>{element}</div>
            <div className={`${headerClasses} mb-0 whitespace-nowrap flex-shrink-0`} style={headerStyle}>
              {headerText}
            </div>
          </div>
        );
    }
  };

  const wrappedElement = needTooltip && tooltipProps ? (
    <Tooltip
      title={tooltipProps.title || ""}
      placement={tooltipProps.placement || "bottom-end"}
    >
      {renderWithHeader(chartElement)}
    </Tooltip>
  ) : (
    renderWithHeader(chartElement)
  );

  return <>{wrappedElement}</>;
}
