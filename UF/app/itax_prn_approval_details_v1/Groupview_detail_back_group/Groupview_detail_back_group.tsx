




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
import Buttonrejected  from "./Buttonrejected";
import Buttonapprove  from "./Buttonapprove";
import Textview_details  from "./Textview_details";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupview_detail_back_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing}:any)=> {
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
      "rejected",
      "approve",
      "view_details"
    ],
    "allowedGroups": [
      "canvas",
      "view_detail_back_group",
      "viewed_details_grp",
      "prn_no_details_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Branch Manager": {
    "allowedControls": [
      "rejected",
      "approve",
      "view_details"
    ],
    "allowedGroups": [
      "canvas",
      "view_detail_back_group",
      "viewed_details_grp",
      "prn_no_details_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Credit Approver": {
    "allowedControls": [
      "rejected",
      "approve",
      "view_details"
    ],
    "allowedGroups": [
      "canvas",
      "view_detail_back_group",
      "viewed_details_grp",
      "prn_no_details_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "System Administrator": {
    "allowedControls": [
      "rejected",
      "approve"
    ],
    "allowedGroups": [],
    "blockedControls": [
      "view_details"
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
  const {rejectedc3cd0, setrejectedc3cd0}= useContext(TotalContext) as TotalContextProps;
  const {approve242e3, setapprove242e3}= useContext(TotalContext) as TotalContextProps;
  const {view_details5f9dd, setview_details5f9dd}= useContext(TotalContext) as TotalContextProps;
  const {viewed_details_grp73f21, setviewed_details_grp73f21}= useContext(TotalContext) as TotalContextProps;
  const {viewed_details_grp73f21Props, setviewed_details_grp73f21Props}= useContext(TotalContext) as TotalContextProps;
  const {prn_no_details_tablefc106, setprn_no_details_tablefc106}= useContext(TotalContext) as TotalContextProps;
  const {prn_no_details_tablefc106Props, setprn_no_details_tablefc106Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_PRN_Approval_Details:AFVK:v1",componentId:"be3f23f0662a4486855a2aabcad50bce",from:"GroupViewDetailBackGroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("rejected")){
      setrejectedc3cd0({...rejectedc3cd0,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("approve")){
      setapprove242e3({...approve242e3,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("view_details")){
      setview_details5f9dd({...view_details5f9dd,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['view_detail_back_group']  = view_detail_back_group50bce,
      codeStates['setview_detail_back_group'] = setview_detail_back_group50bce,
      codeStates['viewed_details_grp']  = viewed_details_grp73f21,
      codeStates['setviewed_details_grp'] = setviewed_details_grp73f21,
      codeStates['prn_no_details_table']  = prn_no_details_tablefc106,
      codeStates['setprn_no_details_table'] = setprn_no_details_tablefc106,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const view_detail_back_group50bceRef = useRef<any>(null);
  const handleClearSearch = () => {
    view_detail_back_group50bceRef.current?.setSearchParams();
    view_detail_back_group50bceRef.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(view_detail_back_group50bce) && Object.keys(view_detail_back_group50bce)?.length>0)
      {
        setview_detail_back_group50bce({})
      }
    }else 
      prevRefreshRef.current= true
  }, [view_detail_back_group50bceProps?.refresh,token])


  const renderBUttons=()=>{
    return (
      <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 12',
      
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(24, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        height: '100%',
        overflow: 'auto',
        gridAutoRows: '4px',
        columnGap: '6px',
        backgroundColor:'#f2f2f2',
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
        {        (("rejected" in ButtonGoRuleData)?ButtonGoRuleData["rejected"]:true) && 
          allowedControls.includes("rejected")  ?            <Buttonrejected lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing}/>: <div></div>} 
        {        (("approve" in ButtonGoRuleData)?ButtonGoRuleData["approve"]:true) && 
          allowedControls.includes("approve")  ?            <Buttonapprove lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} setIsProcessing={setIsProcessing}/>: <div></div>} 
          {allowedControls.includes("view_details") ?<Textview_details   /* 5f9dd */ isDynamic={false } index={idx} item={item} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>
 )
}

export default Groupview_detail_back_group
