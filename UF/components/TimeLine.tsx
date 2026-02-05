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
  onStepClick
}) => {
  const { theme } = useGlobal()

  const isDark = theme === 'dark' || theme === 'dark-hc'
  const isHorizontal = view === 'horizontal'

  const timelineElement = (
    <div
      className={`overflow-hidden rounded-xl  ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } ${className}`}
    >
      <ol
        className={
          isHorizontal
            ? 'relative flex items-start gap-0 overflow-x-auto pb-4 scrollbar-thin'
            : 'x scrollbar-none relative h-full overflow-auto'
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