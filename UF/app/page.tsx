
'use client'
import LoginForm from './components/loginForm'
import { AxiosService } from './components/axiosService'
import { deleteAllCookies, getCookie } from './components/cookieMgment'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import decodeToken from './components/decodeToken'

export default function HomePage() {
  const router = useRouter()
  const token = getCookie('token');
  const decodedToken = decodeToken(token)
  const encryptionFlagApp: boolean = true;
  let landingScreen:string = 'CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TOB001:AFGK:TOB002:AFK:TOB_Dashboard_Screen:AFVK:v1';

  const securityCheck = async () => {
    try {
      const encryptionDpd: string = "CK:CT242:FNGK:AF:FNK:CDF-DPD:CATK:TOB001:AFGK:TOB002:AFK:TOBDPD:AFVK:v1";
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
  }, [token])

  return (
    <>
      <LoginForm logo=""/>
    </>
  )
}
