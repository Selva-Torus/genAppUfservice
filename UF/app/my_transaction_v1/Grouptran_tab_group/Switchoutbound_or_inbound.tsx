
'use client'
import React, { useState, useContext, useEffect, useRef } from 'react';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { codeExecution } from '@/app/utils/codeExecution';
import { deleteAllCookies,getCookie } from '@/app/components/cookieMgment'
import { Switch } from '@/components/Switch'
import { Text } from '@/components/Text'
import { AxiosService } from "@/app/components/axiosService";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { useRouter } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import { eventBus } from '@/app/eventBus';
import { te_refreshDto } from '@/app/interfaces/interfaces';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import {Modal} from '@/components/Modal';
import evaluateDecisionTable from '@/app/utils/evaluateDecisionTable';
import decodeToken from '@/app/components/decodeToken';
import { eventDecisionTable } from '@/app/utils/evaluateDecisionTable';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { getGroupOrchestrationData, getControlOrchestrationData } from '@/app/utils/Orchestration';

const Switchoutbound_or_inbound = ({checkToAdd,setCheckToAdd,encryptionFlagCompData,setIsProcessing,controlData}:any) => {
  const token:string = getCookie('token');
  const decodedTokenObj: any = decodeToken(token);
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const [allCode,setAllCode] = useState<string>("");
  const [ruleCode,setRuleCode] = useState<any>("");
  const toast : Function = useInfoMsg();
  const routes : AppRouterInstance = useRouter();
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState<boolean>(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState<boolean>(false);
  const prevRefreshRef = useRef<any>(false);
 /////////////
   //another screen
  const {tran_main_group1dc7f, settran_main_group1dc7f}= useContext(TotalContext) as TotalContextProps;
  const {tran_main_group1dc7fProps, settran_main_group1dc7fProps}= useContext(TotalContext) as TotalContextProps;
  const {tran_tab_group08b64, settran_tab_group08b64}= useContext(TotalContext) as TotalContextProps;
  const {tran_tab_group08b64Props, settran_tab_group08b64Props}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tab4a963, setview_all_tab4a963}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tablec9e87, setview_all_tablec9e87}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tablec9e87Props, setview_all_tablec9e87Props}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tab69f01, setfailure_queue_tab69f01}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tablea476f, setfailure_queue_tablea476f}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tablea476fProps, setfailure_queue_tablea476fProps}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_tabef582, setsuccess_queue_tabef582}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_table63aae, setsuccess_queue_table63aae}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_table63aaeProps, setsuccess_queue_table63aaeProps}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_tab5611e, setreturn_queue_tab5611e}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_table267f0, setreturn_queue_table267f0}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_table267f0Props, setreturn_queue_table267f0Props}= useContext(TotalContext) as TotalContextProps;
  const {outbound_or_inbound5e076, setoutbound_or_inbound5e076}= useContext(TotalContext) as TotalContextProps;
  const {search14cf0, setsearch14cf0}= useContext(TotalContext) as TotalContextProps;
  const {refresh313d0, setrefresh313d0}= useContext(TotalContext) as TotalContextProps;
  const {downloadcb505, setdownloadcb505}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const handleMapperValue=async()=>{
    try{
    const orchestrationData = getControlOrchestrationData(
      controlData,
      "cbe34c122c574df4884941f1efe08b64",
      "ca12c2b73e5b4e6fb12328ecdb75e076"
    );
      if(orchestrationData?.data?.error == true){
        return
      }
      setAllCode(orchestrationData?.data?.code)
      setRuleCode(orchestrationData?.data?.rule)
    }catch(err)
    {
      console.log(err)
    }
  }

  useEffect(() => {
    handleMapperValue()
    settran_tab_group08b64((pre:any)=>({...pre,outbound_or_inbound:null}))
  },[outbound_or_inbound5e076?.refresh])


  const handleChange = async (checked: boolean) => {
    try{
    setIsProcessing(true);
    settran_tab_group08b64((prev: any) => ({ ...prev, outbound_or_inbound: checked }));
    let code:string= allCode;
    if (code != '') {
      let codeStates: any = {};
        codeStates['tran_main_group'] = tran_main_group1dc7f,
        codeStates['settran_main_group'] = settran_main_group1dc7f,
        codeStates['tran_main_group1dc7f'] = tran_main_group1dc7fProps,
        codeStates['settran_main_group1dc7f'] = settran_main_group1dc7fProps,
        codeStates['tran_tab_group'] = tran_tab_group08b64,
        codeStates['settran_tab_group'] = settran_tab_group08b64,
        codeStates['tran_tab_group08b64'] = tran_tab_group08b64Props,
        codeStates['settran_tab_group08b64'] = settran_tab_group08b64Props,
        codeStates['view_all_tab'] = view_all_tab4a963,
        codeStates['setview_all_tab'] = setview_all_tab4a963,
        codeStates['view_all_table'] = view_all_tablec9e87,
        codeStates['setview_all_table'] = setview_all_tablec9e87,
        codeStates['view_all_tablec9e87'] = view_all_tablec9e87Props,
        codeStates['setview_all_tablec9e87'] = setview_all_tablec9e87Props,
        codeStates['failure_queue_tab'] = failure_queue_tab69f01,
        codeStates['setfailure_queue_tab'] = setfailure_queue_tab69f01,
        codeStates['failure_queue_table'] = failure_queue_tablea476f,
        codeStates['setfailure_queue_table'] = setfailure_queue_tablea476f,
        codeStates['failure_queue_tablea476f'] = failure_queue_tablea476fProps,
        codeStates['setfailure_queue_tablea476f'] = setfailure_queue_tablea476fProps,
        codeStates['success_queue_tab'] = success_queue_tabef582,
        codeStates['setsuccess_queue_tab'] = setsuccess_queue_tabef582,
        codeStates['success_queue_table'] = success_queue_table63aae,
        codeStates['setsuccess_queue_table'] = setsuccess_queue_table63aae,
        codeStates['success_queue_table63aae'] = success_queue_table63aaeProps,
        codeStates['setsuccess_queue_table63aae'] = setsuccess_queue_table63aaeProps,
        codeStates['return_queue_tab'] = return_queue_tab5611e,
        codeStates['setreturn_queue_tab'] = setreturn_queue_tab5611e,
        codeStates['return_queue_table'] = return_queue_table267f0,
        codeStates['setreturn_queue_table'] = setreturn_queue_table267f0,
        codeStates['return_queue_table267f0'] = return_queue_table267f0Props,
        codeStates['setreturn_queue_table267f0'] = setreturn_queue_table267f0Props,
        codeStates['outbound_or_inbound'] = outbound_or_inbound5e076,
        codeStates['setoutbound_or_inbound'] = setoutbound_or_inbound5e076,
        codeStates['search'] = search14cf0,
        codeStates['setsearch'] = setsearch14cf0,
        codeStates['refresh'] = refresh313d0,
        codeStates['setrefresh'] = setrefresh313d0,
        codeStates['download'] = downloadcb505,
        codeStates['setdownload'] = setdownloadcb505,
    codeExecution(code,codeStates)
    }
    let filterPropsEvaluateDecisionTable2:any = evaluateDecisionTable(ruleCode?.nodes,{outbound_or_inbound: checked},{...decodedTokenObj,...memoryVariables}) 
    let filterProps2:any =  [
  {
    "key": "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",
    "nodeBasedData": [
      {
        "nodeId": "c2a320f6a30140a487ed20c46f1763dd",
        "object": {
          "properties.direction": "outbound_or_inbound"
        }
      }
    ]
  }
]
    delete filterProps2[0].nodeBasedData[0].object
    setview_all_tablec9e87Props((prev: any) => ({...prev,filterProps: [{
      ...(prev.filterProps?.[0] ?? {}),
      ...filterProps2[0].nodeBasedData[0],
      ...filterPropsEvaluateDecisionTable2 // NEW values
    }]})) 
    let filterPropsEvaluateDecisionTable4:any = evaluateDecisionTable(ruleCode?.nodes,{outbound_or_inbound: checked},{...decodedTokenObj,...memoryVariables}) 
    let filterProps4:any =  [
  {
    "key": "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",
    "nodeBasedData": [
      {
        "nodeId": "c2a320f6a30140a487ed20c46f1763dd",
        "object": {
          "properties.direction": "outbound_or_inbound"
        }
      }
    ]
  }
]
    delete filterProps4[0].nodeBasedData[0].object
    setfailure_queue_tablea476fProps((prev: any) => ({...prev,filterProps: [{
      ...(prev.filterProps?.[0] ?? {}),
      ...filterProps4[0].nodeBasedData[0],
      ...filterPropsEvaluateDecisionTable4 // NEW values
    }]})) 
    let filterPropsEvaluateDecisionTable6:any = evaluateDecisionTable(ruleCode?.nodes,{outbound_or_inbound: checked},{...decodedTokenObj,...memoryVariables}) 
    let filterProps6:any =  [
  {
    "key": "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",
    "nodeBasedData": [
      {
        "nodeId": "c2a320f6a30140a487ed20c46f1763dd",
        "object": {
          "properties.direction": "outbound_or_inbound"
        }
      }
    ]
  }
]
    delete filterProps6[0].nodeBasedData[0].object
    setsuccess_queue_table63aaeProps((prev: any) => ({...prev,filterProps: [{
      ...(prev.filterProps?.[0] ?? {}),
      ...filterProps6[0].nodeBasedData[0],
      ...filterPropsEvaluateDecisionTable6 // NEW values
    }]})) 
    let filterPropsEvaluateDecisionTable8:any = evaluateDecisionTable(ruleCode?.nodes,{outbound_or_inbound: checked},{...decodedTokenObj,...memoryVariables}) 
    let filterProps8:any =  [
  {
    "key": "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:GSS:AFGK:VGPH:AFK:transaction:AFVK:v1",
    "nodeBasedData": [
      {
        "nodeId": "c2a320f6a30140a487ed20c46f1763dd",
        "object": {
          "properties.direction": "outbound_or_inbound"
        }
      }
    ]
  }
]
    delete filterProps8[0].nodeBasedData[0].object
    setreturn_queue_table267f0Props((prev: any) => ({...prev,filterProps: [{
      ...(prev.filterProps?.[0] ?? {}),
      ...filterProps8[0].nodeBasedData[0],
      ...filterPropsEvaluateDecisionTable8 // NEW values
    }]})) 
    }catch (err: any) {
      setIsProcessing(false);
      if(typeof err == 'string')
        toast(err, 'danger');
      else
        toast(err?.response?.data?.errorDetails?.message, 'danger');
    }finally{
      setIsProcessing(false);
    }
  }

  async function handleConfirmOnChange(){
  } 
  if (outbound_or_inbound5e076?.isHidden) {
    return <></>
  }
  return (
    <div 
      className=""
      style={{gridColumn: `13 / 18`,gridRow: `2 / 11`, gap:``, height: `100%`, overflow: 'auto'}} >
      <Switch
        className="!bg-white !rounded-md !p-1.5"
        disabled= {outbound_or_inbound5e076?.isDisabled ? true : false}
        content="OUTBOUND"
        checkedContent="INBOUND"                                                                                                                                             
        uncheckedContent="OUTBOUND"
        checked={tran_tab_group08b64?.outbound_or_inbound || false} 
        onChange={handleChange}
      />
  </div>
  )
}

export default Switchoutbound_or_inbound



