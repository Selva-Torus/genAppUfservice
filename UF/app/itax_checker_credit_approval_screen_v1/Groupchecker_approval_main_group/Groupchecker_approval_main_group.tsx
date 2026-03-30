




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
import Textupload_file_label  from "./Textupload_file_label";
import Textitaxst_id  from "./Textitaxst_id";
import Documentuploaderdocumentuploader  from "./Documentuploaderdocumentuploader";
import TextInputfile_name  from "./TextInputfile_name";
import Buttoncancel  from "./Buttoncancel";
import Buttoncredit_approve  from "./Buttoncredit_approve";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupchecker_approval_main_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing}:any)=> {
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
      "upload_file_label",
      "itaxst_id",
      "documentuploader",
      "file_name",
      "cancel",
      "credit_approve"
    ],
    "allowedGroups": [
      "canvas",
      "checker_approval_main_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Branch Manager": {
    "allowedControls": [
      "upload_file_label",
      "itaxst_id",
      "documentuploader",
      "file_name",
      "cancel",
      "credit_approve"
    ],
    "allowedGroups": [
      "canvas",
      "checker_approval_main_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Credit Approver": {
    "allowedControls": [
      "upload_file_label",
      "documentuploader",
      "file_name",
      "cancel",
      "credit_approve"
    ],
    "allowedGroups": [
      "canvas",
      "checker_approval_main_group"
    ],
    "blockedControls": [
      "itaxst_id"
    ],
    "readOnlyControls": []
  },
  "System Administrator": {
    "allowedControls": [
      "upload_file_label",
      "itaxst_id",
      "documentuploader",
      "file_name",
      "cancel",
      "credit_approve"
    ],
    "allowedGroups": [
      "canvas",
      "checker_approval_main_group"
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
  const {checker_approval_main_groupff981, setchecker_approval_main_groupff981}= useContext(TotalContext) as TotalContextProps;
  const {checker_approval_main_groupff981Props, setchecker_approval_main_groupff981Props}= useContext(TotalContext) as TotalContextProps;
  const {upload_file_label93f14, setupload_file_label93f14}= useContext(TotalContext) as TotalContextProps;
  const {itaxst_ida5acc, setitaxst_ida5acc}= useContext(TotalContext) as TotalContextProps;
  const {documentuploader68dcb, setdocumentuploader68dcb}= useContext(TotalContext) as TotalContextProps;
  const {file_name456cb, setfile_name456cb}= useContext(TotalContext) as TotalContextProps;
  const {cancel68e13, setcancel68e13}= useContext(TotalContext) as TotalContextProps;
  const {credit_approve89f9a, setcredit_approve89f9a}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Checker_Credit_Approval_Screen:AFVK:v1",componentId:"69e68eaa0404477da2d103ecf51ff981",from:"GroupCheckerApprovalMainGroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("upload_file_label")){
      setupload_file_label93f14({...upload_file_label93f14,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("itaxst_id")){
      setitaxst_ida5acc({...itaxst_ida5acc,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("documentuploader")){
      setdocumentuploader68dcb({...documentuploader68dcb,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("file_name")){
      setfile_name456cb({...file_name456cb,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("cancel")){
      setcancel68e13({...cancel68e13,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("credit_approve")){
      setcredit_approve89f9a({...credit_approve89f9a,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['checker_approval_main_group']  = checker_approval_main_groupff981,
      codeStates['setchecker_approval_main_group'] = setchecker_approval_main_groupff981,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const checker_approval_main_groupff981Ref = useRef<any>(null);
  const handleClearSearch = () => {
    checker_approval_main_groupff981Ref.current?.setSearchParams();
    checker_approval_main_groupff981Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(checker_approval_main_groupff981) && Object.keys(checker_approval_main_groupff981)?.length>0)
      {
        setchecker_approval_main_groupff981({})
      }
    }else 
      prevRefreshRef.current= true
  }, [checker_approval_main_groupff981Props?.refresh,token])


  const renderBUttons=()=>{
    return (
      <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 82',
      
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
      className={`flex flex-col overflow-auto rounded-md p-2 ${isDark ? 'text-white' : 'text-black'}`}
    >
          {allowedControls.includes("upload_file_label") ?<Textupload_file_label   /* 93f14 */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
          {allowedControls.includes("itaxst_id") ?<Textitaxst_id   /* a5acc */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("documentuploader") ?<Documentuploaderdocumentuploader   /* 68dcb */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("file_name") ?<TextInputfile_name   /* 456cb */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {        (("cancel" in ButtonGoRuleData)?ButtonGoRuleData["cancel"]:true) && 
          allowedControls.includes("cancel")  ?            <Buttoncancel lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing}/>: <div></div>} 
        {        (("credit_approve" in ButtonGoRuleData)?ButtonGoRuleData["credit_approve"]:true) && 
          allowedControls.includes("credit_approve")  ?            <Buttoncredit_approve lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing}/>: <div></div>} 
    </div>
 )
}

export default Groupchecker_approval_main_group
