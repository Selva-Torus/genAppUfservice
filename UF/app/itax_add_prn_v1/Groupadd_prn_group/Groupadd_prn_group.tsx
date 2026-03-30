




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
import Textadd_prn  from "./Textadd_prn";
import Textprn_no_label  from "./Textprn_no_label";
import TextInputprn_no  from "./TextInputprn_no";
import Buttonclear  from "./Buttonclear";
import Buttonsave  from "./Buttonsave";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupadd_prn_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing}:any)=> {
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
      "add_prn",
      "prn_no_label",
      "prn_no",
      "clear",
      "save"
    ],
    "allowedGroups": [
      "canvas",
      "add_prn_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Branch Manager": {
    "allowedControls": [
      "add_prn",
      "prn_no_label",
      "prn_no",
      "clear",
      "save"
    ],
    "allowedGroups": [
      "canvas",
      "add_prn_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Credit Approver": {
    "allowedControls": [
      "add_prn",
      "prn_no_label",
      "prn_no",
      "clear",
      "save"
    ],
    "allowedGroups": [
      "canvas",
      "add_prn_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "System Administrator": {
    "allowedControls": [
      "add_prn",
      "prn_no_label",
      "prn_no",
      "clear",
      "save"
    ],
    "allowedGroups": [
      "canvas",
      "add_prn_group"
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
  const {add_prn_group1a4d8, setadd_prn_group1a4d8}= useContext(TotalContext) as TotalContextProps;
  const {add_prn_group1a4d8Props, setadd_prn_group1a4d8Props}= useContext(TotalContext) as TotalContextProps;
  const {add_prnadd8d, setadd_prnadd8d}= useContext(TotalContext) as TotalContextProps;
  const {prn_no_labelefcac, setprn_no_labelefcac}= useContext(TotalContext) as TotalContextProps;
  const {prn_no972eb, setprn_no972eb}= useContext(TotalContext) as TotalContextProps;
  const {cleara7662, setcleara7662}= useContext(TotalContext) as TotalContextProps;
  const {saveda692, setsaveda692}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Add_PRN:AFVK:v1",componentId:"9b82f09daa9b4c4dbf68f7ffdbd1a4d8",from:"GroupAddPrnGroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("add_prn")){
      setadd_prnadd8d({...add_prnadd8d,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("prn_no_label")){
      setprn_no_labelefcac({...prn_no_labelefcac,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("prn_no")){
      setprn_no972eb({...prn_no972eb,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("clear")){
      setcleara7662({...cleara7662,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("save")){
      setsaveda692({...saveda692,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['add_prn_group']  = add_prn_group1a4d8,
      codeStates['setadd_prn_group'] = setadd_prn_group1a4d8,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const add_prn_group1a4d8Ref = useRef<any>(null);
  const handleClearSearch = () => {
    add_prn_group1a4d8Ref.current?.setSearchParams();
    add_prn_group1a4d8Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(add_prn_group1a4d8) && Object.keys(add_prn_group1a4d8)?.length>0)
      {
        setadd_prn_group1a4d8({})
      }
    }else 
      prevRefreshRef.current= true
  }, [add_prn_group1a4d8Props?.refresh,token])


  const renderBUttons=()=>{
    return (
      <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 45',
      
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
      className={`flex flex-col overflow-auto rounded-md p-4 ${isDark ? 'text-white' : 'text-black'}`}
    >
          {allowedControls.includes("add_prn") ?<Textadd_prn   /* add8d */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("prn_no_label") ?<Textprn_no_label   /* efcac */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("prn_no") ?<TextInputprn_no   /* 972eb */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {        (("clear" in ButtonGoRuleData)?ButtonGoRuleData["clear"]:true) && 
          allowedControls.includes("clear")  ?            <Buttonclear lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing}/>: <div></div>} 
        {        (("save" in ButtonGoRuleData)?ButtonGoRuleData["save"]:true) && 
          allowedControls.includes("save")  ?            <Buttonsave lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing}/>: <div></div>} 
    </div>
 )
}

export default Groupadd_prn_group
