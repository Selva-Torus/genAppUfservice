'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { CSSProperties } from 'react'
import { LuRefreshCcw } from 'react-icons/lu'
import { useGlobal } from '@/context/GlobalContext'
import { CommonHeaderAndTooltip } from './CommonHeaderAndTooltip'
import {
  HeaderPosition,
  TooltipProps as TooltipPropsType
} from '@/types/global'
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext
} from 'react-icons/md'
import { IoMdAdd, IoMdRemove } from 'react-icons/io'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export type FileItem = {
  url: string
  fileName: string
  fileType: string
  originalId?: string
}

type toolbarPosition = 'top' | 'bottom' | 'left' | 'right'
type toolbarAlignment = 'start' | 'center' | 'end'

interface DocViewerProps {
  files?: FileItem[]
  className?: string
  style?: CSSProperties
  headerText?: string
  headerPosition?: HeaderPosition
  toolbarPosition?: toolbarPosition
  toolbarAlignment?: toolbarAlignment
  tooltipProps?: TooltipPropsType
  needTooltip?: boolean
  onDownload?: (file: FileItem) => void
  currentUrlIndex?: number
  onUrlIndexChange?: (index: number) => void
}

/* ---------- helpers ---------- */
const isImage = (url?: string) =>
  !!url && /\.(png|jpe?g|gif|webp|bmp|svg|jfif)$/i.test(url)
const isPdf = (url?: string) => !!url && /\.pdf$/i.test(url)
const isOffice = (url?: string) => !!url && /\.(docx?|xlsx?|pptx?)$/i.test(url)
const isImageType = (type?: string) => !!type && type.startsWith('image/')
const isPdfType = (type?: string) => type === 'application/pdf'

/* ---------- component ---------- */
const DocViewer: React.FC<DocViewerProps> = ({
  files = [],
  className = '',
  style,
  headerText,
  headerPosition = 'top',
  toolbarPosition = 'top',
  toolbarAlignment = 'end',
  tooltipProps,
  needTooltip = false,
  onDownload,
  currentUrlIndex,
  onUrlIndexChange
}) => {
  const { theme } = useGlobal()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [numPages, setNumPages] = useState<number>(0)
  const [pdfPageNumber, setPdfPageNumber] = useState(1)

  const activeIndex =
    currentUrlIndex !== undefined ? currentUrlIndex : currentIndex
  const currentFile = files[activeIndex]
  const currentUrl = currentFile?.url
  const currentFileName = currentFile?.fileName || 'Document'
  const currentFileType = currentFile?.fileType || ''

  const isFirst = activeIndex === 0
  const isLast = activeIndex === files.length - 1

  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const contentRef = useRef<HTMLDivElement>(null)

  const MIN_ZOOM = 1
  const MAX_ZOOM = 4
  const ZOOM_STEP = 0.25

  const resetZoomAndPosition = useCallback(() => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    setPdfPageNumber(1)
    setNumPages(0)
  }, [])

  const navigate = (newIndex: number) => {
    if (onUrlIndexChange !== undefined && currentUrlIndex !== undefined) {
      onUrlIndexChange(newIndex)
    } else {
      setCurrentIndex(newIndex)
      resetZoomAndPosition()
    }
  }

  const goToPrevious = () => {
    if (!isFirst) navigate(activeIndex - 1)
  }
  const goToNext = () => {
    if (!isLast) navigate(activeIndex + 1)
  }

  const handleZoomIn = () =>
    setZoom(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM))
  const handleZoomOut = () =>
    setZoom(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM))
  const handleResetZoom = () => resetZoomAndPosition()

  useEffect(() => {
    const element = contentRef.current
    if (!element) return
    const handleWheelEvent = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        e.stopPropagation()
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
        setZoom(prev => Math.min(Math.max(prev + delta, MIN_ZOOM), MAX_ZOOM))
      } else if (zoom > 1) {
        e.preventDefault()
        e.stopPropagation()
        if (e.shiftKey) {
          setPosition(prev => ({
            x: prev.x - (e.deltaY > 0 ? 20 : -20),
            y: prev.y
          }))
        } else {
          setPosition(prev => ({
            x: prev.x,
            y: prev.y - (e.deltaY > 0 ? 20 : -20)
          }))
        }
      }
    }
    element.addEventListener('wheel', handleWheelEvent, { passive: false })
    return () => element.removeEventListener('wheel', handleWheelEvent)
  }, [zoom])

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
        setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
      }
    },
    [isDragging, dragStart, zoom]
  )

  const handleMouseUp = useCallback(() => setIsDragging(false), [])
  const handleMouseLeave = useCallback(() => setIsDragging(false), [])

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

  const handleTouchEnd = useCallback(() => setIsDragging(false), [])

  const panHandlers = {
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  }

  const transformStyle = {
    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
    transformOrigin: 'center center',
    transition: isDragging ? 'none' : 'transform 0.2s ease-out'
  }

  /* ---------- derived flags ---------- */
  const isVertical = toolbarPosition === 'left' || toolbarPosition === 'right'

  const navBtnBase =
    'flex h-8 w-8 items-center justify-center rounded bg-gray-200 text-slate-900 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50'

  const positionClass =
    toolbarAlignment === 'start'
      ? 'justify-start'
      : toolbarAlignment === 'center'
      ? 'justify-center'
      : 'justify-end'

  /* ---------- controls block (reused for all directions) ---------- */
  // For left/right: stacks vertically. For top/bottom: stays horizontal.
  const zoomControls = (
    <div
      className={`flex items-center gap-1 rounded-lg border bg-white p-1 ${
        isVertical ? 'flex-col' : 'flex-row'
      }`}
    >
      <button
        onClick={handleZoomIn}
        disabled={zoom >= MAX_ZOOM}
        className={navBtnBase}
        title='Zoom in'
      >
        <IoMdAdd size={22} />
      </button>
      <span className='flex h-8 w-8 items-center justify-center rounded border bg-gray-200 text-[12px] font-medium text-slate-900'>
        {Math.round(zoom * 100)}%
      </span>
      <button
        onClick={handleZoomOut}
        disabled={zoom <= MIN_ZOOM}
        className={navBtnBase}
        title='Zoom out'
      >
        <IoMdRemove size={22} />
      </button>
      <button
        onClick={handleResetZoom}
        className={navBtnBase}
        title='Reset zoom'
      >
        <LuRefreshCcw size={20} />
      </button>
    </div>
  )

  const fileNavControls = files.length > 1 && (
    <div
      className={`flex items-center gap-1 rounded-lg border bg-white p-1 ${
        isVertical ? 'flex-col' : 'flex-row'
      }`}
    >
      <div
        className={`flex items-center gap-0.5 ${
          isVertical ? 'flex-col' : 'flex-row'
        }`}
      >
        <button
          onClick={goToPrevious}
          disabled={isFirst}
          className='flex h-8 w-6 items-center justify-center rounded bg-gray-200 text-slate-900 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50'
          title='Previous'
        >
          <MdNavigateBefore size={22} />
        </button>
        <button
          onClick={goToNext}
          disabled={isLast}
          className='flex h-8 w-6 items-center justify-center rounded bg-gray-200 text-slate-900 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50'
          title='Next'
        >
          <MdNavigateNext size={22} />
        </button>
      </div>
      <div
        className={`flex items-center gap-1 text-[12px] font-medium text-slate-900 ${
          isVertical ? 'flex-col' : 'flex-row'
        }`}
      >
        <span className='flex h-8 w-8 items-center justify-center rounded border bg-gray-200'>
          {activeIndex + 1}
        </span>
        <span className='flex h-8 items-center justify-center px-1'>
          of {files.length}
        </span>
      </div>
    </div>
  )

  /* ---------- render content ---------- */
  const renderContent = () => {
    if (files.length === 0 || !currentUrl) {
      return (
        <div className='flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border border-red-400 bg-gray-50 p-6 text-center shadow-sm'>
          <span className='text-[clamp(0.75rem,1.2vw,1.125rem)] font-semibold text-gray-700'>
            No Document Found
          </span>
          <p className='text-sm text-gray-500'>
            The attachment or document you are looking for is unavailable or not
            uploaded yet.
          </p>
        </div>
      )
    }

    if (isImageType(currentFileType) || isImage(currentUrl)) {
      return (
        <div
          ref={contentRef}
          className='h-full w-full overflow-hidden'
          style={{
            cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
          }}
          {...panHandlers}
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

    if (isPdfType(currentFileType) || isPdf(currentUrl)) {
      return (
        <div
          ref={contentRef}
          className='flex h-full w-full flex-col overflow-hidden'
          style={{
            cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
          }}
          {...panHandlers}
        >
          <div
            className='flex min-h-0 flex-1 items-center justify-center overflow-hidden'
            style={transformStyle}
          >
            <Document
              file={currentUrl}
              onLoadSuccess={({ numPages: n }) => setNumPages(n)}
              loading={<p className='text-sm text-gray-500'>Loading PDF…</p>}
              error={
                <p className='text-sm text-red-500'>Failed to load PDF.</p>
              }
            >
              <Page
                pageNumber={pdfPageNumber}
                renderTextLayer
                renderAnnotationLayer
              />
            </Document>
          </div>
          {numPages > 1 && (
            <div className='flex items-center justify-center gap-2 py-1'>
              <button
                onClick={() => setPdfPageNumber(1)}
                disabled={pdfPageNumber <= 1}
                className='flex h-7 w-7 items-center justify-center rounded bg-gray-200 text-slate-900 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50'
                title='First page'
              >
                <MdFirstPage size={16} />
              </button>
              <button
                onClick={() => setPdfPageNumber(prev => Math.max(prev - 1, 1))}
                disabled={pdfPageNumber <= 1}
                className='flex h-7 w-7 items-center justify-center rounded bg-gray-200 text-slate-900 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50'
                title='Previous page'
              >
                <MdNavigateBefore size={16} />
              </button>
              <span className='min-w-[4rem] text-center text-xs text-slate-700'>
                {pdfPageNumber} of {numPages}
              </span>
              <button
                onClick={() =>
                  setPdfPageNumber(prev => Math.min(prev + 1, numPages))
                }
                disabled={pdfPageNumber >= numPages}
                className='flex h-7 w-7 items-center justify-center rounded bg-gray-200 text-slate-900 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50'
                title='Next page'
              >
                <MdNavigateNext size={16} />
              </button>
              <button
                onClick={() => setPdfPageNumber(numPages)}
                disabled={pdfPageNumber >= numPages}
                className='flex h-7 w-7 items-center justify-center rounded bg-gray-200 text-slate-900 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50'
                title='Last page'
              >
                <MdLastPage size={16} />
              </button>
            </div>
          )}
        </div>
      )
    }

    return (
      <div
        ref={contentRef}
        className='h-full w-full overflow-hidden'
        style={{
          cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
        }}
        {...panHandlers}
      >
        <div
          className='relative h-full w-full overflow-hidden'
          style={transformStyle}
        >
          <iframe
            src={
              isOffice(currentUrl)
                ? `https://docs.google.com/gview?url=${encodeURIComponent(
                    currentUrl
                  )}&embedded=true`
                : currentUrl
            }
            className='h-full w-full border-0'
          />
        </div>
      </div>
    )
  }

  const fileNameBar = files.length > 0 && (
    <div className='flex shrink-0 items-center rounded-lg bg-[#f4f5fa] px-3 py-2 shadow'>
      <span className='min-w-0 flex-1 truncate text-sm font-medium text-slate-900'>
        {currentFileName}
      </span>
    </div>
  )

  const viewerElement = (
    <div
      className={`flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden ${className}`}
      style={style}
    >
      {/* ── TOP ── filename + controls inline on same row */}
      {toolbarPosition === 'top' && files.length > 0 && (
        <div className='flex shrink-0 items-center gap-2 rounded-lg bg-[#f4f5fa] px-3 py-2 shadow'>
          <span className='min-w-0 flex-1  truncate text-sm font-medium text-slate-900'>
            {currentFileName}
          </span>
          <div className={`flex flex-row items-center gap-2 ${positionClass}`}>
            {zoomControls}
            {fileNavControls}
          </div>
        </div>
      )}

      {/* ── BOTTOM ── filename at top */}
      {toolbarPosition === 'bottom' && files.length > 0 && (
        <div className='flex shrink-0 items-center rounded-lg bg-[#f4f5fa] px-3 py-2 shadow'>
          <span className='min-w-0 flex-1 truncate text-sm font-medium text-slate-900'>
            {currentFileName}
          </span>
        </div>
      )}

      {/* ── content area — top/bottom only, no filename here ── */}
      {!isVertical && (
        <div className='relative min-h-0 flex-1 overflow-hidden'>
          {renderContent()}
        </div>
      )}

      {/* ── BOTTOM controls — below content ── */}
      {toolbarPosition === 'bottom' && files.length > 0 && (
        <div
          className={`flex shrink-0 flex-row items-center gap-2 rounded-lg px-3 py-2 shadow ${positionClass}`}
        >
          {zoomControls}
          {fileNavControls}
        </div>
      )}

      {/* ── LEFT / RIGHT ── */}
      {isVertical && (
        <div
          className={`flex min-h-0 flex-1 overflow-hidden ${
            toolbarPosition === 'left' ? 'flex-row' : 'flex-row-reverse'
          }`}
        >
          {/* Sidebar — zoom + filenav only */}
          <div
            className={`flex shrink-0 flex-col gap-2 px-2 py-3 shadow ${positionClass}`}
          >
            {zoomControls}
            {fileNavControls}
          </div>
          {/* filename + content stacked together */}
          <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
            {files.length > 0 && (
              <div className='shrink-0 rounded-lg bg-[#f4f5fa] px-3 py-2 shadow'>
                <span className='block min-w-0 truncate text-sm font-medium text-slate-900'>
                  {currentFileName}
                </span>
              </div>
            )}
            <div className='relative min-h-0 flex-1 overflow-hidden'>
              {renderContent()}
            </div>
          </div>
        </div>
      )}
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
