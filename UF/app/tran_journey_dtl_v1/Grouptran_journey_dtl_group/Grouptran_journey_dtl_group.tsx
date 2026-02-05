

'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { CommonHeaderAndTooltip } from '@/components/CommonHeaderAndTooltip';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import Texttran_date_and_time  from "./Texttran_date_and_time";
import Texttran_status  from "./Texttran_status";
import Texttra_created_date  from "./Texttra_created_date";
import Textfailuer_process_code  from "./Textfailuer_process_code";
import Texttran_process  from "./Texttran_process";
import Textproduct_code  from "./Textproduct_code";
import Buttonview_msg_data  from "./Buttonview_msg_data";
import Buttonview_tran_log  from "./Buttonview_tran_log";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Grouptran_journey_dtl_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
  const token:string = getCookie('token'); 
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  let code:any = ``;
  let idx = "";
  let item = "";
  const { isDark, isHighContrast, bgStyle, textStyle } = useTheme();
  const {dfd_tran_journey_dtl_v1Props, setdfd_tran_journey_dtl_v1Props} = useContext(TotalContext) as TotalContextProps;
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
  const securityData:any={
  "Maker": {
    "allowedControls": [
      "tran_date_and_time",
      "tran_status",
      "tra_created_date",
      "failuer_process_code",
      "tran_process",
      "product_code",
      "view_msg_data",
      "view_tran_log"
    ],
    "allowedGroups": [
      "canvas",
      "tran_journey_dtl_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Checker": {
    "allowedControls": [
      "tran_date_and_time",
      "tran_status",
      "tra_created_date",
      "failuer_process_code",
      "tran_process",
      "product_code",
      "view_msg_data",
      "view_tran_log"
    ],
    "allowedGroups": [
      "canvas",
      "tran_journey_dtl_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Admin": {
    "allowedControls": [
      "tran_date_and_time",
      "tran_status",
      "tra_created_date",
      "failuer_process_code",
      "tran_process",
      "product_code",
      "view_msg_data",
      "view_tran_log"
    ],
    "allowedGroups": [
      "canvas",
      "tran_journey_dtl_group"
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
  const {tran_journey_dtl_group6545a, settran_journey_dtl_group6545a}= useContext(TotalContext) as TotalContextProps;
  const {tran_journey_dtl_group6545aProps, settran_journey_dtl_group6545aProps}= useContext(TotalContext) as TotalContextProps;
  const {tran_date_and_timebba58, settran_date_and_timebba58}= useContext(TotalContext) as TotalContextProps;
  const {tran_status9b4c1, settran_status9b4c1}= useContext(TotalContext) as TotalContextProps;
  const {tra_created_date34aa7, settra_created_date34aa7}= useContext(TotalContext) as TotalContextProps;
  const {failuer_process_code981ea, setfailuer_process_code981ea}= useContext(TotalContext) as TotalContextProps;
  const {tran_process55ab3, settran_process55ab3}= useContext(TotalContext) as TotalContextProps;
  const {product_code36b37, setproduct_code36b37}= useContext(TotalContext) as TotalContextProps;
  const {view_msg_data387c6, setview_msg_data387c6}= useContext(TotalContext) as TotalContextProps;
  const {view_tran_log83071, setview_tran_log83071}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Tran_Journey_Dtl:AFVK:v1",componentId:"6167c96f57c544618a1d4370f846545a",from:"GroupTranJourneyDtlGroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("tran_date_and_time")){
      settran_date_and_timebba58({...tran_date_and_timebba58,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tran_status")){
      settran_status9b4c1({...tran_status9b4c1,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tra_created_date")){
      settra_created_date34aa7({...tra_created_date34aa7,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("failuer_process_code")){
      setfailuer_process_code981ea({...failuer_process_code981ea,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tran_process")){
      settran_process55ab3({...tran_process55ab3,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("product_code")){
      setproduct_code36b37({...product_code36b37,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("view_msg_data")){
      setview_msg_data387c6({...view_msg_data387c6,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("view_tran_log")){
      setview_tran_log83071({...view_tran_log83071,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['tran_journey_dtl_group']  = tran_journey_dtl_group6545a,
      codeStates['settran_journey_dtl_group'] = settran_journey_dtl_group6545a,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const tran_journey_dtl_group6545aRef = useRef<any>(null);
  const handleClearSearch = () => {
    tran_journey_dtl_group6545aRef.current?.setSearchParams();
    tran_journey_dtl_group6545aRef.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(tran_journey_dtl_group6545a) && Object.keys(tran_journey_dtl_group6545a)?.length>0)
      {
        settran_journey_dtl_group6545a({})
      }
    }else 
      prevRefreshRef.current= true
  }, [tran_journey_dtl_group6545aProps?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 132',
      
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(24, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        height: '100%',
        overflow: 'auto',
        gridAutoRows: '4px',
        columnGap: '4px',
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
          {allowedControls.includes("tran_date_and_time") ?<Texttran_date_and_time   /* bba58 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("tran_status") ?<Texttran_status   /* 9b4c1 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("tra_created_date") ?<Texttra_created_date   /* 34aa7 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("failuer_process_code") ?<Textfailuer_process_code   /* 981ea */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("tran_process") ?<Texttran_process   /* 55ab3 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("product_code") ?<Textproduct_code   /* 36b37 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {        (("view_msg_data" in ButtonGoRuleData)?ButtonGoRuleData["view_msg_data"]:true) && 
          allowedControls.includes("view_msg_data")  ?            <Buttonview_msg_data lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>} 
        {        (("view_tran_log" in ButtonGoRuleData)?ButtonGoRuleData["view_tran_log"]:true) && 
          allowedControls.includes("view_tran_log")  ?            <Buttonview_tran_log lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>} 
    </div>
 )
}

export default Grouptran_journey_dtl_group
