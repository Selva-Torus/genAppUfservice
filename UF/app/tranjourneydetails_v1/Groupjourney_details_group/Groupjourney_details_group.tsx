'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { getGroupOrchestrationData, getControlOrchestrationData, fetchBatchData } from '@/app/utils/Orchestration';
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
import evaluateDecisionTable,{ evaluateDecisionForDynamicActions,eventDecisionTable } from '@/app/utils/evaluateDecisionTable';
import decodeToken from '@/app/components/decodeToken';
import uoMapperData from '@/context/dfdmapperContolnames.json';
import Textdetails_label  from "./Textdetails_label";
import Dividerdivider_top  from "./Dividerdivider_top";
import Texttransaction_date_time_label  from "./Texttransaction_date_time_label";
import Textstatus_label  from "./Textstatus_label";
import Texttransaction_date_time  from "./Texttransaction_date_time";
import Textstatus  from "./Textstatus";
import Textprocessed_by_label  from "./Textprocessed_by_label";
import Textdebit_account_label  from "./Textdebit_account_label";
import Textprocessed_by  from "./Textprocessed_by";
import Textdebit_account  from "./Textdebit_account";
import Textcurrency_label  from "./Textcurrency_label";
import Textcredit_account_label  from "./Textcredit_account_label";
import Textcurrency  from "./Textcurrency";
import Textcredit_account  from "./Textcredit_account";
import Textamount_label  from "./Textamount_label";
import Texttransaction_reference_label  from "./Texttransaction_reference_label";
import Textamount  from "./Textamount";
import Texttransaction_reference  from "./Texttransaction_reference";
import Dividerdivider_bottom  from "./Dividerdivider_bottom";
import Buttonview_msg_data_btn  from "./Buttonview_msg_data_btn";
import Buttonview_tran_log_btn  from "./Buttonview_tran_log_btn";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupjourney_details_group = ({lockedData={},setLockedData,primaryTableData={},tableData=[],setTableData, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing, groupData: groupDataProp={}, controlData: controlDataProp={}}:any)=> {
  const token:string = getCookie('token'); 
  const decodedTokenObj:any = decodeToken(token);
  const user : string | undefined = decodedTokenObj?.selectedAccessProfile;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const copyFormData=useHandleGroupArrayCopyFormData()
  const [groupData, setGroupData] = useState<any>(groupDataProp);
  const [controlData, setControlData] = useState<any>(controlDataProp);
  let code:any = `
if("response_data" in journey_details_group && journey_details_group.response_data  !=null && journey_details_group.response_data  !=undefined)
{
    setview_tran_log_btn((pre)=>({
    ...pre,isDisabled:false
    }))
}

if("request_data" in journey_details_group && journey_details_group.request_data  !=null && journey_details_group.request_data  !=undefined)
{
    setview_tran_log_btn((pre)=>({
    ...pre,isDisabled:false
    }))
}
if("message_data" in journey_details_group && journey_details_group.message_data  !=null && journey_details_group.message_data  !=undefined)
{
    setview_msg_data_btn((pre)=>({
    ...pre,isDisabled:false
    }))
}`;
  let idx = "";
  let item = "";
  const { isDark, isHighContrast, bgStyle, textStyle } = useTheme();
  const {dfd_transaction_v1Props, setdfd_transaction_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_journey_v1Props, setdfd_journey_v1Props} = useContext(TotalContext) as TotalContextProps;
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
  "Operational Manager": {
    "allowedControls": [
      "details_label",
      "divider_top",
      "transaction_date_time_label",
      "status_label",
      "transaction_date_time",
      "status",
      "processed_by_label",
      "debit_account_label",
      "processed_by",
      "debit_account",
      "currency_label",
      "credit_account_label",
      "currency",
      "credit_account",
      "amount_label",
      "transaction_reference_label",
      "amount",
      "transaction_reference",
      "divider_bottom",
      "view_msg_data_btn",
      "view_tran_log_btn"
    ],
    "allowedGroups": [
      "canvas",
      "journey_details_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Operational Officer": {
    "allowedControls": [
      "details_label",
      "divider_top",
      "transaction_date_time_label",
      "status_label",
      "transaction_date_time",
      "status",
      "processed_by_label",
      "debit_account_label",
      "processed_by",
      "debit_account",
      "currency_label",
      "credit_account_label",
      "currency",
      "credit_account",
      "amount_label",
      "transaction_reference_label",
      "amount",
      "transaction_reference",
      "divider_bottom",
      "view_msg_data_btn",
      "view_tran_log_btn"
    ],
    "allowedGroups": [
      "canvas",
      "journey_details_group"
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
  const {journey_details_groupd9a0e, setjourney_details_groupd9a0e}= useContext(TotalContext) as TotalContextProps;
  const {journey_details_groupd9a0eProps, setjourney_details_groupd9a0eProps}= useContext(TotalContext) as TotalContextProps;
  const {details_labelb25b2, setdetails_labelb25b2}= useContext(TotalContext) as TotalContextProps;
  const {divider_tope6917, setdivider_tope6917}= useContext(TotalContext) as TotalContextProps;
  const {transaction_date_time_label669d7, settransaction_date_time_label669d7}= useContext(TotalContext) as TotalContextProps;
  const {status_labelf3713, setstatus_labelf3713}= useContext(TotalContext) as TotalContextProps;
  const {transaction_date_time14856, settransaction_date_time14856}= useContext(TotalContext) as TotalContextProps;
  const {status88bc7, setstatus88bc7}= useContext(TotalContext) as TotalContextProps;
  const {processed_by_label542e8, setprocessed_by_label542e8}= useContext(TotalContext) as TotalContextProps;
  const {debit_account_label3b1b7, setdebit_account_label3b1b7}= useContext(TotalContext) as TotalContextProps;
  const {processed_byd2b69, setprocessed_byd2b69}= useContext(TotalContext) as TotalContextProps;
  const {debit_account36b40, setdebit_account36b40}= useContext(TotalContext) as TotalContextProps;
  const {currency_labele21ba, setcurrency_labele21ba}= useContext(TotalContext) as TotalContextProps;
  const {credit_account_label65c7b, setcredit_account_label65c7b}= useContext(TotalContext) as TotalContextProps;
  const {currency9c8a2, setcurrency9c8a2}= useContext(TotalContext) as TotalContextProps;
  const {credit_account0d1f4, setcredit_account0d1f4}= useContext(TotalContext) as TotalContextProps;
  const {amount_labelfd725, setamount_labelfd725}= useContext(TotalContext) as TotalContextProps;
  const {transaction_reference_labelb1ca9, settransaction_reference_labelb1ca9}= useContext(TotalContext) as TotalContextProps;
  const {amount01416, setamount01416}= useContext(TotalContext) as TotalContextProps;
  const {transaction_reference500d6, settransaction_reference500d6}= useContext(TotalContext) as TotalContextProps;
  const {divider_bottom8bad5, setdivider_bottom8bad5}= useContext(TotalContext) as TotalContextProps;
  const {view_msg_data_btne6a88, setview_msg_data_btne6a88}= useContext(TotalContext) as TotalContextProps;
  const {view_tran_log_btn9cd8c, setview_tran_log_btn9cd8c}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [ruleData,setRuleData]=useState<any>([])
  const [open, setOpen] = React.useState(false);
  const {tranjourneydetails_v1, settranjourneydetails_v1} = useContext(TotalContext) as TotalContextProps;
  const checkOrchestrationData = async (): Promise<{ groupData: any; controlData: any }> => {
  if (Object.keys(groupData).length > 0) {
    return { groupData, controlData } 
  };
  const data: any = await fetchBatchData(
    'CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:GSS:AFGK:RTGS:AFK:tranJourneyDetails:AFVK:v1',
    [user],
    'GroupJourneyDetailsGroup',
    token
  );
    const resolved = { groupData: data.groupData || {}, controlData: data.controlData || {} };
    setGroupData(resolved.groupData);
    setControlData(resolved.controlData);
    return resolved;
  };
  async function securityCheck() {
  const { groupData: currentGroupData } = await checkOrchestrationData();
  let orchestrationData:any = getGroupOrchestrationData(currentGroupData, "21c6b985251b46b2a031d20162ad9a0e");
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
    setjourney_details_groupd9a0eProps((pre:any)=>({...pre,isHaveRule:true}))
    let schemaFlag:any = evaluateDecisionTable(orchestrationData?.data?.rule.nodes,{},{...decodedTokenObj});
    if (schemaFlag.output) {
      setShowFlag(schemaFlag.output.toLowerCase());
    }else{
      setShowFlag("")
    }
  }
    
  /////////////
    if(orchestrationData?.data?.readableControls.includes("details_label")){
      setdetails_labelb25b2({...details_labelb25b2,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("divider_top")){
      setdivider_tope6917({...divider_tope6917,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("transaction_date_time_label")){
      settransaction_date_time_label669d7({...transaction_date_time_label669d7,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("status_label")){
      setstatus_labelf3713({...status_labelf3713,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("transaction_date_time")){
      settransaction_date_time14856({...transaction_date_time14856,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("status")){
      setstatus88bc7({...status88bc7,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("processed_by_label")){
      setprocessed_by_label542e8({...processed_by_label542e8,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("debit_account_label")){
      setdebit_account_label3b1b7({...debit_account_label3b1b7,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("processed_by")){
      setprocessed_byd2b69({...processed_byd2b69,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("debit_account")){
      setdebit_account36b40({...debit_account36b40,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("currency_label")){
      setcurrency_labele21ba({...currency_labele21ba,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("credit_account_label")){
      setcredit_account_label65c7b({...credit_account_label65c7b,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("currency")){
      setcurrency9c8a2({...currency9c8a2,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("credit_account")){
      setcredit_account0d1f4({...credit_account0d1f4,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("amount_label")){
      setamount_labelfd725({...amount_labelfd725,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("transaction_reference_label")){
      settransaction_reference_labelb1ca9({...transaction_reference_labelb1ca9,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("amount")){
      setamount01416({...amount01416,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("transaction_reference")){
      settransaction_reference500d6({...transaction_reference500d6,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("divider_bottom")){
      setdivider_bottom8bad5({...divider_bottom8bad5,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("view_msg_data_btn")){
      setview_msg_data_btne6a88({...view_msg_data_btne6a88,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("view_tran_log_btn")){
      setview_tran_log_btn9cd8c({...view_tran_log_btn9cd8c,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
        codeStates['journey_details_group'] = journey_details_groupd9a0e,
        codeStates['setjourney_details_group'] = setjourney_details_groupd9a0e,
        codeStates['journey_details_groupd9a0e'] = journey_details_groupd9a0eProps,
        codeStates['setjourney_details_groupd9a0e'] = setjourney_details_groupd9a0eProps,
        codeStates['details_label'] = details_labelb25b2,
        codeStates['setdetails_label'] = setdetails_labelb25b2,
        codeStates['divider_top'] = divider_tope6917,
        codeStates['setdivider_top'] = setdivider_tope6917,
        codeStates['transaction_date_time_label'] = transaction_date_time_label669d7,
        codeStates['settransaction_date_time_label'] = settransaction_date_time_label669d7,
        codeStates['status_label'] = status_labelf3713,
        codeStates['setstatus_label'] = setstatus_labelf3713,
        codeStates['transaction_date_time'] = transaction_date_time14856,
        codeStates['settransaction_date_time'] = settransaction_date_time14856,
        codeStates['status'] = status88bc7,
        codeStates['setstatus'] = setstatus88bc7,
        codeStates['processed_by_label'] = processed_by_label542e8,
        codeStates['setprocessed_by_label'] = setprocessed_by_label542e8,
        codeStates['debit_account_label'] = debit_account_label3b1b7,
        codeStates['setdebit_account_label'] = setdebit_account_label3b1b7,
        codeStates['processed_by'] = processed_byd2b69,
        codeStates['setprocessed_by'] = setprocessed_byd2b69,
        codeStates['debit_account'] = debit_account36b40,
        codeStates['setdebit_account'] = setdebit_account36b40,
        codeStates['currency_label'] = currency_labele21ba,
        codeStates['setcurrency_label'] = setcurrency_labele21ba,
        codeStates['credit_account_label'] = credit_account_label65c7b,
        codeStates['setcredit_account_label'] = setcredit_account_label65c7b,
        codeStates['currency'] = currency9c8a2,
        codeStates['setcurrency'] = setcurrency9c8a2,
        codeStates['credit_account'] = credit_account0d1f4,
        codeStates['setcredit_account'] = setcredit_account0d1f4,
        codeStates['amount_label'] = amount_labelfd725,
        codeStates['setamount_label'] = setamount_labelfd725,
        codeStates['transaction_reference_label'] = transaction_reference_labelb1ca9,
        codeStates['settransaction_reference_label'] = settransaction_reference_labelb1ca9,
        codeStates['amount'] = amount01416,
        codeStates['setamount'] = setamount01416,
        codeStates['transaction_reference'] = transaction_reference500d6,
        codeStates['settransaction_reference'] = settransaction_reference500d6,
        codeStates['divider_bottom'] = divider_bottom8bad5,
        codeStates['setdivider_bottom'] = setdivider_bottom8bad5,
        codeStates['view_msg_data_btn'] = view_msg_data_btne6a88,
        codeStates['setview_msg_data_btn'] = setview_msg_data_btne6a88,
        codeStates['view_tran_log_btn'] = view_tran_log_btn9cd8c,
        codeStates['setview_tran_log_btn'] = setview_tran_log_btn9cd8c,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const handleOnClick= async (selectedItem:any, selectedIndex?: number)=>{

  }
  const journey_details_groupd9a0eRef = useRef<any>(null);
  const handleClearSearch = () => {
    journey_details_groupd9a0eRef.current?.setSearchParams();
    journey_details_groupd9a0eRef.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(journey_details_groupd9a0e) && Object.keys(journey_details_groupd9a0e)?.length>0)
      {
        setjourney_details_groupd9a0e({})
      }
    }else 
      prevRefreshRef.current= true
  }, [journey_details_groupd9a0eProps?.refresh,token])


  const renderBUttons=()=>{
    return (
      <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 104',
      
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(24, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        height: '100%',
        overflow: 'auto',
        gridAutoRows: '4px',
        columnGap: '5px',
        backgroundColor:'#ffffff',
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
          {allowedControls.includes("details_label") ?<Textdetails_label   /* b25b2 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
        {allowedControls.includes("divider_top") ?<Dividerdivider_top   /* e6917 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
          {allowedControls.includes("transaction_date_time_label") ?<Texttransaction_date_time_label   /* 669d7 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
          {allowedControls.includes("status_label") ?<Textstatus_label   /* f3713 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
          {allowedControls.includes("transaction_date_time") ?<Texttransaction_date_time   /* 14856 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
          {allowedControls.includes("status") ?<Textstatus   /* 88bc7 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
          {allowedControls.includes("processed_by_label") ?<Textprocessed_by_label   /* 542e8 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
          {allowedControls.includes("debit_account_label") ?<Textdebit_account_label   /* 3b1b7 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
          {allowedControls.includes("processed_by") ?<Textprocessed_by   /* d2b69 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
          {allowedControls.includes("debit_account") ?<Textdebit_account   /* 36b40 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
          {allowedControls.includes("currency_label") ?<Textcurrency_label   /* e21ba */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
          {allowedControls.includes("credit_account_label") ?<Textcredit_account_label   /* 65c7b */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
          {allowedControls.includes("currency") ?<Textcurrency   /* 9c8a2 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
          {allowedControls.includes("credit_account") ?<Textcredit_account   /* 0d1f4 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
          {allowedControls.includes("amount_label") ?<Textamount_label   /* fd725 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
          {allowedControls.includes("transaction_reference_label") ?<Texttransaction_reference_label   /* b1ca9 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
          {allowedControls.includes("amount") ?<Textamount   /* 01416 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
          {allowedControls.includes("transaction_reference") ?<Texttransaction_reference   /* 500d6 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
        {allowedControls.includes("divider_bottom") ?<Dividerdivider_bottom   /* 8bad5 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing} controlData={controlData} />: <div></div>}
        {        ((ruleData?.length>0 && "view_msg_data_btn" in ButtonGoRuleData)?ButtonGoRuleData["view_msg_data_btn"]:true) && 
          allowedControls.includes("view_msg_data_btn")  ?            <Buttonview_msg_data_btn tableData={tableData} setTableData={setTableData} lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} controlData={controlData} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing}/>: <div></div>} 
        {        ((ruleData?.length>0 && "view_tran_log_btn" in ButtonGoRuleData)?ButtonGoRuleData["view_tran_log_btn"]:true) && 
          allowedControls.includes("view_tran_log_btn")  ?            <Buttonview_tran_log_btn tableData={tableData} setTableData={setTableData} lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} controlData={controlData} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing}/>: <div></div>} 
    </div>
 )
}

export default Groupjourney_details_group
