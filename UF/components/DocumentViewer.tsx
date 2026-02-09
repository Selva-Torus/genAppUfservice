'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { CSSProperties } from 'react'
import { Tooltip } from './Tooltip'
import {
  HeaderPosition,
  TooltipProps as TooltipPropsType
} from '@/types/global'
import { Text } from './Text'
import {
  FiMaximize2,
  FiDownload,
  FiZoomIn,
  FiZoomOut,
  FiRotateCcw
} from 'react-icons/fi'
import { getFontSizeClass } from '@/app/utils/branding'
import { useGlobal } from '@/context/GlobalContext'
import { CommonHeaderAndTooltip } from './CommonHeaderAndTooltip'
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md'

interface DocViewerProps {
  url?: string | null | string[]
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

  const urls = Array.isArray(url) ? url : url ? [url] : []
  const [currentIndex, setCurrentIndex] = useState(0)

  // Zoom and pan state
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const contentRef = useRef<HTMLDivElement>(null)

  const MIN_ZOOM = 0.5
  const MAX_ZOOM = 4
  const ZOOM_STEP = 0.25

  const isFirst = currentIndex === 0
  const isLast = currentIndex === urls.length - 1

  // Reset zoom and position when changing documents
  const resetZoomAndPosition = useCallback(() => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  const goToPrevious = () => {
    if (urls.length === 0 || isFirst) return
    setCurrentIndex(prev => prev - 1)
    resetZoomAndPosition()
  }

  const goToNext = () => {
    if (urls.length === 0 || isLast) return
    setCurrentIndex(prev => prev + 1)
    resetZoomAndPosition()
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM))
  }

  const handleResetZoom = () => {
    resetZoomAndPosition()
  }

  // Mouse wheel zoom - using native event listener to prevent browser zoom
  useEffect(() => {
    const element = contentRef.current
    if (!element) return

    const handleWheelEvent = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        e.stopPropagation()
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
        setZoom(prev => Math.min(Math.max(prev + delta, MIN_ZOOM), MAX_ZOOM))
      }
    }

    element.addEventListener('wheel', handleWheelEvent, { passive: false })
    return () => {
      element.removeEventListener('wheel', handleWheelEvent)
    }
  }, [])

  // Pan handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom > 1) {
        setIsDragging(true)
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
      }
    },
    [zoom, position]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && zoom > 1) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        })
      }
    },
    [isDragging, dragStart, zoom]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch handlers for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (zoom > 1 && e.touches.length === 1) {
        const touch = e.touches[0]
        setIsDragging(true)
        setDragStart({
          x: touch.clientX - position.x,
          y: touch.clientY - position.y
        })
      }
    },
    [zoom, position]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging && zoom > 1 && e.touches.length === 1) {
        const touch = e.touches[0]
        setPosition({
          x: touch.clientX - dragStart.x,
          y: touch.clientY - dragStart.y
        })
      }
    },
    [isDragging, dragStart, zoom]
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  const currentUrl = urls[currentIndex]

  const openFullscreen = () => {
    if (!currentUrl) return
    window.open(currentUrl, '_blank', 'noopener,noreferrer')
  }

  const downloadFile = () => {
    if (!currentUrl) return
    const link = document.createElement('a')
    link.href = currentUrl
    link.download = 'document'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderContent = () => {
    if (urls.length === 0 || !currentUrl) {
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

    const transformStyle = {
      transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
      transformOrigin: 'center center',
      cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
      transition: isDragging ? 'none' : 'transform 0.2s ease-out'
    }

    /* IMAGE → NO iframe */
    if (isImage(currentUrl)) {
      return (
        <div
          ref={contentRef}
          className='h-full w-full overflow-hidden'
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={currentUrl}
            alt='document'
            className='h-full w-full select-none object-contain'
            style={transformStyle}
            draggable={false}
          />
        </div>
      )
    }

    /* PDF / TEXT / OFFICE → iframe preview only */
    return (
      <div
        ref={contentRef}
        className='h-full w-full overflow-hidden'
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div style={{ ...transformStyle, width: '100%', height: '100%' }}>
          <iframe
            src={
              isOffice(currentUrl)
                ? `https://docs.google.com/gview?url=${encodeURIComponent(
                    currentUrl
                  )}&embedded=true`
                : currentUrl
            }
            className='h-full w-full border-0 object-contain'
            style={{ pointerEvents: zoom > 1 ? 'none' : 'auto' }}
          />
        </div>
      </div>
    )
  }

  const viewerElement = (
    <div
      className={`relative h-full min-h-0 w-full min-w-0 overflow-hidden ${className}`}
      style={style}
    >
      {/* Fullscreen button */}

      {urls.length > 0 && (
        <>
          {/* Top right controls */}
          <div className='absolute right-2 top-2 z-10 flex flex-col gap-3'>
            {/* Top actions */}
            <div className='flex flex-col items-center gap-2 rounded-md bg-white p-2 shadow'>
              <button
                onClick={openFullscreen}
                className='flex h-7 w-7 items-center justify-center rounded bg-gray-200 text-slate-900 hover:bg-gray-300'
                title='Open fullscreen'
              >
                <FiMaximize2 size={16} />
              </button>

              <button
                onClick={downloadFile}
                className='flex h-7 w-7 items-center justify-center rounded bg-gray-200 text-slate-900 hover:bg-gray-300'
                title='Download'
              >
                <FiDownload size={16} />
              </button>
            </div>

            {/* Zoom controls */}
            <div className='flex flex-col items-center gap-2 rounded-md bg-white p-2 shadow'>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= MAX_ZOOM}
                className='flex h-7 w-7 items-center justify-center rounded bg-gray-200 text-slate-900 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-200'
                title='Zoom in'
              >
                <FiZoomIn size={14} />
              </button>
              <span className='flex h-7 w-7 items-center justify-center rounded bg-gray-200 text-[12px] font-medium text-slate-900'>
                {Math.round(zoom * 100)}%
              </span>

              <button
                onClick={handleZoomOut}
                disabled={zoom <= MIN_ZOOM}
                className='flex h-7 w-7 items-center justify-center rounded bg-gray-200 text-slate-900 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-200'
                title='Zoom out'
              >
                <FiZoomOut size={14} />
              </button>
              {/* {(zoom !== 1 || position.x !== 0 || position.y !== 0) && ( */}
              <button
                onClick={handleResetZoom}
                className='flex h-7 w-7 items-center justify-center rounded bg-gray-200 text-slate-900 hover:bg-gray-300'
                title='Reset'
              >
                <FiRotateCcw size={14} />
              </button>
              {/* )} */}
            </div>
          </div>

          {urls.length > 1 && (
            <div className='absolute bottom-2 right-2 z-10 flex items-center gap-2'>
              <button
                onClick={goToPrevious}
                disabled={isFirst}
                className={`overflow-hidden rounded bg-black/60 object-contain p-2 text-white ${
                  isFirst ? 'cursor-not-allowed opacity-50' : 'hover:bg-black'
                }`}
                title='Previous'
              >
                <MdNavigateBefore size={16} />
              </button>
              <span className='rounded bg-black/60 px-2 py-1 text-sm text-white'>
                {currentIndex + 1} / {urls.length}
              </span>
              <button
                onClick={goToNext}
                disabled={isLast}
                className={`overflow-hidden rounded bg-black/60 object-contain p-2 text-white ${
                  isLast ? 'cursor-not-allowed opacity-50' : 'hover:bg-black'
                }`}
                title='Next'
              >
                <MdNavigateNext size={16} />
              </button>
            </div>
          )}
        </>
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
