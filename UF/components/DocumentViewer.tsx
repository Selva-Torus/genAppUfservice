'use client'

import React from 'react'
import { CSSProperties } from 'react'
import { Tooltip } from './Tooltip'
import {
  HeaderPosition,
  TooltipProps as TooltipPropsType
} from '@/types/global'
import { Text } from './Text'
import { FiMaximize2, FiDownload } from 'react-icons/fi'
import { getFontSizeClass } from '@/app/utils/branding'
import { useGlobal } from '@/context/GlobalContext'
import { CommonHeaderAndTooltip } from './CommonHeaderAndTooltip'

interface DocViewerProps {
  url?: string  | null
  className?: string
  style?: CSSProperties
  headerText?: string
  headerPosition?: HeaderPosition
  tooltipProps?: TooltipPropsType
  needTooltip?: boolean
}

/* ---------- helpers ---------- */
const isImage = (url?: string) =>
  !!url && /\.(png|jpe?g|gif|webp|bmp|svg|jfif)$/i.test(url)

const isPdf = (url?: string) => !!url && /\.pdf$/i.test(url)
const isText = (url?: string) => !!url && /\.(txt|xml|json|csv)$/i.test(url)
const isOffice = (url?: string) => !!url && /\.(docx?|xlsx?|pptx?)$/i.test(url)

/* ---------- component ---------- */

const DocViewer: React.FC<DocViewerProps> = ({
  url,
  className = '',
  style,
  headerText,
  headerPosition = 'top',
  tooltipProps,
  needTooltip = false
}) => {
  const { theme, direction, branding } = useGlobal()
  const isDark = theme === 'dark' || theme === 'dark-hc'
  const openFullscreen = () => {
    if (!url) return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const downloadFile = () => {
    if (!url) return
    const link = document.createElement('a')
    link.href = url
    link.download = 'document'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderContent = () => {
    if (!url) {
      return (
        <div className='flex h-full w-full flex-col justify-center overflow-hidden whitespace-break-spaces rounded-xl border border-red-500 bg-gray-50 p-4 text-center shadow-sm'>
          <text className='    text-[clamp(0.75rem,1.2vw,1.125rem)] font-semibold leading-tight text-gray-700 '>
            No Document Found
          </text>
          <p className=' text-sm text-gray-500'>
            The attachment or document you are looking for is unavailable or not
            uploaded yet.
          </p>
        </div>
      )
    }

    /* IMAGE → NO iframe */
    if (isImage(url)) {
      return (
        <img
          src={url}
          alt='document'
          className='h-full w-full object-contain'
        />
      )
    }

    /* PDF / TEXT / OFFICE → iframe preview only */
    return (
      <iframe
        src={
          isOffice(url)
            ? `https://docs.google.com/gview?url=${encodeURIComponent(
                url
              )}&embedded=true`
            : url
        }
        className='h-full w-full border-0 object-contain'
      />
    )
  }

  const viewerElement = (
    <div
      className={`relative h-full min-h-0 w-full min-w-0 overflow-hidden ${className}`}
      style={style}
    >
      {/* Fullscreen button */}

      {url && (
        <div className='absolute right-2 top-2 z-10 flex gap-2'>
          <button
            onClick={downloadFile}
            className='overflow-hidden rounded bg-black/60 object-contain p-2 text-white hover:bg-black'
            title='Download'
          >
            <FiDownload size={16} />
          </button>
          <button
            onClick={openFullscreen}
            className='overflow-hidden rounded bg-black/60 object-contain p-2 text-white hover:bg-black'
            title='Open fullscreen'
          >
            <FiMaximize2 size={16} />
          </button>
        </div>
      )}

      {renderContent()}
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
           {viewerElement}
         </CommonHeaderAndTooltip>
       )
}

export default DocViewer