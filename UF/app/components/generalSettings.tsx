import React, { useContext, useEffect, useState } from 'react'
import {
  DarkHCTheme,
  DarkTheme,
  LightHCTheme,
  LightTheme
} from './svgApplication'
import { fetchAMDKey } from '../utils/fetchAMDKey.api'
import { getCookie, setCookie } from './cookieMgment'
import { Select } from '@gravity-ui/uikit'
import { getLanguagesJson } from '../utils/getLanguagesJson.api'
import { TotalContext, TotalContextProps } from '../globalContext'

const GeneralSettings = () => {
  const [languageOptions, setLanguageOptions] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState([
    getCookie('cfg_lang')
  ])
  const [selectedTheme, setSelectedTheme] = useState(getCookie('cfg_theme'))
  const token = getCookie('token')
  const { property, setProperty } = useContext(
    TotalContext
  ) as TotalContextProps
  let brandcolor: string = property?.brandColor ?? '#0736c4'

  const themeOptions = [
    {
      label: 'Light',
      icon: <LightTheme />,
      code: 'light'
    },
    {
      label: 'Dark',
      icon: <DarkTheme />,
      code: 'dark'
    },
    {
      label: 'Light with High Contrast',
      icon: <LightHCTheme />,
      code: 'light-hc'
    },
    {
      label: 'Dark with High Contrast',
      icon: <DarkHCTheme />,
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
    console.log(languageJson)
  }

  const handleThemeChange = (value: any) => {
    setSelectedTheme(value)
    setCookie('cfg_theme', value)
  }

  return (
    <div className='h-full w-full'>
      <div className='flex w-full items-center justify-between'>
        <div className='flex flex-col gap-[1vh]'>
          <h1
            style={{
              color: '#000000',
              fontSize: `1.25vw`
            }}
            className=' font-semibold leading-[1.04vw]'
          >
            {'General'}
          </h1>
          <p
            style={{
              color: '#000000',
              opacity: '0.5',
              fontSize: `0.83vw`
            }}
          >
            {' '}
            Manage appearance, language, and basic preferences.
          </p>
        </div>
      </div>
      {/* Divider Line */}
      <hr className='my-[1vh] w-full border-[#D8DBDF]' />
      {/* Theme Selection */}
      <div className='flex flex-col gap-[2.49vh]'>
        <div className='flex flex-col gap-[0.62vh]'>
          <h1
            className='font-semibold leading-[1.85vh]'
            style={{
              color: '#000000',
              fontSize: `0.72vw`
            }}
          >
            {'Interface Theme'}
          </h1>
          <p
            className='leading-[1.85vh]'
            style={{
              color: '#000000',
              fontSize: '0.72vw',
              opacity: '0.5'
            }}
          >
            {'Select the Theme of the application'}.
          </p>
        </div>
        <div className='flex gap-[1.17vw]'>
          {themeOptions.map(val => (
            <div
              key={val.label}
              className='flex flex-col gap-[2.25vh] text-center cursor-pointer '
              onClick={() => handleThemeChange(val.code)}
            >
              <div
                key={val.code}
                className={`rounded-md rounded-tl-xl outline-none relative`}
                style={{
                  border:
                    selectedTheme == val.code
                      ? `4px solid ${brandcolor}`
                      : 'none'
                }}
              >
                {val.icon}
              <div className='absolute right-4 bottom-3'>
                {selectedTheme === val.code && (
                  <input
                    type='checkbox'
                    readOnly
                    checked={true}
                    className='transition-color fade-in h-[0.8vw] w-[0.8vw] cursor-pointer rounded-lg outline-none duration-700'
                    style={{
                      backgroundColor: `#000000`,
                      color: `${brandcolor}`,
                      borderColor: `${brandcolor}`,
                      accentColor: `${brandcolor}`
                    }}
                  />
                )}
              </div>
              </div>
              <span
                className='flex items-center justify-center font-medium leading-[1.85vh]'
                style={{
                  color: '#000000',
                  fontSize: '0.72vw'
                }}
              >
                {val.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Divider Line */}
      <hr className='my-[1vh] w-full border-[#D8DBDF]' />
      {/* Language Selection */}
      <div className='flex items-center'>
        <div className='flex w-[20vw] flex-col gap-[0.62vh]'>
          <h1
            className='font-semibold leading-[1.85vh] '
            style={{
              color: '#000000',
              fontSize: '0.72vw'
            }}
          >
            {'Language'}
          </h1>
          <p
            className='leading-[1.85vh]'
            style={{
              color: '#000000',
              fontSize: `0.72vw`,
              opacity: '0.5'
            }}
          >
            {'Select the language of the application'}.
          </p>
        </div>
        <div className='w-[10vw]'>
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
      <hr className='my-[1vh] w-full border-[#D8DBDF]' />
    </div>
  )
}

export default GeneralSettings
