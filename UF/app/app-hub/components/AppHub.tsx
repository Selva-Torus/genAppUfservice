'use client'
import React, { useContext, useEffect, useState } from 'react'
import TopNav from '@/app/components/Layout/TopNav'
import { TotalContext, TotalContextProps } from '@/app/globalContext'
import { useGlobal } from '@/context/GlobalContext'
import { twMerge } from 'tailwind-merge'
import { useTheme } from '@/hooks/useTheme'
import { getCdnImage } from '@/app/utils/getAssets'
import { getCookie } from '@/app/components/cookieMgment'
import { AxiosService } from '@/app/components/axiosService'
import { useInfoMsg } from '@/app/components/infoMsgHandler'
import { Button } from '@/components/Button'
import { Dropdown } from '@/components/Dropdown'
import { SearchIcon } from '@/app/components/svgApplication'

type VersionInfo = {
  version: string
  accessUrl: string
}

type Application = {
  code: string
  name: string
  logo?: string
  versionInfo?: VersionInfo[]
}

const AppHub = ({ appList }: { appList: Application[] }) => {
  const { userDetails, setUserDetails } = useContext(
    TotalContext
  ) as TotalContextProps
  const { branding } = useGlobal()
  const { brandColor } = branding
  const { borderColor, isDark } = useTheme()
  const token = getCookie('token')
  const toast: Function = useInfoMsg()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<VersionInfo | null>(
    null
  )

  const userDetailsData = async () => {
    try {
      let myAccount = await AxiosService.get('/UF/myAccount-for-client', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          key: 'Logs Screen'
        }
      })
      setUserDetails(myAccount?.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    userDetailsData()
  }, [])

  return (
    <div
      className='h-full w-full bg-cover bg-center'
      style={{ backgroundImage: 'var(--app-bg-image)' }}
    >
      {/* Top Navigation */}
      <TopNav
        appName='Application Hub'
        navData={[]}
        userDetails={userDetails}
        brandColor={brandColor}
        mode='closed'
        listMenuItems={false}
      />
      <hr className={twMerge('w-full border', borderColor)} />
      {/* Header Controls */}
      <div className='flex items-center justify-between px-6 py-4'>
        <div
          className={twMerge(
            'flex w-96 items-center gap-[.5vw] rounded-lg border px-3 py-1',
            borderColor
          )}
        >
          <span>
            <SearchIcon
              fill={isDark ? 'white' : 'black'}
              height='0.83vw'
              width='0.83vw'
            />
          </span>
          <input
            type='text'
            placeholder='Search'
            className='w-full outline-none'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className='flex items-center'>
          <div
            title={selectedVersion?.version ?? 'Select Version'}
            className='w-[10vw]'
          >
            <Dropdown
              placeholder='Select Version'
              disabled={!selectedApp?.versionInfo?.length}
              className='rounded-md outline-none disabled:opacity-50'
              static
              staticProps={selectedApp?.versionInfo?.map(v => v.version) ?? []}
              value={selectedVersion?.version ?? ''}
              onChange={val => {
                const version = selectedApp?.versionInfo?.find(
                  v => v.version === val
                )
                setSelectedVersion(version ?? null)
              }}
            />
          </div>

          {/* <select
            className='rounded-md border px-4 py-3 outline-none disabled:opacity-50'
            style={{ fontSize: branding.fontSize }}
            disabled={!selectedApp?.versionInfo?.length}
            value={selectedVersion?.version ?? ''}
            onChange={e => {
              const version = selectedApp?.versionInfo?.find(
                v => v.version === e.target.value
              )
              setSelectedVersion(version ?? null)
            }}
          >
            <option value=''>Select Version</option>
            {selectedApp?.versionInfo?.map(v => (
              <option key={v.version} value={v.version}>
                {v.version}
              </option>
            ))}
          </select> */}

          <Button
            className='rounded-md px-4 py-2 disabled:opacity-50'
            disabled={!selectedVersion}
            onClick={() => {
              if (selectedVersion?.accessUrl) {
                const origin = window.location.href

                const url = new URL(
                  `${selectedVersion.accessUrl}/next-api/auth-redirect`
                )
                url.searchParams.set('origin', origin)
                url.searchParams.set('token', token)

                window.open(url.toString(), '_self')
              } else {
                toast('Access URL not found for the selected version', 'danger')
              }
            }}
          >
            Next →
          </Button>
        </div>
      </div>

      {/* App Group */}
      <div className='px-6'>
        {/* App Grid */}
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6'>
          {appList
            .filter(a =>
              a.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(app => {
              const isSelected = selectedApp?.code === app.code

              return (
                <div
                  key={app.code}
                  onClick={() => {
                    setSelectedApp(app)
                    if (app.versionInfo && app.versionInfo.length) {
                      setSelectedVersion(app.versionInfo[0])
                    } else {
                      setSelectedVersion(null)
                    }
                  }}
                  className={twMerge(
                    'cursor-pointer rounded-xl border p-4 transition-all hover:bg-[var(--hover-color)]',
                    isSelected ? 'bg-[var(--selection-color)]' : 'bg-unset'
                  )}
                >
                  <div className='mb-3 flex h-10 w-12 items-center justify-center rounded-md bg-gray-100'>
                    {app.logo ? (
                      <img
                        src={getCdnImage(app.logo)}
                        alt={app.name}
                        className='h-6 w-6 object-contain'
                      />
                    ) : (
                      <span
                        style={{ fontSize: branding.fontSize }}
                        className='font-bold'
                      >
                        APP
                      </span>
                    )}
                  </div>

                  <p
                    style={{ fontSize: branding.fontSize }}
                    className='font-medium'
                  >
                    {app.name}
                  </p>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default AppHub
