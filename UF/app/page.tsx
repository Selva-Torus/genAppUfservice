
'use client'
import LoginForm from './components/LoginForm';
import { AxiosService } from './components/axiosService';
import { deleteAllCookies, deleteCookie, getCookie } from './components/cookieMgment';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import decodeToken from './components/decodeToken';
import { useInfoMsg } from './components/infoMsgHandler';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { DecodedToken,ScreenDetail } from '@/types/global';

export default function HomePage() {
  const router : AppRouterInstance = useRouter();
  const token :string | undefined = getCookie('token');
  const decodedToken : DecodedToken = decodeToken(token);
  const encryptionFlagApp: boolean = false;    
  let landingScreen:string = 'CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1';
  const toast : Function = useInfoMsg();
  let screenDetails : ScreenDetail[] = [
  {
    "screenName": "my transaction",
    "screensName": "my_transaction-v1",
    "ufKey": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1"
  }
]
  const isSaasApp = process.env.NEXT_PUBLIC_IS_SAAS_APPLICATION;
  const [appTenantList , setAppTenantList] = useState([]);
  const securityCheck = async () : Promise<void> => {
    try {
      const encryptionDpd: string = "CK:CT005:FNGK:AF:FNK:CDF-DPD:CATK:GSS:AFGK:VGPH:AFK:VGPH_DPD:AFVK:v1";
      const encryptionMethod: string = "";
      let introspect:any;
      if(encryptionFlagApp){
        introspect = await AxiosService.get('/UF/introspect', {
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
        introspect = await AxiosService.get('/UF/introspect', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            key:"Logs Screen"  
          }
        })
      }

      if (introspect?.data?.authenticated) {
        if (!decodedToken.selectedAccessProfile) {
          router.push('/select-context')
        } else if (landingScreen === 'User Screen') {
          router.push('/user')
          }
          else if (landingScreen === 'Logs Screen') {
          router.push('/logs')
        }
        else {
          let defaultScreen : string = "";
            screenDetails.map((screen: any) => {
              if (landingScreen === screen.ufKey) {
                defaultScreen = screen.screensName
              }
            })
            defaultScreen =
              defaultScreen.split('-')[0] +
              '_' +
              defaultScreen.split('-').at(-1)
              if(defaultScreen)
                router.push('/' + defaultScreen)
          }
      } else {
        await deleteAllCookies()
      }
    } catch (err: any) {
      await deleteAllCookies()
    }
  }

    const handleGetAppSubTenants = async () => {
    const appTenants = await AxiosService.get('UF/app-tenant-app' , {
      validateStatus: () => true
    })
    if(appTenants.status == 200){
       setAppTenantList(appTenants.data)
       return
    }
    setAppTenantList([])
    return
  }

  useEffect(() => {
    if(token)
    {
      securityCheck()
    }
    if (getCookie('server_error')) {
      toast(decodeURIComponent(getCookie('server_error')), 'danger')
      deleteCookie('server_error')
    }
    if(isSaasApp){
      handleGetAppSubTenants()
    }
  }, [token])

  return (
    <>
      <LoginForm logo="torus/9.1/CT005/resources/images/Blue Logo.png"   loginType="standard"   image="torus/9.1/CT005/resources/images/Login 1.png" appTenantList={appTenantList}/>
    </>
  )
}
 