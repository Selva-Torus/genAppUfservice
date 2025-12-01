import {
  FilterIcon,
  Multiply,
  SearchIcon
} from '@/app/components/svgApplication'
// import { RangeCalendar } from '@gravity-ui/date-components'
import { dateTime, DateTime } from '@gravity-ui/date-utils'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getCookie } from '@/app/components/cookieMgment'
import { checkDataAccess } from '@/app/utils/checkDAP'
import { AxiosService } from '@/app/components/axiosService'
import { CiCalendarDate } from "react-icons/ci";
import { Button } from '@/components/Button'
import Popup from '@/components/Popup'
import Spin from '@/components/Spin'
import { Text } from '@/components/Text'
import { Checkbox } from '@/components/Checkbox'
import { Avatar } from '@/components/Avatar'
import { useTheme } from '@/hooks/useTheme'
import { twMerge } from 'tailwind-merge'
import { RangeCalendar } from '@/components/RangeCalendar'

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
  range: any
  setRange: React.Dispatch<
    React.SetStateAction<any>
  >
  fabrics: Array<string>
  setFabrics: React.Dispatch<React.SetStateAction<Array<string>>>
  user: Array<string>
  setUser: React.Dispatch<React.SetStateAction<Array<string>>>
  activeTab: string
}) => {
  const [isDateRangeOpen, setDateRangeOpen] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState<any>(range)
  const [selectedKeys, setSelectedKeys] = useState<string[]>(fabrics)
  const [selectedUsers, setSelectedUsers] = useState<string[]>(user)
  const [searchTerm, setSearchTerm] = useState('')
  const [userList, setuserList] = useState<Array<any>>([])
  const [loading, setLoading] = useState(false)
  const token: string = getCookie('token')

  const isAdminUser = useMemo(() => checkDataAccess(token), [token])
  const { isDark , borderColor , textColor , bgColor} = useTheme()

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

  const showDate = (date: DateTime) => {
    if(!date) return ""
    const { year, month, day } = date
    return `${day}/${month}/${year}`
  }

  return (
    <div className='h-fit w-full'>
      <div className='flex w-full items-center justify-between px-[0.7vw] py-[1vh]'>
        <Text variant='subheader-2' className='flex gap-2'>
          <FilterIcon fill={isDark ? '#fff' : '#000'} /> Filter
        </Text>
        <Button
          className='flex items-center justify-center'
          onClick={() => setOpen(false)}
        >
          {' '}
          <Multiply
            width='12'
            height='12'
            fill={isDark ? '#fff' : '#000'}
          />
        </Button>
      </div>
      <hr
        className={`w-full ${borderColor}`}
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
          className={twMerge('flex w-fit cursor-pointer items-center gap-[2vw] rounded border px-[0.5vw] py-[0.5vh]' , borderColor)}
        >
          <div className='flex flex-col gap-1'>
            <Text variant='body-2' color='secondary'>Select Date </Text>
            <Text variant='body-2' >
              {showDate(selectedDateRange?.start)} -{' '}
              {showDate(selectedDateRange?.end)}
            </Text>
          </div>
          <span className='flex self-end'>
            <CiCalendarDate color={isDark ? '#fff' : '#000'} opacity={0.5} />
          </span>
        </div>
        <Popup
          anchorRef={calendarTriggerRef}
          open={isDateRangeOpen}
          onClose={() => setDateRangeOpen(false)}
          size='xl'
        >
          <RangeCalendar
            value={selectedDateRange}
            onChange={(val) => setSelectedDateRange(val)}
            maxValue={{
              year: new Date().getFullYear(),
              month: new Date().getMonth() + 1,
              day: new Date().getDate()
            }}
            minValue={{
              year: new Date().getFullYear(),
              month: new Date().getMonth() + 1,
              day: new Date().getDate()
            }}

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
              value={selectedKeys?.includes(item.key)}
              onChange={e =>
                setSelectedKeys(prev => {
                  if (e) {
                    return [...prev, item.key]
                  } else {
                    return prev.filter(key => key !== item.key)
                  }
                })
              }
              checked={selectedKeys.includes(item.key)}
              size='l'
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
              twMerge('flex w-full items-center gap-[0.5vw] rounded border px-2' , borderColor , bgColor , textColor)
            }
          >
            <span>
              <SearchIcon
                fill={isDark ? '#fff' : '#000'}
                height='16'
                width='16'
              />
            </span>
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={'Search'}
              className={twMerge(`h-8 w-full rounded-md border-none font-medium outline-none` , bgColor , textColor)}
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
              <Spin className='flex w-full justify-center' spinning color='success' style='dots' />
            ) : (
              userList
                .filter(u =>
                  (u.loginId + u.firstName + u.lastName)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((userObj: any) => (
                  <div key={userObj?.loginId} className='flex gap-2 cursor-pointer'>
                    <Checkbox
                      key={userObj?.loginId}
                      value={userObj?.loginId}
                      className='flex items-center gap-2 text-[0.72vw]'
                      onChange={e =>
                        setSelectedUsers(prev => {
                          if (e) {
                            return [...prev, userObj?.loginId]
                          } else {
                            return prev.filter(id => id !== userObj?.loginId)
                          }
                        })
                      }
                      checked={selectedUsers.includes(userObj?.loginId)}
                      size='l'
                    />
                    <div key={userObj?.loginId} className='flex gap-[0.5vw]'>
                      <Avatar
                        imageUrl={userObj?.profile as string}
                        size='m'
                        className={`transition-all delay-75 duration-300 ease-in-out hover:scale-[1.2] `}
                        theme='normal'
                        view='filled'
                        icon='FaRegUser'
                      />
                      <div className='flex flex-col gap-1'>
                        <Text variant='body-2'>
                          {userObj?.firstName + ' ' + userObj?.lastName}
                        </Text>
                        <Text variant='body-1'>{userObj?.loginId}</Text>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
      <hr
        className={twMerge('w-full' , borderColor)}
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
