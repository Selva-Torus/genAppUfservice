

'use client'
import React, { useEffect } from 'react'
import SetupScreen from './components'
import { AxiosService } from '../components/axiosService'
import {
  deleteAllCookies,
  getCookie,
  setCookie
} from '../components/cookieMgment'
import { useRouter } from 'next/navigation'
import decodeToken from '../components/decodeToken'

function page() {
  const token = getCookie('token')
  const decodedToken = decodeToken(token)
  const router = useRouter()
  let landingScreen: string = 'CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Master_System_Setup:AFVK:v1'
  const encryptionFlagApp: boolean = false;    
  const securityCheck = async () => {
    try {
      const encryptionDpd: string =
        'CK:CT005:FNGK:AF:FNK:CDF-DPD:CATK:V001:AFGK:VGPH001:AFK:VGPH_DPD:AFVK:v1'
      const encryptionMethod: string = ''
      let introspect: any
      if (encryptionFlagApp) {
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
      } else {
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
        }
        if (introspect?.data?.updatedToken) {
          setCookie('token', introspect?.data.updatedToken)
        }
      } else {
        await deleteAllCookies()
      }
    } catch (err: any) {
      await deleteAllCookies()
    }
  }

  useEffect(() => {
    if (token) {
      securityCheck()
    }
  }, [token])

  return (
    <div>
      <SetupScreen tenantAccess={'edit'} />
    </div>
  )
}

export default page