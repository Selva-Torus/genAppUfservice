
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
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';

const Switchoutbound_or_inbound = ({checkToAdd,setCheckToAdd,encryptionFlagCompData}:any) => {
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
  const {transaction_groupcc5ac, settransaction_groupcc5ac}= useContext(TotalContext) as TotalContextProps;
  const {transaction_groupcc5acProps, settransaction_groupcc5acProps}= useContext(TotalContext) as TotalContextProps;
  const {tab_group05125, settab_group05125}= useContext(TotalContext) as TotalContextProps;
  const {tab_group05125Props, settab_group05125Props}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tab71a07, setview_all_tab71a07}= useContext(TotalContext) as TotalContextProps;
  const {view_all_table648c4, setview_all_table648c4}= useContext(TotalContext) as TotalContextProps;
  const {view_all_table648c4Props, setview_all_table648c4Props}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tab11090, setfailure_queue_tab11090}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_table449a9, setfailure_queue_table449a9}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_table449a9Props, setfailure_queue_table449a9Props}= useContext(TotalContext) as TotalContextProps;
  const {add_new_payment33109, setadd_new_payment33109}= useContext(TotalContext) as TotalContextProps;
  const {searchfdc03, setsearchfdc03}= useContext(TotalContext) as TotalContextProps;
  const {refresh59747, setrefresh59747}= useContext(TotalContext) as TotalContextProps;
  const {download53d76, setdownload53d76}= useContext(TotalContext) as TotalContextProps;
  const {outbound_or_inbound5dfa8, setoutbound_or_inbound5dfa8}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Transaction:AFVK:v1",
          componentId: "e7a2fc97bd954c2794c6346b05b05125",
          controlId: "4a40ae49888e4f0faed818cc1d05dfa8",
          isTable: false,
          from:"Switch",
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
      setAllCode(orchestrationData?.data?.code)
      setRuleCode(orchestrationData?.data?.rule)
    }catch(err)
    {
      console.log(err)
    }
  }

  useEffect(() => {
    handleMapperValue()
    settab_group05125((pre:any)=>({...pre,outbound_or_inbound:null}))
  },[outbound_or_inbound5dfa8?.refresh])


  const handleChange = async (checked: boolean) => {
    settab_group05125((prev: any) => ({ ...prev, outbound_or_inbound: checked }));
    let code:string= allCode;
    if (code != '') {
      let codeStates: any = {};
            codeStates['transaction_group']  = transaction_groupcc5ac,
            codeStates['settransaction_group'] = settransaction_groupcc5ac,
            codeStates['view_all_table']  = view_all_table648c4,
            codeStates['setview_all_table'] = setview_all_table648c4,
            codeStates['failure_queue_table']  = failure_queue_table449a9,
            codeStates['setfailure_queue_table'] = setfailure_queue_table449a9,
    codeExecution(code,codeStates)
    }
    let filterPropsEvaluateDecisionTable2:any = evaluateDecisionTable(ruleCode?.nodes,{outbound_or_inbound: checked},{...decodedTokenObj,...memoryVariables}) 
    let filterProps2:any =  [
  {
    "key": "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",
    "nodeBasedData": [
      {
        "nodeId": "5bc8f410f27248d88fc91b7fe01fb9c0",
        "object": {}
      }
    ]
  }
]
    delete filterProps2[0].nodeBasedData[0].object
    setview_all_table648c4Props((prev: any) => ({...prev,filterProps: [{
      ...(prev.filterProps?.[0] ?? {}),
      ...filterProps2[0].nodeBasedData[0],
      ...filterPropsEvaluateDecisionTable2 // NEW values
    }]})) 
    let filterPropsEvaluateDecisionTable4:any = evaluateDecisionTable(ruleCode?.nodes,{outbound_or_inbound: checked},{...decodedTokenObj,...memoryVariables}) 
    let filterProps4:any =  [
  {
    "key": "CK:CT005:FNGK:AF:FNK:DF-DFD:CATK:V001:AFGK:VGPH001:AFK:Get_Transaction_DFD:AFVK:v1",
    "nodeBasedData": [
      {
        "nodeId": "5bc8f410f27248d88fc91b7fe01fb9c0",
        "object": {}
      }
    ]
  }
]
    delete filterProps4[0].nodeBasedData[0].object
    setfailure_queue_table449a9Props((prev: any) => ({...prev,filterProps: [{
      ...(prev.filterProps?.[0] ?? {}),
      ...filterProps4[0].nodeBasedData[0],
      ...filterPropsEvaluateDecisionTable4 // NEW values
    }]})) 
  }

  async function handleConfirmOnChange(){
  } 
  if (outbound_or_inbound5dfa8?.isHidden) {
    return <></>
  }
  return (
    <div 
      className=""
      style={{gridColumn: `15 / 18`,gridRow: `2 / 7`, gap:``, height: `100%`, overflow: 'auto'}} >
      <Switch
        className="!bg-white !rounded-xl !p-1.5"
        disabled= {outbound_or_inbound5dfa8?.isDisabled ? true : false}
        content="OUTBOUND"
        checkedContent="INBOUND"                                                                                                                                             
        uncheckedContent="OUTBOUND"
        checked={tab_group05125?.outbound_or_inbound || false} 
        onChange={handleChange}
      />
  </div>
  )
}

export default Switchoutbound_or_inbound



