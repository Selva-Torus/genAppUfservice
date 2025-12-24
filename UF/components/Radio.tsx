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
interface RadioProps {
  checked?: boolean
  disabled?: boolean
  content?: string
  needTooltip?: boolean
  tooltipProps?: TooltipPropsType
  headerText?: string
  headerPosition?: HeaderPosition
  value?: string
  name?: string
  className?: string
  fillContainer?: boolean
  contentAlign?: ContentAlign
  onClick?: (checked: boolean) => void
  onChange?: (value: string) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
}

export const Radio: React.FC<RadioProps> = ({
  checked,
  disabled = false,
  content,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = 'top',
  value = '',
  name,
  className = '',
  fillContainer = true,
  contentAlign = 'left',
  onChange,
  onBlur,
  onFocus,
  onClick
}) => {
  const { theme, direction, branding } = useGlobal()
  const isDark = theme === 'dark' || theme === 'dark-hc'
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
  const getRadioStyles = (): React.CSSProperties => {
    const isDark = theme === 'dark' || theme === 'dark-hc'

    if (disabled) {
      return {
        backgroundColor: isDark ? '#374151' : '#E5E7EB',
        borderColor: isDark ? '#4B5563' : '#D1D5DB'
      }
    }

    if (checked) {
      return {
        backgroundColor: 'var(--selection-color)',
        borderColor: 'var(--selection-color)',
        borderWidth: '2px',
        boxShadow: 'inset 0 0 0 5px white '
      }
    }

    return {
      backgroundColor: isDark ? '#1F2937' : 'white',
      borderColor: isDark ? '#4B5563' : '#D1D5DB',
      borderWidth: '2px'
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!disabled) {
      e.preventDefault()
      onClick?.(!checked)
      onChange?.(value)
    }
  }

  const radioElement = (
    <label
      className={`
        ${getFontSizeClass(branding.fontSize)}
        ${fillContainer ? 'flex' : 'inline-flex'} 
        items-center 
        ${getContentAlignClasses()} 
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} 
        ${getFillClasses()} ${fillContainer ? 'overflow-hidden' : ''}
      `}
      onClick={handleClick}
    >
      <input
        type='radio'
        checked={checked}
        disabled={disabled}
        name={name}
        value={value}
        onChange={() => onChange?.(value)}
        onBlur={onBlur}
        onFocus={onFocus}
        className='sr-only'
      />
      <div
        style={getRadioStyles()}
        className={`
          aspect-square h-full
          flex-shrink-0  rounded-full border transition-all
        `}
        onMouseEnter={e => {
          if (!disabled && !checked) {
            e.currentTarget.style.borderColor = 'var(--hover-color)'
          }
        }}
        onMouseLeave={e => {
          if (!disabled && !checked) {
            const isDark = theme === 'dark' || theme === 'dark-hc'
            e.currentTarget.style.borderColor = isDark ? '#4B5563' : '#D1D5DB'
          }
        }}
      />
      {content && (
        <span
          className={`${direction === 'RTL' ? 'mr-2' : 'ml-2'} ${
            theme === 'dark' || theme === 'dark-hc'
              ? 'text-gray-200'
              : 'text-gray-900'
          } ${fillContainer ? 'overflow-hidden ' : ''}`}
        >
          {content}
        </span>
      )}
    </label>
  )

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText)
      return (
        <div className={`${fillContainer ? 'h-full w-full' : ''} ${className}`}>
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
            } items-center gap-4 ${className} ${headerClasses}`}
          >
            {element}
            <div className={`mb-0 min-w-0 overflow-hidden`}>{headerText}</div>
          </div>
        )
    }
  }

  const finalElement = renderWithHeader(radioElement)

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    )
  }

  return <>{finalElement}</>
}