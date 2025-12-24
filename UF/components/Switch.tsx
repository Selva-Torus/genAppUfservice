'use client'

import React from 'react'
import { useGlobal } from '@/context/GlobalContext'
import { Tooltip } from './Tooltip'
import {
  HeaderPosition,
  TooltipProps as TooltipPropsType
} from '@/types/global'
import { getFontSizeClass } from '@/app/utils/branding'

type ContentAlign = 'left' | 'center' | 'right'

interface SwitchProps {
  checked: boolean
  disabled?: boolean
  content?: string
  needTooltip?: boolean
  tooltipProps?: TooltipPropsType
  headerText?: string
  headerPosition?: HeaderPosition
  onChange?: (checked: boolean) => void
  className?: string
  fillContainer?: boolean
  contentAlign?: ContentAlign
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  disabled = false,
  content,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = 'top',
  onChange,
  className = '',
  fillContainer = true,
  contentAlign = 'center'
}) => {
  const { theme, direction, branding } = useGlobal()

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

  const getSwitchStyles = (): React.CSSProperties => {
    const isDark = theme === 'dark' || theme === 'dark-hc'

    if (disabled) {
      return {
        backgroundColor: isDark ? '#374151' : '#E5E7EB',
        opacity: 0.5
      }
    }

    if (checked) {
      return {
        backgroundColor: 'var(--selection-color)'
      }
    }

    return {
      backgroundColor: isDark ? '#4B5563' : '#D1D5DB'
    }
  }

  const getTranslateClass = () => {
    return checked ? 'translate-x-[calc(100%-0.125rem)]' : 'translate-x-0.5'
  }
  const switchElement = (
    <label
      className={` 
        ${getFontSizeClass(branding.fontSize)}
        ${fillContainer ? 'flex' : 'inline-flex'} items-center 
        ${getContentAlignClasses()} 
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} 
        ${getFillClasses()} ${fillContainer ? 'overflow-hidden' : ''}
        ${className} 
      `}
    >
      <div
        className={`relative aspect-[2/1] h-full flex-shrink-0 rounded-full transition-colors duration-200 ease-in-out`}
        style={getSwitchStyles()}
        onClick={() => !disabled && onChange?.(!checked)}
      >
        <div
          className={`absolute top-0.5 aspect-square h-[calc(100%-4px)] transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${getTranslateClass()}`}
        />
      </div>
      {content && (
        <span
          className={`${direction === 'RTL' ? 'mr-3' : 'ml-3'} ${
            theme === 'dark' || theme === 'dark-hc'
              ? 'text-gray-200'
              : 'text-gray-900'
          } ${disabled ? 'opacity-50' : ''} ${
            fillContainer
              ? 'overflow-hidden text-ellipsis whitespace-nowrap'
              : ''
          }`}
          style={{ fontSize: 'var(--font-size)' }}
        >
          {content}
        </span>
      )}
    </label>
  )

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText)
      return (
        <div className={`${getFontSizeClass(branding.fontSize)} ${fillContainer ? 'h-full w-full' : ''} ${className}`}>
          {element}
        </div>
      )

    const headerClasses = `text-[var(--font-size)] font-semibold mb-1 ${
      theme === 'dark' || theme === 'dark-hc'
        ? 'text-gray-300'
        : 'text-gray-700'
    }`

    switch (headerPosition) {
      case 'top':
        return (
          <div
            className={`flex flex-col ${
              fillContainer ? 'h-full w-full' : ''
            } ${className}`}
          >
            <div className={headerClasses}>{headerText}</div>
            <div className={fillContainer ? 'min-h-0 flex-1' : ''}>
              {element}
            </div>
          </div>
        )
      case 'bottom':
        return (
          <div
            className={`flex flex-col ${
              fillContainer ? 'h-full w-full' : ''
            } ${className}`}
          >
            <div className={fillContainer ? 'min-h-0 flex-1' : ''}>
              {element}
            </div>
            <div className={`${headerClasses} mb-0 mt-1`}>{headerText}</div>
          </div>
        )
      case 'left':
        return (
          <div
            className={`flex items-center ${
              fillContainer ? 'h-full w-full' : ''
            } ${className}`}
          >
            <div
              className={`${headerClasses} mb-0 flex-shrink-0 ${
                direction === 'RTL' ? 'ml-2' : 'mr-2'
              }`}
            >
              {headerText}
            </div>
            <div className={fillContainer ? 'h-full min-w-0 flex-1' : ''}>
              {element}
            </div>
          </div>
        )
      case 'right':
        return (
          <div
            className={`flex items-center ${
              fillContainer ? 'h-full w-full' : ''
            } ${className}`}
          >
            <div className={fillContainer ? 'h-full min-w-0 flex-1' : ''}>
              {element}
            </div>
            <div
              className={`${headerClasses} mb-0 flex-shrink-0 ${
                direction === 'RTL' ? 'mr-2' : 'ml-2'
              }`}
            >
              {headerText}
            </div>
          </div>
        )
    }
  }

  const finalElement = renderWithHeader(switchElement)

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    )
  }

  return <>{finalElement}</>
}