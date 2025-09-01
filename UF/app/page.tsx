
'use client'
import LoginForm from './components/loginForm'
import { AxiosService } from './components/axiosService'
import {
  deleteAllCookies,
  deleteCookie,
  getCookie
} from './components/cookieMgment'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import decodeToken from './components/decodeToken'
import { useInfoMsg } from './components/infoMsgHandler'

export default function HomePage() {
  const router = useRouter()
  const token = getCookie('token');
  const decodedToken = decodeToken(token)
  const encryptionFlagApp: boolean = false;    
  let landingScreen:string = 'User Screen';
  const toast = useInfoMsg()
  let screenDetails: any = {
    keys: [
      {
        screensName: 'formitem-v1',
        ufKey:
          'CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:CG:AFGK:TG2:AFK:showProfile:AFVK:v1'
      }
    ]
  }

  const securityCheck = async () => {
    try {
      const encryptionDpd: string = "CK:CT003:FNGK:AF:FNK:CDF-DPD:CATK:CG:AFGK:TG2:AFK:TG2DPD:AFVK:v1";
      const encryptionMethod: string = "";
      let introspect:any;
      if(encryptionFlagApp){
        introspect = await AxiosService.get('/UF/introspect', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            dpdKey: encryptionDpd,
            method: encryptionMethod
          }
        })        
      }else{
        introspect = await AxiosService.get('/UF/introspect', {
          headers: {
            Authorization: `Bearer ${token}`
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
        } else {
          let defaultScreen: any = ''
          screenDetails.map((screen: any) => {
            if (landingScreen === screen.ufKey) {
              defaultScreen = screen.screensName
            }
          })
          defaultScreen =
            defaultScreen.split('-')[0] + '_' + defaultScreen.split('-').at(-1)
          if (defaultScreen) router.push('/' + defaultScreen)
        }
      } else {
        await deleteAllCookies()
      }
    } catch (err: any) {
      await deleteAllCookies()
    }
  }

  useEffect(() => {
    if(token){
      securityCheck()
    }
    if (getCookie('server_error')) {
      toast(decodeURIComponent(getCookie('server_error')), 'danger')
      deleteCookie('server_error')
    }
  }, [token])

  return (
    <>
      <LoginForm
        logo='https://cdns3dfsdev.toruslowcode.com/torus/9.1/CT003/resources/images/image.jfif'
        loginType='rightAligned'
        image=''
      />
    </>
  )
}
