import { FilterIcon, Multiply } from '@/app/components/svgApplication'
import { RangeCalendar } from '@gravity-ui/date-components'
import { DateTime } from '@gravity-ui/date-utils'
import { Button, Checkbox, Popup } from '@gravity-ui/uikit'
import React, { useRef, useState } from 'react'
import { Calendar } from '@gravity-ui/icons'

const LogsFilterationModal = ({
  range,
  setRange,
  setOpen,
  fabrics,
  setFabrics
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  range: {
    start: DateTime
    end: DateTime
  }
  setRange: React.Dispatch<
    React.SetStateAction<{
      start: DateTime
      end: DateTime
    }>
  >
  fabrics: Array<string>
  setFabrics: React.Dispatch<React.SetStateAction<Array<string>>>
}) => {
  const [isDateRangeOpen, setDateRangeOpen] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState(range)
  const [selectedKeys, setSelectedKeys] = useState<string[]>(fabrics)

  const calendarTriggerRef = useRef<HTMLDivElement>(null)

  const fabricList = [
    { key: 'DF', label: 'Data Fabric' },
    { key: 'UF', label: 'UI Fabric' },
    { key: 'PF', label: 'Process Fabric' },
    { key: 'API', label: 'API Fabric' },
    { key: 'AIF', label: 'AI Fabric' },
    { key: 'CDF', label: 'Deployment Fabric' }
  ]

  const handleUpdateFilterInputs = () => {
    setRange(selectedDateRange)
    setFabrics(selectedKeys)
    setOpen(false)
  }

  return (
    <div className='h-fit w-[30vw]'>
      <div className='flex w-full items-center justify-between px-[0.7vw] py-[1vh]'>
        <div className='flex gap-2 text-[0.9vw]'>
          <FilterIcon fill='var(--g-color-text-primary)' /> Filter
        </div>
        <Button
          className='flex items-center justify-center'
          onClick={() => setOpen(false)}
        >
          {' '}
          <Multiply
            width='0.83vw'
            height='0.83vw'
            fill={'var(--g-color-text-primary)'}
          />
        </Button>
      </div>
      <hr
        style={{ borderColor: 'var(--g-color-line-generic)' }}
        className='w-full'
      />
      {/* Date Range Selection */}
      <div className='flex flex-col gap-[1.24vh] px-[0.58vw] py-[1.24vh]'>
        <h1 className='text-[0.72vw] font-medium leading-[2.22vh]'>
          SORT BY DATE
        </h1>
        <div
          onClick={e => {
            setDateRangeOpen(!isDateRangeOpen)
            e.stopPropagation()
          }}
          ref={calendarTriggerRef}
          className='flex w-fit cursor-pointer items-center gap-[2vw] rounded border px-[0.5vw] py-[0.5vh]'
          style={{
            borderColor: 'var(--g-color-line-generic)'
          }}
        >
          <div className='flex flex-col gap-[0.5vh]'>
            <span className='text-[0.72vw] opacity-50'>Select Date </span>
            <span className='text-[0.72vw]'>
              {selectedDateRange.start.format('DD/MM/YYYY')} -{' '}
              {selectedDateRange.end.format('DD/MM/YYYY')}
            </span>
          </div>
          <span className='flex self-end'>
            <Calendar color='var(--g-color-text-primary)' opacity={0.5} />
          </span>
        </div>
        <Popup
          anchorRef={calendarTriggerRef}
          open={isDateRangeOpen}
          onOutsideClick={() => setDateRangeOpen(false)}
        >
          <RangeCalendar
            value={selectedDateRange}
            onUpdate={setSelectedDateRange}
          />
        </Popup>
      </div>
      {/* Fabric Selection */}
      <div className='flex flex-col gap-[1.24vh] px-[0.58vw] py-[1.24vh]'>
        <h1 className='text-[0.72vw] font-medium leading-[2.22vh]'>FABRICS</h1>
        <div className='flex flex-col gap-[1.5vh]'>
          {fabricList.map((item, index) => (
            <Checkbox
              key={index}
              content={item.label}
              value={item.key}
              onChange={e =>
                setSelectedKeys(prev => {
                  if (e.target.checked) {
                    return [...prev, item.key]
                  } else {
                    return prev.filter(key => key !== item.key)
                  }
                })
              }
              checked={selectedKeys.includes(item.key)}
              style={{
                fontSize: '0.72vw'
              }}
            />
          ))}
        </div>
      </div>
      <hr
        style={{ borderColor: 'var(--g-color-line-generic)' }}
        className='w-full'
      />
      <div className='flex justify-end gap-[1vw] px-[0.58vw] py-[1.24vh]'>
        <Button view='raised' onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button onClick={handleUpdateFilterInputs}>Save</Button>
      </div>
    </div>
  )
}

export default LogsFilterationModal
