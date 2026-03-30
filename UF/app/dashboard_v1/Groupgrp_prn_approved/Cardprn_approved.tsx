'use client'


import React, { useState, useContext, useEffect, useRef } from 'react'; 
import { Text } from '@/components/Text';
import { Card } from '@/components/Card';
import { Modal } from '@/components/Modal';
import { Icon } from '@/components/Icon';
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { getCookie } from '@/app/components/cookieMgment';
import { AxiosService } from "@/app/components/axiosService";
import { codeExecution } from '@/app/utils/codeExecution';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { useRouter } from 'next/navigation';
import { eventBus } from '@/app/eventBus';
import { getFilterProps, getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { te_refreshDto } from '@/app/interfaces/interfaces';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { DecodedToken,PrimaryTableData,SecurityData,EncryptionFlagPageData,PaginationData,AllowedGroupNode,ActionDetails } from "@/types/global";
import { eventDecisionTable } from '@/app/utils/evaluateDecisionTable';
import decodeToken from '@/app/components/decodeToken';
import i18n from '@/app/components/i18n';

const Cardprn_approved = ({checkToAdd,setCheckToAdd,encryptionFlagCompData}:any) => {
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const token: string = getCookie('token');
  const decodedTokenObj:any = decodeToken(token);
  const {dfd_itax_dashboard_cards_v1Props, setdfd_itax_dashboard_cards_v1Props} = useContext(TotalContext) as TotalContextProps; 
  const keyset:any=i18n.keyset("language");
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  const toast : Function=useInfoMsg();
  const routes : AppRouterInstance  = useRouter();
  const prevRefreshRef = useRef<any>(false);
  //showComponentAsPopup || showArtifactAsModal
  /////////////
   //another screen
  const {itaxgroup732e5, setitaxgroup732e5}= useContext(TotalContext) as TotalContextProps  
  const {itaxgroup732e5Props, setitaxgroup732e5Props}= useContext(TotalContext) as TotalContextProps  
  const {overall_dashboard54180, setoverall_dashboard54180}= useContext(TotalContext) as TotalContextProps  
  const {overall_dashboard54180Props, setoverall_dashboard54180Props}= useContext(TotalContext) as TotalContextProps  
  const {grp_total_transactionse00c2, setgrp_total_transactionse00c2}= useContext(TotalContext) as TotalContextProps  
  const {grp_total_transactionse00c2Props, setgrp_total_transactionse00c2Props}= useContext(TotalContext) as TotalContextProps  
  const {grp_prn_initiated2f421, setgrp_prn_initiated2f421}= useContext(TotalContext) as TotalContextProps  
  const {grp_prn_initiated2f421Props, setgrp_prn_initiated2f421Props}= useContext(TotalContext) as TotalContextProps  
  const {grp_prn_approvedb95cb, setgrp_prn_approvedb95cb}= useContext(TotalContext) as TotalContextProps  
  const {grp_prn_approvedb95cbProps, setgrp_prn_approvedb95cbProps}= useContext(TotalContext) as TotalContextProps  
  const {prn_approvedff8ef, setprn_approvedff8ef}= useContext(TotalContext) as TotalContextProps  
  const {grp_credit_pendingfe0e2, setgrp_credit_pendingfe0e2}= useContext(TotalContext) as TotalContextProps  
  const {grp_credit_pendingfe0e2Props, setgrp_credit_pendingfe0e2Props}= useContext(TotalContext) as TotalContextProps  
  const {grp_credit_approved7e3bd, setgrp_credit_approved7e3bd}= useContext(TotalContext) as TotalContextProps  
  const {grp_credit_approved7e3bdProps, setgrp_credit_approved7e3bdProps}= useContext(TotalContext) as TotalContextProps  
  const {grp_payment_completed34dec, setgrp_payment_completed34dec}= useContext(TotalContext) as TotalContextProps  
  const {grp_payment_completed34decProps, setgrp_payment_completed34decProps}= useContext(TotalContext) as TotalContextProps  
  const {grp_bar_chart02e16, setgrp_bar_chart02e16}= useContext(TotalContext) as TotalContextProps  
  const {grp_bar_chart02e16Props, setgrp_bar_chart02e16Props}= useContext(TotalContext) as TotalContextProps  
  const {grp_pie_chart2415d, setgrp_pie_chart2415d}= useContext(TotalContext) as TotalContextProps  
  const {grp_pie_chart2415dProps, setgrp_pie_chart2415dProps}= useContext(TotalContext) as TotalContextProps  
  //////////////
 
  
  const handleMapperDetails=async():Promise<void>=>{
    try{
    let code:string;
    const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Dashboard:AFVK:v1",  componentId:"77aa4a68fb384b1ba6b788dad85b95cb",controlId:"65181bb846ff4d5a95dcb90bdacff8ef",isTable:false,accessProfile:accessProfile,from:"cardPRN Approved"},{
      headers: {
        Authorization: `Bearer ${token}`
    }})
    code = orchestrationData?.data?.code;
    if (code != '') {
          let codeStates: Record<string, any> = {}
          codeStates['itaxgroup']  = itaxgroup732e5,
          codeStates['setitaxgroup'] = setitaxgroup732e5,
          codeStates['overall_dashboard']  = overall_dashboard54180,
          codeStates['setoverall_dashboard'] = setoverall_dashboard54180,
          codeStates['grp_total_transactions']  = grp_total_transactionse00c2,
          codeStates['setgrp_total_transactions'] = setgrp_total_transactionse00c2,
          codeStates['grp_prn_initiated']  = grp_prn_initiated2f421,
          codeStates['setgrp_prn_initiated'] = setgrp_prn_initiated2f421,
          codeStates['grp_prn_approved']  = grp_prn_approvedb95cb,
          codeStates['setgrp_prn_approved'] = setgrp_prn_approvedb95cb,
          codeStates['grp_credit_pending']  = grp_credit_pendingfe0e2,
          codeStates['setgrp_credit_pending'] = setgrp_credit_pendingfe0e2,
          codeStates['grp_credit_approved']  = grp_credit_approved7e3bd,
          codeStates['setgrp_credit_approved'] = setgrp_credit_approved7e3bd,
          codeStates['grp_payment_completed']  = grp_payment_completed34dec,
          codeStates['setgrp_payment_completed'] = setgrp_payment_completed34dec,
          codeStates['grp_bar_chart']  = grp_bar_chart02e16,
          codeStates['setgrp_bar_chart'] = setgrp_bar_chart02e16,
          codeStates['grp_pie_chart']  = grp_pie_chart2415d,
          codeStates['setgrp_pie_chart'] = setgrp_pie_chart2415d,
        codeExecution(code,codeStates)
      }
    }catch(err){
      console.log(err)
    }
    try{
      if(Array.isArray(dfd_itax_dashboard_cards_v1Props)){
      setgrp_prn_approvedb95cb((pre:any)=>({...pre,prn_approved:dfd_itax_dashboard_cards_v1Props[0]?.prn_approved}));
  }
    }catch(err){
      console.log(err);
    }
  }

  const handleClick=async(value:Record<string, any>):Promise<void>=>{
  }


useEffect(() => {
  if (prevRefreshRef.current) {
    handleMapperDetails()
  }else 
  prevRefreshRef.current= true
},[prn_approvedff8ef?.refresh])

useEffect(() => {
  if(Array.isArray(dfd_itax_dashboard_cards_v1Props)){
    setgrp_prn_approvedb95cb((pre:any)=>({...pre,prn_approved:dfd_itax_dashboard_cards_v1Props[0]?.prn_approved}));
  }
},[dfd_itax_dashboard_cards_v1Props])

  const style = {
    
    display: 'flex',
   // boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.2)', 
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  if (prn_approvedff8ef?.isHidden) {
    return <></>
  }  
  return (
    <div 
    style={{gridColumn: `1 / 25`,gridRow: `1 / 34`, gap:``, height: `100%`, overflow: 'auto'}} >
      <Card 
      style={style}
      className="p-1 !text-2xl !text-white font-bold"   
      theme="normal"
      view="clear"
      icon="MdOutlinePendingActions"
      label={keyset("PRN Approved")}
      disabled= {prn_approvedff8ef?.isDisabled ? true : false}
      onClick={handleClick} 
      contentAlign={"center"}
      >
      {grp_prn_approvedb95cb?.prn_approved?grp_prn_approvedb95cb?.prn_approved:"0"}
      </Card>
    </div>
  )
}

export default Cardprn_approved
