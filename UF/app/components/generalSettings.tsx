import React, { useContext, useEffect, useState } from 'react'
import {
  DarkHCTheme,
  DarkTheme,
  LightHCTheme,
  LightTheme
} from './svgApplication'
import { fetchAMDKey } from '../utils/fetchAMDKey.api'
import { getCookie, setCookie } from './cookieMgment'
import { Select, Text } from '@gravity-ui/uikit'
import { getLanguagesJson } from '../utils/getLanguagesJson.api'
import { TotalContext, TotalContextProps } from '../globalContext'
import { useGravityThemeClass } from '../utils/useGravityUITheme'

const GeneralSettings = () => {
  const [languageOptions, setLanguageOptions] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState([
    getCookie('cfg_lang')
  ])
  const token = getCookie('token')
  const { property, setProperty, selectedTheme, setSelectedTheme } = useContext(
    TotalContext
  ) as TotalContextProps
  let brandcolor: string = property?.brandColor ?? '#0736c4'
  const themeClass = useGravityThemeClass()

  const themeOptions = [
    {
      label: 'Light',
      icon: <LightTheme width='200px'/>,
      code: 'light'
    },
    {
      label: 'Dark',
      icon: <DarkTheme width='200px'/>,
      code: 'dark'
    },
    {
      label: 'Light with High Contrast',
      icon: <LightHCTheme width='200px'/>,
      code: 'light-hc'
    },
    {
      label: 'Dark with High Contrast',
      icon: <DarkHCTheme width='200px'/>,
      code: 'dark-hc'
    }
  ]

  const fetchLanguages = async () => {
    const key = `CK:TGA:FNGK:SETUP:FNK:SF:CATK:TENANT:AFGK:${process.env.NEXT_PUBLIC_TENANT_CODE}:AFK:PROFILE:AFVK:v1:tpc`
    const response = await fetchAMDKey(key, token, {})
    if (response.languages && Array.isArray(response['languages'])) {
      const updatedLangResponse = response['languages'].map(item => ({
        content: item.name,
        value: item.code
      }))
      setLanguageOptions(updatedLangResponse as any)
    }
  }

  useEffect(() => {
    fetchLanguages()
  }, [])

  const handleLanguageChange = async (value: any) => {
    setSelectedLanguage(value)
    setCookie('cfg_lang', value)
    const languageJson = await getLanguagesJson(value, token)
  }

  const handleThemeChange = (value: any) => {
    setSelectedTheme(value)
    setCookie('cfg_theme', value)
  }

  return (
    <div className={`g-root h-full w-full ${themeClass} overflow-auto`}>
      <div className='flex w-full items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <Text variant='header-1'>General</Text>
          <Text variant='body-2' color='secondary'>
            {' '}
            Manage appearance, language, and basic preferences.
          </Text>
        </div>
      </div>
      {/* Divider Line */}
      <hr
        className='my-2 w-full border'
        style={{ borderColor: 'var(--g-color-line-generic)' }}
      />
      {/* Theme Selection */}
      <div className='flex flex-col gap-[2.49vh]'>
        <div className='flex flex-col gap-[0.62vh]'>
          <Text variant='subheader-2'>{'Interface Theme'}</Text>
          <Text variant='body-2' color='secondary'>
            {'Select the Theme of the application'}.
          </Text>
        </div>
        <div className='flex gap-2 flex-wrap'>
          {themeOptions.map(val => (
            <div
              key={val.label}
              className='flex cursor-pointer flex-col gap-[2.25vh] text-center '
              onClick={() => handleThemeChange(val.code)}
            >
              <div
                key={val.code}
                className={`relative rounded-md rounded-tl-xl outline-none`}
                style={{
                  border:
                    selectedTheme == val.code
                      ? `4px solid ${brandcolor}`
                      : 'none'
                }}
              >
                {val.icon}
                <div className='absolute bottom-3 right-4'>
                  {selectedTheme === val.code && (
                    <input
                      type='checkbox'
                      readOnly
                      checked={true}
                      className='transition-color fade-in h-4 w-4 cursor-pointer rounded-lg outline-none duration-700'
                      style={{
                        color: `${brandcolor}`,
                        borderColor: `${brandcolor}`,
                        accentColor: `${brandcolor}`
                      }}
                    />
                  )}
                </div>
              </div>
              <Text variant='body-1' color='secondary'>
                {val.label}
              </Text>
            </div>
          ))}
        </div>
      </div>
      {/* Divider Line */}
      <hr
        className='my-2 w-full border'
        style={{ borderColor: 'var(--g-color-line-generic)' }}
      />
      {/* Language Selection */}
      <div className='flex items-center flex-wrap'>
        <div className='flex w-1/2 lg:w-1/3 flex-col'>
          <Text variant='subheader-2'>{'Language'}</Text>
          <Text variant='body-2' color='secondary' className='text-nowrap'>
            {'Select the language of the application'}.
          </Text>
        </div>
        <div className='w-[200px]'>
          <Select
            value={selectedLanguage}
            onUpdate={handleLanguageChange}
            options={languageOptions}
            width={'max'}
            placeholder='Select Language'
          />
        </div>
      </div>
      {/* Divider Line */}
      <hr
        className='my-2 w-full border'
        style={{ borderColor: 'var(--g-color-line-generic)' }}
      />
    </div>
  )
}

export default GeneralSettings
