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
import Labelmsgnames  from "./Labelmsgnames";
import Labelversions  from "./Labelversions";
import Labelstatuss  from "./Labelstatuss";
import Labelrelease_dates  from "./Labelrelease_dates";
import TextInputsource_msg_type  from "./TextInputsource_msg_type";
import TextInputversion  from "./TextInputversion";
import TextInputstatus  from "./TextInputstatus";
import TextInputrelease_date  from "./TextInputrelease_date";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupapi_repository_groups = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
      "msgnames",
      "versions",
      "statuss",
      "release_dates",
      "source_msg_type",
      "version",
      "status",
      "release_date"
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
      "msgnames",
      "versions",
      "statuss",
      "release_dates",
      "source_msg_type",
      "version",
      "status",
      "release_date"
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
  const {msgnames7a309, setmsgnames7a309}= useContext(TotalContext) as TotalContextProps;
  const {versionsbeb4b, setversionsbeb4b}= useContext(TotalContext) as TotalContextProps;
  const {statuss18862, setstatuss18862}= useContext(TotalContext) as TotalContextProps;
  const {release_datesb8be1, setrelease_datesb8be1}= useContext(TotalContext) as TotalContextProps;
  const {source_msg_typea3c5a, setsource_msg_typea3c5a}= useContext(TotalContext) as TotalContextProps;
  const {version95ead, setversion95ead}= useContext(TotalContext) as TotalContextProps;
  const {status3a35d, setstatus3a35d}= useContext(TotalContext) as TotalContextProps;
  const {release_date27b40, setrelease_date27b40}= useContext(TotalContext) as TotalContextProps;
  const {info_summary_groups8d62c, setinfo_summary_groups8d62c}= useContext(TotalContext) as TotalContextProps;
  const {info_summary_groups8d62cProps, setinfo_summary_groups8d62cProps}= useContext(TotalContext) as TotalContextProps;
  const {api_process_log17839, setapi_process_log17839}= useContext(TotalContext) as TotalContextProps;
  const {api_process_log17839Props, setapi_process_log17839Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Msg_Info:AFVK:v1",componentId:"862b2b2574e048eca62763b9b23b475a",from:"GroupApiRepositoryGroups",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("msgnames")){
      setmsgnames7a309({...msgnames7a309,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("versions")){
      setversionsbeb4b({...versionsbeb4b,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("statuss")){
      setstatuss18862({...statuss18862,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("release_dates")){
      setrelease_datesb8be1({...release_datesb8be1,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("source_msg_type")){
      setsource_msg_typea3c5a({...source_msg_typea3c5a,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("version")){
      setversion95ead({...version95ead,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("status")){
      setstatus3a35d({...status3a35d,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("release_date")){
      setrelease_date27b40({...release_date27b40,isDisabled:true});
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
  const api_repository_groupsb475aRef = useRef<any>(null);
  const handleClearSearch = () => {
    api_repository_groupsb475aRef.current?.setSearchParams();
    api_repository_groupsb475aRef.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(api_repository_groupsb475a) && Object.keys(api_repository_groupsb475a)?.length>0)
      {
        setapi_repository_groupsb475a({})
      }
    }else 
      prevRefreshRef.current= true
  }, [api_repository_groupsb475aProps?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 7',
        gridRow: '13 / 49',
        height: '100%',
        gridAutoRows: '4px',
        columnGap: '',
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
      className={clsx("p-2",
        "rounded-md",
        isDark ? "bg-gray-800 text-white" : "bg-white text-black"
      )}
    >
        {allowedControls.includes("msgnames")?<Labelmsgnames   /* 7a309 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("versions")?<Labelversions   /* beb4b */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("statuss")?<Labelstatuss   /* 18862 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("release_dates")?<Labelrelease_dates   /* b8be1 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("source_msg_type") ?<TextInputsource_msg_type   /* a3c5a */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("version") ?<TextInputversion   /* 95ead */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("status") ?<TextInputstatus   /* 3a35d */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("release_date") ?<TextInputrelease_date   /* 27b40 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>
 )
}

export default Groupapi_repository_groups
