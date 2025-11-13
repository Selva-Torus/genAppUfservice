import React, { useEffect, useState } from 'react'
import { Button, TextInput, TextInputProps } from '@gravity-ui/uikit'
import { FiMic, FiMicOff } from 'react-icons/fi'
import { Magnifier } from '@gravity-ui/icons'
import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition'

interface TorusSpeechToTextInputProps extends Omit<TextInputProps, 'onChange'> {
  onChange: (value: string) => void
  value: string
  onSearch: () => {}
}

export function TorusSpeechToTextInput(props: TorusSpeechToTextInputProps) {
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition()
  const [openMic, setOpenMic] = useState<any>(true)
  const [inputValue, setInputValue] = useState(props.value || '')

  useEffect(() => {
    setInputValue(transcript)
    props.onChange(transcript)
  }, [transcript])

  useEffect(() => {
    setInputValue(props.value || '')
  }, [props.value])

  const handleSearch = () => {
    props.onSearch()
  }
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    props.onChange(e.target.value)
  }

  if (!browserSupportsSpeechRecognition) {
    return <p>Speech Recognition not supported in this browser.</p>
  }

  const toggleMic = () => {
    resetTranscript()
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' })
    setInputValue('')
    setOpenMic(false)
  }
  return (
    <div className='relative w-full'>
      <TextInput
        {...props}
        value={inputValue}
        onChange={handleTyping}
        placeholder='Start speaking or typing...'
        className='w-full rounded-full border border-gray-200 bg-white px-5 py-3 pl-12 pr-16 shadow-md outline-none transition-all duration-200'
        view='clear'
        endContent={
          <div className='absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-3'>
            <button
              onClick={toggleMic}
              className='rounded-full p-2 transition-colors hover:bg-gray-100'
              style={{
                fontSize: '18px',
                color: openMic ? 'bg-red-300' : 'bg-greeen-400'
              }}
            >
              {openMic ? <FiMicOff /> : <FiMic />}
            </button>
            <button
              onClick={() => {
                setOpenMic(true),
                  handleSearch(),
                  SpeechRecognition.stopListening()
              }}
              className='rounded-full p-2 transition-colors hover:bg-gray-100'
              style={{
                fontSize: '18px',
                color: '#5f6368'
              }}
            >
              <Magnifier />
            </button>
          </div>
        }
      />
    </div>
  )
}
