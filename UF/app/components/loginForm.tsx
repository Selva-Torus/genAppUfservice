
'use client'
import React, { useContext, useMemo, useState } from 'react'
import { Logo } from '../components/Logo'
import { isLightColor } from '../components/utils'
import axios from 'axios'
import { api_screenRouteDto, api_signinDto } from '../interfaces/interfaces'
import { useInfoMsg } from '../components/infoMsgHandler'
import { setCookie } from '../components/cookieMgment'
import { useRouter } from 'next/navigation'
import { Button, Icon, Spin, Text } from '@gravity-ui/uikit'
import { DefaultLoginImage, GitHubIcon, GoogleIcon } from '../utils/svgApplications'
import { BsEyeFill, BsEyeSlash } from 'react-icons/bs'
import Link from 'next/link'
import { TotalContext, TotalContextProps } from '../globalContext'
import { singleSignOn } from '../utils/serverUtils'
import decodeToken from './decodeToken'
import {Shield} from '@gravity-ui/icons';
interface LoginProps {
  logo?: string
  appName?: string
  brandColor?: string
  loginType?: 'standard' | 'rightAligned' | 'leftAligned'
  image?: string
}

const Login = ({ logo, appName = "oprmatrix", brandColor = "#adffaf", loginType = "standard", image }: LoginProps) => {
  const { selectedTheme, setSelectedTheme } = useContext(
    TotalContext
  ) as TotalContextProps
  const [formData, setFormData] = useState<Record<string, string>>({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const baseUrl: any = process.env.NEXT_PUBLIC_API_BASE_URL
  const toast = useInfoMsg()
  const router = useRouter()
  const onBoardingKey:string = "User Screen"
  const tenant = process.env.NEXT_PUBLIC_TENANT_CODE
  const [imageandLogoValid, setImageandLogoValid] = useState({
    image: image ? true : false,
    logo: logo ? true : false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async () => {
    try {
      if (tenant && formData.email && formData.password) {
        setLoading(true)

        setCookie('cfg_theme','dark')
        setSelectedTheme('dark')
        
        const api_signinBody: api_signinDto = {
          client: tenant,
          username: formData.email,
          password: formData.password,
          key: "CK:TGA:FNGK:BLDC:FNK:DEV:CATK:CT003:AFGK:AG001:AFK:oprmatrix:AFVK:v1:bldc",
          ufClientType: 'UFW'
        }
        const api_signin = await axios.post(
          `${baseUrl}/UF/signin`,
          api_signinBody,
          {
            validateStatus: () => true
          }
        )

        if (api_signin.status == 201) {
          if (
            api_signin?.data?.token == null ||
            api_signin?.data?.token == undefined ||
            api_signin?.data?.authorized == null ||
            api_signin?.data?.authorized == undefined ||
            api_signin?.data?.email == null ||
            api_signin?.data?.email == undefined
          ) {
            toast('Invalid credentials', 'danger')
            setLoading(false)
            return
          }
          setCookie('token', api_signin.data.token)
          setCookie('tenant', tenant)
          document.cookie = `language=${'en'}`
          let screenDetails: any = {
            keys:[
  {
    "screensName": "testroute-v1",
    "ufKey": "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:oprmatrixUF:AFVK:v1"
  }
]
          }
          const ORM: any = decodeToken(api_signin.data.token)
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
          screenDetails = screenDetails.keys
          let defaultScreen = ''
          if (onBoardingKey === 'User Screen') {
            defaultScreen = 'user'
          } else if (onBoardingKey === 'Logs Screen') {
            defaultScreen = 'logs'
          } else {
            screenDetails.forEach((screen: any) => {
              if (onBoardingKey === screen.ufKey) {
                defaultScreen = screen.screensName
              }
            })
            defaultScreen =
              defaultScreen.split('-')[0] +
              '_' +
              defaultScreen.split('-').at(-1)
          }
          document.cookie = `currentPage=${JSON.stringify(defaultScreen)}`
          if (api_signin?.data?.redirectToORPSelector) {
            router.push('/select-context')
          } else {
            router.push('/' + defaultScreen)
          }
        } else {
          toast(
            api_signin.data.message || 'Error occured during login',
            'danger'
          )
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    } catch (error: any) {
      console.log(error)

      toast(error?.response?.data?.errorDetails, 'danger')
      if (error?.response) {
        setLoading(false)
      } else {
        setLoading(false)
      }
    }
  }

  return (
    <div
      className={'flex h-screen w-screen overflow-y-auto'}
      style={{
        flexDirection: loginType == 'leftAligned' ? 'row-reverse' : 'row'
      }}
    >
      {loginType !== 'standard' && (
        <div className='hidden md:flex h-full w-1/2 flex-col items-center justify-center'>
          {imageandLogoValid.image ? (
            <img
              className='h-full w-full'
              src={image}
              alt='login'
              onError={() =>
                setImageandLogoValid({ ...imageandLogoValid, image: false })
              }
            />
          ) : (
            <DefaultLoginImage />
          )}
        </div>
      )}

      <div
        style={{
          background: `linear-gradient(to bottom, ${brandColor}, #ffffff)`
        }}
        className={`flex justify-center p-5 h-full overflow-y-auto ${
          loginType !== 'standard' ? 'w-full md:w-1/2' : 'w-full'
        }`}
      >
        <div className='flex h-full flex-col items-center justify-center gap-[5.24vh]'>
          <div className='flex flex-col items-center gap-[1.24vh]'>
            {imageandLogoValid.logo ? (
              <img
                className='h-[16px] w-[20px]'
                width={100}
                height={100}
                src={logo}
                alt='logo'
                onError={() =>
                  setImageandLogoValid({ ...imageandLogoValid, logo: false })
                }
              />
            ) : (
              <Logo />
            )}
            <Text variant='header-2' color='brand'>
              {appName}
            </Text>
            <Text variant='body-1'>
              Create an account or log in to explore about our app
            </Text>
          </div>
          <div
            className={`flex h-fit min-w-[400px] flex-col gap-5 rounded-lg bg-white px-5`}
          >
            <Text variant='header-2' className='py-2'>
              Login
            </Text>
            <div className='flex flex-col gap-2'>
              <Text variant='body-2' color='secondary'>
                Email Address
              </Text>
              <input
                type='text'
                name='email'
                className='rounded-full bg-[#F4F5FA] p-3 outline-none'
                placeholder='Enter your email'
                onChange={handleInputChange}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleFormSubmit()
                  }
                }}
              />
            </div>
            <div className='flex flex-col gap-2 relative'>
              <Text variant='body-2' color='secondary'>
                Password
              </Text>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                className='rounded-full bg-[#F4F5FA] p-3 outline-none'
                placeholder='Enter your password'
                onChange={handleInputChange}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleFormSubmit()
                  }
                }}
              />
              <button
                type='button'
                onClick={() => setShowPassword(prev => !prev)}
                className='absolute bottom-3 right-4 focus:outline-none'
              >
                {showPassword ? (
                  <BsEyeFill className='h-[17px] w-[17px]' />
                ) : (
                  <BsEyeSlash className='h-[17px] w-[17px]' />
                )}
              </button>
            </div>
            <Link href='/forgot-password' className='text-black/50'>
              Forgot Password
            </Link>
            <Button
              onClick={handleFormSubmit}
              size='xl'              
            >
              {loading ? <Spin size='s' style={{marginTop : "10px"}}/> : 'Login'}
            </Button>

            {process.env.NEXT_PUBLIC_NEXT_AUTH_NEEDED === 'true' && (
              <div className='flex w-full'>
                <Button
                  onClick={() => singleSignOn('fusionauth')}
                  width='max'
                  size='l'
                  view='raised'
                >
                <Icon data={Shield} />
                  ViaFusionAuth
                </Button>
              </div>
            )}

            <div className='flex justify-center'>
              <Text>
                Don&apos;t have an account?{' '}
                <a
                href="https://outlook.office.com/mail/deeplink/compose?to=support@torus.tech"
                target="_blank"
                rel="noopener noreferrer"
                >
                <Text color='brand'
                >
                  Contact Admin
                </Text>
                </a>
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
