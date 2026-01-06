import {
  FilterIcon,
  Multiply,
  SearchIcon
} from '@/app/components/svgApplication'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getCookie } from '@/app/components/cookieMgment'
import { checkDataAccess } from '@/app/utils/checkDAP'
import { AxiosService } from '@/app/components/axiosService'
import { CiCalendarDate } from 'react-icons/ci'
import { Button } from '@/components/Button'
import Popup from '@/components/Popup'
import Spin from '@/components/Spin'
import { Text } from '@/components/Text'
import { Checkbox } from '@/components/Checkbox'
import { Avatar } from '@/components/Avatar'
import { useTheme } from '@/hooks/useTheme'
import { twMerge } from 'tailwind-merge'
import { RangeCalendar } from '@/components/RangeCalendar'
import { getCdnImage } from '@/app/utils/getAssets'

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
  setRange: React.Dispatch<React.SetStateAction<any>>
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
  const { isDark, borderColor, textColor, bgColor, branding } = useTheme()

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

  const showDate = (date: any) => {
    if (!date) return ''
    const { year, month, day } = date
    return `${day}/${month}/${year}`
  }

  const toggleFabric = (key: string) => {
    setSelectedKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  return (
    <div className='h-fit w-full'>
      <div className='flex w-full items-center justify-between px-2 py-1'>
        <Text
          contentAlign='left'
          variant='subheader-2'
          className='flex !w-fit gap-2'
        >
          <FilterIcon fill={isDark ? '#fff' : '#000'} /> Filter
        </Text>
        <Button
          className='!w-fit rounded-md p-2'
          onClick={() => setOpen(false)}
        >
          {' '}
          <Multiply width='12' height='12' fill={isDark ? '#fff' : '#000'} />
        </Button>
      </div>
      <hr className={`w-full ${borderColor}`} />
      {/* Date Range Selection */}
      <div className='flex flex-col gap-3 px-2 py-3'>
        <Text contentAlign='left' variant='subheader-1'>
          SORT BY DATE
        </Text>
        <div
          onClick={e => {
            setDateRangeOpen(!isDateRangeOpen)
            e.stopPropagation()
          }}
          ref={calendarTriggerRef}
          className={twMerge(
            'flex w-fit cursor-pointer items-center gap-[2vw] rounded border px-[0.5vw] py-[0.5vh]',
            borderColor
          )}
        >
          <div className='flex flex-col gap-1'>
            <Text contentAlign='left' variant='body-2' color='secondary'>
              Select Date{' '}
            </Text>
            <Text contentAlign='left' variant='body-2'>
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
            onChange={val => setSelectedDateRange(val)}
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
        <Text contentAlign='left' variant='subheader-1'>
          FABRICS
        </Text>

        <div className='flex flex-col gap-2'>
          {(activeTab === 'process'
            ? fabricList.filter(item => ['DF', 'PF'].includes(item.key))
            : fabricList
          ).map(item => (
            <label
              key={item.key}
              className='flex cursor-pointer items-center gap-2'
            >
              <input
                type='checkbox'
                className='h-4 w-4 cursor-pointer'
                style={{ accentColor: branding.selectionColor }}
                checked={selectedKeys.includes(item.key)}
                onChange={() => toggleFabric(item.key)}
              />
              <Text contentAlign='left'>{item.label}</Text>
            </label>
          ))}
        </div>
      </div>

      {/* if admin User  */}
      {isAdminUser && (
        <div className='flex flex-col gap-3 px-2 py-3'>
          <Text contentAlign='left' variant='subheader-1'>
            USERS
          </Text>
          {/* Search section */}
          <div
            className={twMerge(
              'flex w-full items-center gap-[0.5vw] rounded border px-2',
              borderColor,
              bgColor,
              textColor
            )}
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
              className={twMerge(
                `h-8 w-full rounded-md border-none font-medium outline-none`,
                bgColor,
                textColor
              )}
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
              <Spin
                className='flex w-full justify-center'
                spinning
                color='success'
                style='dots'
              />
            ) : (
              userList
                .filter(u =>
                  (u.loginId + u.firstName + u.lastName)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((userObj: any) => (
                  <label
                    key={userObj?.loginId}
                    className='flex cursor-pointer items-center gap-2'
                  >
                    <input
                      type='checkbox'
                      style={{ accentColor: branding.selectionColor }}
                      className='h-4 w-4'
                      onChange={e =>
                        setSelectedUsers(prev => {
                          if (!prev.includes(userObj?.loginId)) {
                            return [...prev, userObj?.loginId]
                          } else {
                            return prev.filter(id => id !== userObj?.loginId)
                          }
                        })
                      }
                      checked={selectedUsers.includes(userObj?.loginId)}
                    />
                    <div
                      key={userObj?.loginId}
                      className='flex items-center gap-[0.5vw]'
                    >
                      <div className='h-11 w-11 rounded-full'>
                        <Avatar
                          theme='normal'
                          view='filled'
                          imageUrl={getCdnImage(userObj?.profile)}
                          icon='FaRegUser'
                        />
                      </div>
                      <div className='flex flex-col gap-1'>
                        <Text
                          className='text-nowrap'
                          contentAlign='left'
                          variant='body-2'
                        >
                          {userObj?.firstName + ' ' + userObj?.lastName}
                        </Text>
                        <Text contentAlign='left' variant='body-1'>
                          {userObj?.loginId}
                        </Text>
                      </div>
                    </div>
                  </label>
                ))
            )}
          </div>
        </div>
      )}
      <hr className={twMerge('w-full', borderColor)} />

      <div className='flex justify-end gap-[1vw] pt-2'>
        <Button
          className='!w-fit rounded-md p-2'
          view='raised'
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdateFilterInputs}
          className='!w-fit rounded-md p-2'
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default LogsFilterationModal
