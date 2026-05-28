'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useGlobal } from '@/context/GlobalContext'
import { DatePicker } from '@/components/DatePicker'

import { getFontSizeClass, getBorderRadiusClass } from '@/app/utils/branding'
import { MdAdd, MdDelete, MdKeyboardArrowDown, MdSearch } from 'react-icons/md'
import { MdCheck } from 'react-icons/md'

// ─── Public types ─────────────────────────────────────────────────────────────

export type DataType = 'string' | 'number' | 'date'

export interface FieldConfig {
  controllerName: string
  dataType: DataType
  label?: string
}

export interface FilterOutput {
  key: string
  operator: string
  value: string | number
  value2?: string | number
}

export interface AdvancedSearchProps {
  data: FieldConfig[]
  value?: FilterOutput[]
  label?: string
  disabled?: boolean
  className?: string
  onChange?: (filters: FilterOutput[]) => void
  onSubmit?: (filters: FilterOutput[]) => void
}

// ─── Internal row ─────────────────────────────────────────────────────────────

interface FilterRow {
  id: string
  key: string
  operator: string
  value: string
  value2: string
  dataType: DataType
}

// ─── Dropdown option type ─────────────────────────────────────────────────────

interface DropdownOption {
  value: string
  label: string
}

// ─── DropdownSelect ───────────────────────────────────────────────────────────

interface DropdownSelectProps {
  options: DropdownOption[]
  value: string
  placeholder?: string
  disabled?: boolean
  isDark: boolean
  selectionColor: string
  onChange: (value: string) => void
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  options,
  value,
  placeholder = 'Select',
  disabled = false,
  isDark,
  selectionColor,
  onChange
}) => {
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState<React.CSSProperties>({})
  const btnRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value)

  const openDropdown = () => {
    if (disabled || !btnRef.current) return
    const r = btnRef.current.getBoundingClientRect()
    setStyle({
      position: 'fixed',
      top: r.bottom + 4,
      left: r.left,
      width: Math.max(r.width, 160),
      zIndex: 9999
    })
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (
        btnRef.current?.contains(e.target as Node) ||
        listRef.current?.contains(e.target as Node)
      )
        return
      setOpen(false)
    }
    const onScroll = (e: Event) => {
      if (listRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [open])

  const borderColor = isDark ? '#4B5563' : '#D1D5DB'
  const bgBtn = isDark ? '#1F2937' : '#FFFFFF'
  const bgList = isDark ? '#1F2937' : '#FFFFFF'
  const textColor = isDark ? '#F9FAFB' : '#111827'
  const hoverBg = isDark ? '#374151' : '#F3F4F6'
  const placeholderCl = isDark ? '#6B7280' : '#9CA3AF'

  return (
    <>
      <button
        ref={btnRef}
        type='button'
        disabled={disabled}
        onClick={openDropdown}
        className='flex h-full w-full min-w-0 items-center justify-between gap-1 overflow-hidden rounded-lg px-2 text-xs focus:outline-none sm:px-3 sm:text-sm'
        style={{
          background: bgBtn,
          color: selected ? textColor : placeholderCl,
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          border: 'none'
        }}
      >
        <span className='min-w-0 flex-1 truncate text-left'>
          {selected ? selected.label : placeholder}
        </span>
        <MdKeyboardArrowDown
          size={16}
          className={`flex-shrink-0 transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
          style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
        />
      </button>

      {open && (
        <div
          ref={listRef}
          style={{
            ...style,
            background: bgList,
            border: `1px solid ${borderColor}`
          }}
          className='max-h-52 overflow-y-auto rounded-lg shadow-xl'
        >
          {options.length === 0 ? (
            <div
              className='px-3 py-2 text-center text-xs'
              style={{ color: placeholderCl }}
            >
              No options
            </div>
          ) : (
            options.map(opt => {
              const isActive = opt.value === value
              return (
                <button
                  key={opt.value}
                  type='button'
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                  className='flex w-full min-w-0 items-center justify-between overflow-hidden px-3 py-1.5 text-left text-xs transition-colors duration-100 focus:outline-none sm:py-2 sm:text-sm'
                  style={{
                    background: isActive ? selectionColor : 'transparent',
                    color: isActive ? '#fff' : textColor
                  }}
                  onMouseEnter={e => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.background =
                        hoverBg
                  }}
                  onMouseLeave={e => {
                    if (!isActive)
                      (e.currentTarget as HTMLElement).style.background =
                        'transparent'
                  }}
                >
                  <span className='truncate'>{opt.label}</span>
                  {isActive && (
                    <MdCheck size={14} className='ml-1 flex-shrink-0' />
                  )}
                </button>
              )
            })
          )}
        </div>
      )}
    </>
  )
}

// ─── Filter option sets ───────────────────────────────────────────────────────

const STRING_FILTERS: DropdownOption[] = [
  { value: '=', label: 'Equals' },
  { value: 'LIKE', label: 'Contains' },
  { value: 'LIKE_START', label: 'Starts With' },
  { value: 'LIKE_END', label: 'Ends With' },
  { value: '!=', label: 'Not Equals' }
]

const NUMBER_FILTERS: DropdownOption[] = [
  { value: '=', label: 'Equals' },
  { value: '!=', label: 'Not Equals' },
  { value: '>', label: 'Greater Than' },
  { value: '<', label: 'Less Than' },
  { value: '>=', label: 'Greater Than or Equals' },
  { value: '<=', label: 'Less Than or Equals' },
  { value: 'BETWEEN', label: 'Between' }
]

const DATE_FILTERS: DropdownOption[] = [
  { value: '=', label: 'Equals' },
  { value: '<', label: 'Before' },
  { value: '>', label: 'After' },
  { value: '<=', label: 'Before or Equals' },
  { value: '>=', label: 'After or Equals' },
  { value: 'BETWEEN', label: 'Between' }
]

const FILTER_MAP: Record<DataType, DropdownOption[]> = {
  string: STRING_FILTERS,
  number: NUMBER_FILTERS,
  date: DATE_FILTERS
}

const DEFAULT_FILTER: Record<DataType, string> = {
  string: 'LIKE',
  number: '=',
  date: '='
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const genId = () =>
  `row-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

const toTimestamp = (dateStr: string) =>
  dateStr ? `${dateStr}T00:00:00.000Z` : ''

const makeRow = (key = '', dataType: DataType = 'string'): FilterRow => ({
  id: genId(),
  key,
  dataType,
  operator: DEFAULT_FILTER[dataType],
  value: '',
  value2: ''
})

const toOutput = (rows: FilterRow[]): FilterOutput[] =>
  rows.map(({ id, value2, dataType, ...rest }) => ({
    ...rest,
    ...(rest.operator === 'BETWEEN' ? { value2 } : {})
  }))

// ─── Component ────────────────────────────────────────────────────────────────

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  data,
  value,
  label,
  disabled = false,
  className = '',
  onChange,
  onSubmit
}) => {
  const { theme, branding } = useGlobal()
  const isDark = theme === 'dark' || theme === 'dark-hc'

  const isEmitting = useRef(false)

  const [rows, setRows] = useState<FilterRow[]>(() => {
    if (value && value.length > 0) {
      return value.map(v => ({
        id: genId(),
        key: v.key,
        operator: v.operator,
        value: String(v.value ?? ''),
        value2: String(v.value2 ?? ''),
        dataType:
          data.find(f => f.controllerName === v.key)?.dataType ?? 'string'
      }))
    }
    const first = data[0]
    return [makeRow(first?.controllerName ?? '', first?.dataType ?? 'string')]
  })

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!value) return
    if (isEmitting.current) {
      isEmitting.current = false
      return
    }
    setRows(
      value.map(v => ({
        id: genId(),
        key: v.key,
        operator: v.operator,
        value: String(v.value ?? ''),
        value2: String(v.value2 ?? ''),
        dataType:
          data.find(f => f.controllerName === v.key)?.dataType ?? 'string'
      }))
    )
    setSelectedIds(new Set())
  }, [value])

  const controllerOptions: DropdownOption[] = data.map(f => ({
    value: f.controllerName,
    label: f.label ?? f.controllerName
  }))

  const emit = useCallback(
    (updated: FilterRow[]) => {
      isEmitting.current = true
      onChange?.(toOutput(updated))
    },
    [onChange]
  )

  const patch = (id: string, changes: Partial<FilterRow>) => {
    const next = rows.map(r => (r.id === id ? { ...r, ...changes } : r))
    setRows(next)
    emit(next)
  }

  const handleKeyChange = (id: string, key: string) => {
    const field = data.find(f => f.controllerName === key)
    const dataType: DataType = field?.dataType ?? 'string'
    patch(id, {
      key,
      dataType,
      operator: DEFAULT_FILTER[dataType],
      value: '',
      value2: ''
    })
  }

  const addRow = () => {
    const first = data[0]
    const nr = makeRow(first?.controllerName ?? '', first?.dataType ?? 'string')
    const next = [...rows, nr]
    setRows(next)
    emit(next)
  }

  const deleteSelected = () => {
    const next = rows.filter(r => !selectedIds.has(r.id))
    const safe =
      next.length > 0
        ? next
        : [makeRow(data[0]?.controllerName, data[0]?.dataType)]
    setRows(safe)
    setSelectedIds(new Set())
    emit(safe)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex?.slice(1, 3), 16)
    const g = parseInt(hex?.slice(3, 5), 16)
    const b = parseInt(hex?.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const fontSizeClass = getFontSizeClass(branding.fontSize)
  const borderRadiusClass = getBorderRadiusClass(branding.borderRadius)
  const borderColor = isDark ? '#4B5563' : '#D1D5DB'

  const cellCls = `flex items-center gap-1.5 w-full h-8 rounded-lg border-2`
  const cellClsDate = `flex items-center w-full h-8`
  const cellStyle = { borderColor }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div
      className={`flex h-full min-h-0 w-full flex-col border ${fontSizeClass} ${borderRadiusClass} ${
        isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
      } ${className}`}
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* ── Header ── */}
      <div
        className={`flex items-center justify-between border-b px-4 py-2.5 ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <span
          className={`text-sm font-semibold sm:text-base ${
            isDark ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          {label}
        </span>
        <div className='flex items-center gap-1.5 sm:gap-2'>
          <button
            type='button'
            onClick={addRow}
            className='flex h-8 w-8 cursor-pointer items-center justify-center gap-1 rounded-lg text-xs font-medium text-white duration-150 sm:h-auto sm:w-auto sm:px-3 sm:py-1.5 sm:text-sm'
            style={{ backgroundColor: branding.selectionColor }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.backgroundColor =
                branding.hoverColor
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.backgroundColor =
                branding.selectionColor
            }}
          >
            <MdAdd size={16} />
            <span className='hidden sm:inline'>Add</span>
          </button>
          <button
            type='button'
            onClick={deleteSelected}
            disabled={selectedIds.size === 0}
            className={`flex h-8 w-8 items-center justify-center gap-1 rounded-lg text-xs font-medium text-white transition-colors duration-150 sm:h-auto sm:w-auto sm:px-3 sm:py-1.5 sm:text-sm ${
              selectedIds.size === 0
                ? 'cursor-not-allowed bg-red-300'
                : 'cursor-pointer bg-red-500 hover:bg-red-600'
            }`}
          >
            <MdDelete size={16} />
            <span className='hidden sm:inline'>Delete</span>
          </button>
          <button
            type='button'
            onClick={() => onSubmit?.(toOutput(rows))}
            className='flex h-8 w-8 cursor-pointer items-center justify-center gap-1 rounded-lg text-xs font-medium text-white duration-150 sm:h-auto sm:w-auto sm:px-3 sm:py-1.5 sm:text-sm'
            style={{
              backgroundColor: branding.selectionColor,
              boxShadow: `0 0 0 0px ${hexToRgba(branding.selectionColor, 0.2)}`
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.backgroundColor =
                branding.hoverColor
              ;(
                e.currentTarget as HTMLElement
              ).style.boxShadow = `0 0 0 3px ${hexToRgba(
                branding.selectionColor,
                0.2
              )}`
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.backgroundColor =
                branding.selectionColor
              ;(
                e.currentTarget as HTMLElement
              ).style.boxShadow = `0 0 0 0px ${hexToRgba(
                branding.selectionColor,
                0.2
              )}`
            }}
          >
            <MdSearch size={16} />
            <span className='hidden sm:inline'>Search</span>
          </button>
        </div>
      </div>

      {/* ── Filter rows ── */}
      <div className='flex min-h-0 flex-1 flex-col overflow-y-auto'>
        {rows.map((row, idx) => {
          const isBetween = row.operator === 'BETWEEN'
          const isDate = row.dataType === 'date'
          const isNumber = row.dataType === 'number'
          const filterOpts = row.key ? FILTER_MAP[row.dataType] : []
          const isChecked = selectedIds.has(row.id)

          const labelCls = `text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`

          return (
            <div
              key={row.id}
              className={`flex flex-col items-start gap-2 px-4 py-2 transition-colors duration-150 sm:grid sm:px-5 sm:py-3 ${
                isChecked
                  ? isDark
                    ? 'bg-blue-900/40'
                    : 'bg-blue-50'
                  : isDark
                  ? 'bg-gray-900'
                  : 'bg-white'
              } ${
                idx < rows.length - 1
                  ? isDark
                    ? 'border-b border-gray-700'
                    : 'border-b border-gray-200'
                  : ''
              }`}
              style={{ gridTemplateColumns: '28px 1fr 1fr 2fr' }}
            >
              {/* Checkbox */}
              <div className='mt-[14px] hidden h-8 items-center sm:flex'>
                <input
                  type='checkbox'
                  checked={isChecked}
                  onChange={() => toggleSelect(row.id)}
                  className='h-4 w-4 cursor-pointer rounded'
                  style={{ accentColor: branding.selectionColor }}
                />
              </div>

              {/* Field */}
              <div className='flex w-full min-w-0 flex-col gap-1 sm:w-auto'>
                <span className={labelCls}>Field</span>
                <div className={cellCls} style={cellStyle}>
                  <DropdownSelect
                    options={controllerOptions}
                    value={row.key}
                    placeholder='Select field'
                    isDark={isDark}
                    selectionColor={branding.selectionColor}
                    onChange={v => handleKeyChange(row.id, v)}
                  />
                </div>
              </div>

              {/* Condition */}
              <div className='flex w-full min-w-0 flex-col gap-1 sm:w-auto'>
                <span className={labelCls}>Condition</span>
                <div className={cellCls} style={cellStyle}>
                  <DropdownSelect
                    options={filterOpts}
                    value={row.operator}
                    placeholder='Condition'
                    disabled={!row.key}
                    isDark={isDark}
                    selectionColor={branding.selectionColor}
                    onChange={v =>
                      patch(row.id, { operator: v, value: '', value2: '' })
                    }
                  />
                </div>
              </div>

              {/* Value */}
              <div className='flex w-full min-w-0 flex-col gap-1 sm:w-auto'>
                <span className={labelCls}>Value</span>
                {isBetween ? (
                  <div className='flex items-center gap-1'>
                    <div className={isDate ? cellClsDate : cellCls} style={isDate ? undefined : cellStyle}>
                      {isDate ? (
                        <DatePicker
                          value={row.value}
                          fillContainer
                          onChange={v => patch(row.id, { value: toTimestamp(v) })}
                        />
                      ) : (
                        <input
                          type={isNumber ? 'number' : 'text'}
                          value={row.value}
                          placeholder='From'
                          disabled={disabled}
                          onChange={e =>
                            patch(row.id, { value: e.target.value })
                          }
                          onKeyDown={e => {
                            if (e.key === 'Enter') onSubmit?.(toOutput(rows))
                          }}
                          className={`h-full w-full border-0 bg-transparent px-2 py-1 text-xs focus:outline-none focus:ring-0 sm:text-sm ${
                            isDark
                              ? 'text-white placeholder-gray-500'
                              : 'text-gray-900 placeholder-gray-400'
                          }`}
                          style={{ fontFamily: 'var(--font-body)' }}
                        />
                      )}
                    </div>
                    <span
                      className={`flex-shrink-0 text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      –
                    </span>
                    <div className={isDate ? cellClsDate : cellCls} style={isDate ? undefined : cellStyle}>
                      {isDate ? (
                        <DatePicker
                          value={row.value2}
                          fillContainer
                          onChange={v => patch(row.id, { value2: toTimestamp(v) })}
                        />
                      ) : (
                        <input
                          type={isNumber ? 'number' : 'text'}
                          value={row.value2}
                          placeholder='To'
                          disabled={disabled}
                          onChange={e =>
                            patch(row.id, { value2: e.target.value })
                          }
                          onKeyDown={e => {
                            if (e.key === 'Enter') onSubmit?.(toOutput(rows))
                          }}
                          className={`h-full w-full border-0 bg-transparent px-2 py-1 text-xs focus:outline-none focus:ring-0 sm:text-sm ${
                            isDark
                              ? 'text-white placeholder-gray-500'
                              : 'text-gray-900 placeholder-gray-400'
                          }`}
                          style={{ fontFamily: 'var(--font-body)' }}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={isDate ? cellClsDate : cellCls} style={isDate ? undefined : cellStyle}>
                    {isDate ? (
                      <DatePicker
                        value={row.value}
                        fillContainer
                        onChange={v => patch(row.id, { value: toTimestamp(v) })}
                      />
                    ) : (
                      <input
                        type={isNumber ? 'number' : 'text'}
                        value={row.value}
                        placeholder='Value'
                        disabled={disabled}
                        onChange={e =>
                          patch(row.id, { value: e.target.value })
                        }
                        onKeyDown={e => {
                          if (e.key === 'Enter') onSubmit?.(toOutput(rows))
                        }}
                        className={`h-full w-full border-0 bg-transparent px-2 py-1 text-xs focus:outline-none focus:ring-0 sm:text-sm ${
                          isDark
                            ? 'text-white placeholder-gray-500'
                            : 'text-gray-900 placeholder-gray-400'
                        }`}
                        style={{ fontFamily: 'var(--font-body)' }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdvancedSearch