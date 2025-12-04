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

const Labelais_label = ({encryptionFlagCompData}:any) => {
  const token:string = getCookie('token'); 
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
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
  const {ais_groupbe189, setais_groupbe189}= useContext(TotalContext) as TotalContextProps;
  const {ais_groupbe189Props, setais_groupbe189Props}= useContext(TotalContext) as TotalContextProps;
  const {ais_label68093, setais_label68093}= useContext(TotalContext) as TotalContextProps;
  const {get_accounts1a859, setget_accounts1a859}= useContext(TotalContext) as TotalContextProps;
  const {get_accounts1a859Props, setget_accounts1a859Props}= useContext(TotalContext) as TotalContextProps;
  //////////////


const handleMapperValue=async()=>{
  try{
    const orchestrationData: any = await AxiosService.post(
      '/UF/Orchestration',
      {
        key: "CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TPPTEST001:AFGK:TPPTEST002:AFK:VOB_Get_Accounts_Consents:AFVK:v1",
        componentId: "e912f360b0d746828435c4da9a0be189",
        controlId: "26d77a2ac2e54348980be6665da68093",
        isTable: false,
        from:"labelAccount Information Service",
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
  setais_groupbe189((pre:any)=>({...pre,ais_label:""}));
},[ais_label68093?.refresh])


const handleClick =async(e:any)=>{
  setais_groupbe189((prev: any) => ({ ...prev, ais_label: e.target.value }));
  let code = allCode;
    if (code != '') {
    let codeStates: any = {};
      codeStates['ais_group']  = ais_groupbe189,
      codeStates['setais_group'] = setais_groupbe189,
      codeStates['get_accounts']  = get_accounts1a859,
      codeStates['setget_accounts'] = setget_accounts1a859,
  codeExecution(code,codeStates);
  }
}


  if (ais_label68093?.isHidden) {
    return <></>
  }  

  return (
    <div 
      style={{gridColumn: `1 / 13`,gridRow: `1 / 13`, gap:``, height: `100%`, overflow: 'auto'}} >
      <Label 
        className=""
        size="m"
        disabled= {ais_label68093?.isDisabled ? true : false}
        theme="normal"
        interactive={false}
        onClick = {()=> handleClick }
      >
      Account Information Service
      </Label>
    </div>
  )
}

export default Labelais_label
