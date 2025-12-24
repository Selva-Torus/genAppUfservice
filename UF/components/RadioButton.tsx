'use client'

import React, { useState } from 'react'
import { useGlobal } from '@/context/GlobalContext'
import { Tooltip } from './Tooltip'
import {
  ComponentSize,
  HeaderPosition,
  TooltipProps as TooltipPropsType
} from '@/types/global'
import { getFontSizeClass, getBorderRadiusClass } from '@/app/utils/branding'

interface RadioButtonItem {
  value: string
  content: string
  // Tailwind/CSS class string for this item
  className?: string
}
type ContentAlign = 'left' | 'center' | 'right'
interface RadioButtonProps {
  disabled?: boolean
  items: RadioButtonItem[]
  needTooltip?: boolean
  tooltipProps?: TooltipPropsType
  headerText?: string
  headerPosition?: HeaderPosition
  defaultValue?: string
  className?: string
  fillContainer?: boolean
  contentAlign?: ContentAlign
  onChange?: (value: string) => void
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  disabled = false,
  items,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = 'top',
  defaultValue,
  className = '',
  fillContainer = true,
  contentAlign = 'center',
  onChange,
  onBlur,
  onFocus
}) => {
  const { theme, direction, branding } = useGlobal()
  const [selectedValue, setSelectedValue] = useState(
    defaultValue || items[0]?.value || ''
  )

  const handleChange = (value: string) => {
    if (!disabled) {
      setSelectedValue(value)
      onChange?.(value)
    }
  }

  const getFillClasses = () => {
    if (!fillContainer) return ''
    return 'w-full h-full'
  }
  const getContentAlignClasses = () => {
    switch (contentAlign) {
      case 'left':
        return 'justify-start'
      case 'right':
        return 'justify-end'
      case 'center':
      default:
        return 'justify-center'
    }
  }
  const isDark = theme === 'dark' || theme === 'dark-hc'

  const radioButtonElement = (
    <div
      className={`
        overflow-hidden
        p-1 
        [border-radius:var(--border-radius)] 
        ${fillContainer ? 'flex' : 'inline-flex'} 
        ${isDark ? 'bg-gray-800' : 'bg-gray-100'} 
        ${direction === 'RTL' ? 'flex-row-reverse' : ''} 
        ${getFillClasses()}
        ${getFontSizeClass(branding.fontSize)}
        ${className}
      `}
    >
      {items.map(item => {
        const isSelected = selectedValue === item.value
        return (
          <button
            key={item.value}
            onClick={() => handleChange(item.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled}
            className={`
              flex items-center
              px-4 py-2 ${getContentAlignClasses()}
              overflow-hidden
              text-ellipsis
              whitespace-nowrap
              font-medium transition-all [border-radius:var(--border-radius)]
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              ${getFillClasses()}
              ${
                isSelected
                  ? `text-white`
                  : isDark
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }
            `}
            dir={direction}
            style={{
              backgroundColor: isSelected ? 'var(--brand-color)' : 'transparent'
            }}
          >
            {item.content}
          </button>
        )
      })}
    </div>
  )

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText)
      return (
        <div className={`${fillContainer ? 'h-full w-full' : ''} `}>
          {element}
        </div>
      )

    const headerClasses = `font-semibold mb-1 overflow-hidden text-ellipsis whitespace-nowrap ${
      isDark ? 'text-gray-300' : 'text-gray-700'
    } 
      ${getFontSizeClass(branding.fontSize)} ${className}`

    switch (headerPosition) {
      case 'top':
        return (
          <div
            className={`${
              fillContainer
                ? 'flex h-full w-full flex-col'
                : 'inline-flex flex-col'
            } ${headerClasses}`}
          >
            <div>{headerText}</div>
            {element}
          </div>
        )
      case 'bottom':
        return (
          <div
            className={`${
              fillContainer
                ? 'flex h-full w-full flex-col'
                : 'inline-flex flex-col'
            }  ${headerClasses}`}
          >
            {element}
            <div className='mt-1'>{headerText}</div>
          </div>
        )
      case 'left':
        return (
          <div
            className={`${
              fillContainer ? 'flex h-full w-full' : 'inline-flex'
            } items-center gap-4 ${headerClasses}`}
          >
            <div className={`mb-0 min-w-0 overflow-hidden`}>{headerText}</div>
            {element}
          </div>
        )
      case 'right':
        return (
          <div
            className={`${
              fillContainer ? 'flex h-full w-full ' : 'inline-flex flex-col'
            } items-center gap-4 ${headerClasses}`}
          >
            {element}
            <div className={`mb-0 min-w-0 overflow-hidden`}>{headerText}</div>
          </div>
        )
    }
  }

  const finalElement = renderWithHeader(radioButtonElement)

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip
        title={tooltipProps.title}
        placement={tooltipProps.placement}
        triggerClassName='inline-flex'
      >
        {finalElement}
      </Tooltip>
    )
  }

  return <>{finalElement}</>
}