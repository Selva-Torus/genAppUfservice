




'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleGroupArrayCopyFormData } from '@/app/utils/commonfunctions'; 
import { CommonHeaderAndTooltip } from '@/components/CommonHeaderAndTooltip';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import evaluateDecisionTable from '@/app/utils/evaluateDecisionTable';
import decodeToken from '@/app/components/decodeToken';
import uoMapperData from '@/context/dfdmapperContolnames.json';
import BarChartsbar_chart  from "./BarChartsbar_chart";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupgrp_bar_chart = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing}:any)=> {
  const token:string = getCookie('token'); 
  const decodedTokenObj:any = decodeToken(token);
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const copyFormData=useHandleGroupArrayCopyFormData()
  let code:any = ``;
  let idx = "";
  let item = "";
  const { isDark, isHighContrast, bgStyle, textStyle } = useTheme();
  const {dfd_itax_dashboard_cards_v1Props, setdfd_itax_dashboard_cards_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_itax_bar_chart_dfd_v1Props, setdfd_itax_bar_chart_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_itax_pie_chart_dfd_v1Props, setdfd_itax_pie_chart_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
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
  const [showFlag, setShowFlag] = React.useState<string>("");
  const securityData:any={
  "Branch Officer": {
    "allowedControls": [
      "bar_chart"
    ],
    "allowedGroups": [
      "canvas",
      "itaxgroup",
      "overall_dashboard",
      "grp_total_transactions",
      "grp_prn_initiated",
      "grp_prn_approved",
      "grp_credit_pending",
      "grp_credit_approved",
      "grp_payment_completed",
      "grp_bar_chart",
      "grp_pie_chart"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Branch Manager": {
    "allowedControls": [
      "bar_chart"
    ],
    "allowedGroups": [
      "canvas",
      "itaxgroup",
      "overall_dashboard",
      "grp_total_transactions",
      "grp_prn_initiated",
      "grp_prn_approved",
      "grp_credit_pending",
      "grp_credit_approved",
      "grp_payment_completed",
      "grp_bar_chart",
      "grp_pie_chart"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Credit Approver": {
    "allowedControls": [
      "bar_chart"
    ],
    "allowedGroups": [
      "canvas",
      "itaxgroup",
      "overall_dashboard",
      "grp_total_transactions",
      "grp_prn_initiated",
      "grp_prn_approved",
      "grp_credit_pending",
      "grp_credit_approved",
      "grp_payment_completed",
      "grp_bar_chart",
      "grp_pie_chart"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "System Administrator": {
    "allowedControls": [
      "bar_chart"
    ],
    "allowedGroups": [
      "canvas",
      "itaxgroup",
      "overall_dashboard",
      "grp_total_transactions",
      "grp_prn_initiated",
      "grp_prn_approved",
      "grp_credit_pending",
      "grp_credit_approved",
      "grp_payment_completed",
      "grp_bar_chart",
      "grp_pie_chart"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  }
};
  const prevRefreshRef = useRef(false);
  const [allowedComponent,setAllowedComponent]=useState<any>("");
  const [allowedControls,setAllowedControls]=useState<any>("");
  const toast=useInfoMsg();
  const confirmMsgFlag: boolean = false;
  const [allCode,setAllCode]=useState<any>("");
  const routes = useRouter();
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const [ButtonGoRuleData,setButtonGoRuleData]=useState<any>({})
 /////////////
   //another screen
  const {itaxgroup732e5, setitaxgroup732e5}= useContext(TotalContext) as TotalContextProps;
  const {itaxgroup732e5Props, setitaxgroup732e5Props}= useContext(TotalContext) as TotalContextProps;
  const {overall_dashboard54180, setoverall_dashboard54180}= useContext(TotalContext) as TotalContextProps;
  const {overall_dashboard54180Props, setoverall_dashboard54180Props}= useContext(TotalContext) as TotalContextProps;
  const {grp_total_transactionse00c2, setgrp_total_transactionse00c2}= useContext(TotalContext) as TotalContextProps;
  const {grp_total_transactionse00c2Props, setgrp_total_transactionse00c2Props}= useContext(TotalContext) as TotalContextProps;
  const {grp_prn_initiated2f421, setgrp_prn_initiated2f421}= useContext(TotalContext) as TotalContextProps;
  const {grp_prn_initiated2f421Props, setgrp_prn_initiated2f421Props}= useContext(TotalContext) as TotalContextProps;
  const {grp_prn_approvedb95cb, setgrp_prn_approvedb95cb}= useContext(TotalContext) as TotalContextProps;
  const {grp_prn_approvedb95cbProps, setgrp_prn_approvedb95cbProps}= useContext(TotalContext) as TotalContextProps;
  const {grp_credit_pendingfe0e2, setgrp_credit_pendingfe0e2}= useContext(TotalContext) as TotalContextProps;
  const {grp_credit_pendingfe0e2Props, setgrp_credit_pendingfe0e2Props}= useContext(TotalContext) as TotalContextProps;
  const {grp_credit_approved7e3bd, setgrp_credit_approved7e3bd}= useContext(TotalContext) as TotalContextProps;
  const {grp_credit_approved7e3bdProps, setgrp_credit_approved7e3bdProps}= useContext(TotalContext) as TotalContextProps;
  const {grp_payment_completed34dec, setgrp_payment_completed34dec}= useContext(TotalContext) as TotalContextProps;
  const {grp_payment_completed34decProps, setgrp_payment_completed34decProps}= useContext(TotalContext) as TotalContextProps;
  const {grp_bar_chart02e16, setgrp_bar_chart02e16}= useContext(TotalContext) as TotalContextProps;
  const {grp_bar_chart02e16Props, setgrp_bar_chart02e16Props}= useContext(TotalContext) as TotalContextProps;
  const {bar_chart386dd, setbar_chart386dd}= useContext(TotalContext) as TotalContextProps;
  const {grp_pie_chart2415d, setgrp_pie_chart2415d}= useContext(TotalContext) as TotalContextProps;
  const {grp_pie_chart2415dProps, setgrp_pie_chart2415dProps}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Dashboard:AFVK:v1",componentId:"69d66a48cbd7491790fe477712802e16",from:"GroupGrpBarChart",accessProfile:accessProfile},{
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
  if(orchestrationData?.data?.rule?.nodes?.length > 0){
    let schemaFlag:any = evaluateDecisionTable(orchestrationData?.data?.rule.nodes,{},{...decodedTokenObj});

    if (schemaFlag.output) {
      setShowFlag(schemaFlag.output.toLowerCase());
    }else{
      setShowFlag("")
    }
  }
    
  /////////////
    if(orchestrationData?.data?.readableControls.includes("bar_chart")){
      setbar_chart386dd({...bar_chart386dd,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
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

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const grp_bar_chart02e16Ref = useRef<any>(null);
  const handleClearSearch = () => {
    grp_bar_chart02e16Ref.current?.setSearchParams();
    grp_bar_chart02e16Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(grp_bar_chart02e16) && Object.keys(grp_bar_chart02e16)?.length>0)
      {
        setgrp_bar_chart02e16({})
      }
    }else 
      prevRefreshRef.current= true
  }, [grp_bar_chart02e16Props?.refresh,token])


  const renderBUttons=()=>{
    return (
      <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '1 / 13',
        gridRow: '41 / 161',
      
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(24, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        height: '100%',
        overflow: 'auto',
        gridAutoRows: '4px',
        columnGap: '0px',
        backgroundColor:'',
        backgroundImage:"url('')",
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: ''
      }}
      className={`flex flex-col overflow-auto rounded-md  ${isDark ? 'text-white' : 'text-black'}`}
    >
        {allowedControls.includes("bar_chart") ?<BarChartsbar_chart /* 386dd */ encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>
 )
}

export default Groupgrp_bar_chart
