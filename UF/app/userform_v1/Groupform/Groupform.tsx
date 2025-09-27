'use client'

import React,{ useEffect, useState,useContext, useRef } from 'react';
import { Grid } from "@gravity-ui/page-constructor";
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import {Modal} from '@gravity-ui/uikit';
import { eventBus } from '@/app/eventBus';

import TextInputname  from "./TextInputname";
import TextInputage  from "./TextInputage";
import Buttonsave  from "./Buttonsave";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';


const GroupForm = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData}:any) => {

  const securityData:any={
  "Template 1": {
    "allowedControls": [
      "name",
      "age",
      "save"
    ],
    "allowedGroups": [
      "canvas",
      "form"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  }
};
  let code:any = ``;
  const prevRefreshRef = useRef(false);
  const [allowedComponent,setAllowedComponent]=useState<any>("");
  const [allowedControls,setAllowedControls]=useState<any>("");
  const toast=useInfoMsg();
  const confirmMsgFlag: boolean = false;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const [allCode,setAllCode]=useState<any>("");
  const token:string = getCookie('token'); 
  const routes = useRouter();
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
 /////////////
   //another screen
  const {forma62ff, setforma62ff}= useContext(TotalContext) as TotalContextProps;
  const {forma62ffProps, setforma62ffProps}= useContext(TotalContext) as TotalContextProps;
  const {name8eedd, setname8eedd}= useContext(TotalContext) as TotalContextProps;
  const {age7d25a, setage7d25a}= useContext(TotalContext) as TotalContextProps;
  const {save3d5e3, setsave3d5e3}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const encryptionFlagComp: boolean = encryptionFlagPageData?.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagPageData?.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagPageData?.method;
  let encryptionFlagCompData :any ={
    "flag":encryptionFlagComp,
    "dpd":encryptionDpd,
    "method":encryptionMethod
  };
  
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT266:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:userform:AFVK:v1",componentId:"d1ef2bef95ab46a1b105470f5f1a62ff",from:"GroupForm",accessProfile:accessProfile},{
    headers: {
      Authorization: `Bearer ${token}`
    }})
  code = orchestrationData?.data?.code;
  const security:any[] = orchestrationData?.data?.security;
  const allowedGroups:any[] = orchestrationData?.data?.allowedGroups;
  if(orchestrationData?.data?.error === true){
    toast(orchestrationData?.data?.errorDetails?.message, 'danger')
    return
  }
  setAllowedControls(security) 
  setAllowedComponent(allowedGroups) 
    
  /////////////
    if(orchestrationData?.data?.readableControls.includes("name")){
      setname8eedd({...name8eedd,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("age")){
      setage7d25a({...age7d25a,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("save")){
      setsave3d5e3({...save3d5e3,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['form']  = forma62ff,
      codeStates['setform'] = setforma62ff,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(forma62ff) && Object.keys(forma62ff)?.length>0)
      {
        setforma62ff({})
      }
    }else 
      prevRefreshRef.current= true
  }, [forma62ffProps?.refresh])

  return (
    <div className="col-start-1 col-end-13 row-start-1 row-end-5 gap-  p-2 rounded-md groupStyle">
      <Grid containerClass='grid grid-cols-12 gap-2 '>
        {allowedControls.includes("name") ? <TextInputname   /* 8eedd */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} /> : <div></div>}
        {allowedControls.includes("age") ? <TextInputage   /* 7d25a */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} /> : <div></div>}
        {allowedControls.includes("save")  ? <Buttonsave lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/> : <div></div>}          
      </Grid>
    </div>             
  )
}

export default GroupForm