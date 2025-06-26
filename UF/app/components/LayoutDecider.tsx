
'use client'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import TopNav from './TopNav'
import SideNav from './SideNav'
import './brand.css'
import { TotalContext, TotalContextProps } from '../globalContext'
import { AxiosService } from './axiosService'
import { deleteAllCookies, getCookie } from './cookieMgment'
import { useInfoMsg } from './infoMsgHandler'
import { MenuItem } from '../interfaces/interfaces'
import decodeToken from './decodeToken'

const LayoutDecider = ({
  mode = 'detached',
  navigationStyles = 'vertical',
  sidebarStyle = 'compact',
  children
}: {
  mode?: 'fluid' | 'closed' | 'detached'
  navigationStyles?: 'vertical' | 'horizontal'
  sidebarStyle?:
    | 'default'
    | 'compact'
    | 'condensed'
    | 'hoverView'
    | 'fullLayout'
    | 'hidden'
  children: React.ReactNode
}) => {
  const [fullView, setFullView] = useState(
    sidebarStyle == 'default' || sidebarStyle == 'condensed' ? true : false
  )
  const { property, setProperty, userDetails , setUserDetails,encAppFalg , setEncAppFalg } = useContext(
    TotalContext
  ) as TotalContextProps
  const encryptionFlagApp: boolean = true;
  const encryptionDpd: string = "CK:CT242:FNGK:AF:FNK:CDF-DPD:CATK:TOB001:AFGK:TOB002:AFK:TOBDPD:AFVK:v1";
  const encryptionMethod: string = "";
  const brandColor = property?.brandColor || '#1F2D3D'
  const hoverColor = property?.hoverColor || '#1F2D3D'
  const selectionColor = property?.selectionColor || '#1F2D3D'
  const sidebarColor = property?.menubarColor || '#1F2D3D'
  const topbarColor = property?.topbarColor || ''
  const logo = ""
  const appName = "TOBApp"
  const toast = useInfoMsg()
  const [loading, setLoading] = useState(true)
  const [updatedNavData, setUpdatedNavData] = useState<MenuItem[]>([])
  const navData: MenuItem[] = [
  {
    "menuGroup": "admin",
    "menuGroupLabel": "Admin",
    "screenDetails": [
      {
        "name": "logs",
        "label": "Logs",
        "key": "Logs Screen",
        "static": true,
        "icon": "https://minapi.gsstvl.com/torus/9.1/resources/icons/document-add-svgrepo-com.svg"
      },
      {
        "name": "user",
        "label": "User",
        "key": "User Screen",
        "static": true,
        "icon": "https://minapi.gsstvl.com/torus/9.1/resources/icons/user-plus-svgrepo-com.svg"
      }
    ],
    "items": [],
    "icon": "https://minapi.gsstvl.com/torus/9.1/resources/icons/admin-svgrepo-com.svg"
  },
  {
    "menuGroup": "tob_schema",
    "menuGroupLabel": "TOB_Schema",
    "screenDetails": [
      {
        "name": "tob_screen_1",
        "label": "TOB_Screen_1",
        "key": "CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TOB001:AFGK:TOB002:AFK:TOB_Dashboard_Screen:AFVK:v1",
        "static": false
      }
    ],
    "items": []
  }
]
  const token:string = getCookie('token'); 
  const decodedTokenObj: any = decodeToken(token)
  const user = decodedTokenObj?.selectedAccessProfile
  const getSideNavClassName = useMemo(() => {
    if (
      navigationStyles === 'horizontal' ||
      mode === 'closed' ||
      sidebarStyle === 'fullLayout' ||
      sidebarStyle === 'hidden'
    ) {
      return 'hidden'
    }

    const widthClass = fullView ? 'w-[10%]' : 'w-[5%]'
    const baseClass = 'flex-shrink-0'
    const marginClass = mode === 'detached' ? 'm-2' : ''
    const extraClass = mode === 'detached' ? 'rounded-md shadow-md' : ''
    const detachedBorder = mode === 'detached' ? 'border' : ''

    if (['condensed', 'hoverView'].includes(sidebarStyle)) {
      return `${marginClass} ${widthClass} ${baseClass} ${detachedBorder}  ${extraClass}`.trim()
    }

    if (['default', 'compact'].includes(sidebarStyle)) {
      const compactWidth = sidebarStyle === 'compact' ? 'w-[5%]' : 'w-[10%]'
      return `${marginClass} ${compactWidth} ${baseClass}  ${detachedBorder} ${extraClass}`.trim()
    }

    if (fullView) {
      return `${marginClass} w-[10%] ${baseClass}`.trim()
    }

    return ''
  }, [navigationStyles, mode, sidebarStyle, fullView])

  const childrenClassName = useMemo(() => {
    if (
      navigationStyles === 'horizontal' ||
      sidebarStyle === 'fullLayout' ||
      sidebarStyle === 'hidden'
    ) {
      return 'm-2 p-0 b rounded-md shadow-md'
    }
    const marginClass =
      mode === 'detached' || mode === 'closed' ? 'm-2 p-2' : 'm-3 p-3'
    const extraClass =
      mode === 'detached' ? 'rounded-md shadow-md' : 'rounded-md shadow-md'

    if (mode === 'closed') {
      return `${marginClass}  ${extraClass}`.trim()
    }

    if (['condensed', 'hoverView'].includes(sidebarStyle)) {
      return `${marginClass}  ${extraClass}`.trim()
    }

    if (['default', 'compact'].includes(sidebarStyle)) {
      return `${marginClass}   ${extraClass}`.trim()
    }

    if (fullView) {
      return `${marginClass}`.trim()
    }

    return ''
  }, [navigationStyles, mode, sidebarStyle])

  async function logout() {
    localStorage.clear()
    sessionStorage.clear()
    deleteAllCookies()
    window.location.href = '/'
  }

  const checkSecurity = async (
    artifactKey: string,
    accessProfile: string[],
    token: string
  ): Promise<Boolean> => {
    if (!artifactKey) return false
    try {
        setEncAppFalg({
          "flag":encryptionFlagApp,
          "dpd":encryptionDpd,
          "method":encryptionMethod
      });
      let orchestrationBody:any ={
          key: artifactKey,
          accessProfile: accessProfile,
          from: 'layoutDecider'
        }
        if (encryptionFlagApp) {          
          orchestrationBody["dpdKey"] = encryptionDpd;
          orchestrationBody["method"] = encryptionMethod;
        }
      const orchestrationData = await AxiosService.post(
        '/UF/Orchestration',
        orchestrationBody,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const securityResponse = orchestrationData?.data?.security
      if (
        securityResponse &&
        typeof securityResponse == 'string' &&
        securityResponse.toLowerCase() == 'ba'
      ) {
        return false
      } else {
        return true
      }
    } catch (error) {
      return false
    }
  }

  const processMenuItems = async (
    items: MenuItem[],
    accessProfile: string[],
    token: string
  ): Promise<MenuItem[]> => {
    const updatedItems: MenuItem[] = []
    for (const item of items) {
      let newItem = { ...item } // Copy item

      if (newItem.screenDetails && Array.isArray(newItem.screenDetails)) {
        const validScreens = []

        for (const screen of newItem.screenDetails) {
          if (screen.static) validScreens.push(screen)
          if (screen.key && !screen.static) {
            const isValid = await checkSecurity(
              screen.key,
              accessProfile,
              token
            )
            if (isValid) validScreens.push(screen)
          }
        }

        newItem.screenDetails = validScreens.length > 0 ? validScreens : []
      }

      if (newItem.items && Array.isArray(newItem.items)) {
        newItem.items = await processMenuItems(
          newItem.items,
          accessProfile,
          token
        )
      }

      updatedItems.push(newItem)
    }

    return updatedItems.filter(
      item =>
        item.screenDetails.length > 0 || (item.items && item.items?.length > 0)
    )
  }

  async function checkAccessProfile(token: string) {
    try {
      let myAccount:any;
      if (encryptionFlagApp) {  
         myAccount = await AxiosService.get('/UF/myAccount-for-client', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            dpdKey: encryptionDpd,
            method: encryptionMethod
          }
        })
      }else{
        myAccount = await AxiosService.get('/UF/myAccount-for-client', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }
      setUserDetails(myAccount?.data)
      if (
       user != "" && user != null
      ) {
        const processedMenuItems = await processMenuItems(
          navData,
          [user],
          token
        )
        setUpdatedNavData(processedMenuItems)
        setLoading(false)
      } else {
        toast('user lack access to any screen', 'danger')
        logout()
      }
    } catch (err: any) {
      console.error(err)
      toast('user lack access to any screen', 'danger')
      logout()
    }
  }

  useEffect(() => {
    if (typeof window !== undefined) {
      const token = getCookie('token')
      if (token) {
        checkAccessProfile(token)
      }
    }
  }, [])

  const listMenuItems = () => {
    if (navigationStyles == 'horizontal' || mode == 'closed') {
      return true
    } else if (
      navigationStyles == 'vertical' &&
      (sidebarStyle == 'fullLayout' || sidebarStyle == 'hidden')
    ) {
      return true
    }
    return false
  }

  if (loading == true)
    return (
      <div className={`skeleton skeleton-loading h-full w-full`}>
        <style jsx>{`
          .skeleton {
            background-color: #e0e0e0;
            background-image: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #f7f7f7 50%,
              #f0f0f0 75%
            );
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 4px;
          }

          @keyframes loading {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }

          .skeleton-text {
            height: 20px;
          }

          .skeleton-image {
            height: 150px;
            border-radius: 8px;
          }

          .skeleton-card {
            height: 200px;
            border-radius: 8px;
          }
        `}</style>
      </div>
    )
  return (
    <div className='flex h-screen w-screen flex-col'>
      <div
        className='flex-shrink-0'
        style={{
          backgroundColor: `${topbarColor}`
        }}
      >
        <TopNav
          navData={updatedNavData}
          listMenuItems={listMenuItems()}
          mode={mode}
          selectionColor={selectionColor}
          brandColor={brandColor}
          hoverColor={hoverColor}
          topbarColor={topbarColor}
          appName={appName}
          logo={logo}
        />
      </div>
      <div className='flex h-full flex-1'>
        <div
          className={`cursor-pointer transition-all duration-700 ease-in-out ${getSideNavClassName}`}
          style={{
            backgroundColor: `${sidebarColor}`,
            borderColor: `${brandColor}70`
          }}
        >
          <SideNav
            navData={updatedNavData}
            mode={mode}
            sidebarStyle={sidebarStyle}
            fullView={fullView}
            setFullView={setFullView}
            brandColor={brandColor}
            hoverColor={hoverColor}
            selectionColor={selectionColor}
            userDetails={userDetails}
          />
        </div>
        <div className={`flex-1 overflow-auto ${childrenClassName} pageStyle` }>
          {children}
        </div>
      </div>
    </div>
  )
}

export default LayoutDecider
