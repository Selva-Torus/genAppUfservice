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
import TextInputage  from "./TextInputage";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';


const GroupgroupB = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails}:any)=> {
  const token:string = getCookie('token'); 
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
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
  const securityData:any={};
  let code:any = ``;
  const prevRefreshRef = useRef(false);
  const [allowedComponent,setAllowedComponent]=useState<any>("");
  const [allowedControls,setAllowedControls]=useState<any>("");
  const toast=useInfoMsg();
  const confirmMsgFlag: boolean = false;
  const [allCode,setAllCode]=useState<any>("");
  const routes = useRouter();
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
 /////////////
   //another screen
  const {main6d2c7, setmain6d2c7}= useContext(TotalContext) as TotalContextProps;
  const {main6d2c7Props, setmain6d2c7Props}= useContext(TotalContext) as TotalContextProps;
  const {groupad476b, setgroupad476b}= useContext(TotalContext) as TotalContextProps;
  const {groupad476bProps, setgroupad476bProps}= useContext(TotalContext) as TotalContextProps;
  const {groupb66b0d, setgroupb66b0d}= useContext(TotalContext) as TotalContextProps;
  const {groupb66b0dProps, setgroupb66b0dProps}= useContext(TotalContext) as TotalContextProps;
  const {age9919a, setage9919a}= useContext(TotalContext) as TotalContextProps;
  const {groupc59a19, setgroupc59a19}= useContext(TotalContext) as TotalContextProps;
  const {groupc59a19Props, setgroupc59a19Props}= useContext(TotalContext) as TotalContextProps;
  const {groupde191f, setgroupde191f}= useContext(TotalContext) as TotalContextProps;
  const {groupde191fProps, setgroupde191fProps}= useContext(TotalContext) as TotalContextProps;
  //////////////
  
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:TT407:FNGK:AF:FNK:UF-UFW:CATK:CGFA:AFGK:TG4CGFA:AFK:forPFCheckUF:AFVK:v1",componentId:"4031f31d86804f2282d6b4b8bec66b0d",from:"GroupGroupb",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("age")){
      setage9919a({...age9919a,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['main']  = main6d2c7,
      codeStates['setmain'] = setmain6d2c7,
      codeStates['groupa']  = groupad476b,
      codeStates['setgroupa'] = setgroupad476b,
      codeStates['groupb']  = groupb66b0d,
      codeStates['setgroupb'] = setgroupb66b0d,
      codeStates['groupc']  = groupc59a19,
      codeStates['setgroupc'] = setgroupc59a19,
      codeStates['groupd']  = groupde191f,
      codeStates['setgroupd'] = setgroupde191f,

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
      if(!Array.isArray(groupb66b0d) && Object.keys(groupb66b0d)?.length>0)
      {
        setgroupb66b0d({})
      }
    }else 
      prevRefreshRef.current= true
  }, [groupb66b0dProps?.refresh])

  return (
    <div style = {{"gridAutoRows":"50px","display":"grid","gridTemplateColumns":"repeat(12, 1fr)","gridTemplateRows":"repeat(auto-fill, minmax(50px, 1fr))","gridColumn":"7 / 12","gridRow":"2 / 9","height":"100vh","overflow":"auto"}}
        className=" rounded-md " >
        {allowedControls.includes("age") ?<TextInputage   /* 9919a */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>             
  )
}

export default GroupgroupB
