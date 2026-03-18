import { useRef, useCallback, useEffect } from 'react'
import { Text } from './Text'
import { Icon } from './Icon'
import { useGlobal } from '@/context/GlobalContext'
import {
  HeaderPosition,
  TooltipProps as TooltipPropsType
} from '@/types/global'
import { getFontSizeClass } from '@/app/utils/branding'
import { CommonHeaderAndTooltip } from './CommonHeaderAndTooltip'

interface TimeLineProps {
  steps: Array<Record<string, any>>
  statusMap?: Record<string, { icon: string; color: string }>
  title: string
  status: string
  date: string
  view?: 'vertical' | 'horizontal'
  needTooltip?: boolean
  tooltipProps?: TooltipPropsType
  headerText?: string
  headerPosition?: HeaderPosition
  className?: string
  onStepClick?: (step: Record<string, any>, index: number) => void
  onLoadMore?: () => void
  isLoadingMore?: boolean
  hasMore?: boolean
}

export const TimeLine: React.FC<TimeLineProps> = ({
  steps = [],
  statusMap = {},
  title = '',
  status = '',
  date = '',
  view = 'horizontal',
  needTooltip = false,
  tooltipProps,
  headerText,
  headerPosition = 'top',
  className = '',
  onStepClick,
  onLoadMore,
  isLoadingMore = false,
  hasMore = true
}) => {
  const { theme } = useGlobal()
  const scrollRef = useRef<HTMLDivElement>(null)

  const isDark = theme === 'dark' || theme === 'dark-hc'
  const isHorizontal = view === 'horizontal'

  // Auto-load more if content doesn't fill the container
  useEffect(() => {
    if (!scrollRef.current || !onLoadMore || isLoadingMore || !hasMore) return

    const checkAndLoadMore = () => {
      if (!scrollRef.current) return
      const { scrollHeight, clientHeight, scrollWidth, clientWidth } = scrollRef.current

      if (isHorizontal) {
        // If content width is less than or equal to container width, load more
        if (scrollWidth <= clientWidth) {
          onLoadMore()
        }
      } else {
        // If content height is less than or equal to container height, load more
        if (scrollHeight <= clientHeight) {
          onLoadMore()
        }
      }
    }

    // Small delay to allow DOM to update
    const timer = setTimeout(checkAndLoadMore, 100)
    return () => clearTimeout(timer)
  }, [steps, onLoadMore, isLoadingMore, hasMore, isHorizontal])

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !onLoadMore || isLoadingMore) return
    const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } = scrollRef.current

    if (isHorizontal) {
      // Horizontal scroll detection
      if (scrollLeft + clientWidth >= scrollWidth - 50) {
        onLoadMore()
      }
    } else {
      // Vertical scroll detection
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        onLoadMore()
      }
    }
  }, [onLoadMore, isLoadingMore, isHorizontal])

  const timelineElement = (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className={`rounded-xl ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } ${className} ${isHorizontal ? 'overflow-x-auto' : 'overflow-y-auto'}`}
      style={{ maxHeight: isHorizontal ? undefined : '100%', height: isHorizontal ? undefined : '100%' }}
    >
      <ol
        className={
          isHorizontal
            ? 'relative flex items-start gap-0 pb-4 scrollbar-thin'
            : 'x scrollbar-none relative'
        }
        style={isHorizontal ? { scrollBehavior: 'smooth' } : undefined}
      >
        {steps.map((step, idx) => {
          const isLeft = idx % 2 === 0
          const statusStyles = statusMap[step[status]] || {
            icon: null,
            color: '#d1d5db'
          }
          return (
            <li
              key={idx}
              className={
                isHorizontal
                  ? 'hover:color-gray-50 relative flex min-w-[200px] cursor-pointer flex-col items-center rounded transition-all duration-200'
                  : 'relative mb-12 flex w-full flex-row justify-center'
              }
              onClick={() => onStepClick?.(step, idx)}
            >
              {isHorizontal ? (
                <>
                  {/* Horizontal Layout */}
                  <time
                    className={`mb-4 text-center text-lg sm:text-sm ${
                      isDark ? 'text-gray-200' : 'text-gray-600'
                    }`}
                  >
                    {step[date]}
                  </time>

                  <div className='relative mb-4 flex w-full items-center'>
                    <span
                      className={`relative z-10 mx-auto flex h-8 w-8 items-center justify-center rounded-full border-4 border-white `}
                      style={{ backgroundColor: statusStyles.color }}
                    >
                      {statusStyles.icon && (
                        <Icon
                          data={statusStyles.icon}
                          size={16}
                          className='text-white'
                        />
                      )}
                    </span>

                    {idx !== steps.length - 1 && (
                      <div
                        className='absolute left-1/2 top-1/2 h-0.5 w-full -translate-y-1/2'
                        style={{ backgroundColor: statusStyles.color }}
                      />
                    )}
                  </div>

                  <div className='flex flex-col gap-1 text-center'>
                    <Text
                      fillContainer={false}
                      className={`text-lg sm:text-sm ${
                        isDark ? 'text-gray-200' : 'text-gray-600'
                      }`}
                    >
                      {step[title]}
                    </Text>
                    <Text
                      fillContainer={false}
                      className={`text-lg sm:text-sm ${
                        isDark ? 'text-gray-200' : 'text-gray-600'
                      }`}
                    >
                      {step[status]}
                    </Text>
                  </div>
                </>
              ) : (
                <>
                  {/* Vertical Layout */}
                  <div className='basis-1/3 p-2 text-center'>
                    <time
                      className={`overflow-hidden text-lg sm:text-sm ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                      }`}
                    >
                      {step[date]}
                    </time>
                  </div>

                  <div className='relative flex justify-center'>
                    {idx !== steps.length - 1 && (
                      <div
                        className='absolute top-10 h-full w-0.5'
                        style={{ backgroundColor: statusStyles.color }}
                      />
                    )}

                    <span
                      className='z-10 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white'
                      style={{ backgroundColor: statusStyles.color }}
                    >
                      {statusStyles.icon && (
                        <Icon
                          data={statusStyles.icon}
                          size={20}
                          className='text-white'
                        />
                      )}
                    </span>
                  </div>

                  <div
                    className={`flex basis-1/3 flex-col overflow-hidden p-2 text-center ${
                      isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}
                  >
                    <Text fillContainer={false} className='text-lg sm:text-sm'>{step[title]}</Text>
                    <Text fillContainer={false} className='text-lg sm:text-sm'>{step[status]}</Text>
                  </div>
                </>
              )}
            </li>
          )
        })}
        {isLoadingMore && (
          <li className={isHorizontal ? 'flex min-w-[100px] items-center justify-center' : 'flex w-full items-center justify-center py-4'}>
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
          </li>
        )}
      </ol>
    </div>
  )

  return (
    <CommonHeaderAndTooltip
      needTooltip={needTooltip}
      tooltipProps={tooltipProps}
      headerText={headerText}
      headerPosition={headerPosition}
      className={className}
    >
      {timelineElement}
    </CommonHeaderAndTooltip>
  )
}