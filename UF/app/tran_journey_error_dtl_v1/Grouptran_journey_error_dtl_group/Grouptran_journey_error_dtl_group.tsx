

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
import Texttrs_created_date  from "./Texttrs_created_date";
import Textfailuer_process_code  from "./Textfailuer_process_code";
import Texttran_process  from "./Texttran_process";
import Textproduct_code  from "./Textproduct_code";
import Buttonview_msg_data  from "./Buttonview_msg_data";
import Buttonrequest_data  from "./Buttonrequest_data";
import Buttonresponse_data  from "./Buttonresponse_data";
import Buttontran_log_data  from "./Buttontran_log_data";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Grouptran_journey_error_dtl_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
  const securityData:any={};
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
  const {tran_journey_error_dtl_grouped0e7, settran_journey_error_dtl_grouped0e7}= useContext(TotalContext) as TotalContextProps;
  const {tran_journey_error_dtl_grouped0e7Props, settran_journey_error_dtl_grouped0e7Props}= useContext(TotalContext) as TotalContextProps;
  const {tran_date_and_timec7376, settran_date_and_timec7376}= useContext(TotalContext) as TotalContextProps;
  const {tran_status9ed8a, settran_status9ed8a}= useContext(TotalContext) as TotalContextProps;
  const {trs_created_datee861b, settrs_created_datee861b}= useContext(TotalContext) as TotalContextProps;
  const {failuer_process_codee5490, setfailuer_process_codee5490}= useContext(TotalContext) as TotalContextProps;
  const {tran_process92d9c, settran_process92d9c}= useContext(TotalContext) as TotalContextProps;
  const {product_code6692d, setproduct_code6692d}= useContext(TotalContext) as TotalContextProps;
  const {view_msg_data9b55f, setview_msg_data9b55f}= useContext(TotalContext) as TotalContextProps;
  const {request_data9aa32, setrequest_data9aa32}= useContext(TotalContext) as TotalContextProps;
  const {response_data39796, setresponse_data39796}= useContext(TotalContext) as TotalContextProps;
  const {tran_log_data1b428, settran_log_data1b428}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Tran_Journey_Error_Dtl:AFVK:v1",componentId:"4c3c71908836485abc8f9dac45ded0e7",from:"GroupTranJourneyErrorDtlGroup",accessProfile:accessProfile},{
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
      settran_date_and_timec7376({...tran_date_and_timec7376,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tran_status")){
      settran_status9ed8a({...tran_status9ed8a,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("trs_created_date")){
      settrs_created_datee861b({...trs_created_datee861b,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("failuer_process_code")){
      setfailuer_process_codee5490({...failuer_process_codee5490,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tran_process")){
      settran_process92d9c({...tran_process92d9c,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("product_code")){
      setproduct_code6692d({...product_code6692d,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("view_msg_data")){
      setview_msg_data9b55f({...view_msg_data9b55f,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("request_data")){
      setrequest_data9aa32({...request_data9aa32,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("response_data")){
      setresponse_data39796({...response_data39796,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tran_log_data")){
      settran_log_data1b428({...tran_log_data1b428,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['tran_journey_error_dtl_group']  = tran_journey_error_dtl_grouped0e7,
      codeStates['settran_journey_error_dtl_group'] = settran_journey_error_dtl_grouped0e7,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const tran_journey_error_dtl_grouped0e7Ref = useRef<any>(null);
  const handleClearSearch = () => {
    tran_journey_error_dtl_grouped0e7Ref.current?.setSearchParams();
    tran_journey_error_dtl_grouped0e7Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(tran_journey_error_dtl_grouped0e7) && Object.keys(tran_journey_error_dtl_grouped0e7)?.length>0)
      {
        settran_journey_error_dtl_grouped0e7({})
      }
    }else 
      prevRefreshRef.current= true
  }, [tran_journey_error_dtl_grouped0e7Props?.refresh])

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
          {allowedControls.includes("tran_date_and_time") ?<Texttran_date_and_time   /* c7376 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("tran_status") ?<Texttran_status   /* 9ed8a */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("trs_created_date") ?<Texttrs_created_date   /* e861b */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("failuer_process_code") ?<Textfailuer_process_code   /* e5490 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("tran_process") ?<Texttran_process   /* 92d9c */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("product_code") ?<Textproduct_code   /* 6692d */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {        (("view_msg_data" in ButtonGoRuleData)?ButtonGoRuleData["view_msg_data"]:true) && 
          allowedControls.includes("view_msg_data")  ?            <Buttonview_msg_data lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>} 
        {        (("request_data" in ButtonGoRuleData)?ButtonGoRuleData["request_data"]:true) && 
          allowedControls.includes("request_data")  ?            <Buttonrequest_data lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>} 
        {        (("response_data" in ButtonGoRuleData)?ButtonGoRuleData["response_data"]:true) && 
          allowedControls.includes("response_data")  ?            <Buttonresponse_data lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>} 
        {        (("tran_log_data" in ButtonGoRuleData)?ButtonGoRuleData["tran_log_data"]:true) && 
          allowedControls.includes("tran_log_data")  ?            <Buttontran_log_data lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>} 
    </div>
 )
}

export default Grouptran_journey_error_dtl_group
