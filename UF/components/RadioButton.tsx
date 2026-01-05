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
  const fontSizeClass = getFontSizeClass(branding.fontSize)

  // Helper to convert hex to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex?.slice(1, 3), 16)
    const g = parseInt(hex?.slice(3, 5), 16)
    const b = parseInt(hex?.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const radioButtonElement = (
    <div
      className={`
        overflow-hidden p-1 [border-radius:var(--border-radius)]
        ${fillContainer ? 'flex' : 'inline-flex'}
        ${getFillClasses()}
      `}
    >
      {items.map(item => {
        const isSelected = selectedValue === item.value
        return (
          <button
            key={item.value}
            onClick={() => handleChange(item.value)}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              onBlur?.(e)
            }}
            onFocus={(e) => {
              if (!disabled) {
                e.currentTarget.style.boxShadow = `0 0 0 3px ${hexToRgba(branding.selectionColor, 0.2)}`
              }
              onFocus?.(e)
            }}
            onMouseEnter={(e) => {
              if (!disabled && !isSelected) {
                e.currentTarget.style.backgroundColor = hexToRgba(branding.hoverColor, 0.1)
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled && !isSelected) {
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
            disabled={disabled}
            className={`
              flex items-center
              px-4 py-2 ${getContentAlignClasses()}
              text-ellipsis
              whitespace-nowrap transition-all [border-radius:var(--border-radius)]
              ${fontSizeClass}
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              ${getFillClasses()}
              ${
                isSelected
                  ? `text-white`
                  : isDark
                  ? 'text-gray-300'
                  : 'text-gray-700'
              }
            `}
            dir={direction}
            style={{
              backgroundColor: isSelected ? branding.selectionColor : 'transparent'
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
        <div
          className={`h-full w-full 
            ${getFontSizeClass(branding.fontSize)} 
            ${isDark ? 'bg-gray-800' : 'bg-gray-100'} 
            ${direction === 'RTL' ? 'flex-row-reverse' : ''}
            ${className}
          `}
        >
          {element}
        </div>
      )

    const headerClasses = `
      flex h-full w-full overflow-hidden text-ellipsis whitespace-nowrap 
      ${isDark ? 'text-gray-300' : 'text-gray-700'}
      ${direction === 'RTL' ? 'flex-row-reverse' : ''}
      ${getFontSizeClass(branding.fontSize)}
      ${className}
      `

    switch (headerPosition) {
      case 'top':
        return (
          <div className={`${headerClasses} flex-col `}>
            <div className='font-semibold '>{headerText}</div>
            {element}
          </div>
        )
      case 'bottom':
        return (
          <div className={`${headerClasses} flex-col`}>
            {element}
            <div className='mt-1 font-semibold'>{headerText}</div>
          </div>
        )
      case 'left':
        return (
          <div className={`${headerClasses} items-center gap-4`}>
            <div className={`mb-0 min-w-0 overflow-hidden font-semibold`}>
              {headerText}
            </div>
            {element}
          </div>
        )
      case 'right':
        return (
          <div className={`${headerClasses} items-center gap-4`}>
            {element}
            <div className={`mb-0 min-w-0 overflow-hidden font-semibold`}>
              {headerText}
            </div>
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
      >
        {finalElement}
      </Tooltip>
    )
  }

  return <>{finalElement}</>
}