import {
  FilterIcon,
  Multiply,
  SearchIcon
} from '@/app/components/svgApplication'
import { RangeCalendar } from '@gravity-ui/date-components'
import { dateTime, DateTime } from '@gravity-ui/date-utils'
import { Avatar, Button, Checkbox, Popup , Loader, Text } from '@gravity-ui/uikit'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Calendar , Person } from '@gravity-ui/icons'
import { getCookie } from '@/app/components/cookieMgment'
import { checkDataAccess } from '@/app/utils/checkDAP'
import { AxiosService } from '@/app/components/axiosService'

const LogsFilterationModal = ({
  range,
  setRange,
  setOpen,
  fabrics,
  setFabrics,
  user,
  setUser,
  activeTab
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
  user: Array<string>
  setUser: React.Dispatch<React.SetStateAction<Array<string>>>
  activeTab:string
}) => {
  const [isDateRangeOpen, setDateRangeOpen] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState(range)
  const [selectedKeys, setSelectedKeys] = useState<string[]>(fabrics)
  const [selectedUsers, setSelectedUsers] = useState<string[]>(user)
  const [searchTerm, setSearchTerm] = useState('')
  const [userList, setuserList] = useState<Array<any>>([])
  const [loading, setLoading] = useState(false)
  const token: string = getCookie('token')

  const isAdminUser = useMemo(() => checkDataAccess(token), [token])

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
    setUser(selectedUsers)
    setOpen(false)
  }

  const getOrgAndUserData = async () => {
    setuserList([])
    setLoading(true)
    try {
      if (!isAdminUser) return
      const response = await AxiosService.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/getAppSecurityData`,
        {
          headers: {
            Authorization: `Bearer ${getCookie('token')}`
          }
        }
      )
      if (response.status === 200) {
        if (response.data.users && Array.isArray(response.data.users)) {
          setuserList(response.data.users)
          setLoading(false)
        }
      }
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  useEffect(() => {
    getOrgAndUserData()
  }, [])

  return (
    <div className='h-fit w-[50vw] lg:w-[30vw]'>
      <div className='flex w-full items-center justify-between px-[0.7vw] py-[1vh]'>
        <Text variant='subheader-2' className='flex gap-2'>
          <FilterIcon fill='var(--g-color-text-primary)' /> Filter
        </Text>
        <Button
          className='flex items-center justify-center'
          onClick={() => setOpen(false)}
        >
          {' '}
          <Multiply
            width='12'
            height='12'
            fill={'var(--g-color-text-primary)'}
          />
        </Button>
      </div>
      <hr
        style={{ borderColor: 'var(--g-color-line-generic)' }}
        className='w-full'
      />
      {/* Date Range Selection */}
      <div className='flex flex-col gap-3 px-2 py-3'>
        <Text variant='subheader-1' >
          SORT BY DATE
        </Text>
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
          <div className='flex flex-col gap-1'>
            <Text variant='body-2' color='secondary'>Select Date </Text>
            <Text variant='body-2' >
              {selectedDateRange.start.format('DD/MM/YYYY')} -{' '}
              {selectedDateRange.end.format('DD/MM/YYYY')}
            </Text>
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
            maxValue={dateTime()}
          />
        </Popup>
      </div>
      {/* Fabric Selection */}
      <div className='flex flex-col gap-3 px-2 py-3'>
        <Text variant='subheader-1'>FABRICS</Text>
        <div className='flex flex-col gap-[1.5vh]'>
          {(activeTab === 'process'
            ? fabricList.filter(item => ['DF', 'PF'].includes(item.key))
            : fabricList
          ).map((item, index) => (
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
            />
          ))}
        </div>
      </div>
      {/* if admin User  */}
      {isAdminUser && (
        <div className='flex flex-col gap-3 px-2 py-3'>
          <Text variant='subheader-1'>USERS</Text>
          {/* Search section */}
          <div
            className={
              'flex w-full items-center gap-[0.5vw] rounded border px-2'
            }
            style={{
              borderColor: 'var(--g-color-line-generic)'
            }}
          >
            <span>
              <SearchIcon
                fill={'var(--g-color-text-primary)'}
                height='16'
                width='16'
              />
            </span>
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={'Search'}
              style={{
                backgroundColor: 'var(--g-color-base-background)',
                color: 'var(--g-color-text-primary)',
              }}
              className={`h-8 w-full rounded-md border-none font-medium outline-none`}
            />
          </div>
          {/* user list section */}
          <div
            className='scrollbar-none flex flex-col gap-[1vh] overflow-scroll'
            style={{
              height: userList.length > 3 ? '160px' : 'auto'
            }}
          >
            {loading ? (
              <Loader className='flex w-full justify-center' />
            ) : (
              userList
                .filter(u =>
                  (u.loginId + u.firstName + u.lastName)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((userObj: any) => (
                  <Checkbox
                    key={userObj?.loginId}
                    content={
                      <div key={userObj?.loginId} className='flex gap-[0.5vw]'>
                        <Avatar
                          imgUrl={userObj?.profile}
                          size='m'
                          className={`transition-all delay-75 duration-300 ease-in-out hover:scale-[1.2] `}
                          icon={Person}
                        />
                        <div className='flex flex-col gap-1'>
                          <Text variant='body-2'>
                            {userObj?.firstName + ' ' + userObj?.lastName}
                          </Text>
                          <Text variant='body-1' >{userObj?.loginId}</Text>
                        </div>
                      </div>
                    }
                    value={userObj?.loginId}
                    className='flex items-center gap-2 text-[0.72vw]'
                    onChange={e =>
                      setSelectedUsers(prev => {
                        if (e.target.checked) {
                          return [...prev, userObj?.loginId]
                        } else {
                          return prev.filter(id => id !== userObj?.loginId)
                        }
                      })
                    }
                    checked={selectedUsers.includes(userObj?.loginId)}
                    style={{
                      fontSize: '0.72vw'
                    }}
                  />
                ))
            )}
          </div>
        </div>
      )}
      <hr
        style={{ borderColor: 'var(--g-color-line-generic)' }}
        className='w-full'
      />

      <div className='flex justify-end gap-[1vw] px-2 py-3'>
        <Button view='raised' onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button onClick={handleUpdateFilterInputs}>Save</Button>
      </div>
    </div>
  )
}

export default LogsFilterationModal
