




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
import Tablecredit_process_table  from './Tablecredit_process_table';  
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupcredit_process_table = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing}:any)=> {
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
  const {dfd_itax_source_tran_dfd_v1Props, setdfd_itax_source_tran_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
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
      "prn",
      "slip_payment_code",
      "payment_advice_date",
      "tax_payer_pin",
      "tax_payer_full_name",
      "total_amount",
      "currency",
      "trs_event_process_status"
    ],
    "allowedGroups": [
      "canvas",
      "overallgroup",
      "itax_main_tab_group",
      "tab_process_new_prn",
      "itax_source_table",
      "tab_credit_process_group",
      "credit_process_table",
      "tab_view_processed_prn",
      "view_processed_prn_table"
    ],
    "blockedControls": [
      "itaxst_id",
      "cp_view",
      "cp_log",
      "cp_payment"
    ],
    "readOnlyControls": []
  },
  "Branch Manager": {
    "allowedControls": [
      "prn",
      "slip_payment_code",
      "payment_advice_date",
      "tax_payer_pin",
      "tax_payer_full_name",
      "total_amount",
      "currency",
      "trs_event_process_status"
    ],
    "allowedGroups": [
      "canvas",
      "overallgroup",
      "itax_main_tab_group",
      "tab_process_new_prn",
      "itax_source_table",
      "tab_credit_process_group",
      "credit_process_table",
      "tab_view_processed_prn",
      "view_processed_prn_table"
    ],
    "blockedControls": [
      "itaxst_id",
      "cp_view",
      "cp_log",
      "cp_payment"
    ],
    "readOnlyControls": []
  },
  "Credit Approver": {
    "allowedControls": [
      "prn",
      "slip_payment_code",
      "payment_advice_date",
      "tax_payer_pin",
      "tax_payer_full_name",
      "total_amount",
      "cp_view",
      "currency",
      "trs_event_process_status"
    ],
    "allowedGroups": [
      "canvas",
      "overallgroup",
      "itax_main_tab_group",
      "tab_process_new_prn",
      "itax_source_table",
      "tab_credit_process_group",
      "credit_process_table",
      "tab_view_processed_prn",
      "view_processed_prn_table"
    ],
    "blockedControls": [
      "itaxst_id",
      "cp_log",
      "cp_payment"
    ],
    "readOnlyControls": []
  },
  "System Administrator": {
    "allowedControls": [
      "itaxst_id",
      "prn",
      "slip_payment_code",
      "payment_advice_date",
      "tax_payer_pin",
      "tax_payer_full_name",
      "total_amount",
      "cp_view",
      "cp_log",
      "cp_payment",
      "currency",
      "trs_event_process_status"
    ],
    "allowedGroups": [
      "canvas",
      "overallgroup",
      "itax_main_tab_group",
      "tab_process_new_prn",
      "itax_source_table",
      "tab_credit_process_group",
      "credit_process_table",
      "tab_view_processed_prn",
      "view_processed_prn_table"
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
  const {overallgroup4d9a0, setoverallgroup4d9a0}= useContext(TotalContext) as TotalContextProps;
  const {overallgroup4d9a0Props, setoverallgroup4d9a0Props}= useContext(TotalContext) as TotalContextProps;
  const {itax_main_tab_group216b3, setitax_main_tab_group216b3}= useContext(TotalContext) as TotalContextProps;
  const {itax_main_tab_group216b3Props, setitax_main_tab_group216b3Props}= useContext(TotalContext) as TotalContextProps;
  const {tab_process_new_prn5597e, settab_process_new_prn5597e}= useContext(TotalContext) as TotalContextProps;
  const {tab_process_new_prn5597eProps, settab_process_new_prn5597eProps}= useContext(TotalContext) as TotalContextProps;
  const {itax_source_table1afd6, setitax_source_table1afd6}= useContext(TotalContext) as TotalContextProps;
  const {itax_source_table1afd6Props, setitax_source_table1afd6Props}= useContext(TotalContext) as TotalContextProps;
  const {tab_credit_process_group546cc, settab_credit_process_group546cc}= useContext(TotalContext) as TotalContextProps;
  const {tab_credit_process_group546ccProps, settab_credit_process_group546ccProps}= useContext(TotalContext) as TotalContextProps;
  const {credit_process_table0cd4c, setcredit_process_table0cd4c}= useContext(TotalContext) as TotalContextProps;
  const {credit_process_table0cd4cProps, setcredit_process_table0cd4cProps}= useContext(TotalContext) as TotalContextProps;
  const {itaxst_id0eeff, setitaxst_id0eeff}= useContext(TotalContext) as TotalContextProps;
  const {prnb6d00, setprnb6d00}= useContext(TotalContext) as TotalContextProps;
  const {slip_payment_code9b31c, setslip_payment_code9b31c}= useContext(TotalContext) as TotalContextProps;
  const {payment_advice_date8473b, setpayment_advice_date8473b}= useContext(TotalContext) as TotalContextProps;
  const {tax_payer_pina5a64, settax_payer_pina5a64}= useContext(TotalContext) as TotalContextProps;
  const {tax_payer_full_namee8e84, settax_payer_full_namee8e84}= useContext(TotalContext) as TotalContextProps;
  const {total_amount99179, settotal_amount99179}= useContext(TotalContext) as TotalContextProps;
  const {cp_view07f80, setcp_view07f80}= useContext(TotalContext) as TotalContextProps;
  const {cp_log321e5, setcp_log321e5}= useContext(TotalContext) as TotalContextProps;
  const {cp_paymentcf667, setcp_paymentcf667}= useContext(TotalContext) as TotalContextProps;
  const {currency50540, setcurrency50540}= useContext(TotalContext) as TotalContextProps;
  const {trs_event_process_status332f5, settrs_event_process_status332f5}= useContext(TotalContext) as TotalContextProps;
  const {tab_view_processed_prn29a93, settab_view_processed_prn29a93}= useContext(TotalContext) as TotalContextProps;
  const {tab_view_processed_prn29a93Props, settab_view_processed_prn29a93Props}= useContext(TotalContext) as TotalContextProps;
  const {view_processed_prn_table8f5a5, setview_processed_prn_table8f5a5}= useContext(TotalContext) as TotalContextProps;
  const {view_processed_prn_table8f5a5Props, setview_processed_prn_table8f5a5Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_KEDTB_Main_Screen:AFVK:v1",componentId:"650d3fd3b4d54b6682fc16d68ef0cd4c",from:"GroupCreditProcessTable",isTable : true,accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("itaxst_id")){
      setitaxst_id0eeff({...itaxst_id0eeff,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("prn")){
      setprnb6d00({...prnb6d00,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("slip_payment_code")){
      setslip_payment_code9b31c({...slip_payment_code9b31c,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("payment_advice_date")){
      setpayment_advice_date8473b({...payment_advice_date8473b,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tax_payer_pin")){
      settax_payer_pina5a64({...tax_payer_pina5a64,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tax_payer_full_name")){
      settax_payer_full_namee8e84({...tax_payer_full_namee8e84,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("total_amount")){
      settotal_amount99179({...total_amount99179,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("cp_view")){
      setcp_view07f80({...cp_view07f80,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("cp_log")){
      setcp_log321e5({...cp_log321e5,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("cp_payment")){
      setcp_paymentcf667({...cp_paymentcf667,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("currency")){
      setcurrency50540({...currency50540,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("trs_event_process_status")){
      settrs_event_process_status332f5({...trs_event_process_status332f5,isDisabled:true});
    }
  //////////////
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const credit_process_table0cd4cRef = useRef<any>(null);
  const handleClearSearch = () => {
    credit_process_table0cd4cRef.current?.setSearchParams();
    credit_process_table0cd4cRef.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(credit_process_table0cd4c) && Object.keys(credit_process_table0cd4c)?.length>0)
      {
        setcredit_process_table0cd4c({})
      }
    }else 
      prevRefreshRef.current= true
  }, [credit_process_table0cd4cProps?.refresh,token])


  const renderBUttons=()=>{
    return (
          <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 153',
      
        //rowGap: '0px',
        overflow: 'visible',
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
      <div className='flex flex-col h-full w-full min-w-0 overflow-auto'>
        <div className='flex flex-1 w-full min-h-0'>
       {<Tablecredit_process_table headerButtonsRenders={renderBUttons}
        lockedData={lockedData} setLockedData={setLockedData}  primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData}  refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} paginationDetails={paginationDetails} open={open} setOpen={setOpen} ref={credit_process_table0cd4cRef} ButtonGoRuleData={ButtonGoRuleData} setButtonGoRuleData ={setButtonGoRuleData} setIsProcessing={setIsProcessing}/>}
      </div>
      </div>
    </div>
 )
}

export default Groupcredit_process_table
