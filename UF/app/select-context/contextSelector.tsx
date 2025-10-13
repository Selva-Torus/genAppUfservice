'use client'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Select, Spin } from '@gravity-ui/uikit'
import { SearchIcon } from '../components/svgApplication'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import axios from 'axios'
import { getCookie, setCookie } from '../components/cookieMgment'
import { ArrowBackward, ArrowForward, StarIcon } from '../utils/svgApplications'
import { useRouter } from 'next/navigation'
import decodeToken from '../components/decodeToken'
import { capitalize } from 'lodash'
import { TotalContext, TotalContextProps } from '../globalContext'
import { isLightColor } from '../components/utils'

const ContextSelector = () => {
  const [selectedAccessProfile, setSelectedAccessProfile] = useState<string[]>(
    []
  )
  const { property } = useContext(TotalContext) as TotalContextProps
  let brandColor: string = property?.brandColor ?? '#0736c4'
  const token: string = getCookie('token')
  const tp_ps: any = getCookie('tp_ps')
  const decodedTokenObj: any = decodeToken(token)
  const user = decodedTokenObj?.loginId
  const toast = useInfoMsg()
  const baseUrl: any = process.env.NEXT_PUBLIC_API_BASE_URL
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [accessProfiles, setAccessProfiles] = useState<any[]>([])
  const [selectedPsCode, setSelectedPsCode] = useState('')
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState('')
    let landingScreen:string = 'Logs Screen';
       let screenDetails: any = {
           keys:[
  {
    "screensName": "test-v1",
    "ufKey": "CK:TT407:FNGK:AF:FNK:UF-UFW:CATK:CGFA:AFGK:TG4CGFA:AFK:forPFCheckUF:AFVK:v1"
  }
]
        }
        screenDetails = screenDetails.keys
        
  if (landingScreen === 'User Screen') {
    landingScreen = 'user'
  }
  else if (landingScreen === 'Logs Screen') {
    landingScreen = 'logs'
  }
   else{
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
      setSelectedPsCode(JSON.parse(atob(tp_ps))?.psCode ?? '')
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
    setSelectedPsCode(item.psCode)
  }

  const handleNavigationClick = async () => {
    setLoading(true)
    try {
      const res = await axios.post(
        `${baseUrl}/UF/getAccessToken`,
        {
          psCode: selectedPsCode,
          selectedAccessProfile: selectedAccessProfile[0],
          dap : accessProfiles.find((item) => item.accessProfile === selectedAccessProfile[0])?.dap ?? undefined,
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
            JSON.stringify({ psCode: selectedPsCode, selectedAccessProfile })
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

  return (
    <div className='h-[100vh] w-full bg-[#F7F7F7]'>
      <div className='flex h-[100%] flex-col items-center justify-center gap-[15px]'>
        <h1 className='text-[1.5vw] font-bold'>Welcome {capitalize(user)}</h1>
        <div className='flex items-center gap-[5px] text-[0.83vw] text-black/50'>
          <span>{dateString}</span>
          <hr className='h-[25px] border' />
          <span>{time}</span>
        </div>
        <h5 className='text-[0.83vw] font-medium text-black'>
          Select from the profiles to proceed
        </h5>
        <div className='flex w-full justify-center gap-[.5vw]'>
          <div className='relative h-[37px] items-center'>
            <span className='absolute inset-y-0 left-0 flex p-[10px]'>
              <SearchIcon fill={'#000000'} height='15px' width='15px' />
            </span>
            <input
              autoFocus
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder='Search'
              onFocus={e => (e.target.style.borderColor = brandColor)}
              onBlur={e => (e.target.style.borderColor = '#00000026')}
              disabled={!selectedAccessProfile[0]}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#000000',
                fontSize: `0.72vw`,
                borderColor: '#00000026'
              }}
              className={`h-[37px] w-[20vw] rounded-md border pl-[30px] font-medium focus:outline-none`}
            />
          </div>
          <div className='w-[10vw]'>
            <Select
              value={selectedAccessProfile}
              onUpdate={data => {
                setSelectedAccessProfile(data)
                setSelectedPsCode('')
              }}
              width={'max'}
              size='l'
              placeholder='Select Access Profile'
              className='w-full'
            >
              {accessProfiles.map((item, index) => (
                <Select.Option key={index} value={item.accessProfile}>
                  {item.accessProfile}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        <div
          className={`flex w-full h-[300px] overflow-y-auto items-center justify-center gap-[10px] ${accessProfiles.map((item: any) => (item.combinations.length > 5 ? 'flex flex-wrap' : ''))}`}
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
                      border:
                        item.psCode === selectedPsCode
                          ? `2px solid ${brandColor}`
                          : ''
                    }}
                    className={`flex h-[215px] w-[240px] flex-col gap-[10px] rounded-md bg-white pl-[10px] pt-[10px] text-start text-white outline-none`}
                    onClick={() => handleCardClick(item)}
                  >
                    <div className='flex w-full items-center justify-between'>
                      <h1 className='text-[15px] font-semibold text-black'>
                        {item.orgGrpName}
                      </h1>
                      <span className='pr-[10px] outline-none'>
                        <StarIcon
                          fill={item.psCode === selectedPsCode ? '#F9D544' : ''}
                          stroke={
                            item.psCode === selectedPsCode ? '' : '#B6BAC3'
                          }
                        />
                      </span>
                    </div>
                    <h1 className='w-[80%] truncate rounded-md bg-[#F7F8F8] px-[2px] py-[5px] text-[0.72vw] font-medium text-black/50'>
                      {item.orgName}
                    </h1>
                    <h1 className='text-[15px] font-semibold text-black'>
                      {item.roleGrpName}
                    </h1>
                    <h1 className='w-[80%] truncate rounded-md bg-[#F7F8F8] px-[2px] py-[5px] text-[0.72vw] font-medium text-black/50'>
                      {item.roleName}
                    </h1>
                    <h1 className='text-[15px] font-semibold text-black'>
                      {item.psGrpName}
                    </h1>
                    <h1 className='w-[80%] truncate rounded-md bg-[#F7F8F8] px-[2px] py-[5px] text-[0.72vw] font-medium text-black/50'>
                      {item.psName}
                    </h1>
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
            disabled={!selectedPsCode}
          >
            {loading ? (
              <span className='flex w-full items-center justify-center'>
                <Spin size='s' />
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
              <ArrowBackward /> Back to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContextSelector
