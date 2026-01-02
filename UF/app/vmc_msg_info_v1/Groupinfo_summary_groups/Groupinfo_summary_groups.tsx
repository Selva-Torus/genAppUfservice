'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import Cardtotal_calls  from "./Cardtotal_calls";
import Cardsuccess_rate  from "./Cardsuccess_rate";
import Carderror_rate  from "./Carderror_rate";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupinfo_summary_groups = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
  const token:string = getCookie('token'); 
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  let code:any = ``;
  let idx = "";
  let item = "";
  const { isDark, isHighContrast, bgStyle, textStyle } = useTheme();
  const {dfd_mongo_total_calls_v1Props, setdfd_mongo_total_calls_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_mongo_api_repository_v1Props, setdfd_mongo_api_repository_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_mongo_api_process_logs_v1Props, setdfd_mongo_api_process_logs_v1Props} = useContext(TotalContext) as TotalContextProps;
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
  const securityData:any={
  "EQBAdmin": {
    "allowedControls": [
      "total_calls",
      "success_rate",
      "error_rate"
    ],
    "allowedGroups": [
      "info_group",
      "vmc_msg_info",
      "info_summary_repository_group",
      "msg_group",
      "api_repository_groups",
      "info_summary_groups",
      "api_process_log"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "EQBOperator": {
    "allowedControls": [],
    "allowedGroups": [
      "msg_group"
    ],
    "blockedControls": [
      "total_calls",
      "success_rate",
      "error_rate"
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
 /////////////
   //another screen
  const {vmc_msg_infob41b0, setvmc_msg_infob41b0}= useContext(TotalContext) as TotalContextProps;
  const {vmc_msg_infob41b0Props, setvmc_msg_infob41b0Props}= useContext(TotalContext) as TotalContextProps;
  const {info_summary_repository_group8106c, setinfo_summary_repository_group8106c}= useContext(TotalContext) as TotalContextProps;
  const {info_summary_repository_group8106cProps, setinfo_summary_repository_group8106cProps}= useContext(TotalContext) as TotalContextProps;
  const {msg_group609be, setmsg_group609be}= useContext(TotalContext) as TotalContextProps;
  const {msg_group609beProps, setmsg_group609beProps}= useContext(TotalContext) as TotalContextProps;
  const {api_repository_groupsb475a, setapi_repository_groupsb475a}= useContext(TotalContext) as TotalContextProps;
  const {api_repository_groupsb475aProps, setapi_repository_groupsb475aProps}= useContext(TotalContext) as TotalContextProps;
  const {info_summary_groups8d62c, setinfo_summary_groups8d62c}= useContext(TotalContext) as TotalContextProps;
  const {info_summary_groups8d62cProps, setinfo_summary_groups8d62cProps}= useContext(TotalContext) as TotalContextProps;
  const {total_callsfcfdc, settotal_callsfcfdc}= useContext(TotalContext) as TotalContextProps;
  const {success_rate1130c, setsuccess_rate1130c}= useContext(TotalContext) as TotalContextProps;
  const {error_ratead931, seterror_ratead931}= useContext(TotalContext) as TotalContextProps;
  const {api_process_log17839, setapi_process_log17839}= useContext(TotalContext) as TotalContextProps;
  const {api_process_log17839Props, setapi_process_log17839Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Msg_Info:AFVK:v1",componentId:"a6d7927c980b49688fb350316df8d62c",from:"GroupInfoSummaryGroups",accessProfile:accessProfile},{
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
    
  /////////////
    if(orchestrationData?.data?.readableControls.includes("total_calls")){
      settotal_callsfcfdc({...total_callsfcfdc,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("success_rate")){
      setsuccess_rate1130c({...success_rate1130c,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("error_rate")){
      seterror_ratead931({...error_ratead931,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['vmc_msg_info']  = vmc_msg_infob41b0,
      codeStates['setvmc_msg_info'] = setvmc_msg_infob41b0,
      codeStates['info_summary_repository_group']  = info_summary_repository_group8106c,
      codeStates['setinfo_summary_repository_group'] = setinfo_summary_repository_group8106c,
      codeStates['msg_group']  = msg_group609be,
      codeStates['setmsg_group'] = setmsg_group609be,
      codeStates['api_repository_groups']  = api_repository_groupsb475a,
      codeStates['setapi_repository_groups'] = setapi_repository_groupsb475a,
      codeStates['info_summary_groups']  = info_summary_groups8d62c,
      codeStates['setinfo_summary_groups'] = setinfo_summary_groups8d62c,
      codeStates['api_process_log']  = api_process_log17839,
      codeStates['setapi_process_log'] = setapi_process_log17839,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const info_summary_groups8d62cRef = useRef<any>(null);
  const handleClearSearch = () => {
    info_summary_groups8d62cRef.current?.setSearchParams();
    info_summary_groups8d62cRef.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(info_summary_groups8d62c) && Object.keys(info_summary_groups8d62c)?.length>0)
      {
        setinfo_summary_groups8d62c({})
      }
    }else 
      prevRefreshRef.current= true
  }, [info_summary_groups8d62cProps?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '7 / 13',
        gridRow: '13 / 49',
        height: '100%',
        gridAutoRows: '4px',
        columnGap: '10px',
        //rowGap: '',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        overflow: 'auto',
        backgroundColor:'#ededed',
        backgroundImage:'',
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: ''
      }}
      className={clsx("",
        "rounded-md",
        isDark ? "bg-gray-800 text-white" : "bg-white text-black"
      )}
    >
        {allowedControls.includes("total_calls") ?<Cardtotal_calls  /* fcfdc */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
        {allowedControls.includes("success_rate") ?<Cardsuccess_rate  /* 1130c */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
        {allowedControls.includes("error_rate") ?<Carderror_rate  /* ad931 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  />: <div></div>}
    </div>
 )
}

export default Groupinfo_summary_groups
