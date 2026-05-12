'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { Tabs } from '@/components/Tabs'
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { getGroupOrchestrationData, getControlOrchestrationData } from '@/app/utils/Orchestration';
import Groupview_all_tab  from "../Groupview_all_tab/Groupview_all_tab";
import Groupfailure_queue_tab  from "../Groupfailure_queue_tab/Groupfailure_queue_tab";
import Groupsuccess_queue_tab  from "../Groupsuccess_queue_tab/Groupsuccess_queue_tab";
import Groupreturn_queue_tab  from "../Groupreturn_queue_tab/Groupreturn_queue_tab";
import Switchoutbound_or_inbound from "./Switchoutbound_or_inbound";
import Buttonsearch from "./Buttonsearch";
import Buttonrefresh from "./Buttonrefresh";
import Buttondownload from "./Buttondownload";
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import decodeToken from '@/app/components/decodeToken';
import { eventDecisionTable } from '@/app/utils/evaluateDecisionTable';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { CommonHeaderAndTooltip } from '@/components/CommonHeaderAndTooltip';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Grouptran_tab_group = ({lockedData={},setLockedData,primaryTableData={},tableData=[], setTableData ,setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing, groupData={}, controlData={}}:any)=> {
  const token:string = getCookie('token'); 
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const allStates:any=useContext(TotalContext) as TotalContextProps;
  let code:any = ``;
    const decodedTokenObj:any = decodeToken(token);

  let idx = "";
  let item = "";
  const { isDark, isHighContrast, bgStyle, textStyle } = useTheme();
  const {dfd_transaction_v1Props, setdfd_transaction_v1Props} = useContext(TotalContext) as TotalContextProps;
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
  "IT Team": {
    "allowedControls": [
      "outbound_or_inbound",
      "search",
      "refresh",
      "download"
    ],
    "allowedGroups": [
      "canvas",
      "tran_main_group",
      "tran_tab_group",
      "view_all_tab",
      "view_all_table",
      "failure_queue_tab",
      "failure_queue_table",
      "success_queue_tab",
      "success_queue_table",
      "return_queue_tab",
      "return_queue_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Business Team": {
    "allowedControls": [
      "outbound_or_inbound",
      "search",
      "refresh",
      "download"
    ],
    "allowedGroups": [
      "canvas",
      "tran_main_group",
      "tran_tab_group",
      "view_all_tab",
      "view_all_table",
      "failure_queue_tab",
      "failure_queue_table",
      "success_queue_tab",
      "success_queue_table",
      "return_queue_tab",
      "return_queue_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Operation Team": {
    "allowedControls": [
      "outbound_or_inbound",
      "search",
      "refresh",
      "download"
    ],
    "allowedGroups": [
      "canvas",
      "tran_main_group",
      "tran_tab_group",
      "view_all_tab",
      "view_all_table",
      "failure_queue_tab",
      "failure_queue_table",
      "success_queue_tab",
      "success_queue_table",
      "return_queue_tab",
      "return_queue_table"
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
  const {tran_main_group1dc7f, settran_main_group1dc7f}= useContext(TotalContext) as TotalContextProps;
  const {tran_main_group1dc7fProps, settran_main_group1dc7fProps}= useContext(TotalContext) as TotalContextProps;
  const {tran_tab_group08b64, settran_tab_group08b64}= useContext(TotalContext) as TotalContextProps;
  const {tran_tab_group08b64Props, settran_tab_group08b64Props}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tab4a963, setview_all_tab4a963}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tablec9e87, setview_all_tablec9e87}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tablec9e87Props, setview_all_tablec9e87Props}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tab69f01, setfailure_queue_tab69f01}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tablea476f, setfailure_queue_tablea476f}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tablea476fProps, setfailure_queue_tablea476fProps}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_tabef582, setsuccess_queue_tabef582}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_table63aae, setsuccess_queue_table63aae}= useContext(TotalContext) as TotalContextProps;
  const {success_queue_table63aaeProps, setsuccess_queue_table63aaeProps}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_tab5611e, setreturn_queue_tab5611e}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_table267f0, setreturn_queue_table267f0}= useContext(TotalContext) as TotalContextProps;
  const {return_queue_table267f0Props, setreturn_queue_table267f0Props}= useContext(TotalContext) as TotalContextProps;
  const {outbound_or_inbound5e076, setoutbound_or_inbound5e076}= useContext(TotalContext) as TotalContextProps;
  const {search14cf0, setsearch14cf0}= useContext(TotalContext) as TotalContextProps;
  const {refresh313d0, setrefresh313d0}= useContext(TotalContext) as TotalContextProps;
  const {downloadcb505, setdownloadcb505}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = getGroupOrchestrationData(
        groupData,
        "cbe34c122c574df4884941f1efe08b64"
      );
  code = orchestrationData?.data?.code;
  setAllCode(orchestrationData?.data?.code||"");
  const security:any[] = orchestrationData?.data?.security;
  const allowedGroups:any[] = orchestrationData?.data?.allowedGroups;
  if(orchestrationData?.data?.error === true){
    toast(orchestrationData?.data?.errorDetails?.message, 'danger')
    return
  }
  setAllowedControls(security) 
  setAllowedComponent(allowedGroups) 
  for(let i=0;i<tabOptions?.length;i++){
    if(allowedGroups?.find((group)=>(group==tabOptions[i]?.id)))
    {
      settran_tab_group08b64((pre:any)=>({...pre,tran_tab_group:tabOptions[i]?.id}));
      break;
    }
  }   
  /////////////
    if(orchestrationData?.data?.readableControls.includes("view_all_tab")){
      setview_all_tab4a963({...view_all_tab4a963,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("failure_queue_tab")){
      setfailure_queue_tab69f01({...failure_queue_tab69f01,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("success_queue_tab")){
      setsuccess_queue_tabef582({...success_queue_tabef582,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("return_queue_tab")){
      setreturn_queue_tab5611e({...return_queue_tab5611e,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("outbound_or_inbound")){
      setoutbound_or_inbound5e076({...outbound_or_inbound5e076,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("search")){
      setsearch14cf0({...search14cf0,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("refresh")){
      setrefresh313d0({...refresh313d0,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("download")){
      setdownloadcb505({...downloadcb505,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
        codeStates['selected']  = "view_all_tab",
        codeStates['tran_main_group'] = tran_main_group1dc7f,
        codeStates['settran_main_group'] = settran_main_group1dc7f,
        codeStates['tran_main_group1dc7f'] = tran_main_group1dc7fProps,
        codeStates['settran_main_group1dc7f'] = settran_main_group1dc7fProps,
        codeStates['tran_tab_group'] = tran_tab_group08b64,
        codeStates['settran_tab_group'] = settran_tab_group08b64,
        codeStates['tran_tab_group08b64'] = tran_tab_group08b64Props,
        codeStates['settran_tab_group08b64'] = settran_tab_group08b64Props,
        codeStates['view_all_tab'] = view_all_tab4a963,
        codeStates['setview_all_tab'] = setview_all_tab4a963,
        codeStates['view_all_table'] = view_all_tablec9e87,
        codeStates['setview_all_table'] = setview_all_tablec9e87,
        codeStates['view_all_tablec9e87'] = view_all_tablec9e87Props,
        codeStates['setview_all_tablec9e87'] = setview_all_tablec9e87Props,
        codeStates['failure_queue_tab'] = failure_queue_tab69f01,
        codeStates['setfailure_queue_tab'] = setfailure_queue_tab69f01,
        codeStates['failure_queue_table'] = failure_queue_tablea476f,
        codeStates['setfailure_queue_table'] = setfailure_queue_tablea476f,
        codeStates['failure_queue_tablea476f'] = failure_queue_tablea476fProps,
        codeStates['setfailure_queue_tablea476f'] = setfailure_queue_tablea476fProps,
        codeStates['success_queue_tab'] = success_queue_tabef582,
        codeStates['setsuccess_queue_tab'] = setsuccess_queue_tabef582,
        codeStates['success_queue_table'] = success_queue_table63aae,
        codeStates['setsuccess_queue_table'] = setsuccess_queue_table63aae,
        codeStates['success_queue_table63aae'] = success_queue_table63aaeProps,
        codeStates['setsuccess_queue_table63aae'] = setsuccess_queue_table63aaeProps,
        codeStates['return_queue_tab'] = return_queue_tab5611e,
        codeStates['setreturn_queue_tab'] = setreturn_queue_tab5611e,
        codeStates['return_queue_table'] = return_queue_table267f0,
        codeStates['setreturn_queue_table'] = setreturn_queue_table267f0,
        codeStates['return_queue_table267f0'] = return_queue_table267f0Props,
        codeStates['setreturn_queue_table267f0'] = setreturn_queue_table267f0Props,
        codeStates['outbound_or_inbound'] = outbound_or_inbound5e076,
        codeStates['setoutbound_or_inbound'] = setoutbound_or_inbound5e076,
        codeStates['search'] = search14cf0,
        codeStates['setsearch'] = setsearch14cf0,
        codeStates['refresh'] = refresh313d0,
        codeStates['setrefresh'] = setrefresh313d0,
        codeStates['download'] = downloadcb505,
        codeStates['setdownload'] = setdownloadcb505,
      codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
     settran_tab_group08b64((pre:any)=>({...pre,tran_tab_group:"view_all_tab"}));
  }
  const handleOnChange=async(id?:string)=>{

     code = allCode
    if (code != '') {
      let codeStates: Record<string, any> = {};
      codeStates['selected']  = id,
        codeStates['tran_main_group'] = tran_main_group1dc7f,
        codeStates['settran_main_group'] = settran_main_group1dc7f,
        codeStates['tran_main_group1dc7f'] = tran_main_group1dc7fProps,
        codeStates['settran_main_group1dc7f'] = settran_main_group1dc7fProps,
        codeStates['tran_tab_group'] = tran_tab_group08b64,
        codeStates['settran_tab_group'] = settran_tab_group08b64,
        codeStates['tran_tab_group08b64'] = tran_tab_group08b64Props,
        codeStates['settran_tab_group08b64'] = settran_tab_group08b64Props,
        codeStates['view_all_tab'] = view_all_tab4a963,
        codeStates['setview_all_tab'] = setview_all_tab4a963,
        codeStates['view_all_table'] = view_all_tablec9e87,
        codeStates['setview_all_table'] = setview_all_tablec9e87,
        codeStates['view_all_tablec9e87'] = view_all_tablec9e87Props,
        codeStates['setview_all_tablec9e87'] = setview_all_tablec9e87Props,
        codeStates['failure_queue_tab'] = failure_queue_tab69f01,
        codeStates['setfailure_queue_tab'] = setfailure_queue_tab69f01,
        codeStates['failure_queue_table'] = failure_queue_tablea476f,
        codeStates['setfailure_queue_table'] = setfailure_queue_tablea476f,
        codeStates['failure_queue_tablea476f'] = failure_queue_tablea476fProps,
        codeStates['setfailure_queue_tablea476f'] = setfailure_queue_tablea476fProps,
        codeStates['success_queue_tab'] = success_queue_tabef582,
        codeStates['setsuccess_queue_tab'] = setsuccess_queue_tabef582,
        codeStates['success_queue_table'] = success_queue_table63aae,
        codeStates['setsuccess_queue_table'] = setsuccess_queue_table63aae,
        codeStates['success_queue_table63aae'] = success_queue_table63aaeProps,
        codeStates['setsuccess_queue_table63aae'] = setsuccess_queue_table63aaeProps,
        codeStates['return_queue_tab'] = return_queue_tab5611e,
        codeStates['setreturn_queue_tab'] = setreturn_queue_tab5611e,
        codeStates['return_queue_table'] = return_queue_table267f0,
        codeStates['setreturn_queue_table'] = setreturn_queue_table267f0,
        codeStates['return_queue_table267f0'] = return_queue_table267f0Props,
        codeStates['setreturn_queue_table267f0'] = setreturn_queue_table267f0Props,
        codeStates['outbound_or_inbound'] = outbound_or_inbound5e076,
        codeStates['setoutbound_or_inbound'] = setoutbound_or_inbound5e076,
        codeStates['search'] = search14cf0,
        codeStates['setsearch'] = setsearch14cf0,
        codeStates['refresh'] = refresh313d0,
        codeStates['setrefresh'] = setrefresh313d0,
        codeStates['download'] = downloadcb505,
        codeStates['setdownload'] = setdownloadcb505,
      codeExecution(code,codeStates);
    }
    settran_tab_group08b64((pre:any)=>({...pre,tran_tab_group:id}));

  }
  const tran_tab_group08b64Ref = useRef<any>(null);
  const handleClearSearch = () => {
    tran_tab_group08b64Ref.current?.setSearchParams();
    tran_tab_group08b64Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(tran_tab_group08b64) && Object.keys(tran_tab_group08b64)?.length>0)
      {
        settran_tab_group08b64({})
      }
    }else 
      prevRefreshRef.current= true
  }, [tran_tab_group08b64Props?.refresh])

let tabHeaderItems : any =[
  {
    id: '0',
    title: 'outbound_or_inbound',
     content: (
      <Switchoutbound_or_inbound
        lockedData={lockedData}
        setLockedData={setLockedData}
        tableData={tableData}
        setTableData={setTableData}
        primaryTableData={primaryTableData}
        setPrimaryTableData={setPrimaryTableData}
        checkToAdd={checkToAdd}
        setCheckToAdd={setCheckToAdd}
        refetch={refetch}
        setRefetch={setRefetch}
        encryptionFlagCompData={encryptionFlagCompData}
        setIsProcessing={setIsProcessing}
        groupData={groupData}
        controlData={controlData}
      />)
  },
  {
    id: '1',
    title: 'search',
     content: (
      <Buttonsearch
        lockedData={lockedData}
        setLockedData={setLockedData}
        tableData={tableData}
        setTableData={setTableData}
        primaryTableData={primaryTableData}
        setPrimaryTableData={setPrimaryTableData}
        checkToAdd={checkToAdd}
        setCheckToAdd={setCheckToAdd}
        refetch={refetch}
        setRefetch={setRefetch}
        encryptionFlagCompData={encryptionFlagCompData}
        setIsProcessing={setIsProcessing}
        groupData={groupData}
        controlData={controlData}
      />)
  },
  {
    id: '2',
    title: 'refresh',
     content: (
      <Buttonrefresh
        lockedData={lockedData}
        setLockedData={setLockedData}
        tableData={tableData}
        setTableData={setTableData}
        primaryTableData={primaryTableData}
        setPrimaryTableData={setPrimaryTableData}
        checkToAdd={checkToAdd}
        setCheckToAdd={setCheckToAdd}
        refetch={refetch}
        setRefetch={setRefetch}
        encryptionFlagCompData={encryptionFlagCompData}
        setIsProcessing={setIsProcessing}
        groupData={groupData}
        controlData={controlData}
      />)
  },
  {
    id: '3',
    title: 'download',
     content: (
      <Buttondownload
        lockedData={lockedData}
        setLockedData={setLockedData}
        tableData={tableData}
        setTableData={setTableData}
        primaryTableData={primaryTableData}
        setPrimaryTableData={setPrimaryTableData}
        checkToAdd={checkToAdd}
        setCheckToAdd={setCheckToAdd}
        refetch={refetch}
        setRefetch={setRefetch}
        encryptionFlagCompData={encryptionFlagCompData}
        setIsProcessing={setIsProcessing}
        groupData={groupData}
        controlData={controlData}
      />)
  },
];
  let tabOptions:any=[
    {
      "id": "view_all_tab",
      "title": "View All",
      "content": <Groupview_all_tab
        lockedData={lockedData} 
        setLockedData={setLockedData} 
        tableData={tableData}
        setTableData={setTableData}
        primaryTableData={primaryTableData}
        setPrimaryTableData={setPrimaryTableData}
        checkToAdd={checkToAdd} 
        setCheckToAdd={setCheckToAdd}  
        refetch={refetch}
        setRefetch={setRefetch}
        dropdownData={dropdownData} 
        setDropdownData={setDropdownData}
        encryptionFlagPageData={encryptionFlagPageData}
        paginationDetails={paginationDetails}
        setIsProcessing={setIsProcessing}
        groupData={groupData}
        controlData={controlData}
      />,
    },
    {
      "id": "failure_queue_tab",
      "title": "Failure Queue",
      "content": <Groupfailure_queue_tab
        lockedData={lockedData} 
        setLockedData={setLockedData} 
        tableData={tableData}
        setTableData={setTableData}
        primaryTableData={primaryTableData}
        setPrimaryTableData={setPrimaryTableData}
        checkToAdd={checkToAdd} 
        setCheckToAdd={setCheckToAdd}  
        refetch={refetch}
        setRefetch={setRefetch}
        dropdownData={dropdownData} 
        setDropdownData={setDropdownData}
        encryptionFlagPageData={encryptionFlagPageData}
        paginationDetails={paginationDetails}
        setIsProcessing={setIsProcessing}
        groupData={groupData}
        controlData={controlData}
      />,
    },
    {
      "id": "success_queue_tab",
      "title": "Success Queue",
      "content": <Groupsuccess_queue_tab
        lockedData={lockedData} 
        setLockedData={setLockedData} 
        tableData={tableData}
        setTableData={setTableData}
        primaryTableData={primaryTableData}
        setPrimaryTableData={setPrimaryTableData}
        checkToAdd={checkToAdd} 
        setCheckToAdd={setCheckToAdd}  
        refetch={refetch}
        setRefetch={setRefetch}
        dropdownData={dropdownData} 
        setDropdownData={setDropdownData}
        encryptionFlagPageData={encryptionFlagPageData}
        paginationDetails={paginationDetails}
        setIsProcessing={setIsProcessing}
        groupData={groupData}
        controlData={controlData}
      />,
    },
    {
      "id": "return_queue_tab",
      "title": "Return Queue",
      "content": <Groupreturn_queue_tab
        lockedData={lockedData} 
        setLockedData={setLockedData} 
        tableData={tableData}
        setTableData={setTableData}
        primaryTableData={primaryTableData}
        setPrimaryTableData={setPrimaryTableData}
        checkToAdd={checkToAdd} 
        setCheckToAdd={setCheckToAdd}  
        refetch={refetch}
        setRefetch={setRefetch}
        dropdownData={dropdownData} 
        setDropdownData={setDropdownData}
        encryptionFlagPageData={encryptionFlagPageData}
        paginationDetails={paginationDetails}
        setIsProcessing={setIsProcessing}
        groupData={groupData}
        controlData={controlData}
      />,
    },
  ]
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 212',
        display: 'grid',
        height: '100%',
        overflow: 'auto',
        gridAutoRows: '',
        columnGap: '',
        backgroundImage:"url('')",
        backgroundColor:'',
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: ''
      }}
      className={`flex flex-col overflow-auto rounded-md${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
    >
    <Tabs
      className=""
      items={tabOptions}
      security={allowedComponent}
      direction='horizontal'
      onChange={handleOnChange}
      defaultActiveId={tran_tab_group08b64?.tran_tab_group || "view_all_tab"}
      activeTab={tran_tab_group08b64?.tran_tab_group || "view_all_tab"}
      headerAlignment='left'
      tabHeaders={ tabHeaderItems}
          />
        </div>
 )
}

export default Grouptran_tab_group
