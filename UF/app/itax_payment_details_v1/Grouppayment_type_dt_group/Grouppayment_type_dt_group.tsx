




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
import Textdebit_account_no_label  from "./Textdebit_account_no_label";
import TextInputdebit_account_no  from "./TextInputdebit_account_no";
import Textavailable_bal_label  from "./Textavailable_bal_label";
import TextInputbalance  from "./TextInputbalance";
import Texttax_amount_label  from "./Texttax_amount_label";
import TextInputtotal_amount  from "./TextInputtotal_amount";
import Textdebit_amount_label  from "./Textdebit_amount_label";
import TextInputdebit_amount  from "./TextInputdebit_amount";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Grouppayment_type_dt_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing}:any)=> {
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
  const {dfd_itax_source_tran_dtl_dfd_v1Props, setdfd_itax_source_tran_dtl_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
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
      "debit_account_no_label",
      "debit_account_no",
      "available_bal_label",
      "balance",
      "tax_amount_label",
      "total_amount",
      "debit_amount_label",
      "debit_amount"
    ],
    "allowedGroups": [
      "canvas",
      "prn_details_group",
      "prn_datails_table",
      "subscreen_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1",
      "payment_type_cheque_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1",
      "payment_type_dt_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Branch Manager": {
    "allowedControls": [
      "debit_account_no_label",
      "debit_account_no",
      "available_bal_label",
      "balance",
      "tax_amount_label",
      "total_amount",
      "debit_amount_label",
      "debit_amount"
    ],
    "allowedGroups": [
      "canvas",
      "prn_details_group",
      "prn_datails_table",
      "subscreen_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1",
      "payment_type_cheque_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1",
      "payment_type_dt_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Credit Approver": {
    "allowedControls": [
      "debit_account_no_label",
      "debit_account_no",
      "available_bal_label",
      "balance",
      "tax_amount_label",
      "total_amount",
      "debit_amount_label",
      "debit_amount"
    ],
    "allowedGroups": [
      "canvas",
      "prn_details_group",
      "prn_datails_table",
      "subscreen_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1",
      "payment_type_cheque_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1",
      "payment_type_dt_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "System Administrator": {
    "allowedControls": [
      "debit_account_no_label",
      "debit_account_no",
      "available_bal_label",
      "balance",
      "tax_amount_label",
      "total_amount",
      "debit_amount_label",
      "debit_amount"
    ],
    "allowedGroups": [
      "canvas",
      "prn_details_group",
      "prn_datails_table",
      "subscreen_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1",
      "payment_type_cheque_group",
      "ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1",
      "payment_type_dt_group"
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
  const {prn_details_group00560, setprn_details_group00560}= useContext(TotalContext) as TotalContextProps;
  const {prn_details_group00560Props, setprn_details_group00560Props}= useContext(TotalContext) as TotalContextProps;
  const {prn_datails_table2ad52, setprn_datails_table2ad52}= useContext(TotalContext) as TotalContextProps;
  const {prn_datails_table2ad52Props, setprn_datails_table2ad52Props}= useContext(TotalContext) as TotalContextProps;
  const {subscreen_groupc0414, setsubscreen_groupc0414}= useContext(TotalContext) as TotalContextProps;
  const {subscreen_groupc0414Props, setsubscreen_groupc0414Props}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86, setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86Props, setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86Props}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_cheque_group239dd, setpayment_type_cheque_group239dd}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_cheque_group239ddProps, setpayment_type_cheque_group239ddProps}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7, setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7}= useContext(TotalContext) as TotalContextProps;
  const {ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7Props, setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7Props}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_dt_groupedf52, setpayment_type_dt_groupedf52}= useContext(TotalContext) as TotalContextProps;
  const {payment_type_dt_groupedf52Props, setpayment_type_dt_groupedf52Props}= useContext(TotalContext) as TotalContextProps;
  const {debit_account_no_labelcdc37, setdebit_account_no_labelcdc37}= useContext(TotalContext) as TotalContextProps;
  const {debit_account_no53afb, setdebit_account_no53afb}= useContext(TotalContext) as TotalContextProps;
  const {available_bal_label08076, setavailable_bal_label08076}= useContext(TotalContext) as TotalContextProps;
  const {balanceb280e, setbalanceb280e}= useContext(TotalContext) as TotalContextProps;
  const {tax_amount_labela2854, settax_amount_labela2854}= useContext(TotalContext) as TotalContextProps;
  const {total_amounte161d, settotal_amounte161d}= useContext(TotalContext) as TotalContextProps;
  const {debit_amount_label8b9a0, setdebit_amount_label8b9a0}= useContext(TotalContext) as TotalContextProps;
  const {debit_amountbfd7f, setdebit_amountbfd7f}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Payment_Details:AFVK:v1",componentId:"9f8b1c13bbde4e59b630d88d4acedf52",from:"GroupPaymentTypeDtGroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("debit_account_no_label")){
      setdebit_account_no_labelcdc37({...debit_account_no_labelcdc37,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("debit_account_no")){
      setdebit_account_no53afb({...debit_account_no53afb,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("available_bal_label")){
      setavailable_bal_label08076({...available_bal_label08076,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("balance")){
      setbalanceb280e({...balanceb280e,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tax_amount_label")){
      settax_amount_labela2854({...tax_amount_labela2854,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("total_amount")){
      settotal_amounte161d({...total_amounte161d,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("debit_amount_label")){
      setdebit_amount_label8b9a0({...debit_amount_label8b9a0,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("debit_amount")){
      setdebit_amountbfd7f({...debit_amountbfd7f,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['prn_details_group']  = prn_details_group00560,
      codeStates['setprn_details_group'] = setprn_details_group00560,
      codeStates['prn_datails_table']  = prn_datails_table2ad52,
      codeStates['setprn_datails_table'] = setprn_datails_table2ad52,
      codeStates['subscreen_group']  = subscreen_groupc0414,
      codeStates['setsubscreen_group'] = setsubscreen_groupc0414,
      codeStates['ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1']  = ct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86,
      codeStates['setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v1'] = setct010_af_uf_ufws_i001_itax_itax_payment_type_cheque_v19ea86,
      codeStates['payment_type_cheque_group']  = payment_type_cheque_group239dd,
      codeStates['setpayment_type_cheque_group'] = setpayment_type_cheque_group239dd,
      codeStates['ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1']  = ct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7,
      codeStates['setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1'] = setct010_af_uf_ufws_i001_itax_itax_payment_type_directtransfer_v1dd0c7,
      codeStates['payment_type_dt_group']  = payment_type_dt_groupedf52,
      codeStates['setpayment_type_dt_group'] = setpayment_type_dt_groupedf52,

    codeExecution(code,codeStates);
    } 
  }

  function handleConfirmOnLoad(){
  }

    const handleOnload=()=>{
      // copyFormData for group
      setprn_details_group00560Props((prev:any) => {
        const newKey = 'CT010:AF:UF-UFWS:I001:ITAX:ITAX_Payment_Type_DirectTransfer:v1';
        return {
          ...prev,
          ssKey: prev?.ssKey?.includes(newKey)
            ? prev.ssKey
            : [...(prev?.ssKey || []), newKey]
        };
        });
      setprn_details_group00560((prev:any) => ({ ...prev, ...payment_type_dt_groupedf52 }));
  }
  const handleOnChange=()=>{

  }
  const payment_type_dt_groupedf52Ref = useRef<any>(null);
  const handleClearSearch = () => {
    payment_type_dt_groupedf52Ref.current?.setSearchParams();
    payment_type_dt_groupedf52Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(payment_type_dt_groupedf52) && Object.keys(payment_type_dt_groupedf52)?.length>0)
      {
        setpayment_type_dt_groupedf52({})
      }
    }else 
      prevRefreshRef.current= true
  }, [payment_type_dt_groupedf52Props?.refresh,token])

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    handleOnChange()
  }, [payment_type_dt_groupedf52])

  const renderBUttons=()=>{
    return (
      <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '2 / 50',
      
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
      className={`flex flex-col overflow-auto rounded-md p-1 ${isDark ? 'text-white' : 'text-black'}`}
    >
          {allowedControls.includes("debit_account_no_label") ?<Textdebit_account_no_label   /* cdc37 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("debit_account_no") ?<TextInputdebit_account_no   /* 53afb */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("available_bal_label") ?<Textavailable_bal_label   /* 08076 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("balance") ?<TextInputbalance   /* b280e */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("tax_amount_label") ?<Texttax_amount_label   /* a2854 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("total_amount") ?<TextInputtotal_amount   /* e161d */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("debit_amount_label") ?<Textdebit_amount_label   /* 8b9a0 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("debit_amount") ?<TextInputdebit_amount   /* bfd7f */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>
 )
}

export default Grouppayment_type_dt_group
