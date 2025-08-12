import React, { useEffect, useState } from 'react';
import { Button, TextInput, TextInputProps } from '@gravity-ui/uikit';
import { FiMic, FiMicOff } from 'react-icons/fi';
import { Magnifier } from '@gravity-ui/icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface TorusSpeechToTextInputProps extends Omit<TextInputProps, 'onChange'> {
  onChange: (value: string) => void;
  value: string;
}

export function TorusSpeechToTextInput(props: TorusSpeechToTextInputProps) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [inputValue, setInputValue] = useState(props.value || '');

  useEffect(() => {
    setInputValue(transcript);
    props.onChange(transcript);
  }, [transcript]);

  useEffect(() => {
    setInputValue(props.value || '');
  }, [props.value]);

  const toggleMic = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      setInputValue(''); 
    }
  };

  const handleSearch = () => {
    // Search logic here
  };
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    props.onChange(e.target.value);
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Speech Recognition not supported in this browser.</p>;
  }

  return (
    <div style={{ position: 'relative' }}>
      <TextInput
        {...props}
        value={inputValue}
        onChange={handleTyping}
        placeholder="Start speaking or typing..."
        className='border border-gray-300 rounded-lg p-1 w-full'
        view='clear'
       endContent={
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Button
              onClick={toggleMic}
              className='flex items-center justify-center'
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                color: 'gray',
              }}
            >
              {listening ? <FiMicOff /> : <FiMic />}
            </Button>
            <Button
              onClick={handleSearch}
              className='flex items-center justify-center'
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                color: 'gray',
              }}
            >
              <Magnifier />
            </Button>
          </div>
        }
      />
    </div>
  );
}