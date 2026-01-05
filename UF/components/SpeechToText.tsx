import React, { useEffect, useState } from 'react'
import { TextInput } from './TextInput'
import { Button } from './Button'
import { FiMic, FiMicOff } from 'react-icons/fi'
import { Icon } from '@/components/Icon'
import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition'
import { Tooltip } from './Tooltip'
import {
  HeaderPosition,
  TooltipProps as TooltipPropsType
} from '@/types/global'
import { useGlobal } from '@/context/GlobalContext'
import { getFontSizeClass } from '@/app/utils/branding'

type ContentAlign = 'left' | 'center' | 'right'
interface SpeechToTextInputProps extends Omit<any, 'onChange'> {
  onChange: (value: string) => void
  value: string
  onSearch: () => {}
  className?: string
  disabled?: boolean
  needTooltip?: boolean
  tooltipProps?: TooltipPropsType
  headerText?: string
  headerPosition?: HeaderPosition
  placeholder?: string
  label?: string
  contentAlign?: ContentAlign
}

export function SpeechToTextInput(props: SpeechToTextInputProps) {
  const {
    needTooltip = false,
    tooltipProps,
    headerText,
    headerPosition = 'top',
    placeholder = 'Start speaking or typing...',
    label,
    ...restProps
  } = props
  const { theme, direction, branding } = useGlobal()
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition()
  const [openMic, setOpenMic] = useState<any>(true)
  const [inputValue, setInputValue] = useState(restProps.value || '')

  useEffect(() => {
    setInputValue(transcript)
    restProps.onChange(transcript)
  }, [transcript])

  useEffect(() => {
    setInputValue(restProps.value || '')
  }, [restProps.value])

  const handleSearch = () => {
    restProps.onSearch()
  }
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    restProps.onChange(e.target.value)
  }

  if (!browserSupportsSpeechRecognition) {
    return <p>Speech Recognition not supported in this browser.</p>
  }

  const toggleMic = () => {
    if (restProps.disabled) return
    resetTranscript()
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' })
    setInputValue('')
    setOpenMic(false)
  }

  const isDark = theme === 'dark' || theme === 'dark-hc'

  const inputElement = (
    <div className='relative h-full w-full'>
      {label && (
        <label
          className={`mb-2 block font-medium ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          {label}
        </label>
      )}
      <TextInput
        {...restProps}
        value={inputValue}
        onChange={handleTyping}
        disabled={restProps.disabled}
        placeholder={placeholder}
        contentAlign={restProps.contentAlign}
        className={`w-full rounded-full border border-gray-200 bg-white  text-gray-600 shadow-md outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-400/20 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 dark:focus:ring-opacity-50 ${restProps.className}`}
        view='clear'
        endContent={
          <div className='absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-3'>
            <button
              onClick={toggleMic}
              disabled={restProps.disabled}
              className='rounded-full p-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'
              style={{
                fontSize: '18px',
                color: openMic ? 'bg-red-300' : 'bg-greeen-400'
              }}
            >
              {openMic ? <FiMicOff /> : <FiMic />}
            </button>
            <button
              onClick={() => {
                if (restProps.disabled) return
                setOpenMic(true),
                  handleSearch(),
                  SpeechRecognition.stopListening()
              }}
              disabled={restProps.disabled}
              className='rounded-full p-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'
              style={{
                fontSize: '18px',
                color: '#5f6368'
              }}
            >
              <Icon data='FaSearch' size={18} />
            </button>
          </div>
        }
      />
    </div>
  )

  const renderWithHeader = (element: React.ReactNode) => {
    if (!headerText) return <div className='h-full w-full'>{element}</div>

    const headerClasses = `
      flex h-full w-full overflow-hidden text-ellipsis whitespace-nowrap 
      ${isDark ? 'text-gray-300' : 'text-gray-700'} 
      ${getFontSizeClass(branding.fontSize)}
      ${restProps.className}
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
            <div className={`mb-0 min-w-0  overflow-hidden font-semibold`}>
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

  const finalElement = renderWithHeader(inputElement)

  if (needTooltip && tooltipProps) {
    return (
      <Tooltip title={tooltipProps.title} placement={tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    )
  }

  return <>{finalElement}</>
}