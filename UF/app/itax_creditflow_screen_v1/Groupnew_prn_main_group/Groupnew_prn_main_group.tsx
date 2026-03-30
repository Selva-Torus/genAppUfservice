




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
import Texttransaction_details_label  from "./Texttransaction_details_label";
import Textitaxst_id  from "./Textitaxst_id";
import Textprnno_label  from "./Textprnno_label";
import TextInputeslip_no  from "./TextInputeslip_no";
import Textpayment_type_label  from "./Textpayment_type_label";
import TextInputpayment_type_dropdown  from "./TextInputpayment_type_dropdown";
import Textdebit_account_no_label  from "./Textdebit_account_no_label";
import TextInputdebit_account_no  from "./TextInputdebit_account_no";
import Texttax_payers_full_name_label  from "./Texttax_payers_full_name_label";
import TextInputtax_payer_full_name  from "./TextInputtax_payer_full_name";
import Textdebit_amount_label  from "./Textdebit_amount_label";
import TextInputdebit_amount  from "./TextInputdebit_amount";
import Textloan_amt_label  from "./Textloan_amt_label";
import TextInputloan_amt  from "./TextInputloan_amt";
import Textauth_memo_label  from "./Textauth_memo_label";
import Textfilename  from "./Textfilename";
import Documentuploadermemo_documentuploader  from "./Documentuploadermemo_documentuploader";
import Buttonclear  from "./Buttonclear";
import Buttonsubmit  from "./Buttonsubmit";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupnew_prn_main_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing}:any)=> {
  const token:string = getCookie('token'); 
  const decodedTokenObj:any = decodeToken(token);
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const copyFormData=useHandleGroupArrayCopyFormData()
  let code:any = `setnew_prn_main_group((pre)=>({...pre,loan_amt:+new_prn_main_group?.debit_amount-new_prn_main_group?.balance}))
 `;
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
      "transaction_details_label",
      "prnno_label",
      "eslip_no",
      "payment_type_label",
      "payment_type_dropdown",
      "debit_account_no_label",
      "debit_account_no",
      "tax_payers_full_name_label",
      "tax_payer_full_name",
      "debit_amount_label",
      "debit_amount",
      "loan_amt_label",
      "loan_amt",
      "auth_memo_label",
      "filename",
      "memo_documentuploader",
      "clear",
      "submit"
    ],
    "allowedGroups": [
      "canvas",
      "new_prn_main_group"
    ],
    "blockedControls": [
      "itaxst_id"
    ],
    "readOnlyControls": []
  },
  "Branch Manager": {
    "allowedControls": [
      "transaction_details_label",
      "prnno_label",
      "eslip_no",
      "payment_type_label",
      "payment_type_dropdown",
      "debit_account_no_label",
      "debit_account_no",
      "tax_payers_full_name_label",
      "tax_payer_full_name",
      "debit_amount_label",
      "debit_amount",
      "loan_amt_label",
      "loan_amt",
      "auth_memo_label",
      "filename",
      "memo_documentuploader",
      "clear",
      "submit"
    ],
    "allowedGroups": [
      "canvas",
      "new_prn_main_group"
    ],
    "blockedControls": [
      "itaxst_id"
    ],
    "readOnlyControls": []
  },
  "Credit Approver": {
    "allowedControls": [
      "transaction_details_label",
      "prnno_label",
      "eslip_no",
      "payment_type_label",
      "payment_type_dropdown",
      "debit_account_no_label",
      "debit_account_no",
      "tax_payers_full_name_label",
      "tax_payer_full_name",
      "debit_amount_label",
      "debit_amount",
      "loan_amt_label",
      "loan_amt",
      "auth_memo_label",
      "filename",
      "memo_documentuploader",
      "clear",
      "submit"
    ],
    "allowedGroups": [
      "canvas",
      "new_prn_main_group"
    ],
    "blockedControls": [
      "itaxst_id"
    ],
    "readOnlyControls": []
  },
  "System Administrator": {
    "allowedControls": [
      "transaction_details_label",
      "itaxst_id",
      "prnno_label",
      "eslip_no",
      "payment_type_label",
      "payment_type_dropdown",
      "debit_account_no_label",
      "debit_account_no",
      "tax_payers_full_name_label",
      "tax_payer_full_name",
      "debit_amount_label",
      "debit_amount",
      "loan_amt_label",
      "loan_amt",
      "auth_memo_label",
      "filename",
      "memo_documentuploader",
      "clear",
      "submit"
    ],
    "allowedGroups": [
      "canvas",
      "new_prn_main_group"
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
  const {new_prn_main_group21910, setnew_prn_main_group21910}= useContext(TotalContext) as TotalContextProps;
  const {new_prn_main_group21910Props, setnew_prn_main_group21910Props}= useContext(TotalContext) as TotalContextProps;
  const {transaction_details_label6f776, settransaction_details_label6f776}= useContext(TotalContext) as TotalContextProps;
  const {itaxst_id19a2c, setitaxst_id19a2c}= useContext(TotalContext) as TotalContextProps;
  const {prnno_label2284a, setprnno_label2284a}= useContext(TotalContext) as TotalContextProps;
  const {eslip_noe1f20, seteslip_noe1f20}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_labela8526, setpayment_type_labela8526}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_dropdown5d344, setpayment_type_dropdown5d344}= useContext(TotalContext) as TotalContextProps;
  const {debit_account_no_label99095, setdebit_account_no_label99095}= useContext(TotalContext) as TotalContextProps;
  const {debit_account_no9ec5d, setdebit_account_no9ec5d}= useContext(TotalContext) as TotalContextProps;
  const {tax_payers_full_name_labeld7111, settax_payers_full_name_labeld7111}= useContext(TotalContext) as TotalContextProps;
  const {tax_payer_full_name8bf4d, settax_payer_full_name8bf4d}= useContext(TotalContext) as TotalContextProps;
  const {debit_amount_label46f0a, setdebit_amount_label46f0a}= useContext(TotalContext) as TotalContextProps;
  const {debit_amountbbf1f, setdebit_amountbbf1f}= useContext(TotalContext) as TotalContextProps;
  const {loan_amt_labeleacfe, setloan_amt_labeleacfe}= useContext(TotalContext) as TotalContextProps;
  const {loan_amt3440e, setloan_amt3440e}= useContext(TotalContext) as TotalContextProps;
  const {auth_memo_labelf0a0e, setauth_memo_labelf0a0e}= useContext(TotalContext) as TotalContextProps;
  const {filename4f410, setfilename4f410}= useContext(TotalContext) as TotalContextProps;
  const {memo_documentuploader51a64, setmemo_documentuploader51a64}= useContext(TotalContext) as TotalContextProps;
  const {clear14cbd, setclear14cbd}= useContext(TotalContext) as TotalContextProps;
  const {submitc9c9c, setsubmitc9c9c}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_CreditFlow_Screen:AFVK:v1",componentId:"f1099583e1124434b28d0c4b0be21910",from:"GroupNewPrnMainGroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("transaction_details_label")){
      settransaction_details_label6f776({...transaction_details_label6f776,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("itaxst_id")){
      setitaxst_id19a2c({...itaxst_id19a2c,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("prnno_label")){
      setprnno_label2284a({...prnno_label2284a,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("eslip_no")){
      seteslip_noe1f20({...eslip_noe1f20,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("payment_type_label")){
      setpayment_type_labela8526({...payment_type_labela8526,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("payment_type_dropdown")){
      setpayment_type_dropdown5d344({...payment_type_dropdown5d344,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("debit_account_no_label")){
      setdebit_account_no_label99095({...debit_account_no_label99095,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("debit_account_no")){
      setdebit_account_no9ec5d({...debit_account_no9ec5d,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tax_payers_full_name_label")){
      settax_payers_full_name_labeld7111({...tax_payers_full_name_labeld7111,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tax_payer_full_name")){
      settax_payer_full_name8bf4d({...tax_payer_full_name8bf4d,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("debit_amount_label")){
      setdebit_amount_label46f0a({...debit_amount_label46f0a,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("debit_amount")){
      setdebit_amountbbf1f({...debit_amountbbf1f,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("loan_amt_label")){
      setloan_amt_labeleacfe({...loan_amt_labeleacfe,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("loan_amt")){
      setloan_amt3440e({...loan_amt3440e,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("auth_memo_label")){
      setauth_memo_labelf0a0e({...auth_memo_labelf0a0e,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("filename")){
      setfilename4f410({...filename4f410,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("memo_documentuploader")){
      setmemo_documentuploader51a64({...memo_documentuploader51a64,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("clear")){
      setclear14cbd({...clear14cbd,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("submit")){
      setsubmitc9c9c({...submitc9c9c,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['new_prn_main_group']  = new_prn_main_group21910,
      codeStates['setnew_prn_main_group'] = setnew_prn_main_group21910,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const new_prn_main_group21910Ref = useRef<any>(null);
  const handleClearSearch = () => {
    new_prn_main_group21910Ref.current?.setSearchParams();
    new_prn_main_group21910Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(new_prn_main_group21910) && Object.keys(new_prn_main_group21910)?.length>0)
      {
        setnew_prn_main_group21910({})
      }
    }else 
      prevRefreshRef.current= true
  }, [new_prn_main_group21910Props?.refresh,token])


  const renderBUttons=()=>{
    return (
      <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 162',
      
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
      className={`flex flex-col overflow-auto rounded-md p-2 ${isDark ? 'text-white' : 'text-black'}`}
    >
          {allowedControls.includes("transaction_details_label") ?<Texttransaction_details_label   /* 6f776 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("itaxst_id") ?<Textitaxst_id   /* 19a2c */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("prnno_label") ?<Textprnno_label   /* 2284a */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("eslip_no") ?<TextInputeslip_no   /* e1f20 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("payment_type_label") ?<Textpayment_type_label   /* a8526 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("payment_type_dropdown") ?<TextInputpayment_type_dropdown   /* 5d344 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("debit_account_no_label") ?<Textdebit_account_no_label   /* 99095 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("debit_account_no") ?<TextInputdebit_account_no   /* 9ec5d */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("tax_payers_full_name_label") ?<Texttax_payers_full_name_label   /* d7111 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("tax_payer_full_name") ?<TextInputtax_payer_full_name   /* 8bf4d */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("debit_amount_label") ?<Textdebit_amount_label   /* 46f0a */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("debit_amount") ?<TextInputdebit_amount   /* bbf1f */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("loan_amt_label") ?<Textloan_amt_label   /* eacfe */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("loan_amt") ?<TextInputloan_amt   /* 3440e */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("auth_memo_label") ?<Textauth_memo_label   /* f0a0e */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("filename") ?<Textfilename   /* 4f410 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("memo_documentuploader") ?<Documentuploadermemo_documentuploader   /* 51a64 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {        (("clear" in ButtonGoRuleData)?ButtonGoRuleData["clear"]:true) && 
          allowedControls.includes("clear")  ?            <Buttonclear lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing}/>: <div></div>} 
        {        (("submit" in ButtonGoRuleData)?ButtonGoRuleData["submit"]:true) && 
          allowedControls.includes("submit")  ?            <Buttonsubmit lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing}/>: <div></div>} 
    </div>
 )
}

export default Groupnew_prn_main_group
