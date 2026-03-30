




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
import TextInputprn_textinput  from "./TextInputprn_textinput";
import TextInputslippaymentcodetextinput  from "./TextInputslippaymentcodetextinput";
import TextInputtaxpayerfullnametextinput  from "./TextInputtaxpayerfullnametextinput";
import Buttonclear  from "./Buttonclear";
import Buttonsearch  from "./Buttonsearch";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupsearch_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing}:any)=> {
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
      "prn_textinput",
      "slippaymentcodetextinput",
      "taxpayerfullnametextinput",
      "clear",
      "search"
    ],
    "allowedGroups": [
      "canvas",
      "search_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Branch Manager": {
    "allowedControls": [
      "prn_textinput",
      "slippaymentcodetextinput",
      "taxpayerfullnametextinput",
      "clear",
      "search"
    ],
    "allowedGroups": [
      "canvas",
      "search_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Credit Approver": {
    "allowedControls": [
      "prn_textinput",
      "slippaymentcodetextinput",
      "taxpayerfullnametextinput",
      "clear",
      "search"
    ],
    "allowedGroups": [
      "canvas",
      "search_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "System Administrator": {
    "allowedControls": [
      "prn_textinput",
      "slippaymentcodetextinput",
      "taxpayerfullnametextinput",
      "clear",
      "search"
    ],
    "allowedGroups": [
      "canvas",
      "search_group"
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
  const {search_group9a617, setsearch_group9a617}= useContext(TotalContext) as TotalContextProps;
  const {search_group9a617Props, setsearch_group9a617Props}= useContext(TotalContext) as TotalContextProps;
  const {prn_textinput88273, setprn_textinput88273}= useContext(TotalContext) as TotalContextProps;
  const {slippaymentcodetextinputf76e3, setslippaymentcodetextinputf76e3}= useContext(TotalContext) as TotalContextProps;
  const {taxpayerfullnametextinput0ac43, settaxpayerfullnametextinput0ac43}= useContext(TotalContext) as TotalContextProps;
  const {clear43278, setclear43278}= useContext(TotalContext) as TotalContextProps;
  const {search6f0c3, setsearch6f0c3}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Main_Screen_Search:AFVK:v1",componentId:"67a3af3c7cf8400e86a421b514e9a617",from:"GroupSearchGroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("prn_textinput")){
      setprn_textinput88273({...prn_textinput88273,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("slippaymentcodetextinput")){
      setslippaymentcodetextinputf76e3({...slippaymentcodetextinputf76e3,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("taxpayerfullnametextinput")){
      settaxpayerfullnametextinput0ac43({...taxpayerfullnametextinput0ac43,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("clear")){
      setclear43278({...clear43278,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("search")){
      setsearch6f0c3({...search6f0c3,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['search_group']  = search_group9a617,
      codeStates['setsearch_group'] = setsearch_group9a617,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const search_group9a617Ref = useRef<any>(null);
  const handleClearSearch = () => {
    search_group9a617Ref.current?.setSearchParams();
    search_group9a617Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(search_group9a617) && Object.keys(search_group9a617)?.length>0)
      {
        setsearch_group9a617({})
      }
    }else 
      prevRefreshRef.current= true
  }, [search_group9a617Props?.refresh,token])


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
        columnGap: '5px',
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
        {allowedControls.includes("prn_textinput") ?<TextInputprn_textinput   /* 88273 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("slippaymentcodetextinput") ?<TextInputslippaymentcodetextinput   /* f76e3 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("taxpayerfullnametextinput") ?<TextInputtaxpayerfullnametextinput   /* 0ac43 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {        (("clear" in ButtonGoRuleData)?ButtonGoRuleData["clear"]:true) && 
          allowedControls.includes("clear")  ?            <Buttonclear lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing}/>: <div></div>} 
        {        (("search" in ButtonGoRuleData)?ButtonGoRuleData["search"]:true) && 
          allowedControls.includes("search")  ?            <Buttonsearch lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing}/>: <div></div>} 
    </div>
 )
}

export default Groupsearch_group
