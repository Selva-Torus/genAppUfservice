'use client'

import React, { useContext,useEffect } from 'react' 
import { Icon } from '@/components/Icon';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';

const Icondashboard = ({encryptionFlagCompData}:any) => {
  const token:string = getCookie('token'); 
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method
  /////////////
  //another screen
  const {outside board012f9, setoutside board012f9}= useContext(TotalContext) as TotalContextProps
  const {outside board012f9Props, setoutside board012f9Props}= useContext(TotalContext) as TotalContextProps
  const {headera5dfc, setheadera5dfc}= useContext(TotalContext) as TotalContextProps
  const {headera5dfcProps, setheadera5dfcProps}= useContext(TotalContext) as TotalContextProps
  const {side5fa55, setside5fa55}= useContext(TotalContext) as TotalContextProps
  const {side5fa55Props, setside5fa55Props}= useContext(TotalContext) as TotalContextProps
  const {4441d, set4441d}= useContext(TotalContext) as TotalContextProps
  const {dashboard0074d, setdashboard0074d}= useContext(TotalContext) as TotalContextProps
  const {account895d0, setaccount895d0}= useContext(TotalContext) as TotalContextProps
  const {help1a4ca, sethelp1a4ca}= useContext(TotalContext) as TotalContextProps
  const {settings67c80, setsettings67c80}= useContext(TotalContext) as TotalContextProps
  const {notification7a80c, setnotification7a80c}= useContext(TotalContext) as TotalContextProps
  const {card2a34c5, setcard2a34c5}= useContext(TotalContext) as TotalContextProps
  const {card2a34c5Props, setcard2a34c5Props}= useContext(TotalContext) as TotalContextProps
  const {5f38e, set5f38e}= useContext(TotalContext) as TotalContextProps
  const {5f38eProps, set5f38eProps}= useContext(TotalContext) as TotalContextProps
  const {card35fd72, setcard35fd72}= useContext(TotalContext) as TotalContextProps
  const {card35fd72Props, setcard35fd72Props}= useContext(TotalContext) as TotalContextProps
  const {0cce7, set0cce7}= useContext(TotalContext) as TotalContextProps
  const {0cce7Props, set0cce7Props}= useContext(TotalContext) as TotalContextProps
  const {card42e38a, setcard42e38a}= useContext(TotalContext) as TotalContextProps
  const {card42e38aProps, setcard42e38aProps}= useContext(TotalContext) as TotalContextProps
  const {6b783, set6b783}= useContext(TotalContext) as TotalContextProps
  const {6b783Props, set6b783Props}= useContext(TotalContext) as TotalContextProps
  const {card1dced1, setcard1dced1}= useContext(TotalContext) as TotalContextProps
  const {card1dced1Props, setcard1dced1Props}= useContext(TotalContext) as TotalContextProps
  const {dd147, setdd147}= useContext(TotalContext) as TotalContextProps
  const {dd147Props, setdd147Props}= useContext(TotalContext) as TotalContextProps
  const {table45205, settable45205}= useContext(TotalContext) as TotalContextProps
  const {table45205Props, settable45205Props}= useContext(TotalContext) as TotalContextProps
  //////////////
  const handleCode=async () => {
    let code:any;
    const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT003:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:oprmatrix:AFK:Dashboard3:AFVK:v1",  componentId:"f5b36dda2fd54aba9ca30b404275fa55",controlId:"713c8204ed114b3890589ef532b0074d",isTable:false,accessProfile:accessProfile,from:"Icon"},{
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

  if (dashboard0074d?.isHidden) {
    return <></>
  }

return (
  <div 
    style={{gridColumn: `3 / 11`,gridRow: `32 / 48`, gap:``, height: `100%`, overflow: 'auto'
 }} >
    <Icon 
      className=""
      size={45}
      data="MdApps"
    />
  </div>
  )
}

export default Icondashboard
