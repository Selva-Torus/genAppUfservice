'use client'

import React,{ useEffect, useState,useContext } from 'react'
import { Grid } from "@gravity-ui/page-constructor";
import { AxiosService } from '@/app/components/axiosService'
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation'

import {Modal} from '@gravity-ui/uikit';
import { eventBus } from '@/app/eventBus';


import TextIntegration_Metrics_Summary  from "./TextIntegration_Metrics_Summary";
import Cardtotal_calls  from "./Cardtotal_calls";
import Cardsuccess_rate  from "./Cardsuccess_rate";
import Carderror_rate  from "./Carderror_rate";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment"
import { TotalContext, TotalContextProps } from '@/app/globalContext';


const GroupSummaryTable = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData}:any) => {
  const [allowedComponent,setAllowedComponent]=useState<any>("")
  const toast=useInfoMsg()
  const confirmMsgFlag: boolean = false
  const {hide, setHide} = useContext(TotalContext) as TotalContextProps
  const {disable, setDisable} = useContext(TotalContext) as TotalContextProps
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps
  const [allCode,setAllCode]=useState<any>("")
  const token:string = getCookie('token'); 
  const routes = useRouter()
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
  const {Info_Groupaab7f, setInfo_Groupaab7f} = useContext(TotalContext) as TotalContextProps
  const {isInfo_Groupaab7fContainValidataion, setInfo_Groupaab7fContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {Summary_Table98cb0, setSummary_Table98cb0} = useContext(TotalContext) as TotalContextProps
  const {isSummary_Table98cb0ContainValidataion, setSummary_Table98cb0ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {API_Process_Log_Table4f441, setAPI_Process_Log_Table4f441} = useContext(TotalContext) as TotalContextProps
  const {isAPI_Process_Log_Table4f441ContainValidataion, setAPI_Process_Log_Table4f441ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {API_Info80710, setAPI_Info80710} = useContext(TotalContext) as TotalContextProps
  const {isAPI_Info80710ContainValidataion, setAPI_Info80710ContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const encryptionFlagComp: boolean = encryptionFlagPageData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagPageData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagPageData.method
  let encryptionFlagCompData :any ={
    "flag":encryptionFlagComp,
    "dpd":encryptionDpd,
    "method":encryptionMethod
  }
  async function securityCheck() {
    let orchestrationBody:any ={
      key:"CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TOB001:AFGK:TOB002:AFK:TOB_API_Info:AFVK:v1",componentId:"0f31e3de309647629822428f06f98cb0",
      from:"GroupSummaryTable",
accessProfile:accessProfile
    }
    if (encryptionFlagComp) {          
      orchestrationBody["dpdKey"] = encryptionDpd;
      orchestrationBody["method"] = encryptionMethod;
    }
    const orchestrationData:any = await AxiosService.post("/UF/Orchestration",orchestrationBody,{
      headers: {
        Authorization: `Bearer ${token}`
      }})
    const uf_dfKey:string[] = orchestrationData?.data?.DFkeys;
    const code:string = orchestrationData?.data?.code;
    const security:string = orchestrationData?.data?.security;
    if(orchestrationData?.data?.error === true){
      toast(orchestrationData?.data?.errorDetails?.message, 'danger')
      return
    }
    setAllowedComponent(security)  
    if (code === 'undefined' || code === null || code === undefined || code === '') {
      let codeStates: any = {}      
          codeStates['Info_Group'] = Info_Groupaab7f; 
          codeStates['setInfo_Group'] = setInfo_Groupaab7f
          codeStates['Summary_Table'] = Summary_Table98cb0; 
          codeStates['setSummary_Table'] = setSummary_Table98cb0
          codeStates['API_Process_Log_Table'] = API_Process_Log_Table4f441; 
          codeStates['setAPI_Process_Log_Table'] = setAPI_Process_Log_Table4f441
          codeStates['API_Info'] = API_Info80710; 
          codeStates['setAPI_Info'] = setAPI_Info80710

    codeExecution(code,codeStates)
    } 
  }


  const handleOnload=()=>{

  }
  useEffect(() => {    
    securityCheck()   
    handleOnload()
  }, [refresh?.groupSummary_Table98cb0])
  return (
    <div className="col-start-9 col-end-13 row-start-2 row-end-4 gap-10px border border-slate-300 p-2 rounded-md groupStyle">
      <Grid containerClass='grid grid-cols-12 gap-2 '>
          {allowedComponent.includes("integration_metrics_summary")|| allowedComponent.includes("ALL")  ? <TextIntegration_Metrics_Summary   /* 3134b */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} /> : <div></div>}
        {allowedComponent.includes("total_calls")|| allowedComponent.includes("ALL")  ? <Cardtotal_calls  /* 2f181 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  /> : <div></div>}
        {allowedComponent.includes("success_rate")|| allowedComponent.includes("ALL")  ? <Cardsuccess_rate  /* e5646 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  /> : <div></div>}
        {allowedComponent.includes("error_rate")|| allowedComponent.includes("ALL")  ? <Carderror_rate  /* 4859e */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  /> : <div></div>}
      </Grid>
    </div>             
  )
}

export default GroupSummaryTable