
'use client'
import LoginForm from './components/LoginForm';
import { AxiosService } from './components/axiosService';
import { deleteAllCookies, deleteCookie, getCookie } from './components/cookieMgment';
import { useEffect } from 'react';
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
  let landingScreen:string = 'CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Transaction:AFVK:v1';
  const toast : Function = useInfoMsg();
  let screenDetails : ScreenDetail[] = [
  {
    "screenName": "transaction",
    "screensName": "transaction-v1",
    "ufKey": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Transaction:AFVK:v1"
  },
  {
    "screenName": "system setup",
    "screensName": "system_setup-v1",
    "ufKey": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup:AFVK:v1"
  },
  {
    "screenName": "checkerapproval",
    "screensName": "checkerapproval-v1",
    "ufKey": "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:CDC_Checker_Action_Screen:AFVK:v1"
  }
]
  const securityCheck = async () : Promise<void> => {
    try {
      const encryptionDpd: string = "CK:CT005:FNGK:AF:FNK:CDF-DPD:CATK:V001:AFGK:VGPH001:AFK:VGPH_DPD:AFVK:v1";
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
            key:"CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Transaction:AFVK:v1"
          }
        })        
      }else{
        introspect = await AxiosService.get('/UF/introspect', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            key:"CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Transaction:AFVK:v1"  
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

  useEffect(() => {
    if(token)
    {
      securityCheck()
    }
    if (getCookie('server_error')) {
      toast(decodeURIComponent(getCookie('server_error')), 'danger')
      deleteCookie('server_error')
    }
  }, [token])

  return (
    <>
      <LoginForm logo=""  image=""/>
    </>
  )
}
 