'use client'

import React, {useState, useContext,useEffect } from 'react';
import { AxiosService } from "@/app/components/axiosService";
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { codeExecution } from '@/app/utils/codeExecution';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { Label } from '@/components/Label';
import { useRouter } from 'next/navigation';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { eventBus } from '@/app/eventBus';
import { Modal } from '@/components/Modal';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';

const Labelerror_log_view = ({encryptionFlagCompData}:any) => {
  const token:string = getCookie('token'); 
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const toast:any=useInfoMsg();
  const routes = useRouter();
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const [allCode,setAllCode]=useState<any>("");

 /////////////
   //another screen
  const {vmc_error_screen68a17, setvmc_error_screen68a17}= useContext(TotalContext) as TotalContextProps;
  const {vmc_error_screen68a17Props, setvmc_error_screen68a17Props}= useContext(TotalContext) as TotalContextProps;
  const {error_log_view6c812, seterror_log_view6c812}= useContext(TotalContext) as TotalContextProps;
  const {error81aed, seterror81aed}= useContext(TotalContext) as TotalContextProps;
  const {error81aedProps, seterror81aedProps}= useContext(TotalContext) as TotalContextProps;
  //////////////


const handleMapperValue=async()=>{
  try{
    const orchestrationData: any = await AxiosService.post(
      '/UF/Orchestration',
      {
        key: "CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Error_Screen:AFVK:v1",
        componentId: "22a9dd6185a64bab963107f7c0d68a17",
        controlId: "a36d0bfb34ed4f7ab301b8b3e496c812",
        isTable: false,
        from:"labelError Logs",
        accessProfile:accessProfile
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    if(orchestrationData?.data?.error == true){
      return
    }
    setAllCode(orchestrationData?.data?.code);
  }catch(err){
    console.log(err)
  }
}

useEffect(()=>{
  handleMapperValue();
  setvmc_error_screen68a17((pre:any)=>({...pre,error_log_view:""}));
},[error_log_view6c812?.refresh])


const handleClick =async(e:any)=>{
  setvmc_error_screen68a17((prev: any) => ({ ...prev, error_log_view: e.target.value }));
  let code = allCode;
    if (code != '') {
    let codeStates: any = {};
      codeStates['vmc_error_screen']  = vmc_error_screen68a17,
      codeStates['setvmc_error_screen'] = setvmc_error_screen68a17,
      codeStates['error']  = error81aed,
      codeStates['seterror'] = seterror81aed,
  codeExecution(code,codeStates);
  }
}


  if (error_log_view6c812?.isHidden) {
    return <></>
  }  

  return (
    <div 
      style={{gridColumn: `6 / 8`,gridRow: `2 / 13`, gap:``, height: `100%`, overflow: 'auto'}} >
      <Label 
        className=""
        disabled= {error_log_view6c812?.isDisabled ? true : false}
        theme="info"
        interactive={false}
      onClick = {handleClick}
      >
      Error Logs
      </Label>
    </div>
  )
}

export default Labelerror_log_view
