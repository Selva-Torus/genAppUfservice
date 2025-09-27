import React, { useEffect,useState } from 'react';
import { TextArea, TextAreaProps } from '@gravity-ui/uikit';
import { FiVolume2 } from 'react-icons/fi';

interface TorusTextToSpeechOutputProps extends TextAreaProps {}

export function TorusTextToSpeechOutput(props: TorusTextToSpeechOutputProps) {
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
        onUpdate={(val) => {
          setText(val);
          props.onUpdate?.(val);
        }}
      />
      <button
        onClick={handleSpeak}
        disabled={isSpeaking}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px',
          color: isSpeaking ? 'gray' : 'black',
        }}
      >
        <FiVolume2 />
      </button>
    </div>
  );
}
