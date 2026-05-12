

'use client'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import TopNav from './TopNav'
import SideNav from './SideNav'
import './brand.css'
import { TotalContext, TotalContextProps } from '../../globalContext'
import { AxiosService } from '../axiosService'
import { deleteAllCookies, getCookie } from '../cookieMgment'
import { useInfoMsg } from '../infoMsgHandler'
import { MenuItem } from '../../interfaces/interfaces'
import decodeToken from '../decodeToken'
import axios from 'axios'
import { useGlobal } from '@/context/GlobalContext'
import { DecodedToken, Branding } from '@/types/global'
import { useTheme } from '@/hooks/useTheme'
import { twMerge } from 'tailwind-merge'
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
  const [fullView, setFullView] = useState<boolean>(
    sidebarStyle == 'default' || sidebarStyle == 'condensed' ? true : false
  )
  const {userDetails, setUserDetails } = useContext(TotalContext) as TotalContextProps
  const { branding } : { branding: Branding } = useGlobal();
  const { borderColor, bgColor } : { borderColor: string; bgColor: string } = useTheme()
  const { brandColor, hoverColor, selectionColor } : { brandColor: string; hoverColor: string; selectionColor: string } = branding;
  const encryptionFlagApp: boolean = false;    
  const encryptionDpd: string = "CK:CT005:FNGK:AF:FNK:CDF-DPD:CATK:GSS:AFGK:VGPH:AFK:VGPH_DPD:AFVK:v1";
  const encryptionMethod: string = "";
  const logo: string = "torus/9.1/CT005/resources/images/Blue Logo.png"
  const appLogo: string = "torus/9.1/CT005/resources/images/White global payment hub.png"
  const appName: string = "VGPH"
  const toast: Function = useInfoMsg()
  const [loading, setLoading] = useState<boolean>(true)
  const [updatedNavData, setUpdatedNavData] = useState<MenuItem[]>([])
  const aKey :string = "CK:TGA:FNGK:BLDC:FNK:DEV:CATK:CT005:AFGK:GSS:AFK:VGPH:AFVK:v1:bldc"
  const [rawNavData, setRawNavData] = useState<MenuItem[] | null>(null);
  const navData: MenuItem[] = [
  {
    "menuGroup": "admin",
    "menuGroupLabel": "Admin",
    "screenDetails": [
      {
        "name": "logs",
        "label": "Logs",
        "key": "Logs Screen",
        "allowedAccessProfile": [],
        "static": true,
        "icon": "https://tdps3api.toruslowcode.com/torus/9.1/resources/icons/document-add-svgrepo-com.svg"
      },
      {
        "name": "user",
        "label": "User",
        "key": "User Screen",
        "allowedAccessProfile": [],
        "static": true,
        "icon": "https://tdps3api.toruslowcode.com/torus/9.1/resources/icons/user-plus-svgrepo-com.svg"
      }
    ],
    "items": [],
    "icon": "https://tdps3api.toruslowcode.com/torus/9.1/resources/icons/admin-svgrepo-com.svg"
  },
  {
    "menuGroupLabel": "My Transaction",
    "screenDetails": [
      {
        "name": "my transaction",
        "key": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",
        "allowedAccessProfile": [
          "IT Team",
          "Business Team",
          "Operation Team"
        ],
        "static": false
      }
    ],
    "items": []
  }
]
  const token:string = getCookie('token'); 
  const decodedTokenObj: DecodedToken = decodeToken(token)
  const user: string | undefined = decodedTokenObj?.selectedAccessProfile
  const getSideNavClassName = useMemo(() => {
    if (
      navigationStyles === 'horizontal' ||
      mode === 'closed' ||
      sidebarStyle === 'fullLayout' ||
      sidebarStyle === 'hidden'
    ) {
      return 'hidden'
    }

    const widthClass: string = fullView ? 'w-[10vw] ' : 'w-[5%]'
    const baseClass: string = 'flex-shrink-0'
    const marginClass: string = mode === 'detached' ? 'm-2' : ''
    const extraClass: string = mode === 'detached' ? 'rounded-md shadow-md' : ''
    const detachedBorder: string = mode === 'detached' ? 'border' : ''

    if (['condensed', 'hoverView'].includes(sidebarStyle)) {
      return `${marginClass} ${widthClass} ${baseClass} ${detachedBorder}  ${extraClass}`.trim()
    }

    if (['default', 'compact'].includes(sidebarStyle)) {
      const compactWidth: string = sidebarStyle === 'compact' ? 'w-[5%]' : 'w-[10%]'
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
    const marginClass: string =
      mode === 'detached' || mode === 'closed' ? 'm-2 p-2' : 'm-3 p-3'
    const extraClass: string =
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

  async function logout(): Promise<void> {
    localStorage.clear()
    sessionStorage.clear()
    deleteAllCookies()
    window.location.href = '/'
  }


  const processMenuItems = async (
    items: MenuItem[],
    accessProfile: string[],
    token: string
  ): Promise<MenuItem[]> => {
    const updatedItems: MenuItem[] = []
    for (const item of items) {
      let newItem: MenuItem = { ...item } // Copy item

      if (newItem.screenDetails && Array.isArray(newItem.screenDetails)) {
        const validScreens: any[] = []

        for (const screen of newItem.screenDetails) {
          if (screen.static) validScreens.push(screen)
          if (screen.key && !screen.static) {
            const isValid: boolean = screen.allowedAccessProfile.includes(user) ? true : false
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

    const getNavData = async(): Promise<void> => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/UF/getNavbarData`,
        { key: aKey },
        { headers: { authorization: `Bearer ${token}` } }
      )
      //console.log(res.data);
   setRawNavData(res.data); // Set the raw data into state
    } catch (error) {
   console.error("Failed to fetch nav data:", error);
   toast('Failed to load navigation data', 'danger');
   setLoading(false);
    }
  }

  async function checkAccessProfile(token: string, navData: MenuItem[]): Promise<void> {
    try {
   let myAccount:any;
      if (encryptionFlagApp) {
        myAccount = await AxiosService.get('/UF/myAccount-for-client', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            dpdKey: encryptionDpd,
            method: encryptionMethod,
      key:"Logs Screen"
          }
        })
   }else{
        myAccount = await AxiosService.get('/UF/myAccount-for-client', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
      key:"Logs Screen"
          }
        })
      }
      setUserDetails(myAccount?.data)
   if (
   user != "" && user != null
   ) {
        const processedMenuItems: MenuItem[] = await processMenuItems(
          navData, // Use the passed-in navData
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
      const currentToken: string = getCookie('token')
      if (currentToken) {
        // 4a. Initial fetch of raw navigation data
        getNavData()
      } else {
        // Handle missing token scenario if necessary
    setLoading(false);
        // Optional: Redirect to login/logout()
      }
    }
  }, [])

  useEffect(() => {
    if (rawNavData) {
      const currentToken: string = getCookie('token')
      if (currentToken) {
        checkAccessProfile(currentToken, rawNavData)
      }
    }
  }, [rawNavData])

  ///////////
  /* async function checkAccessProfile(token: string) {
    try {
      let myAccount:any;
      if (encryptionFlagApp) {  
         myAccount = await AxiosService.get('/UF/myAccount-for-client', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            dpdKey: encryptionDpd,
            method: encryptionMethod,
            key:"Logs Screen"
          }
        })
      }else{
        myAccount = await AxiosService.get('/UF/myAccount-for-client', {
          headers: {
            Authorization: `Bearer ${token}`
            },
          params: {
            key:"Logs Screen"
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
  }, []) */

  const listMenuItems = (): boolean => {
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

  const navBarItemsOrder: {
    name: string
    'gridColumn'?: string
    'gridRow'?: string
  }[] =[
  {
    "name": "app logo",
    "gridColumn": "1/3"
  },
  {
    "name": "menu items",
    "gridColumn": "3/8",
    "gridRow": "1/6"
  },
  {
    "name": "profile",
    "gridColumn": "12/13",
    "gridRow": "12/13"
  },
  {
    "name": "opr matrix",
    "gridColumn": "9/12",
    "gridRow": "6/9"
  }
]

   if (loading == true){
    return (<div className='flex w-[100vw] h-[100vh] bg-slate-200 justify-center items-center '><span>Loading...</span></div>);
  }
  return (
    <div className={`flex h-screen w-screen flex-col overflow-auto  bg-cover bg-center`} >
      <div className={`g-root flex-shrink-0`}>
        <TopNav
          navData={updatedNavData}
          listMenuItems={listMenuItems()}
          mode={mode}
          brandColor={brandColor}
          appName={appName}
          logo={logo}
          appLogo={appLogo}
          navigationStyles={navigationStyles}
          userDetails={userDetails}
          navBarItemsOrder={navBarItemsOrder}
        />
      </div>
      <div className='flex h-[90%] 2xl:h-[95%] flex-1'>
        <div
          className={twMerge(`cursor-pointer transition-all duration-700 ease-in-out ${getSideNavClassName}` , borderColor)}
        >
          <SideNav
            navData={updatedNavData}
            mode={mode}
            sidebarStyle={sidebarStyle}
            fullView={fullView}
            setFullView={setFullView}
            brandColor={brandColor}
            hoverColor={hoverColor}
            userDetails={userDetails}
            navBarItemsOrder={navBarItemsOrder}
          />
        </div>
        <div
          className={twMerge(`flex-1 overflow-auto ${childrenClassName} border` , borderColor , bgColor)}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default LayoutDecider
