
"use client"
import React, { useContext,useMemo, useState } from 'react'
import { Logo } from '../components/Logo'
import { isLightColor } from '../components/utils';
import axios from 'axios';
import { api_screenRouteDto, api_signinDto } from '../interfaces/interfaces';
import { useInfoMsg } from '../components/infoMsgHandler';
import { setCookie } from "../components/cookieMgment";
import { useRouter } from 'next/navigation';
import { Spin } from '@gravity-ui/uikit';
import { DefaultLoginImage } from '../utils/svgApplications';
import { BsEyeFill, BsEyeSlash } from 'react-icons/bs'
import Link from 'next/link';
import { TotalContext, TotalContextProps } from '../globalContext';
 
interface LoginProps {
    logo?: string;
    appName?: string;
    brandColor?: string;
    loginType?: "standard" | "rightAligned" | "leftAligned";
    image?: string;
}
 
const Login = ({ logo, appName = "TG2", brandColor = "#dce0ea", loginType = "standard", image }: LoginProps) => {
    const { selectedTheme, setSelectedTheme } = useContext(TotalContext) as TotalContextProps
    const [formData, setFormData] = useState<Record<string, string>>({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const baseUrl: any = process.env.NEXT_PUBLIC_API_BASE_URL;
    const toast = useInfoMsg()
    const router = useRouter()
    const onBoardingKey:string = "User Screen"
    const tenant = process.env.NEXT_PUBLIC_TENANT_CODE;
 
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
                    key: "CK:TGA:FNGK:BLDC:FNK:DEV:CATK:CT003:AFGK:CG:AFK:TG2:AFVK:v11:bldc"
                }
                const api_signin = await axios.post(`${baseUrl}/UF/signin`, api_signinBody)
                if (api_signin?.data?.error === true) {
                    toast(api_signin?.data?.errorDetails, 'danger')
                    return
                }
                if (api_signin.status == 201) {
                    if(api_signin?.data?.token == null || api_signin?.data?.token == undefined || api_signin?.data?.authorized == null || api_signin?.data?.authorized == undefined || api_signin?.data?.email == null || api_signin?.data?.email == undefined){
                        toast("Invalid credentials", 'danger')
                        setLoading(false)
                        return
                    }
                    setCookie('token', api_signin.data.token)
                    setCookie('tenant', tenant)
                    document.cookie = `language=${'en'}`;
                    let screenDetails: any = {
                        keys:[
  {
    "screensName": "formitem-v1",
    "ufKey": "CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:CG:AFGK:TG2:AFK:showProfile:AFVK:v1"
  }
]
                    }
                screenDetails = screenDetails.keys
                let defaultScreen =''
                if (onBoardingKey === 'User Screen') {
                    defaultScreen = 'user'
                }
                else if(onBoardingKey === 'Logs Screen') {
                    defaultScreen = 'logs'
                }
                else{
                    screenDetails.forEach((screen: any)   => {
                        if (onBoardingKey === screen.ufKey) {
                            defaultScreen = screen.screensName
                        }  
                    });
                    defaultScreen =defaultScreen.split('-')[0]+'_'+defaultScreen.split('-').at(-1)
                }
                document.cookie = `currentPage=${JSON.stringify(defaultScreen)}`
                if(api_signin?.data?.redirectToORPSelector){
                    router.push('/select-context')
                }else{
                    router.push('/' + defaultScreen)
                }
                } else {
                    setLoading(false)
                }
            } else {
                // setCheckDetails(true)
                setLoading(false)
            }
        } catch (error: any) {
            toast(error?.response?.data?.errorDetails, 'danger')
            if (error?.response) {
                setLoading(false)
            } else {
                setLoading(false)
            }
        }
    }
 
    return (
        <div className={'flex w-screen h-screen'} style={{flexDirection : loginType == "leftAligned" ?  "row-reverse" : "row"}}>
            {loginType !== "standard" &&
                <div className='flex flex-col w-1/2 h-full justify-center items-center'>
                    {image ? <img className='h-full w-full' src={image} alt='login' /> : <DefaultLoginImage />}
                </div>
            }
 
            <div
                style={{ background: `linear-gradient(to bottom, ${brandColor}, #ffffff)` }}
                className={`flex flex-col ${loginType !== "standard" ? "w-1/2 h-full" : "w-full h-full"}`}>
                <div className='flex flex-col gap-[5.24vh] h-[80vh] justify-center items-center'>
                    <div className='flex flex-col gap-[1.24vh] items-center'>
                        {logo ? (
                            <img
                                className='h-[1.1vw] w-[1.25vw]'
                                width={100}
                                height={100}
                                src={logo}
                                alt='logo'
                            />
                        ) : (
                            <Logo />
                        )}
                        <h3
                            className='text-center text-[1.5vw] font-bold'
                            style={{
                                color: isLightColor(brandColor)
                            }}
                        >
                            {appName}
                        </h3>
                        <p style={{ color: isLightColor(brandColor) }} className='text-[0.7vw]'>
                            Create an account or log in to explore about our app
                        </p>
                    </div>
                    <div className={`flex flex-col gap-[2.24vh] bg-white w-[20.98vw] px-[0.83vw] min-h-[40.68vh] rounded-lg`}>
                        <h1 className='font-bold text-[1.5vw] py-[2.24vh]'>
                            Login
                        </h1>
                        <label className='flex flex-col gap-[0.62vh] text-[0.83vw]'>
                            Email Address
                            <input
                                type="text"
                                name="email"
                                className='bg-[#F4F5FA] rounded-full py-[1.24vh] px-[0.83vw] outline-none'
                                placeholder='Enter your email'
                                onChange={handleInputChange}
                                onKeyDown={
                                    (e) => {
                                        if (e.key === 'Enter') {
                                            handleFormSubmit()
                                        }
                                    }
                                }
                            />
                        </label>
                        <label className='relative flex flex-col gap-[0.62vh] text-[0.83vw]'>
                            Password
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                className='bg-[#F4F5FA] rounded-full py-[1.24vh] px-[0.83vw] outline-none'
                                placeholder='Enter your password'
                                onChange={handleInputChange}
                                onKeyDown={
                                    (e) => {
                                        if (e.key === 'Enter') {
                                            handleFormSubmit()
                                        }
                                    }
                                }
                            />
                            <button
                            type='button'
                            onClick={() => setShowPassword(prev => !prev)}
                            className='absolute bottom-[1.2vh] right-[1vw] text-[0.7vw] text-[#666] focus:outline-none'
                            >
                            {showPassword ? (
                                <BsEyeFill className='h-[17px] w-[17px]' />
                            ) : (
                                <BsEyeSlash className='h-[17px] w-[17px]' />
                            )}
                            </button>
                        </label>
                        <Link href="/forgot-password" className='text-black/50'>
                            Forgot Password
                        </Link>
                        <button
                            onClick={handleFormSubmit}
                            style={{ background: brandColor, color: isLightColor(brandColor) }}
                            className='outline-none text-[0.72vw] font-medium rounded-full py-[1.24vh] px-[0.58vw]'
                        >
                            {loading ? <Spin size="s" /> : "Login"}
                        </button>
 
                        <div
                            className="flex justify-center text-[0.65vw]"
                        >
                            <p>
                                Don&apos;t have an account?{" "}
                                <a
                                    style={{ color: brandColor }}
                                    className="cursor-pointer font-bold"
                                >
                                    Contact Admin
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
 
export default Login