




'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleGroupArrayCopyFormData } from '@/app/utils/commonfunctions'; 
import { CommonHeaderAndTooltip } from '@/components/CommonHeaderAndTooltip';
import Groupprn_no_datails_table  from "../Groupprn_no_datails_table/Groupprn_no_datails_table";
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
import Textprn_label  from "./Textprn_label";
import Texteslip_no  from "./Texteslip_no";
import Textitaxst_id  from "./Textitaxst_id";
import Texteslip_details  from "./Texteslip_details";
import Textprn_status_label  from "./Textprn_status_label";
import Textpin_label  from "./Textpin_label";
import Texttax_payers_name_label  from "./Texttax_payers_name_label";
import TextInputprn_status  from "./TextInputprn_status";
import TextInputpin  from "./TextInputpin";
import TextInputtax_payers_name  from "./TextInputtax_payers_name";
import Textprn_amount_label  from "./Textprn_amount_label";
import Textcurrency_label  from "./Textcurrency_label";
import Textprn_reg_date_label  from "./Textprn_reg_date_label";
import TextInputprn_amount  from "./TextInputprn_amount";
import TextInputcurrency  from "./TextInputcurrency";
import TextInputprn_registration_date  from "./TextInputprn_registration_date";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupview_detail_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing}:any)=> {
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
  const {dfd_itax_source_tran_dtl_dfd_v1Props, setdfd_itax_source_tran_dtl_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
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
      "prn_label",
      "eslip_no",
      "eslip_details",
      "prn_status_label",
      "pin_label",
      "tax_payers_name_label",
      "prn_status",
      "pin",
      "tax_payers_name",
      "prn_amount_label",
      "currency_label",
      "prn_reg_date_label",
      "prn_amount",
      "currency",
      "prn_registration_date"
    ],
    "allowedGroups": [
      "canvas",
      "view_detail_back_group",
      "view_detail_group",
      "prn_no_datails_table"
    ],
    "blockedControls": [
      "itaxst_id"
    ],
    "readOnlyControls": []
  },
  "Branch Manager": {
    "allowedControls": [
      "prn_label",
      "eslip_no",
      "eslip_details",
      "prn_status_label",
      "pin_label",
      "tax_payers_name_label",
      "prn_status",
      "pin",
      "tax_payers_name",
      "prn_amount_label",
      "currency_label",
      "prn_reg_date_label",
      "prn_amount",
      "currency",
      "prn_registration_date"
    ],
    "allowedGroups": [
      "canvas",
      "view_detail_back_group",
      "view_detail_group",
      "prn_no_datails_table"
    ],
    "blockedControls": [
      "itaxst_id"
    ],
    "readOnlyControls": []
  },
  "Credit Approver": {
    "allowedControls": [
      "prn_label",
      "eslip_no",
      "eslip_details",
      "prn_status_label",
      "pin_label",
      "tax_payers_name_label",
      "prn_status",
      "pin",
      "tax_payers_name",
      "prn_amount_label",
      "currency_label",
      "prn_reg_date_label",
      "prn_amount",
      "currency",
      "prn_registration_date"
    ],
    "allowedGroups": [
      "canvas",
      "view_detail_back_group",
      "view_detail_group",
      "prn_no_datails_table"
    ],
    "blockedControls": [
      "itaxst_id"
    ],
    "readOnlyControls": []
  },
  "System Administrator": {
    "allowedControls": [],
    "allowedGroups": [],
    "blockedControls": [
      "prn_label",
      "eslip_no",
      "itaxst_id",
      "eslip_details",
      "prn_status_label",
      "pin_label",
      "tax_payers_name_label",
      "prn_status",
      "pin",
      "tax_payers_name",
      "prn_amount_label",
      "currency_label",
      "prn_reg_date_label",
      "prn_amount",
      "currency",
      "prn_registration_date"
    ],
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
  const {view_detail_back_group50bce, setview_detail_back_group50bce}= useContext(TotalContext) as TotalContextProps;
  const {view_detail_back_group50bceProps, setview_detail_back_group50bceProps}= useContext(TotalContext) as TotalContextProps;
  const {view_detail_group73f21, setview_detail_group73f21}= useContext(TotalContext) as TotalContextProps;
  const {view_detail_group73f21Props, setview_detail_group73f21Props}= useContext(TotalContext) as TotalContextProps;
  const {prn_label348d7, setprn_label348d7}= useContext(TotalContext) as TotalContextProps;
  const {eslip_no1e386, seteslip_no1e386}= useContext(TotalContext) as TotalContextProps;
  const {itaxst_id1d5bd, setitaxst_id1d5bd}= useContext(TotalContext) as TotalContextProps;
  const {eslip_details567e2, seteslip_details567e2}= useContext(TotalContext) as TotalContextProps;
  const {prn_status_labele7b20, setprn_status_labele7b20}= useContext(TotalContext) as TotalContextProps;
  const {pin_label660ea, setpin_label660ea}= useContext(TotalContext) as TotalContextProps;
  const {tax_payers_name_label86492, settax_payers_name_label86492}= useContext(TotalContext) as TotalContextProps;
  const {prn_status83532, setprn_status83532}= useContext(TotalContext) as TotalContextProps;
  const {pin7c9eb, setpin7c9eb}= useContext(TotalContext) as TotalContextProps;
  const {tax_payers_name38781, settax_payers_name38781}= useContext(TotalContext) as TotalContextProps;
  const {prn_amount_labela6563, setprn_amount_labela6563}= useContext(TotalContext) as TotalContextProps;
  const {currency_label786a3, setcurrency_label786a3}= useContext(TotalContext) as TotalContextProps;
  const {prn_reg_date_labelf0c46, setprn_reg_date_labelf0c46}= useContext(TotalContext) as TotalContextProps;
  const {prn_amountd22c3, setprn_amountd22c3}= useContext(TotalContext) as TotalContextProps;
  const {currency1ef9b, setcurrency1ef9b}= useContext(TotalContext) as TotalContextProps;
  const {prn_registration_date67d15, setprn_registration_date67d15}= useContext(TotalContext) as TotalContextProps;
  const {prn_no_datails_tablefc106, setprn_no_datails_tablefc106}= useContext(TotalContext) as TotalContextProps;
  const {prn_no_datails_tablefc106Props, setprn_no_datails_tablefc106Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_View_Details:AFVK:v1",componentId:"cf8c6e9383ea49e7be4639ad0e373f21",from:"GroupViewDetailGroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("prn_label")){
      setprn_label348d7({...prn_label348d7,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("eslip_no")){
      seteslip_no1e386({...eslip_no1e386,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("itaxst_id")){
      setitaxst_id1d5bd({...itaxst_id1d5bd,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("eslip_details")){
      seteslip_details567e2({...eslip_details567e2,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("prn_status_label")){
      setprn_status_labele7b20({...prn_status_labele7b20,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("pin_label")){
      setpin_label660ea({...pin_label660ea,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tax_payers_name_label")){
      settax_payers_name_label86492({...tax_payers_name_label86492,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("prn_status")){
      setprn_status83532({...prn_status83532,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("pin")){
      setpin7c9eb({...pin7c9eb,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tax_payers_name")){
      settax_payers_name38781({...tax_payers_name38781,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("prn_amount_label")){
      setprn_amount_labela6563({...prn_amount_labela6563,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("currency_label")){
      setcurrency_label786a3({...currency_label786a3,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("prn_reg_date_label")){
      setprn_reg_date_labelf0c46({...prn_reg_date_labelf0c46,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("prn_amount")){
      setprn_amountd22c3({...prn_amountd22c3,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("currency")){
      setcurrency1ef9b({...currency1ef9b,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("prn_registration_date")){
      setprn_registration_date67d15({...prn_registration_date67d15,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("prn_no_datails_table")){
      setprn_no_datails_tablefc106({...prn_no_datails_tablefc106,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['view_detail_back_group']  = view_detail_back_group50bce,
      codeStates['setview_detail_back_group'] = setview_detail_back_group50bce,
      codeStates['view_detail_group']  = view_detail_group73f21,
      codeStates['setview_detail_group'] = setview_detail_group73f21,
      codeStates['prn_no_datails_table']  = prn_no_datails_tablefc106,
      codeStates['setprn_no_datails_table'] = setprn_no_datails_tablefc106,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const view_detail_group73f21Ref = useRef<any>(null);
  const handleClearSearch = () => {
    view_detail_group73f21Ref.current?.setSearchParams();
    view_detail_group73f21Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(view_detail_group73f21) && Object.keys(view_detail_group73f21)?.length>0)
      {
        setview_detail_group73f21({})
      }
    }else 
      prevRefreshRef.current= true
  }, [view_detail_group73f21Props?.refresh,token])


  const renderBUttons=()=>{
    return (
      <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '10 / 151',
      
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(24, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        height: '100%',
        overflow: 'auto',
        gridAutoRows: '4px',
        columnGap: '4px',
        backgroundColor:'#ffffff',
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
        {allowedComponent.includes("prn_no_datails_table")  &&<Groupprn_no_datails_table  
          lockedData={lockedData} 
          setLockedData={setLockedData} 
          primaryTableData={primaryTableData}
          setPrimaryTableData={setPrimaryTableData}
          checkToAdd={checkToAdd} 
          setCheckToAdd={setCheckToAdd}  
          refetch={refetch}
          setRefetch={setRefetch}
          encryptionFlagPageData={encryptionFlagPageData}
          paginationDetails={paginationDetails}
          setIsProcessing={setIsProcessing}        />}
          {allowedControls.includes("prn_label") ?<Textprn_label   /* 348d7 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("eslip_no") ?<Texteslip_no   /* 1e386 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("itaxst_id") ?<Textitaxst_id   /* 1d5bd */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("eslip_details") ?<Texteslip_details   /* 567e2 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("prn_status_label") ?<Textprn_status_label   /* e7b20 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("pin_label") ?<Textpin_label   /* 660ea */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("tax_payers_name_label") ?<Texttax_payers_name_label   /* 86492 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("prn_status") ?<TextInputprn_status   /* 83532 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("pin") ?<TextInputpin   /* 7c9eb */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("tax_payers_name") ?<TextInputtax_payers_name   /* 38781 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("prn_amount_label") ?<Textprn_amount_label   /* a6563 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("currency_label") ?<Textcurrency_label   /* 786a3 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("prn_reg_date_label") ?<Textprn_reg_date_label   /* f0c46 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("prn_amount") ?<TextInputprn_amount   /* d22c3 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("currency") ?<TextInputcurrency   /* 1ef9b */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("prn_registration_date") ?<TextInputprn_registration_date   /* 67d15 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>
 )
}

export default Groupview_detail_group
