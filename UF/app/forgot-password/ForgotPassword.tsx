'use client'
import React, { useState } from 'react'
import { ArrowBackward, TorusLogo } from '../utils/svgApplications'
import Link from 'next/link'
import { isLightColor } from '../components/utils'
import OtpVerification from './OtpVerification'
import { AxiosService } from '../components/axiosService'
import { useInfoMsg } from '../components/infoMsgHandler'
import { Text } from '@/components/Text'
import { useTheme } from '@/hooks/useTheme'
import { useGlobal } from '@/context/GlobalContext'
import { getCdnImage } from '../utils/getAssets'
import { getFontSizeForHeader } from '../utils/branding'
import { Dropdown } from '@/components/Dropdown'
import i18n from '../components/i18n'

interface Props {
  logo: string
  appName: string
  appTenantList?: any[]
}

const ForgotPassword = ({ logo, appName, appTenantList }: Props) => {
  const [formData, setFormData] = useState<Record<string, string>>({
    email: ''
  })
  const toast = useInfoMsg()
  const [isOtpReceive, setIsOtpReceive] = useState(false)
  const { isDark } = useTheme()
  const { branding } = useGlobal()
  const { brandColor } = branding
  const isSaasApp = process.env.NEXT_PUBLIC_IS_SAAS_APPLICATION
  const [selectedAppTenant , setSelectedAppTenant] = useState('')
  const keyset: any = i18n.keyset('language')

  const handleGetOtp = async () => {
    try {
      const res = await AxiosService.get(`UF/getResetPasswordOtp`, {
        params: {
          email: formData.email,
          tenantId: selectedAppTenant ? appTenantList?.find(item => item.tenant_name == selectedAppTenant)?.at_id : undefined
        }
      })
      if (res.status === 200) {
        setIsOtpReceive(true)
      }
    } catch (error: any) {
      toast(error?.response?.data?.message, 'danger')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className={`g-root flex h-screen w-screen flex-col`}>
      <div className='flex h-[200px] w-full items-center justify-center text-3xl font-semibold'>
        {logo ? (
          <img
            className='h-[50px] w-[50px] object-cover'
            width={100}
            height={100}
            src={getCdnImage(logo)}
            alt='logo'
          />
        ) : (
          <TorusLogo height='50px' width='50px' />
        )}
        {appName}
      </div>
      {isOtpReceive ? (
        <div>
          <OtpVerification
            email={formData.email}
            setIsOtpReceive={setIsOtpReceive}
            selectedAppTenant={selectedAppTenant}
            appTenantList={appTenantList}
          />
        </div>
      ) : (
        <div className='flex h-[550px] w-full flex-col items-center justify-center gap-[20px]'>
          <div className='flex w-full flex-col items-center justify-center gap-[2px]'>
            <Text variant={getFontSizeForHeader(branding.fontSize)} className='font-semibold'>Forgot Password?</Text>
            <Text color='secondary'>
              No worries, we&apos;ll send you instructions
            </Text>
          </div>
          <>
            {isSaasApp == 'true' && (
              <div className='flex flex-col gap-2 w-[300px]'>
                <Dropdown
                  staticProps={appTenantList?.map(
                    (item: any) => item?.tenant_name
                  )}
                  value={selectedAppTenant}
                  onChange={val => setSelectedAppTenant(val as string)}
                  placeholder={keyset('Select Tenant')}
                  hasClear
                  static
                />
              </div>
            )}
            <label className='flex w-[300px] flex-col gap-[10px] text-[15px]'>
              Email
              <input
                type='text'
                name='email'
                className='rounded-full border px-[0.83vw] py-[2vh] text-[15px] font-medium outline-none'
                placeholder='Enter your email'
                onChange={handleInputChange}
                //   onKeyDown={e => {
                //     if (e.key === 'Enter') {
                //       handleFormSubmit()
                //     }
                //   }}
              />
            </label>
            <button
              style={{
                backgroundColor: brandColor,
                color: isLightColor(brandColor)
              }}
              className='w-[300px] rounded-full px-[0.83vw] py-[2vh] text-[15px] font-medium'
              onClick={() => handleGetOtp()}
              disabled={!formData.email}
            >
              Get Code
            </button>
            <Link
              href='/'
              className='flex items-center gap-[10px] text-[15px] font-medium opacity-50'
            >
              <ArrowBackward
                fill={isDark ? '#ffffff' : '#000000'}
              />{' '}
              Back to Login
            </Link>
          </>
        </div>
      )}
    </div>
  )
}

export default ForgotPassword
