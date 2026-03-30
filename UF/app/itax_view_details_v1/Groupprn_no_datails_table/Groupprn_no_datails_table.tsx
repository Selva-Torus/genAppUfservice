




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
import Tableprn_no_datails_table  from './Tableprn_no_datails_table';  
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupprn_no_datails_table = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing}:any)=> {
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
      "tax_code",
      "tax_component",
      "tax_period",
      "amount"
    ],
    "allowedGroups": [
      "canvas",
      "view_detail_back_group",
      "view_detail_group",
      "prn_no_datails_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Branch Manager": {
    "allowedControls": [
      "tax_code",
      "tax_component",
      "tax_period",
      "amount"
    ],
    "allowedGroups": [
      "canvas",
      "view_detail_back_group",
      "view_detail_group",
      "prn_no_datails_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Credit Approver": {
    "allowedControls": [
      "tax_code",
      "tax_component",
      "tax_period",
      "amount"
    ],
    "allowedGroups": [
      "canvas",
      "view_detail_back_group",
      "view_detail_group",
      "prn_no_datails_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "System Administrator": {
    "allowedControls": [],
    "allowedGroups": [],
    "blockedControls": [
      "tax_code",
      "tax_component",
      "tax_period",
      "amount"
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
  const {prn_no_datails_tablefc106, setprn_no_datails_tablefc106}= useContext(TotalContext) as TotalContextProps;
  const {prn_no_datails_tablefc106Props, setprn_no_datails_tablefc106Props}= useContext(TotalContext) as TotalContextProps;
  const {tax_code65046, settax_code65046}= useContext(TotalContext) as TotalContextProps;
  const {tax_component64ca3, settax_component64ca3}= useContext(TotalContext) as TotalContextProps;
  const {tax_period5506c, settax_period5506c}= useContext(TotalContext) as TotalContextProps;
  const {amountb7a3b, setamountb7a3b}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_View_Details:AFVK:v1",componentId:"1cae4dcf33404c0ca0a1036d82dfc106",from:"GroupPrnNoDatailsTable",isTable : true,accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("tax_code")){
      settax_code65046({...tax_code65046,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tax_component")){
      settax_component64ca3({...tax_component64ca3,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tax_period")){
      settax_period5506c({...tax_period5506c,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("amount")){
      setamountb7a3b({...amountb7a3b,isDisabled:true});
    }
  //////////////
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const prn_no_datails_tablefc106Ref = useRef<any>(null);
  const handleClearSearch = () => {
    prn_no_datails_tablefc106Ref.current?.setSearchParams();
    prn_no_datails_tablefc106Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(prn_no_datails_tablefc106) && Object.keys(prn_no_datails_tablefc106)?.length>0)
      {
        setprn_no_datails_tablefc106({})
      }
    }else 
      prevRefreshRef.current= true
  }, [prn_no_datails_tablefc106Props?.refresh,token])


  const renderBUttons=()=>{
    return (
          <></>
    )
  }
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '68 / 149',
      
        //rowGap: '0px',
        overflow: 'visible',
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
      <div className='flex flex-col h-full w-full min-w-0 overflow-auto'>
        <div className='flex flex-1 w-full min-h-0'>
       {<Tableprn_no_datails_table headerButtonsRenders={renderBUttons}
        lockedData={lockedData} setLockedData={setLockedData}  primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData}  refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} paginationDetails={paginationDetails} open={open} setOpen={setOpen} ref={prn_no_datails_tablefc106Ref} ButtonGoRuleData={ButtonGoRuleData} setButtonGoRuleData ={setButtonGoRuleData} setIsProcessing={setIsProcessing}/>}
      </div>
      </div>
    </div>
 )
}

export default Groupprn_no_datails_table
