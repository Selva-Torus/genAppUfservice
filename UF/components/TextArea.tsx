'use client'

import React, { useState } from 'react'
import { useGlobal } from '@/context/GlobalContext'
import { Tooltip } from './Tooltip'
import {
  ComponentSize,
  TextAreaPin,
  HeaderPosition,
  TooltipProps as TooltipPropsType
} from '@/types/global'
import { getFontSizeClass, getBorderRadiusClass } from '@/app/utils/branding'
type ContentAlign = 'left' | 'right' | 'center'
interface TextAreaProps {
  disabled?: boolean
  pin?: TextAreaPin
  placeholder?: string
  readOnly?: boolean
  value?: string
  needTooltip?: boolean
  tooltipProps?: TooltipPropsType
  headerText?: string
  headerPosition?: HeaderPosition
  onChange?: (value: any) => void
  onBlur?: (value: any) => void
  className?: string
  fillContainer?: boolean
  contentAlign?: ContentAlign
}

export const TextArea: React.FC<TextAreaProps> = ({
  disabled = false,
  pin = '',
  placeholder,
  readOnly = false,
  value = '',
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = 'top',
  onChange,
  onBlur,
  className = '',
  fillContainer = true,
  contentAlign = 'left'
}) => {
  const { theme, direction, branding } = useGlobal()
  const [internalValue, setInternalValue] = useState(value)

  const getFillClasses = () => {
    if (!fillContainer) return ''
    return 'w-full h-full'
  }

  const getTextAlignClasses = () => {
    switch (contentAlign) {
      case 'left':
        return 'text-left'
      case 'right':
        return 'text-right'
      case 'center':
        return 'text-center'
      default:
        return 'text-center'
    }
  }

  const getPinClasses = () => {
    if (!pin) return '[border-radius:var(--border-radius)]'
    const baseRadius = getBorderRadiusClass(branding.borderRadius)

    if (pin === 'clear-clear') {
      return baseRadius
    }

    const [left, right] = pin.split('-')
    const leftRadius =
      left === 'round'
        ? 'rounded-l-2xl'
        : left === 'brick'
        ? 'rounded-l-none'
        : `rounded-l${baseRadius.replace('rounded', '')}`
    const rightRadius =
      right === 'round'
        ? 'rounded-r-2xl'
        : right === 'brick'
        ? 'rounded-r-none'
        : `rounded-r${baseRadius.replace('rounded', '')}`

    return `${leftRadius} ${rightRadius}`
  }

  const isDark = theme === 'dark' || theme === 'dark-hc'

  const textAreaElement = (
    <div
      className={`
        ${getFillClasses()} 
        ${getFontSizeClass(branding.fontSize)} overflow-hidden
      `}
    >
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        // rows={minRows}
        // style={{
        //   maxHeight: `${maxRows * 1.5}em`,
        //   resize: 'vertical'
        // }}
        className={`
          ${getFillClasses()}
          ${getPinClasses()}
          ${getTextAlignClasses()}
          border-2 
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          ${
            isDark
              ? 'border-gray-600 bg-gray-800 text-white'
              : 'border-gray-300 bg-white text-gray-900'
          }
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-opacity-50
          ${className}
        `}
        onFocus={e => {
          e.currentTarget.style.borderColor = 'var(--brand-color)'
          e.currentTarget.style.boxShadow = `0 0 0 2px var(--brand-color) 20`
        }}
        onBlur={onBlur}
      />
    </div>
  )

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) return <div className='h-full w-full'>{element}</div>

    const headerClasses = `
      flex h-full w-full overflow-hidden text-ellipsis whitespace-nowrap 
      ${isDark ? 'text-gray-300' : 'text-gray-700'} 
      ${getFontSizeClass(branding.fontSize)}
      ${className}
    `
    switch (headerPosition) {
      case 'top':
        return (
          <div className={`${headerClasses} flex-col`}>
            <div className='font-semibold'>{headerText}</div>
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
            <div className={`mb-0 min-w-0  font-semibold overflow-hidden`}>{headerText}</div>
            {element}
          </div>
        )
      case 'right':
        return (
          <div className={`${headerClasses} items-center gap-4`}>
            {element}
            <div className={`mb-0 min-w-0 font-semibold overflow-hidden`}>{headerText}</div>
          </div>
        )
    }
  }

  const finalElement = renderWithHeader(textAreaElement)

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    )
  }

  return <>{finalElement}</>
}
