'use client'

import { useEffect, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts'
import { Card } from '@gravity-ui/uikit'
import { Select } from '@gravity-ui/uikit'

export interface ExpenseData {
  name: string
  [key: string]: string | number
}

interface DynamicChartProps {
  title?: string
  type?: ChartType
  expenseData?: ExpenseData[]
  total?: number
  showCurrencySign?: string
}

type ChartType = 'donut' | 'bar' | 'line' | 'default'

export function DynamicChart({ title , type='default' , expenseData = [], total = 0 , showCurrencySign}: DynamicChartProps) {
  

  const initialType = type === 'default' ? 'donut' : type
  const [chartType, setChartType] = useState<ChartType>(initialType)

  useEffect(() => {
    if (type && type !== 'default') {
      setChartType(type)
    }
  }, [type])

  const colors = ['#FF9F40', '#FF6B6B', '#36A2EB', '#4CAF50', '#9C27B0', '#00BCD4']

  const pieChartData = expenseData.map((item) => ({
    name: item.name,
    value: Object.keys(item)
      .filter((key) => key !== 'name')
      .reduce((acc, key) => acc + (item[key] as number), 0),
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name } = payload[0].payload
      const selectedData = expenseData.find((item) => item.name === name)
      if (selectedData) {
        return (
          <div className='bg-white p-2 border border-gray-300 rounded shadow'>
            <p className='font-bold'>{name}</p>
            {Object.keys(selectedData)
              .filter((key) => key !== 'name')
              .map((key) => (
                <p key={key}>
                  {key}: {showCurrencySign}{selectedData[key]}
                </p>
              ))}
          </div>
        )
      }
    }
    return null
  }

  const renderChart = () => {
      

    switch (chartType) {
      case 'donut':
        return (
          <ResponsiveContainer width='100%' height='100%' aspect={2}>
            <PieChart>
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
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign='bottom'
                align='center'
                wrapperStyle={{ fontSize: '12px' }}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }}>{value} - {showCurrencySign}{entry?.payload?.value}</span>
                )}
              />
              
              <text
                x='50%'
                y='50%'
                textAnchor='middle'
                dominantBaseline='middle'
                fill='#000'
                fontSize='16'
              >
                Total: {showCurrencySign}{total}
              </text>
              
            </PieChart>
          </ResponsiveContainer>
        )

      case 'bar':
        return (
          <ResponsiveContainer width='100%' height='100%' aspect={2}>
            <BarChart data={expenseData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip formatter={(value, name) => [`${showCurrencySign}${value}`, name]} />              
              <Legend />
              {Object.keys(expenseData[0] || {})
                .filter((key) => key !== 'name')
                .map((key, index) => (
                  <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
                ))}
            </BarChart>
          </ResponsiveContainer>
        )

      case 'line':
        return (
          <ResponsiveContainer width='100%' height='100%' aspect={2}>
            <LineChart data={expenseData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip formatter={(value, name) => [`${showCurrencySign}${value}`, name]} />
              <Legend />
              {Object.keys(expenseData[0] || {})
                .filter((key) => key !== 'name')
                .map((key, index) => (
                  <Line
                    key={key}
                    type='monotone'
                    dataKey={key}
                    stroke={colors[index % colors.length]}
                    activeDot={{ r: 8 }}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <Card className='w-full'>
      <div className='flex flex-row items-center justify-between pb-2'>
        <h3 className='text-base font-normal'>{title}</h3>
        {type === 'default' && (
          <Select value={[chartType]} onUpdate={(value) => setChartType(value[0] as ChartType)}>
            <Select.Option value='donut'>Donut</Select.Option>
            <Select.Option value='bar'>Bar</Select.Option>
            <Select.Option value='line'>Line</Select.Option>
          </Select>
        )}
      </div>
      <div className='relative h-[300px] w-full'>
        {expenseData.length > 0 ? renderChart() : <p>No data available</p>}
      </div>
    </Card>
  )
}
