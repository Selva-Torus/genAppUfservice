'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { getGroupOrchestrationData, getControlOrchestrationData } from '@/app/utils/Orchestration';
import { AxiosService } from '@/app/components/axiosService';
import { api_paginationDto, uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleGroupArrayCopyFormData } from '@/app/utils/commonfunctions'; 
import { CommonHeaderAndTooltip } from '@/components/CommonHeaderAndTooltip';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import evaluateDecisionTable, { evaluateDecisionForDynamicActions } from '@/app/utils/evaluateDecisionTable';
import decodeToken from '@/app/components/decodeToken';
import uoMapperData from '@/context/dfdmapperContolnames.json';
import Textsearch_label  from "./Textsearch_label";
import DatePickertrs_created_date  from "./DatePickertrs_created_date";
import TextInputdebtor_account_no  from "./TextInputdebtor_account_no";
import TextInputdebtor_name  from "./TextInputdebtor_name";
import TextInputcreditor_account_no  from "./TextInputcreditor_account_no";
import Dropdownpayment_currency  from "./Dropdownpayment_currency";
import TextInputpayment_amount  from "./TextInputpayment_amount";
import TextInputuuid  from "./TextInputuuid";
import TextInputstatus  from "./TextInputstatus";
import Buttonsearch  from "./Buttonsearch";
import Buttonclear  from "./Buttonclear";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupmain_group = ({lockedData={},setLockedData,primaryTableData={},tableData=[],setTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing, groupData={}, controlData={}}:any)=> {
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
  const {dfd_combocurrencysearch_v1Props, setdfd_combocurrencysearch_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_transaction_v1Props, setdfd_transaction_v1Props} = useContext(TotalContext) as TotalContextProps;
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
  "IT Team": {
    "allowedControls": [
      "search_label",
      "trs_created_date",
      "debtor_account_no",
      "debtor_name",
      "creditor_account_no",
      "payment_currency",
      "payment_amount",
      "uuid",
      "status",
      "search",
      "clear"
    ],
    "allowedGroups": [
      "canvas",
      "main_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Business Team": {
    "allowedControls": [
      "search_label",
      "trs_created_date",
      "debtor_account_no",
      "debtor_name",
      "creditor_account_no",
      "payment_currency",
      "payment_amount",
      "uuid",
      "status",
      "search",
      "clear"
    ],
    "allowedGroups": [
      "canvas",
      "main_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Operation Team": {
    "allowedControls": [
      "search_label",
      "trs_created_date",
      "debtor_account_no",
      "debtor_name",
      "creditor_account_no",
      "payment_currency",
      "payment_amount",
      "uuid",
      "status",
      "search",
      "clear"
    ],
    "allowedGroups": [
      "canvas",
      "main_group"
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
  const [ButtonGoRuleData,setButtonGoRuleData]=useState<any>({});
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
 /////////////
   //another screen
  const {main_group9066f, setmain_group9066f}= useContext(TotalContext) as TotalContextProps;
  const {main_group9066fProps, setmain_group9066fProps}= useContext(TotalContext) as TotalContextProps;
  const {search_label27572, setsearch_label27572}= useContext(TotalContext) as TotalContextProps;
  const {trs_created_date2cea8, settrs_created_date2cea8}= useContext(TotalContext) as TotalContextProps;
  const {debtor_account_no963e4, setdebtor_account_no963e4}= useContext(TotalContext) as TotalContextProps;
  const {debtor_namee2d9f, setdebtor_namee2d9f}= useContext(TotalContext) as TotalContextProps;
  const {creditor_account_noca692, setcreditor_account_noca692}= useContext(TotalContext) as TotalContextProps;
  const {payment_currency703d2, setpayment_currency703d2}= useContext(TotalContext) as TotalContextProps;
  const {payment_amount042b1, setpayment_amount042b1}= useContext(TotalContext) as TotalContextProps;
  const {uuid29c9f, setuuid29c9f}= useContext(TotalContext) as TotalContextProps;
  const {status4bd75, setstatus4bd75}= useContext(TotalContext) as TotalContextProps;
  const {search0e695, setsearch0e695}= useContext(TotalContext) as TotalContextProps;
  const {cleareddfa, setcleareddfa}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [ruleData,setRuleData]=useState<any>([])
  const [open, setOpen] = React.useState(false);
  const {transactionsearch_v1, settransactionsearch_v1} = useContext(TotalContext) as TotalContextProps;
  async function securityCheck() {
  const orchestrationData = getGroupOrchestrationData(groupData, "526f0e58d5454270aca67c481a99066f");
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
    setRuleData(orchestrationData?.data?.rule?.nodes)
    setmain_group9066fProps((pre:any)=>({...pre,isHaveRule:true}))
    let schemaFlag:any = evaluateDecisionTable(orchestrationData?.data?.rule.nodes,{},{...decodedTokenObj});
    if (schemaFlag.output) {
      setShowFlag(schemaFlag.output.toLowerCase());
    }else{
      setShowFlag("")
    }
  }
    
  /////////////
    if(orchestrationData?.data?.readableControls.includes("search_label")){
      setsearch_label27572({...search_label27572,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("trs_created_date")){
      settrs_created_date2cea8({...trs_created_date2cea8,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("debtor_account_no")){
      setdebtor_account_no963e4({...debtor_account_no963e4,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("debtor_name")){
      setdebtor_namee2d9f({...debtor_namee2d9f,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("creditor_account_no")){
      setcreditor_account_noca692({...creditor_account_noca692,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("payment_currency")){
      setpayment_currency703d2({...payment_currency703d2,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("payment_amount")){
      setpayment_amount042b1({...payment_amount042b1,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("uuid")){
      setuuid29c9f({...uuid29c9f,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("status")){
      setstatus4bd75({...status4bd75,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("search")){
      setsearch0e695({...search0e695,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("clear")){
      setcleareddfa({...cleareddfa,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
        codeStates['main_group'] = main_group9066f,
        codeStates['setmain_group'] = setmain_group9066f,
        codeStates['main_group9066f'] = main_group9066fProps,
        codeStates['setmain_group9066f'] = setmain_group9066fProps,
        codeStates['search_label'] = search_label27572,
        codeStates['setsearch_label'] = setsearch_label27572,
        codeStates['trs_created_date'] = trs_created_date2cea8,
        codeStates['settrs_created_date'] = settrs_created_date2cea8,
        codeStates['debtor_account_no'] = debtor_account_no963e4,
        codeStates['setdebtor_account_no'] = setdebtor_account_no963e4,
        codeStates['debtor_name'] = debtor_namee2d9f,
        codeStates['setdebtor_name'] = setdebtor_namee2d9f,
        codeStates['creditor_account_no'] = creditor_account_noca692,
        codeStates['setcreditor_account_no'] = setcreditor_account_noca692,
        codeStates['payment_currency'] = payment_currency703d2,
        codeStates['setpayment_currency'] = setpayment_currency703d2,
        codeStates['payment_amount'] = payment_amount042b1,
        codeStates['setpayment_amount'] = setpayment_amount042b1,
        codeStates['uuid'] = uuid29c9f,
        codeStates['setuuid'] = setuuid29c9f,
        codeStates['status'] = status4bd75,
        codeStates['setstatus'] = setstatus4bd75,
        codeStates['search'] = search0e695,
        codeStates['setsearch'] = setsearch0e695,
        codeStates['clear'] = cleareddfa,
        codeStates['setclear'] = setcleareddfa,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const handleOnClick= async (selectedItem:any, selectedIndex?: number)=>{

  }
  const main_group9066fRef = useRef<any>(null);
  const handleClearSearch = () => {
    main_group9066fRef.current?.setSearchParams();
    main_group9066fRef.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(main_group9066f) && Object.keys(main_group9066f)?.length>0)
      {
        setmain_group9066f({})
      }
    }else 
      prevRefreshRef.current= true
  }, [main_group9066fProps?.refresh,token])


  const renderBUttons=()=>{
    return (
      <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 69',
      
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(24, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        height: '100%',
        overflow: 'auto',
        gridAutoRows: '4px',
        columnGap: '6px',
        backgroundColor:'#ffffff',
        backgroundImage:"url('')",
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: ''
      }}
      className={`flex flex-col overflow-auto rounded-md p-4 ${isDark ? 'text-white' : 'text-black'}`}
    >
          {allowedControls.includes("search_label") ?<Textsearch_label   /* 27572 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
        {allowedControls.includes("trs_created_date") ?<DatePickertrs_created_date   /* 2cea8 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
        {allowedControls.includes("debtor_account_no") ?<TextInputdebtor_account_no   /* 963e4 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
        {allowedControls.includes("debtor_name") ?<TextInputdebtor_name   /* e2d9f */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
        {allowedControls.includes("creditor_account_no") ?<TextInputcreditor_account_no   /* ca692 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
        {allowedControls.includes("payment_currency") ?<Dropdownpayment_currency   /* 703d2 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData}/>: <div></div>}
        {allowedControls.includes("payment_amount") ?<TextInputpayment_amount   /* 042b1 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
        {allowedControls.includes("uuid") ?<TextInputuuid   /* 29c9f */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
        {allowedControls.includes("status") ?<TextInputstatus   /* 4bd75 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
        {        ((ruleData?.length>0 && "search" in ButtonGoRuleData)?ButtonGoRuleData["search"]:true) && 
          allowedControls.includes("search")  ?            <Buttonsearch tableData={tableData} setTableData={setTableData} lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} controlData={controlData} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing}/>: <div></div>} 
        {        ((ruleData?.length>0 && "clear" in ButtonGoRuleData)?ButtonGoRuleData["clear"]:true) && 
          allowedControls.includes("clear")  ?            <Buttonclear tableData={tableData} setTableData={setTableData} lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} controlData={controlData} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing}/>: <div></div>} 
    </div>
 )
}

export default Groupmain_group
