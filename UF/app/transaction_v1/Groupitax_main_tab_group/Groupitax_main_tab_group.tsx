

'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { Tabs } from '@/components/Tabs'
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import Grouptab_process_new_prn  from "../Grouptab_process_new_prn/Grouptab_process_new_prn";
import Grouptab_credit_process_group  from "../Grouptab_credit_process_group/Grouptab_credit_process_group";
import Grouptab_view_processed_prn  from "../Grouptab_view_processed_prn/Grouptab_view_processed_prn";
import Buttonsearch from "./Buttonsearch";
import Buttonadd_new from "./Buttonadd_new";
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


const Groupitax_main_tab_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false,setIsProcessing}:any)=> {
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
  const securityData:any={
  "Branch Officer": {
    "allowedControls": [
      "search",
      "add_new"
    ],
    "allowedGroups": [
      "canvas",
      "overallgroup",
      "itax_main_tab_group",
      "tab_process_new_prn",
      "itax_source_table",
      "tab_credit_process_group",
      "credit_process_table",
      "tab_view_processed_prn",
      "view_processed_prn_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Branch Manager": {
    "allowedControls": [
      "search",
      "add_new"
    ],
    "allowedGroups": [
      "canvas",
      "overallgroup",
      "itax_main_tab_group",
      "tab_process_new_prn",
      "itax_source_table",
      "tab_credit_process_group",
      "credit_process_table",
      "tab_view_processed_prn",
      "view_processed_prn_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Credit Approver": {
    "allowedControls": [
      "search",
      "add_new"
    ],
    "allowedGroups": [
      "canvas",
      "overallgroup",
      "itax_main_tab_group",
      "tab_process_new_prn",
      "itax_source_table",
      "tab_credit_process_group",
      "credit_process_table",
      "tab_view_processed_prn",
      "view_processed_prn_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "System Administrator": {
    "allowedControls": [
      "search",
      "add_new"
    ],
    "allowedGroups": [
      "canvas",
      "overallgroup",
      "itax_main_tab_group",
      "tab_process_new_prn",
      "itax_source_table",
      "tab_credit_process_group",
      "credit_process_table",
      "tab_view_processed_prn",
      "view_processed_prn_table"
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
  const {overallgroup4d9a0, setoverallgroup4d9a0}= useContext(TotalContext) as TotalContextProps;
  const {overallgroup4d9a0Props, setoverallgroup4d9a0Props}= useContext(TotalContext) as TotalContextProps;
  const {itax_main_tab_group216b3, setitax_main_tab_group216b3}= useContext(TotalContext) as TotalContextProps;
  const {itax_main_tab_group216b3Props, setitax_main_tab_group216b3Props}= useContext(TotalContext) as TotalContextProps;
  const {tab_process_new_prn5597e, settab_process_new_prn5597e}= useContext(TotalContext) as TotalContextProps;
  const {itax_source_table1afd6, setitax_source_table1afd6}= useContext(TotalContext) as TotalContextProps;
  const {itax_source_table1afd6Props, setitax_source_table1afd6Props}= useContext(TotalContext) as TotalContextProps;
  const {searchf8868, setsearchf8868}= useContext(TotalContext) as TotalContextProps;
  const {add_new200e9, setadd_new200e9}= useContext(TotalContext) as TotalContextProps;
  const {tab_credit_process_group546cc, settab_credit_process_group546cc}= useContext(TotalContext) as TotalContextProps;
  const {credit_process_table0cd4c, setcredit_process_table0cd4c}= useContext(TotalContext) as TotalContextProps;
  const {credit_process_table0cd4cProps, setcredit_process_table0cd4cProps}= useContext(TotalContext) as TotalContextProps;
  const {tab_view_processed_prn29a93, settab_view_processed_prn29a93}= useContext(TotalContext) as TotalContextProps;
  const {view_processed_prn_table8f5a5, setview_processed_prn_table8f5a5}= useContext(TotalContext) as TotalContextProps;
  const {view_processed_prn_table8f5a5Props, setview_processed_prn_table8f5a5Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT010:FNGK:AF:FNK:UF-UFW:CATK:I001:AFGK:ITAX:AFK:ITAX_KEDTB_Main_Screen:AFVK:v1",componentId:"da620f9753734aa7b043512d117216b3",from:"GroupItaxMainTabGroup",accessProfile:accessProfile},{
    headers: {
      Authorization: `Bearer ${token}`
    }})
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
      setitax_main_tab_group216b3((pre:any)=>({...pre,itax_main_tab_group:tabOptions[i]?.id}));
      break;
    }
  }   
  /////////////
    if(orchestrationData?.data?.readableControls.includes("tab_process_new_prn")){
      settab_process_new_prn5597e({...tab_process_new_prn5597e,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("search")){
      setsearchf8868({...searchf8868,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("add_new")){
      setadd_new200e9({...add_new200e9,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tab_credit_process_group")){
      settab_credit_process_group546cc({...tab_credit_process_group546cc,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tab_view_processed_prn")){
      settab_view_processed_prn29a93({...tab_view_processed_prn29a93,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['allStates']  = allStates
      codeStates['value']  = "tab_process_new_prn"

      codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
     setitax_main_tab_group216b3((pre:any)=>({...pre,itax_main_tab_group:"tab_process_new_prn"}));
  }
  const handleOnChange=async(id?:string)=>{

     code = allCode
    if (code != '') {
      let codeStates: Record<string, any> = {};
      codeStates['allStates']  = allStates,
      codeStates['value']  = id,
      codeExecution(code,codeStates);
    }
    setitax_main_tab_group216b3((pre:any)=>({...pre,itax_main_tab_group:id}));

  }
  const itax_main_tab_group216b3Ref = useRef<any>(null);
  const handleClearSearch = () => {
    itax_main_tab_group216b3Ref.current?.setSearchParams();
    itax_main_tab_group216b3Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(itax_main_tab_group216b3) && Object.keys(itax_main_tab_group216b3)?.length>0)
      {
        setitax_main_tab_group216b3({})
      }
    }else 
      prevRefreshRef.current= true
  }, [itax_main_tab_group216b3Props?.refresh])

let tabHeaderItems : any =[
  {
    id: '0',
    title: 'search',
     content: (
      <Buttonsearch
        lockedData={lockedData}
        setLockedData={setLockedData}
        primaryTableData={primaryTableData}
        setPrimaryTableData={setPrimaryTableData}
        checkToAdd={checkToAdd}
        setCheckToAdd={setCheckToAdd}
        refetch={refetch}
        setRefetch={setRefetch}
        encryptionFlagCompData={encryptionFlagCompData}
        setIsProcessing={setIsProcessing}
      />)
  },
  {
    id: '1',
    title: 'add_new',
     content: (
      <Buttonadd_new
        lockedData={lockedData}
        setLockedData={setLockedData}
        primaryTableData={primaryTableData}
        setPrimaryTableData={setPrimaryTableData}
        checkToAdd={checkToAdd}
        setCheckToAdd={setCheckToAdd}
        refetch={refetch}
        setRefetch={setRefetch}
        encryptionFlagCompData={encryptionFlagCompData}
        setIsProcessing={setIsProcessing}
      />)
  },
];
  let tabOptions:any=[
    {
      "id": "tab_process_new_prn",
      "title": "Process New PRN",
      "content": <Grouptab_process_new_prn
        lockedData={lockedData} 
        setLockedData={setLockedData} 
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
      />,
    },
    {
      "id": "tab_credit_process_group",
      "title": "Credit Process PRN",
      "content": <Grouptab_credit_process_group
        lockedData={lockedData} 
        setLockedData={setLockedData} 
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
      />,
    },
    {
      "id": "tab_view_processed_prn",
      "title": "View Processed PRN",
      "content": <Grouptab_view_processed_prn
        lockedData={lockedData} 
        setLockedData={setLockedData} 
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
      />,
    },
  ]
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 166',
        display: 'grid',
        height: '100%',
        overflow: 'auto',
        gridAutoRows: '',
        columnGap: '',
        backgroundImage:"url('')",
        backgroundColor:'#f2f2f2',
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
      defaultActiveId={itax_main_tab_group216b3?.itax_main_tab_group || "tab_process_new_prn"}
      activeTab={itax_main_tab_group216b3?.itax_main_tab_group || "tab_process_new_prn"}
      headerAlignment='left'
      tabHeaders={ tabHeaderItems}
          />
        </div>
 )
}

export default Groupitax_main_tab_group
