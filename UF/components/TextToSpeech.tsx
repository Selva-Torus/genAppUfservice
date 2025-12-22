
import React, { useEffect,useState } from 'react';

import { FiVolume2 } from 'react-icons/fi';
import { Button } from './Button';
import { Tooltip } from './Tooltip';
import { HeaderPosition, TooltipProps as TooltipPropsType } from '@/types/global';

interface TextAreaWithEndContentProps {
  value?: string;
  rows?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  style?: React.CSSProperties;
  endContent?: React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
  [key: string]: any;
}

function TextAreaWithEndContent({ endContent, placeholder, ...props }: TextAreaWithEndContentProps) {
  return (
    <div className="relative w-full">
      <textarea
        {...props}
        rows={props.rows || 4}
        placeholder={placeholder}
        className={`
          w-full
          px-3 py-2
          sm:px-4 sm:py-3
          pr-14 sm:pr-16
          text-sm sm:text-base
          rounded-md sm:rounded-lg
          border border-gray-300
          dark:border-gray-600
          dark:bg-gray-800
          dark:text-white
          resize-vertical
          focus:outline-none
          focus:ring-2
          focus:ring-yellow-400
          focus:border-transparent
          transition-all
          font-inherit
        `}
        style={props.style}
      />
      {endContent}
    </div>
  );
}

interface TextToSpeechProps {
  value?: string | number;
  label?: string;
  disabled?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onUpdate?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  style?: React.CSSProperties;
  placeholder?: string;
  needTooltip?: boolean;
  tooltipProps?: TooltipPropsType;
  headerText?: string;
  headerPosition?: HeaderPosition;
  [key: string]: any;
}

export function TextToSpeech(props: TextToSpeechProps){
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

  const endContent = (
    <Button
      onClick={handleSpeak}
      disabled={isSpeaking || props.disabled}
      className={`
        absolute
        right-3
        sm:right-4
        top-2
        sm:top-3
        bg-yellow-400
        hover:bg-yellow-500
        border-none
        rounded-full
        flex
        items-center
        justify-center
        cursor-pointer
        text-white
        text-base sm:text-lg md:text-xl
        shadow-md
        w-8 h-8
        sm:w-9 sm:h-9
        md:w-10 md:h-10
        p-0
        min-w-0
        transition-all
        ${isSpeaking ? 'opacity-70 animate-pulse' : ''}
      `}
    >
      <FiVolume2 className="w-4 h-4 sm:w-5 sm:h-5" />
    </Button>
  );

  const renderWithHeader = (element: React.ReactNode) => {
    if (!props.headerText) return <>{element}</>;

    const headerClasses = "font-semibold mb-1 text-gray-700 dark:text-gray-300";
    const headerPosition = props.headerPosition || "top";

    switch (headerPosition) {
      case "top":
        return (
          <div className="flex flex-col w-full">
            <div className={headerClasses}>{props.headerText}</div>
            {element}
          </div>
        );
      case "bottom":
        return (
          <div className="flex flex-col w-full">
            {element}
            <div className={`${headerClasses} mt-2 mb-0`}>{props.headerText}</div>
          </div>
        );
      case "left":
        return (
          <div className="flex items-start gap-4 w-full">
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {props.headerText}
            </div>
            <div className="flex-1">{element}</div>
          </div>
        );
      case "right":
        return (
          <div className="flex items-start gap-4 w-full">
            <div className="flex-1">{element}</div>
            <div className={`${headerClasses} mb-0 whitespace-nowrap`}>
              {props.headerText}
            </div>
          </div>
        );
    }
  };

  const textAreaContent = (
    <div className="w-full max-w-full">
      {props.label && (
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {props.label}
        </label>
      )}
      <TextAreaWithEndContent
        {...props}
        value={text}
        rows={4}
        disabled={props.disabled}
        placeholder={props.placeholder}
        onChange={(e) => {
          setText(e.target.value);
          props.onUpdate?.(e);
        }}
        onBlur={props.onBlur}
        endContent={endContent}
      />
      {isSpeaking && (
        <p className="mt-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></span>
          Speaking...
        </p>
      )}
    </div>
  );

  const finalElement = renderWithHeader(textAreaContent);

  if (props.needTooltip && props.tooltipProps) {
    return (
      <Tooltip title={props.tooltipProps.title} placement={props.tooltipProps.placement}>
        {finalElement}
      </Tooltip>
    );
  }

  return <>{finalElement}</>;
}
