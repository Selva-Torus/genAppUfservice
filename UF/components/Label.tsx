'use client'

import React from 'react'
import { useGlobal } from '@/context/GlobalContext'
import { Tooltip } from './Tooltip'
import { Icon } from './Icon'
import {
  HeaderPosition,
  TooltipProps as TooltipPropsType
} from '@/types/global'
import { getFontSizeClass, getBorderRadiusClass } from '@/app/utils/branding'
type LabelTheme =
  | 'normal'
  | 'info'
  | 'danger'
  | 'warning'
  | 'success'
  | 'utility'
  | 'unknown'
  | 'clear'
type ContentAlign = 'left' | 'center' | 'right'

interface LabelProps {
  theme?: LabelTheme
  interactive?: boolean
  copy?: boolean
  copyText?: string
  disabled?: boolean
  icon?: string
  needTooltip?: boolean
  tooltipProps?: TooltipPropsType
  headerText?: string
  headerPosition?: HeaderPosition
  children?: React.ReactNode
  onClick?: (e: any) => void
  className?: string
  fillContainer?: boolean
  contentAlign?: ContentAlign
}

export const Label: React.FC<LabelProps> = ({
  theme: labelTheme,
  interactive = false,
  copy = false,
  copyText,
  disabled = false,
  icon,
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = 'top',
  children,
  onClick = () => {},
  className = '',
  fillContainer = true,
  contentAlign = 'center'
}) => {
  const { theme, direction, branding } = useGlobal()
  const handleCopy = () => {
    if (copy) {
      const textToCopy = copyText || (children ? children.toString() : '')
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy)
      }
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

  const getThemeColors = () => {
    const isDark = theme === 'dark' || theme === 'dark-hc'

    switch (labelTheme) {
      case 'info':
        return {
          bg: isDark ? '#1E3A8A' : '#DBEAFE',
          text: isDark ? '#BFDBFE' : '#1E40AF'
        }
      case 'danger':
        return {
          bg: isDark ? '#991B1B' : '#FEE2E2',
          text: isDark ? '#FECACA' : '#991B1B'
        }
      case 'warning':
        return {
          bg: isDark ? '#854D0E' : '#FEF3C7',
          text: isDark ? '#FDE68A' : '#854D0E'
        }
      case 'success':
        return {
          bg: isDark ? '#166534' : '#DCFCE7',
          text: isDark ? '#BBF7D0' : '#166534'
        }
      case 'utility':
        return {
          bg: isDark ? '#374151' : '#F3F4F6',
          text: isDark ? '#D1D5DB' : '#374151'
        }
      case 'unknown':
        return {
          bg: isDark ? '#4B5563' : '#E5E7EB',
          text: isDark ? '#9CA3AF' : '#6B7280'
        }
      case 'clear':
        return { bg: 'transparent', text: isDark ? '#F9FAFB' : '#111827' }
      default:
        return {
          bg: isDark ? '#1F2937' : '#F3F4F6',
          text: isDark ? '#F9FAFB' : '#111827'
        }
    }
  }

  const colors = getThemeColors()
  const isDark = theme === 'dark' || theme === 'dark-hc'

  const labelElement = (
    <span
      onClick={disabled ? undefined : onClick}
      className={`
        items-center gap-1 overflow-hidden px-2 py-1 font-medium transition-all
        ${fillContainer ? 'flex' : 'inline-flex'} 
        ${getContentAlignClasses()}
        ${
          disabled
            ? 'cursor-not-allowed opacity-50'
            : interactive
            ? 'cursor-pointer hover:opacity-80'
            : ''
        }
        ${getFillClasses()}
        ${getFontSizeClass(branding.fontSize)}
        ${className}
      `}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderRadius: 'var(--border-radius)'
      }}
    >
      {icon && <Icon data={icon} size={16} className='flex-shrink-0' />}

      <span className='overflow-hidden text-ellipsis whitespace-nowrap'>
        {children}
      </span>

      {copy && (
        <Icon
          data='FaCopy'
          size={16}
          onClick={(e: any) => {
            e.stopPropagation()
            handleCopy()
          }}
          className='flex-shrink-0 cursor-pointer hover:opacity-70'
        />
      )}
    </span>
  )

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) return <div className='h-full w-full'>{element}</div>

    const headerClasses = `
      flex h-full w-full overflow-hidden text-ellipsis whitespace-nowrap 
      ${isDark ? 'text-gray-300' : 'text-gray-700'}
      ${getFontSizeClass(branding.fontSize)} 
      ${className} `

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

  const finalElement = renderWithHeader(labelElement)

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    )
  }

  return <>{finalElement}</>
}
