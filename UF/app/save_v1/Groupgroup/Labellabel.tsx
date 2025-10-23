'use client'

import { Icon } from '@gravity-ui/uikit';
import { Star } from '@gravity-ui/icons';
import React, {useState, useContext,useEffect } from 'react';
import { AxiosService } from "@/app/components/axiosService";
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment';
import { codeExecution } from '@/app/utils/codeExecution';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { Label, Text } from '@gravity-ui/uikit';
import { useRouter } from 'next/navigation';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { eventBus } from '@/app/eventBus';
import {Modal} from '@gravity-ui/uikit';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';

const Labellabel = ({encryptionFlagCompData}:any) => {
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
  const {group5384d, setgroup5384d}= useContext(TotalContext) as TotalContextProps;
  const {group5384dProps, setgroup5384dProps}= useContext(TotalContext) as TotalContextProps;
  const {save11c8e, setsave11c8e}= useContext(TotalContext) as TotalContextProps;
  const {buttonreject8b1d9, setbuttonreject8b1d9}= useContext(TotalContext) as TotalContextProps;
  const {label0cb72, setlabel0cb72}= useContext(TotalContext) as TotalContextProps;
  const {name1ef9f, setname1ef9f}= useContext(TotalContext) as TotalContextProps;
  const {age6bba1, setage6bba1}= useContext(TotalContext) as TotalContextProps;
  const {street1e063, setstreet1e063}= useContext(TotalContext) as TotalContextProps;
  //////////////


const handleMapperValue=async()=>{
  try{
    const orchestrationData: any = await AxiosService.post(
      '/UF/Orchestration',
      {
        key: "CK:TT407:FNGK:AF:FNK:UF-UFW:CATK:CGFA:AFGK:TG4CGFA:AFK:Testasample:AFVK:v1",
        componentId: "414718cf9b784538acdbc0a9cb15384d",
        controlId: "03fb67d73788428ba946a7a04160cb72",
        isTable: false,
        from:"label",
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
  setgroup5384d((pre:any)=>({...pre,label:""}));
},[label0cb72?.refresh])


const handleClick =async(e:any)=>{
  setgroup5384d((prev: any) => ({ ...prev, label: e}));
  let code = allCode;
    if (code != '') {
    let codeStates: any = {};
      codeStates['group']  = group5384d,
      codeStates['setgroup'] = setgroup5384d,
  codeExecution(code,codeStates);
  }
}


  if (label0cb72?.isHidden) {
    return <></>
  }  

  return (
    <div 
      style={{gridColumn: `8 / 10`,gridRow: `23 / 33`, gap:``, height: `100%`, overflow: 'auto'}} >
      <Label 
        className=""
        size="m"
        icon={<Icon size={20} data={Star} />}
        disabled= {label0cb72?.isDisabled ? true : false}
        theme="normal"
        interactive={false}
        onClick = { handleClick }
      >
      {group5384d?.label||""}
      </Label>
    </div>
  )
}

export default Labellabel
