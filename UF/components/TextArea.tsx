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
import { CommonHeaderAndTooltip } from './CommonHeaderAndTooltip'
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

  // Helper to convert hex to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex?.slice(1, 3), 16)
    const g = parseInt(hex?.slice(3, 5), 16)
    const b = parseInt(hex?.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const textAreaElement = (
    <div
      className={`${getFillClasses()} ${getFontSizeClass(branding.fontSize)}`}
    >
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
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
          p-2 transition-all duration-200
          focus:outline-none

          ${className}
        `}
        onMouseEnter={e => {
          if (
            !disabled &&
            !readOnly &&
            document.activeElement !== e.currentTarget
          ) {
            e.currentTarget.style.borderColor = branding.hoverColor
          }
        }}
        onMouseLeave={e => {
          if (
            !disabled &&
            !readOnly &&
            document.activeElement !== e.currentTarget
          ) {
            e.currentTarget.style.borderColor = isDark ? '#4B5563' : '#D1D5DB'
          }
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = branding.selectionColor
          e.currentTarget.style.boxShadow = `0 0 0 3px ${hexToRgba(
            branding.selectionColor,
            0.2
          )}`
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = isDark ? '#4B5563' : '#D1D5DB'
          e.currentTarget.style.boxShadow = 'none'
          onBlur?.(e)
        }}
      />
    </div>
  )

  return (
    <CommonHeaderAndTooltip
      needTooltip={needTooltip}
      tooltipProps={tooltipProps}
      headerText={headerText}
      headerPosition={headerPosition}
      className={className}
      fillContainer={fillContainer}
    >
      {textAreaElement}
    </CommonHeaderAndTooltip>
  )
}
