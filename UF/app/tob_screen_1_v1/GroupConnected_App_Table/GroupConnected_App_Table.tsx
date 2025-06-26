'use client'

import React,{ useEffect, useState,useContext } from 'react'
import { Grid } from "@gravity-ui/page-constructor";
import { AxiosService } from '@/app/components/axiosService'
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation'

import {Modal} from '@gravity-ui/uikit';
import { eventBus } from '@/app/eventBus';


import TableConnected_App_Table  from './TableConnected_App_Table';  
import TextConnected_Application  from "./TextConnected_Application";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment"
import { TotalContext, TotalContextProps } from '@/app/globalContext';


const GroupConnectedAppTable = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData}:any) => {
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
  const {API_Report360bc, setAPI_Report360bc} = useContext(TotalContext) as TotalContextProps
  const {isAPI_Report360bcContainValidataion, setAPI_Report360bcContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {API_Repo_Table8836e, setAPI_Repo_Table8836e} = useContext(TotalContext) as TotalContextProps
  const {isAPI_Repo_Table8836eContainValidataion, setAPI_Repo_Table8836eContainValidataion} = useContext(TotalContext) as TotalContextProps;
  const {Connected_App_Tablecff73, setConnected_App_Tablecff73} = useContext(TotalContext) as TotalContextProps
  const {isConnected_App_Tablecff73ContainValidataion, setConnected_App_Tablecff73ContainValidataion} = useContext(TotalContext) as TotalContextProps;
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
      key:"CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TOB001:AFGK:TOB002:AFK:TOB_Dashboard_Screen:AFVK:v1",componentId:"4bf572e7f63547d59e62cdd358ccff73",
      from:"GroupConnectedAppTable",
isTable : true,
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
  }


  const handleOnload=()=>{

  }
  useEffect(() => {    
    securityCheck()   
    handleOnload()
  }, [refresh?.groupConnected_App_Tablecff73])
  return (
    <div className="col-start-7 col-end-13 row-start-6 row-end-9 gap-10px border border-slate-300 p-2 rounded-md groupStyle">
      <Grid containerClass='grid grid-cols-12 gap-2 '>
        {allowedComponent.includes("connected_app_table")|| allowedComponent.includes("ALL") ? <TableConnected_App_Table lockedData={lockedData} setLockedData={setLockedData}  primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData}  refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
          {allowedComponent.includes("connected_application")|| allowedComponent.includes("ALL")  ? <TextConnected_Application   /* fcee9 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} /> : <div></div>}
      </Grid>
    </div>             
  )
}

export default GroupConnectedAppTable