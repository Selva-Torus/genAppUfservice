
'use client'
import LoginForm from './components/LoginForm';
import { AxiosService } from './components/axiosService';
import { deleteCookie, getCookie } from './components/cookieMgment';
import { useEffect, useState } from 'react';
import { useInfoMsg } from './components/infoMsgHandler';

export default function HomePage() {
  const toast : Function = useInfoMsg();
  const isSaasApp = process.env.NEXT_PUBLIC_IS_SAAS_APPLICATION;
  const [appTenantList , setAppTenantList] = useState([]);

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
    if (getCookie('server_error')) {
      toast(decodeURIComponent(getCookie('server_error')), 'danger')
      deleteCookie('server_error')
    }
    if(isSaasApp){
      handleGetAppSubTenants()
    }
  }, [])

  return (
    <>
      <LoginForm logo="torus/9.1/CT010/resources/images/Screenshot 2024-02-14 131839.png"  image="" appTenantList={appTenantList}/>
    </>
  )
}
 