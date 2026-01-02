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

const Labelerrormessage_label = ({encryptionFlagCompData}:any) => {
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
  const {vmc_viewmsg_info0ee89, setvmc_viewmsg_info0ee89}= useContext(TotalContext) as TotalContextProps;
  const {vmc_viewmsg_info0ee89Props, setvmc_viewmsg_info0ee89Props}= useContext(TotalContext) as TotalContextProps;
  const {errormessage_label1e59b, seterrormessage_label1e59b}= useContext(TotalContext) as TotalContextProps;
  const {viewmsg_groupf2810, setviewmsg_groupf2810}= useContext(TotalContext) as TotalContextProps;
  const {viewmsg_groupf2810Props, setviewmsg_groupf2810Props}= useContext(TotalContext) as TotalContextProps;
  const {editb2d62, seteditb2d62}= useContext(TotalContext) as TotalContextProps;
  const {retry20f16, setretry20f16}= useContext(TotalContext) as TotalContextProps;
  const {cancel4b018, setcancel4b018}= useContext(TotalContext) as TotalContextProps;
  //////////////


const handleMapperValue=async()=>{
  try{
    const orchestrationData: any = await AxiosService.post(
      '/UF/Orchestration',
      {
        key: "CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_View_Info:AFVK:v1",
        componentId: "b114b7f55fdb49b2bd5f7d168dd0ee89",
        controlId: "252dde7ca818449ab38fffcadd81e59b",
        isTable: false,
        from:"labelError Message",
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
  setvmc_viewmsg_info0ee89((pre:any)=>({...pre,errormessage_label:""}));
},[errormessage_label1e59b?.refresh])


const handleClick =async(e:any)=>{
  setvmc_viewmsg_info0ee89((prev: any) => ({ ...prev, errormessage_label: e.target.value }));
  let code = allCode;
    if (code != '') {
    let codeStates: any = {};
      codeStates['vmc_viewmsg_info']  = vmc_viewmsg_info0ee89,
      codeStates['setvmc_viewmsg_info'] = setvmc_viewmsg_info0ee89,
      codeStates['viewmsg_group']  = viewmsg_groupf2810,
      codeStates['setviewmsg_group'] = setviewmsg_groupf2810,
  codeExecution(code,codeStates);
  }
}


  if (errormessage_label1e59b?.isHidden) {
    return <></>
  }  

  return (
    <div 
      style={{gridColumn: `5 / 9`,gridRow: `3 / 13`, gap:``, height: `100%`, overflow: 'auto'}} >
      <Label 
        className="bg-white"
        disabled= {errormessage_label1e59b?.isDisabled ? true : false}
        theme="info"
        interactive={false}
      onClick = {handleClick}
      >
      Error Message
      </Label>
    </div>
  )
}

export default Labelerrormessage_label
