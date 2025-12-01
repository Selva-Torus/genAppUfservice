
import React, { useEffect,useState } from 'react';

import { FiVolume2 } from 'react-icons/fi';
import { Button } from './Button';
import { TextArea } from './TextArea';

export function TextToSpeech(props: any){
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [text, setText] = useState(props.value?.toString() || '');

  const handleSpeak = () => {
    if (!text.trim()) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

    useEffect(() => {
    setText(props.value?.toString() || '');
  }, [props.value]);

  return (
    <div style={{ position: 'relative' }}>
      <TextArea
        {...props}
        value={text}
        minRows={4}
        onChange={(val) => {
          setText(val.target.value);
          props.onUpdate?.(val.target.value);
        }}
      />
      <Button
        onClick={handleSpeak}
        disabled={isSpeaking}
        className={`
            absolute
            right-[10px]
            top-1/2
            -translate-y-1/2
            bg-none
            border-none
            cursor-pointer
            text-[18px]
            ${isSpeaking ? 'text-gray-500' : 'text-black'}
          `}

      >
        <FiVolume2 />
      </Button>
      {isSpeaking && (
        <p className={`mt-2 text-sm text-blue-600`}>
          Speaking...
        </p>
      )}
    </div>
  );
}
