'use client'
import React, { useCallback,useContext, useEffect, useMemo, useState } from 'react'
import { SearchIcon } from '../components/svgApplication'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import axios from 'axios'
import { getCookie, setCookie } from '../components/cookieMgment'
import { ArrowBackward, ArrowForward, StarIcon } from '../utils/svgApplications'
import { useRouter } from 'next/navigation'
import decodeToken from '../components/decodeToken'
import { capitalize } from 'lodash'
import { isLightColor } from '../components/utils'
import { Text } from '@/components/Text'
import { Select } from '@/components/Select'
import Spin from '@/components/Spin'
import { useGlobal } from '@/context/GlobalContext'
import { twMerge } from 'tailwind-merge'
import { useTheme } from '@/hooks/useTheme'
import { Dropdown } from '@/components/Dropdown'

const ContextSelector = () => {
  const [selectedAccessProfile, setSelectedAccessProfile] = useState<string[]>([])
  const token: string = getCookie('token')
  const tp_ps: any = getCookie('tp_ps')
  const decodedTokenObj: any = decodeToken(token)
  const user = decodedTokenObj?.loginId
  const toast = useInfoMsg();
  const baseUrl: any = process.env.NEXT_PUBLIC_API_BASE_URL
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [accessProfiles, setAccessProfiles] = useState<any[]>([])
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const {borderColor, isDark} = useTheme()
  const { branding } = useGlobal()
  const { brandColor } = branding
  const [selectedCombination, setSelectedCombination] = useState({})
  const [time, setTime] = useState('')
  let landingScreen:string = 'User Screen';
  let screenDetails: any = {
           keys:[
  {
    "screensName": "testroute-v1",
    "ufKey": "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:oprmatrixUF:AFVK:v1"
  }
]
  }
  screenDetails = screenDetails.keys

  if (landingScreen === 'User Screen') {
    landingScreen = 'user'
  }else if (landingScreen === 'Logs Screen') {
    landingScreen = 'logs'
  }else{
    screenDetails.forEach((screen: any)   => {
      if (landingScreen === screen.ufKey) {
        landingScreen = screen.screensName
      }
    });
    landingScreen =landingScreen.split('-')[0]+'_'+landingScreen.split('-').at(-1)
  }

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
      // Format: "11:33 AM" -> convert ":" to "."
      const formatted = now
        .toLocaleTimeString('en-US', options)
        .replace(':', '.')
        .replace(/:\d{2}/, '')
      setTime(formatted)
    }

    updateTime() // initial render
    const timer = setInterval(updateTime, 1000) // update every second
    return () => clearInterval(timer)
  }, [])

  // Format and memoize date only once
  const dateString = useMemo(() => {
    const date = new Date()
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }, [])

  useEffect(() => {
    orpsData()
  }, [])

  useEffect(() => {
    if (tp_ps) {
      setSelectedCombination(JSON.parse(atob(tp_ps))?.selectedCombination ?? {})
      setSelectedAccessProfile(
        JSON.parse(atob(tp_ps))?.selectedAccessProfile ?? []
      )
    }
  }, [tp_ps])

  const orpsData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/UF/getAccessTemplates`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      if (res.status == 200) {
        setAccessProfiles(res.data)
      }
    } catch (error) {
      toast('Error Fetching ORPS', 'danger')
    }
  }

  const handleCardClick = (item: any) => {
    const { orgGrpCode, orgCode, psGrpCode, psCode, roleGrpCode, roleCode } =
      item
    setSelectedCombination({
      orgGrpCode,
      orgCode,
      psGrpCode,
      psCode,
      roleGrpCode,
      roleCode
    })
  }

  const handleNavigationClick = async () => {
    setLoading(true)
    try {
      const res = await axios.post(
        `${baseUrl}/UF/getAccessToken`,
        {
          selectedCombination: selectedCombination,
          selectedAccessProfile: selectedAccessProfile[0],
          dap:
            accessProfiles.find(
              item => item.accessProfile === selectedAccessProfile[0]
            )?.dap ?? undefined,
          ufClientType: 'UFW'
        },
        {
          headers: {
            authorization: `Bearer ${token}`
          }
        }
      )
      if (res.status == 201) {
        setCookie('token', res.data.token)
        setCookie(
          'tp_ps',
          btoa(
            JSON.stringify({
              selectedCombination: selectedCombination,
              selectedAccessProfile
            })
          )
        )
        const ORM: any = decodeToken(res.data.token)
        sessionStorage.setItem(
          'organizationDetails',
          JSON.stringify({
            orgGrpCode: ORM.orgGrpCode,
            orgCode: ORM.orgCode,
            roleGrpCode: ORM.roleGrpCode,
            roleCode: ORM.roleCode,
            psGrpCode: ORM.psGrpCode,
            psCode: ORM.psCode
          })
        )
        // here we have to set the default authentication route
        router.push(landingScreen)
        setLoading(false)
      }
    } catch (error) {
      toast('Error Fetching AccessToken', 'danger')
    }
  }

  const isSelectedCombination = useCallback(
    (item: any) => {
      const { orgGrpCode, orgCode, psGrpCode, psCode, roleGrpCode, roleCode } =
        item
      if (
        JSON.stringify(selectedCombination) ==
        JSON.stringify({
          orgGrpCode,
          orgCode,
          psGrpCode,
          psCode,
          roleGrpCode,
          roleCode
        })
      ) {
        return true
      }
      return false
    },
    [selectedCombination]
  )

  return (
    <div className='h-[100vh] w-full'>
      <div className='flex h-[100%] flex-col items-center justify-center gap-[15px]'>
        <Text variant='display-2'>Welcome {capitalize(user)}</Text>
        <div className='flex items-center gap-[5px] text-[0.83vw]'>
          <Text variant='body-1'>{dateString}</Text>
          <hr className='h-[25px] border' />
          <Text variant='body-1'>{time}</Text>
        </div>
        <Text variant='body-1' className=' font-medium'>
          Select from the profiles to proceed
        </Text>
        <div className='flex w-full justify-center gap-[.5vw]'>
             <div className='relative h-[42px] items-center'>
            <span className='absolute inset-y-0 left-0 flex p-[10px]'>
              <SearchIcon
                fill={isDark ? 'white' : 'black'}
                height='17px'
                width='17px'
              />
            </span>
            <input
              autoFocus
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder='Search'
              onFocus={e => (e.target.style.borderColor = brandColor)}
              onBlur={e => (e.target.style.borderColor = '#00000026')}
              disabled={!selectedAccessProfile[0]}
              className={`h-[42px] w-[20vw] rounded-md border pl-[30px] font-medium focus:outline-none`}
            />
          </div>
          <div className='w-[10vw]'>
           {/* <Select
              options={accessProfiles.map(item => ({
                value: item.accessProfile,
                label: item.accessProfile
              }))}
              value={selectedAccessProfile[0]}
              onChange={value => {
                setSelectedAccessProfile([value] as string[])
                setSelectedCombination({})
              }}
              size='s'
              placeholder='Select Access Profile'
            />*/}
            <Dropdown
              value={selectedAccessProfile[0]}
              staticProps={accessProfiles.map(item => item.accessProfile)}
              className=''
              onChange={val => {
                setSelectedAccessProfile([val] as string[])
                setSelectedCombination({})
              }}
            />
          </div>
        </div>

        <div
          className={`flex h-[300px] w-full items-center justify-center gap-[10px] overflow-y-auto ${accessProfiles.map(
            (item: any) =>
              item.combinations.length > 5 ? 'flex flex-wrap' : ''
          )}`}
        >
          {accessProfiles.map(
            profile =>
              profile.accessProfile === selectedAccessProfile[0] &&
              profile.combinations
                .filter((item: any) =>
                  Object.entries(item).some(
                    ([key, value]) =>
                      key.toLowerCase().includes('name') &&
                      (value as string)
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                )
                .map((item: any, index: number) => (
                  <button
                    key={index}
                    style={{
                      border: isSelectedCombination(item)
                        ? `2px solid ${brandColor}`
                        : ''
                    }}
                    className={twMerge(`flex h-[240px] w-[260px] flex-col gap-[10px] rounded-md pl-[10px] pt-[10px] text-start outline-none border`, borderColor)}
                    onClick={() => handleCardClick(item)}
                  >
                    <div className='flex w-full items-center justify-between'>
                      <Text
                        variant='body-2'
                        className='truncate text-nowrap text-[15px] font-semibold'
                        needTooltip={true}
                        tooltipProps={{
                          title: item?.orgGrpName,
                          placement: 'top-start'
                        }}
                      >
                        {item?.orgGrpName}
                      </Text>
                      <span className='pr-[10px] outline-none'>
                        <StarIcon
                          fill={isSelectedCombination(item) ? '#F9D544' : ''}
                          stroke={isSelectedCombination(item) ? '' : '#B6BAC3'}
                        />
                      </span>
                    </div>
                    <Text
                      variant='body-1'
                      className={twMerge('w-[80%] truncate rounded-md px-[2px] py-[2px] text-[0.72vw] font-medium border-2', borderColor)}
                      needTooltip={true}
                      tooltipProps={{
                        title: item?.orgName,
                        placement: 'top-start'
                      }}
                    >
                      {item?.orgName}
                    </Text>
                    <Text
                      variant='body-2'
                      className='truncate text-nowrap text-[15px] font-semibold'
                      needTooltip={true}
                      tooltipProps={{
                        title: item?.psGrpName,
                        placement: 'top-start'
                      }}
                    >
                      {item?.psGrpName}
                    </Text>
                    <Text
                      variant='body-1'
                      className={twMerge('w-[80%] truncate rounded-md px-[2px] py-[2px] text-[0.72vw] font-medium border-2', borderColor)}
                      needTooltip={true}
                      tooltipProps={{ title:item?.psName, placement:'top-start' }}
                    >
                      {item?.psName}
                    </Text>
                    <Text
                      variant='body-2'
                      className='truncate text-nowrap text-[15px] font-semibold'
                      needTooltip={true}
                      tooltipProps={{ title:item?.roleGrpName, placement:'top-start' }}
                    >
                      {item?.roleGrpName}
                    </Text>
                    <Text
                      variant='body-1'
                      className={twMerge('w-[80%] truncate rounded-md px-[2px] py-[2px] text-[0.72vw] font-medium border-2', borderColor)}
                      needTooltip={true}
                      tooltipProps={{ title:item?.roleName, placement:'top-start' }}
                    >
                      {item?.roleName}
                    </Text>
                  </button>
                ))
          )}
        </div>

        <div className='flex h-[80px] flex-col items-center justify-center gap-[15px]'>
          <button
            onClick={handleNavigationClick}
            style={{
              backgroundColor: brandColor,
              color: isLightColor(brandColor)
            }}
            className='flex w-[200px] items-center justify-between rounded-md px-[10px] py-[10px] text-white outline-none'
            disabled={!Object.keys(selectedCombination).length}
          >
            {loading ? (
              <span className='flex w-full items-center justify-center'>
                <Spin className='flex w-full justify-center' spinning color='success' style='dots' />
              </span>
            ) : (
              <span className='flex w-[200px] items-center justify-between rounded-md outline-none'>
                Let&apos;s Go
                <ArrowForward fill={isLightColor(brandColor)} />
              </span>
            )}
          </button>
          {tp_ps && (
            <button
              onClick={() => router.push(landingScreen)}
              className='flex items-center gap-[10px] outline-none'
            >
              <ArrowBackward fill={isDark ? "white" : "black"} /> Back to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContextSelector
