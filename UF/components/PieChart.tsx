'use client'

import { useGlobal } from '@/context/GlobalContext';
import { Tooltip } from '@/components/Tooltip';
import { HeaderPosition, TooltipProps as TooltipPropsType } from "@/types/global";
import { Cell, Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip as TooltipDisplay } from 'recharts';

type ContentAlign = "left" | "center" | "right";

export interface PieChartData {
  name: string;
  [key: string]: string | number;
}

export interface PieChartProps {
  data: PieChartData[];
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

export const PieChart: React.FC<PieChartProps> =({
  data,
  title = "",
  showCurrencySign = "",
  fillContainer = true,
  contentAlign = "right",
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

  const parsedExpenseData: PieChartData[] = expenseData.map(item => {
    const parsedItem: PieChartData = { name: String(item.name) };
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

  const formattedTotalExpenses = totalExpenses.toLocaleString('en-IN');

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name } = payload[0].payload;
      const selectedData = expenseData.find((item) => item.name === name);
      if (selectedData) {
        return (
          <div className= {`${isDark ? "bg-gray-800" : "bg-white"} p-2 border border-gray-300 rounded shadow`}>
            <p className='font-bold'>{name}</p>
            {Object.keys(selectedData)
              .filter((key) => key !== 'name')
              .map((key) => (
                <p key={key}>
                  {key}: {showCurrencySign}{selectedData[key]}
                </p>
              ))}
          </div>
        );
      }
    }
    return null;
  };

  const pieChartData = parsedExpenseData.map((item) => ({
    name: item.name,
    value: Object.keys(item)
      .filter((key) => key !== 'name')
      .reduce((acc, key) => acc + (item[key] as number), 0),
  }));


  const chartElement = (
    <div className="w-full h-full">
      {title && <h3 className='text-base font-semibold'>{title}</h3>}
      {parsedExpenseData.length > 0 ? (
        <ResponsiveContainer width='100%' height={title ? '90%' : '100%'}>
          <RechartsPieChart>
            <Pie
              data={pieChartData}
              cx='50%'
              cy='50%'
              innerRadius='60%'
              outerRadius='80%'
              paddingAngle={2}
              dataKey='value'
              startAngle={90}
              endAngle={-270}
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
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
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: "12px" }}
              formatter={(value, entry) => {
                const formattedValue = Number(entry?.payload?.value).toLocaleString("en-IN");
                return (
                  <span style={{ color: entry.color }}>
                    {value} - {showCurrencySign}{formattedValue}
                  </span>
                );
              }}
            />
            <text
              x='50%'
              y='50%'
              textAnchor='middle'
              dominantBaseline='middle'
              fill={isDark ? "#fff" : "#000"}
              fontSize='16'
            >
              Total: {showCurrencySign}{formattedTotalExpenses}
            </text>
          </RechartsPieChart>
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
