'use client'

import React, { useContext,useEffect } from 'react' 
import { Icon } from '@/components/Icon';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';

const Iconicon2 = ({encryptionFlagCompData}:any) => {
  const token:string = getCookie('token'); 
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method
  /////////////
  //another screen
  const {backgorunde9308, setbackgorunde9308}= useContext(TotalContext) as TotalContextProps
  const {backgorunde9308Props, setbackgorunde9308Props}= useContext(TotalContext) as TotalContextProps
  const {background10bc8a, setbackground10bc8a}= useContext(TotalContext) as TotalContextProps
  const {background10bc8aProps, setbackground10bc8aProps}= useContext(TotalContext) as TotalContextProps
  const {thirde7680, setthirde7680}= useContext(TotalContext) as TotalContextProps
  const {four05c92, setfour05c92}= useContext(TotalContext) as TotalContextProps
  const {icon190895, seticon190895}= useContext(TotalContext) as TotalContextProps
  const {icon2398a3, seticon2398a3}= useContext(TotalContext) as TotalContextProps
  const {icon379355, seticon379355}= useContext(TotalContext) as TotalContextProps
  const {icon4c9c0e, seticon4c9c0e}= useContext(TotalContext) as TotalContextProps
  const {text285d97, settext285d97}= useContext(TotalContext) as TotalContextProps
  const {text16d8c2, settext16d8c2}= useContext(TotalContext) as TotalContextProps
  //////////////
  const handleCode=async () => {
    let code:any;
    const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:Veracious:AFVK:v1",  componentId:"612784f75f094475b337e4efaad0bc8a",controlId:"398818a895104db8a02dc973a3b398a3",isTable:false,accessProfile:accessProfile,from:"Icon"},{
      headers: {
        Authorization: `Bearer ${token}`
    }})
    code=orchestrationData?.data?.code
    if (code == '') {
      //toast(code?.data?.errorDetails?.message, 'danger')
      //return
    }  else if (code != '') {
      let codeStates: any = {}
      codeExecution(code,codeStates)
    }
  }

  useEffect(() => {
    handleCode()
  }, [])

  if (icon2398a3?.isHidden) {
    return <></>
  }

return (
  <div 
    style={{gridColumn: `4 / 6`,gridRow: `112 / 135`, gap:``, height: `100%`, overflow: 'auto'
 }} >
    <Icon 
      className=""
      size={50}
      data="MdAppRegistration"
      headerPosition='bottom'
      headerText="Transaction Validation &amp; Lifecycle "
    />
  </div>
  )
}

export default Iconicon2
