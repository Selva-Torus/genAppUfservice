'use client'
import Link from 'next/link'
import React, { useRef, useState } from 'react'
import { ArrowBackward } from '../utils/svgApplications'
import { isLightColor } from '../components/utils'
import { useGravityThemeClass } from '../utils/useGravityUITheme'
import { AxiosService } from '../components/axiosService'
import { useInfoMsg } from '../components/infoMsgHandler'
import { BsEyeFill, BsEyeSlash } from 'react-icons/bs'
import { useRouter } from 'next/navigation'

interface Props {
  email: string
  brandColor?: string
  setIsOtpReceive: React.Dispatch<React.SetStateAction<boolean>>
}

const OtpVerification = ({
  email,
  brandColor = '#76C432',
  setIsOtpReceive
}: Props) => {
  const themeClass = useGravityThemeClass()
  const router = useRouter()
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const toast = useInfoMsg()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({
    password: '',
    confirmPassword: ''
  })
  const [validation, setvalidation] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false
  })

  const handleVerifyOtp = async () => {
    try {
      const res = await AxiosService.get(`UF/verifyOtp`, {
        params: {
          email: email,
          otp: otp.join('')
        }
      })
      if (res.status === 200) {
        setIsOtpVerified(true)
      }
    } catch (error: any) {
      toast(error?.response?.data?.message, 'danger')
    }
  }

  const handleGetOtp = async () => {
    try {
      const res = await AxiosService.get(`UF/getResetPasswordOtp`, {
        params: {
          email: email
        }
      })
      if (res.status === 200) {
        return res.data
      }
    } catch (error: any) {
      toast(error?.response?.data?.message, 'danger')
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newOtp = [...otp]
    newOtp[index] = e.target.value
    setOtp(newOtp)
    if (e.target.value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: any) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    if (pastedData.length === otp.length) {
      setOtp(pastedData.split('')) // Set OTP directly if the pasted data is valid
    }
    if (pastedData.length > otp.length) {
      setOtp(pastedData.slice(0, otp.length).split(''))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name == 'password') {
      setvalidation(true)
      if (value.length == 0) {
        setvalidation(false)
      }
      setPasswordErrors({
        length: value.length >= 8,
        lowercase: /[a-z]/.test(value),
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value)
      })
    }
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async () => {
    if (formData.password != formData.confirmPassword) {
      toast('Password does not match', 'danger')
      return
    }
    try {
      const res = await AxiosService.patch(`UF/resetPassword`, {
        email: email,
        password: formData.password
      })
      if (res.status == 200) {
        toast(res.data.message, 'success')
        setIsOtpVerified(false)
        setIsOtpReceive(false)
        router.push('/')
      }
    } catch (error: any) {
      toast(error?.response?.data?.message, 'danger')
    }
  }

  return (
    <>
      {isOtpVerified ? (
        <>
          <div className='flex h-[100px] w-full flex-col items-center justify-center gap-[2px]'>
            <h1 className='text-3xl font-semibold'>Set New Password</h1>
            <p className='w-[300px] text-wrap text-center text-[12px] opacity-50'>
              Your new password must be different from previous used passwords
            </p>
          </div>
          <div
            className={`flex ${validation ? 'h-[410px] gap-[5px]' : 'h-[350px] gap-[20px]'} w-full flex-col items-center justify-center`}
          >
            <label className='flex w-[300px] flex-col gap-[5px] text-[15px]'>
              Password
              <span
                style={{
                  backgroundColor: 'var(--g-color-base-float)',
                  color: 'var(--g-color-text-primary)',
                  borderColor: 'var(--g-color-line-generic)'
                }}
                className='flex w-full justify-between rounded-full border px-[15px] py-[20px] text-[15px] font-medium outline-none'
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  className='text-[15px] font-medium outline-none'
                  placeholder='Enter password'
                  style={{
                    backgroundColor: 'var(--g-color-base-float)',
                    color: 'var(--g-color-text-primary)',
                    borderColor: 'var(--g-color-line-generic)'
                  }}
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
                  className='text-[0.7vw] focus:outline-none'
                >
                  {showPassword ? (
                    <BsEyeFill className='h-[17px] w-[17px]' />
                  ) : (
                    <BsEyeSlash className='h-[17px] w-[17px]' />
                  )}
                </button>
              </span>
            </label>

            {Object.values(passwordErrors).includes(true) && (
              <div className='mb-[10px] flex  gap-[0.87vw]'>
                <div
                  style={{
                    backgroundColor: `${Object.values(passwordErrors).includes(true) ? brandColor : 'var(--g-color-base-float)'}`
                  }}
                  className={`bottom-0 left-0 mt-[0.87vw] h-1 w-[5vw] rounded-sm py-1`}
                />
                <div
                  style={{
                    backgroundColor: `${Object.values(passwordErrors).filter(val => val == true).length >= 2 ? brandColor : 'var(--g-color-base-float)'}`
                  }}
                  className={`bottom-0 left-0 mt-[0.87vw] h-1 w-[5vw] rounded-sm py-1`}
                />
                <div
                  style={{
                    backgroundColor: `${Object.values(passwordErrors).filter(val => val == true).length >= 4 ? brandColor : 'var(--g-color-base-float)'}`
                  }}
                  className={`bottom-0 left-0 mt-[0.87vw] h-1 w-[5vw] rounded-sm py-1`}
                />
              </div>
            )}

            {validation && (
              <div className='flex flex-col gap-[5px] font-medium leading-[1.04vw]'>
                <div className='flex items-center gap-[0.29vw]'>
                  <input
                    type='checkbox'
                    style={{ accentColor: brandColor, color: brandColor }}
                    checked={passwordErrors.length}
                    readOnly
                    className='form-checkbox h-3 w-3 rounded'
                  />
                  <span className='text-[15px]'>
                    Must be at least 8 characters
                  </span>
                </div>

                <div className='flex items-center gap-1 font-medium'>
                  <input
                    type='checkbox'
                    style={{ accentColor: brandColor, color: brandColor }}
                    checked={passwordErrors.lowercase}
                    readOnly
                    className='form-checkbox h-3 w-3 rounded'
                  />
                  <span className='text-[15px]'>
                    Should contain lowercase letters (a-z)
                  </span>
                </div>

                <div className='flex items-center gap-[0.29vw]'>
                  <input
                    type='checkbox'
                    style={{ accentColor: brandColor, color: brandColor }}
                    checked={passwordErrors.uppercase}
                    readOnly
                    className='form-checkbox h-3 w-3 rounded'
                  />
                  <span className='text-[15px]'>
                    Should contain uppercase letters (A-Z)
                  </span>
                </div>

                <div className='flex items-center gap-[0.29vw]'>
                  <input
                    type='checkbox'
                    style={{ accentColor: brandColor, color: brandColor }}
                    checked={passwordErrors.number}
                    readOnly
                    className='form-checkbox h-3 w-3 rounded'
                  />
                  <span className='text-[15px]'>
                    Should contain numbers (i.e., 0-9)
                  </span>
                </div>
              </div>
            )}

            <label className='flex w-[300px] flex-col gap-[5px] text-[15px]'>
              Confirm Password
              <span
                style={{
                  backgroundColor: 'var(--g-color-base-float)',
                  color: 'var(--g-color-text-primary)',
                  borderColor: 'var(--g-color-line-generic)'
                }}
                className='flex w-full justify-between rounded-full border px-[15px] py-[20px] text-[15px] font-medium outline-none'
              >
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  className='text-[15px] font-medium outline-none'
                  placeholder='Enter password'
                  style={{
                    backgroundColor: 'var(--g-color-base-float)',
                    color: 'var(--g-color-text-primary)',
                    borderColor: 'var(--g-color-line-generic)'
                  }}
                  onChange={handleInputChange}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleFormSubmit()
                    }
                  }}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  className='text-[0.7vw] focus:outline-none'
                >
                  {showConfirmPassword ? (
                    <BsEyeFill className='h-[17px] w-[17px]' />
                  ) : (
                    <BsEyeSlash className='h-[17px] w-[17px]' />
                  )}
                </button>
              </span>
            </label>

            <button
              style={{
                backgroundColor: brandColor,
                color: isLightColor(brandColor)
              }}
              className='w-[300px] rounded-full px-[0.83vw] py-[2vh] text-[15px] font-medium'
              onClick={handleFormSubmit}
              disabled={!formData.password || !formData.confirmPassword}
            >
              Set Password
            </button>
            <Link
              href='/'
              className='flex items-center gap-[10px] text-[15px] font-medium opacity-50'
            >
              <ArrowBackward
                fill={themeClass.includes('dark') ? '#ffffff' : '#000000'}
              />{' '}
              Back to Login
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className='flex h-[200px] w-full flex-col items-center justify-center gap-[2px]'>
            <h1 className='text-3xl font-semibold'>Verification Code</h1>
            <p className='text-center text-[12px] opacity-50'>
              We&apos;ve sent a code to {email}
            </p>
          </div>
          <div className='flex h-[100px] w-full flex-col items-center justify-center gap-[20px]'>
            <label className='flex w-[300px] flex-col gap-[10px] text-[15px]'>
              code
              <div className='flex gap-[10px]'>
                {otp.map((_, index) => (
                  <input
                    key={index}
                    type='text'
                    maxLength={1}
                    value={otp[index]}
                    onPaste={handlePaste}
                    onChange={e => handleChange(e, index)}
                    onKeyDown={e => handleKeyDown(e, index)}
                    ref={el => (inputRefs.current[index] = el) as any}
                    style={{
                      backgroundColor: 'var(--g-color-base-float)',
                      color: 'var(--g-color-text-primary)',
                      borderColor: 'var(--g-color-line-generic)'
                    }}
                    className={`h-[40px] w-[40px] rounded-md border text-center text-lg focus:outline-none focus:ring-2`}
                  />
                ))}
              </div>
            </label>
            <button
              style={{
                backgroundColor: brandColor,
                color: isLightColor(brandColor)
              }}
              className='w-[300px] rounded-full px-[0.83vw] py-[2vh] text-[15px] font-medium'
              onClick={() => handleVerifyOtp()}
              disabled={otp.join('').length !== 6}
            >
              Verify
            </button>
            <span className='flex items-center gap-[5px]'>
              <h6 className='text-[15px] opacity-50'>
                Didn&apos;t get a code?
              </h6>
              <button
                onClick={handleGetOtp}
                className='text-[15px] font-semibold'
              >
                Click to resend
              </button>
            </span>
            <Link
              href='/'
              className='flex items-center gap-[10px] text-[15px] font-medium opacity-50'
            >
              <ArrowBackward
                fill={themeClass.includes('dark') ? '#ffffff' : '#000000'}
              />{' '}
              Back to Login
            </Link>
          </div>
        </>
      )}
    </>
  )
}

export default OtpVerification
