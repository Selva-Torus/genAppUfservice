




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
import Textprn_no_label  from "./Textprn_no_label";
import Textesip_no  from "./Textesip_no";
import Textslip_payment_code_label  from "./Textslip_payment_code_label";
import Textslip_payment_code  from "./Textslip_payment_code";
import Textpayment_advice_date_label  from "./Textpayment_advice_date_label";
import Textpayment_advice_date  from "./Textpayment_advice_date";
import Texttax_payer_pin_label  from "./Texttax_payer_pin_label";
import Texttax_payer_pin  from "./Texttax_payer_pin";
import Texttax_payer_full_name_label  from "./Texttax_payer_full_name_label";
import Texttax_payer_full_name  from "./Texttax_payer_full_name";
import Textitaxst_id  from "./Textitaxst_id";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupprndetails_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing}:any)=> {
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
  const {dfd_itax_source_tran_doc_dfd_v1Props, setdfd_itax_source_tran_doc_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
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
      "itaxst_id"
    ],
    "allowedGroups": [],
    "blockedControls": [
      "prn_no_label",
      "esip_no",
      "slip_payment_code_label",
      "slip_payment_code",
      "payment_advice_date_label",
      "payment_advice_date",
      "tax_payer_pin_label",
      "tax_payer_pin",
      "tax_payer_full_name_label",
      "tax_payer_full_name"
    ],
    "readOnlyControls": []
  },
  "Branch Manager": {
    "allowedControls": [
      "prn_no_label",
      "esip_no",
      "slip_payment_code_label",
      "slip_payment_code",
      "payment_advice_date_label",
      "payment_advice_date",
      "tax_payer_pin_label",
      "tax_payer_pin",
      "tax_payer_full_name_label",
      "tax_payer_full_name",
      "itaxst_id"
    ],
    "allowedGroups": [
      "canvas",
      "authorization_memo_file_group",
      "documentviewer_group",
      "overall_group",
      "prndetails_group",
      "application_group",
      "application_tab_group",
      "approve",
      "approve_table",
      "reason_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Credit Approver": {
    "allowedControls": [
      "prn_no_label",
      "esip_no",
      "slip_payment_code_label",
      "slip_payment_code",
      "payment_advice_date_label",
      "payment_advice_date",
      "tax_payer_pin_label",
      "tax_payer_pin",
      "tax_payer_full_name_label",
      "tax_payer_full_name"
    ],
    "allowedGroups": [
      "canvas",
      "authorization_memo_file_group",
      "documentviewer_group",
      "overall_group",
      "prndetails_group",
      "application_group",
      "application_tab_group",
      "approve",
      "approve_table",
      "reason_group"
    ],
    "blockedControls": [
      "itaxst_id"
    ],
    "readOnlyControls": []
  },
  "System Administrator": {
    "allowedControls": [
      "prn_no_label",
      "esip_no",
      "slip_payment_code_label",
      "slip_payment_code",
      "payment_advice_date_label",
      "payment_advice_date",
      "tax_payer_pin_label",
      "tax_payer_pin",
      "tax_payer_full_name_label",
      "tax_payer_full_name",
      "itaxst_id"
    ],
    "allowedGroups": [
      "canvas",
      "authorization_memo_file_group",
      "documentviewer_group",
      "overall_group",
      "prndetails_group",
      "application_group",
      "application_tab_group",
      "approve",
      "approve_table",
      "reason_group"
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
  const {authorization_memo_file_group17228, setauthorization_memo_file_group17228}= useContext(TotalContext) as TotalContextProps;
  const {authorization_memo_file_group17228Props, setauthorization_memo_file_group17228Props}= useContext(TotalContext) as TotalContextProps;
  const {documentviewer_group0a3fb, setdocumentviewer_group0a3fb}= useContext(TotalContext) as TotalContextProps;
  const {documentviewer_group0a3fbProps, setdocumentviewer_group0a3fbProps}= useContext(TotalContext) as TotalContextProps;
  const {overall_group1e6a4, setoverall_group1e6a4}= useContext(TotalContext) as TotalContextProps;
  const {overall_group1e6a4Props, setoverall_group1e6a4Props}= useContext(TotalContext) as TotalContextProps;
  const {prndetails_group881d8, setprndetails_group881d8}= useContext(TotalContext) as TotalContextProps;
  const {prndetails_group881d8Props, setprndetails_group881d8Props}= useContext(TotalContext) as TotalContextProps;
  const {prn_no_label62fcb, setprn_no_label62fcb}= useContext(TotalContext) as TotalContextProps;
  const {esip_no6f361, setesip_no6f361}= useContext(TotalContext) as TotalContextProps;
  const {slip_payment_code_labelba3fe, setslip_payment_code_labelba3fe}= useContext(TotalContext) as TotalContextProps;
  const {slip_payment_code983fc, setslip_payment_code983fc}= useContext(TotalContext) as TotalContextProps;
  const {payment_advice_date_label0a7cd, setpayment_advice_date_label0a7cd}= useContext(TotalContext) as TotalContextProps;
  const {payment_advice_datefb2ad, setpayment_advice_datefb2ad}= useContext(TotalContext) as TotalContextProps;
  const {tax_payer_pin_label532eb, settax_payer_pin_label532eb}= useContext(TotalContext) as TotalContextProps;
  const {tax_payer_pin2328b, settax_payer_pin2328b}= useContext(TotalContext) as TotalContextProps;
  const {tax_payer_full_name_label0ed9c, settax_payer_full_name_label0ed9c}= useContext(TotalContext) as TotalContextProps;
  const {tax_payer_full_namef6644, settax_payer_full_namef6644}= useContext(TotalContext) as TotalContextProps;
  const {itaxst_idd3e56, setitaxst_idd3e56}= useContext(TotalContext) as TotalContextProps;
  const {application_group16335, setapplication_group16335}= useContext(TotalContext) as TotalContextProps;
  const {application_group16335Props, setapplication_group16335Props}= useContext(TotalContext) as TotalContextProps;
  const {application_tab_groupf82f4, setapplication_tab_groupf82f4}= useContext(TotalContext) as TotalContextProps;
  const {application_tab_groupf82f4Props, setapplication_tab_groupf82f4Props}= useContext(TotalContext) as TotalContextProps;
  const {approve1c1d3, setapprove1c1d3}= useContext(TotalContext) as TotalContextProps;
  const {approve1c1d3Props, setapprove1c1d3Props}= useContext(TotalContext) as TotalContextProps;
  const {approve_tableafbb9, setapprove_tableafbb9}= useContext(TotalContext) as TotalContextProps;
  const {approve_tableafbb9Props, setapprove_tableafbb9Props}= useContext(TotalContext) as TotalContextProps;
  const {reason_group39480, setreason_group39480}= useContext(TotalContext) as TotalContextProps;
  const {reason_group39480Props, setreason_group39480Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Credit_Approval_Screen:AFVK:v1",componentId:"4596f20a04d4406587a347f2152881d8",from:"GroupPrndetailsGroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("prn_no_label")){
      setprn_no_label62fcb({...prn_no_label62fcb,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("esip_no")){
      setesip_no6f361({...esip_no6f361,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("slip_payment_code_label")){
      setslip_payment_code_labelba3fe({...slip_payment_code_labelba3fe,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("slip_payment_code")){
      setslip_payment_code983fc({...slip_payment_code983fc,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("payment_advice_date_label")){
      setpayment_advice_date_label0a7cd({...payment_advice_date_label0a7cd,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("payment_advice_date")){
      setpayment_advice_datefb2ad({...payment_advice_datefb2ad,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tax_payer_pin_label")){
      settax_payer_pin_label532eb({...tax_payer_pin_label532eb,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tax_payer_pin")){
      settax_payer_pin2328b({...tax_payer_pin2328b,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tax_payer_full_name_label")){
      settax_payer_full_name_label0ed9c({...tax_payer_full_name_label0ed9c,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tax_payer_full_name")){
      settax_payer_full_namef6644({...tax_payer_full_namef6644,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("itaxst_id")){
      setitaxst_idd3e56({...itaxst_idd3e56,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['authorization_memo_file_group']  = authorization_memo_file_group17228,
      codeStates['setauthorization_memo_file_group'] = setauthorization_memo_file_group17228,
      codeStates['documentviewer_group']  = documentviewer_group0a3fb,
      codeStates['setdocumentviewer_group'] = setdocumentviewer_group0a3fb,
      codeStates['overall_group']  = overall_group1e6a4,
      codeStates['setoverall_group'] = setoverall_group1e6a4,
      codeStates['prndetails_group']  = prndetails_group881d8,
      codeStates['setprndetails_group'] = setprndetails_group881d8,
      codeStates['application_group']  = application_group16335,
      codeStates['setapplication_group'] = setapplication_group16335,
      codeStates['approve_table']  = approve_tableafbb9,
      codeStates['setapprove_table'] = setapprove_tableafbb9,
      codeStates['reason_group']  = reason_group39480,
      codeStates['setreason_group'] = setreason_group39480,

    codeExecution(code,codeStates);
    } 
  }

  function handleConfirmOnLoad(){
  }

    const handleOnload=()=>{
      // copyFormData for group
      setdocumentviewer_group0a3fb((prev:any) => ({ ...prev, ...prndetails_group881d8 }));
  }
  const handleOnChange=()=>{

  }
  const prndetails_group881d8Ref = useRef<any>(null);
  const handleClearSearch = () => {
    prndetails_group881d8Ref.current?.setSearchParams();
    prndetails_group881d8Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(prndetails_group881d8) && Object.keys(prndetails_group881d8)?.length>0)
      {
        setprndetails_group881d8({})
      }
    }else 
      prevRefreshRef.current= true
  }, [prndetails_group881d8Props?.refresh,token])

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    handleOnChange()
  }, [prndetails_group881d8])

  const renderBUttons=()=>{
    return (
      <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '11 / 79',
      
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
      className={`flex flex-col overflow-auto rounded-md p-2 !bg-[#fff6f9] ${isDark ? 'text-white' : 'text-black'}`}
    >
          {allowedControls.includes("prn_no_label") ?<Textprn_no_label   /* 62fcb */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("esip_no") ?<Textesip_no   /* 6f361 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("slip_payment_code_label") ?<Textslip_payment_code_label   /* ba3fe */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("slip_payment_code") ?<Textslip_payment_code   /* 983fc */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("payment_advice_date_label") ?<Textpayment_advice_date_label   /* 0a7cd */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("payment_advice_date") ?<Textpayment_advice_date   /* fb2ad */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("tax_payer_pin_label") ?<Texttax_payer_pin_label   /* 532eb */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("tax_payer_pin") ?<Texttax_payer_pin   /* 2328b */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("tax_payer_full_name_label") ?<Texttax_payer_full_name_label   /* 0ed9c */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("tax_payer_full_name") ?<Texttax_payer_full_name   /* f6644 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("itaxst_id") ?<Textitaxst_id   /* d3e56 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>
 )
}

export default Groupprndetails_group
