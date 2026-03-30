




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
import Buttonreject  from "./Buttonreject";
import Buttonapprove  from "./Buttonapprove";
import DocumentViewerdocumentviewer  from "./DocumentViewerdocumentviewer";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupdocumentviewer_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing}:any)=> {
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
    "allowedControls": [],
    "allowedGroups": [],
    "blockedControls": [
      "reject",
      "approve",
      "documentviewer"
    ],
    "readOnlyControls": []
  },
  "Branch Manager": {
    "allowedControls": [
      "reject",
      "approve",
      "documentviewer"
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
      "reject",
      "approve",
      "documentviewer"
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
  "System Administrator": {
    "allowedControls": [
      "reject",
      "approve",
      "documentviewer"
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
  const {reject5bd6a, setreject5bd6a}= useContext(TotalContext) as TotalContextProps;
  const {approve79abe, setapprove79abe}= useContext(TotalContext) as TotalContextProps;
  const {documentviewercd49e, setdocumentviewercd49e}= useContext(TotalContext) as TotalContextProps;
  const {overall_group1e6a4, setoverall_group1e6a4}= useContext(TotalContext) as TotalContextProps;
  const {overall_group1e6a4Props, setoverall_group1e6a4Props}= useContext(TotalContext) as TotalContextProps;
  const {prndetails_group881d8, setprndetails_group881d8}= useContext(TotalContext) as TotalContextProps;
  const {prndetails_group881d8Props, setprndetails_group881d8Props}= useContext(TotalContext) as TotalContextProps;
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
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_Credit_Approval_Screen:AFVK:v1",componentId:"6b54888d3233443d80bc3f86b430a3fb",from:"GroupDocumentviewerGroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("reject")){
      setreject5bd6a({...reject5bd6a,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("approve")){
      setapprove79abe({...approve79abe,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("documentviewer")){
      setdocumentviewercd49e({...documentviewercd49e,isDisabled:true});
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


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const documentviewer_group0a3fbRef = useRef<any>(null);
  const handleClearSearch = () => {
    documentviewer_group0a3fbRef.current?.setSearchParams();
    documentviewer_group0a3fbRef.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(documentviewer_group0a3fb) && Object.keys(documentviewer_group0a3fb)?.length>0)
      {
        setdocumentviewer_group0a3fb({})
      }
    }else 
      prevRefreshRef.current= true
  }, [documentviewer_group0a3fbProps?.refresh,token])


  const renderBUttons=()=>{
    return (
      <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '13 / 25',
        gridRow: '1 / 230',
      
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
        {        (("reject" in ButtonGoRuleData)?ButtonGoRuleData["reject"]:true) && 
          allowedControls.includes("reject")  ?            <Buttonreject lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing}/>: <div></div>} 
        {        (("approve" in ButtonGoRuleData)?ButtonGoRuleData["approve"]:true) && 
          allowedControls.includes("approve")  ?            <Buttonapprove lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing}/>: <div></div>} 
        {allowedControls.includes("documentviewer") ?<DocumentViewerdocumentviewer   /* cd49e */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>
 )
}

export default Groupdocumentviewer_group
