




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
import Texttran_category_label  from "./Texttran_category_label";
import Textprocessing_system_label  from "./Textprocessing_system_label";
import Texttran_category  from "./Texttran_category";
import Textprocessing_system  from "./Textprocessing_system";
import Buttonview_process_detail  from "./Buttonview_process_detail";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupview_process_detail_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing}:any)=> {
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
  const {dfd_itax_tran_log_dfd_v1Props, setdfd_itax_tran_log_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
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
      "tran_category_label",
      "processing_system_label",
      "tran_category",
      "processing_system",
      "view_process_detail"
    ],
    "allowedGroups": [
      "canvas",
      "view_process_detail_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Branch Manager": {
    "allowedControls": [
      "tran_category_label",
      "processing_system_label",
      "tran_category",
      "processing_system",
      "view_process_detail"
    ],
    "allowedGroups": [
      "canvas",
      "view_process_detail_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Credit Approver": {
    "allowedControls": [
      "tran_category_label",
      "processing_system_label",
      "tran_category",
      "processing_system",
      "view_process_detail"
    ],
    "allowedGroups": [
      "canvas",
      "view_process_detail_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "System Administrator": {
    "allowedControls": [
      "tran_category_label",
      "processing_system_label",
      "tran_category",
      "processing_system",
      "view_process_detail"
    ],
    "allowedGroups": [
      "canvas",
      "view_process_detail_group"
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
  const {view_process_detail_groupe7fe3, setview_process_detail_groupe7fe3}= useContext(TotalContext) as TotalContextProps;
  const {view_process_detail_groupe7fe3Props, setview_process_detail_groupe7fe3Props}= useContext(TotalContext) as TotalContextProps;
  const {tran_category_label4bfef, settran_category_label4bfef}= useContext(TotalContext) as TotalContextProps;
  const {processing_system_labele6ddd, setprocessing_system_labele6ddd}= useContext(TotalContext) as TotalContextProps;
  const {tran_categorycab42, settran_categorycab42}= useContext(TotalContext) as TotalContextProps;
  const {processing_systemcd502, setprocessing_systemcd502}= useContext(TotalContext) as TotalContextProps;
  const {view_process_detailf4139, setview_process_detailf4139}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_View_Process_Detail:AFVK:v1",componentId:"2b4095e2d9814a89a8874886a5fe7fe3",from:"GroupViewProcessDetailGroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("tran_category_label")){
      settran_category_label4bfef({...tran_category_label4bfef,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("processing_system_label")){
      setprocessing_system_labele6ddd({...processing_system_labele6ddd,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tran_category")){
      settran_categorycab42({...tran_categorycab42,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("processing_system")){
      setprocessing_systemcd502({...processing_systemcd502,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("view_process_detail")){
      setview_process_detailf4139({...view_process_detailf4139,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['view_process_detail_group']  = view_process_detail_groupe7fe3,
      codeStates['setview_process_detail_group'] = setview_process_detail_groupe7fe3,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const view_process_detail_groupe7fe3Ref = useRef<any>(null);
  const handleClearSearch = () => {
    view_process_detail_groupe7fe3Ref.current?.setSearchParams();
    view_process_detail_groupe7fe3Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(view_process_detail_groupe7fe3) && Object.keys(view_process_detail_groupe7fe3)?.length>0)
      {
        setview_process_detail_groupe7fe3({})
      }
    }else 
      prevRefreshRef.current= true
  }, [view_process_detail_groupe7fe3Props?.refresh,token])


  const renderBUttons=()=>{
    return (
      <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 46',
      
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
      className={`flex flex-col overflow-auto rounded-md p-4 !bg-[#fff6f9] ${isDark ? 'text-white' : 'text-black'}`}
    >
          {allowedControls.includes("tran_category_label") ?<Texttran_category_label   /* 4bfef */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("processing_system_label") ?<Textprocessing_system_label   /* e6ddd */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("tran_category") ?<Texttran_category   /* cab42 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("processing_system") ?<Textprocessing_system   /* cd502 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {        (("view_process_detail" in ButtonGoRuleData)?ButtonGoRuleData["view_process_detail"]:true) && 
          allowedControls.includes("view_process_detail")  ?            <Buttonview_process_detail lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing}/>: <div></div>} 
    </div>
 )
}

export default Groupview_process_detail_group
