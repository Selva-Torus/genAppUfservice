

'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { Tabs } from '@/components/Tabs'
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import Groupview_all_tab  from "../Groupview_all_tab/Groupview_all_tab";
import Groupfailure_queue_tab  from "../Groupfailure_queue_tab/Groupfailure_queue_tab";
import Buttonadd_new_payment from "./Buttonadd_new_payment";
import Buttonsearch from "./Buttonsearch";
import Buttonrefresh from "./Buttonrefresh";
import Buttondownload from "./Buttondownload";
import Switchoutbound_or_inbound from "./Switchoutbound_or_inbound";
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { CommonHeaderAndTooltip } from '@/components/CommonHeaderAndTooltip';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Grouptab_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
  const {dfd_get_transaction_dfd_v1Props, setdfd_get_transaction_dfd_v1Props} = useContext(TotalContext) as TotalContextProps;
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
  "Maker": {
    "allowedControls": [
      "add_new_payment",
      "search",
      "refresh",
      "download",
      "outbound_or_inbound"
    ],
    "allowedGroups": [
      "canvas",
      "transaction_group",
      "tab_group",
      "view_all_tab",
      "view_all_table",
      "failure_queue_tab",
      "failure_queue_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Checker": {
    "allowedControls": [
      "add_new_payment",
      "search",
      "refresh",
      "download",
      "outbound_or_inbound"
    ],
    "allowedGroups": [
      "canvas",
      "transaction_group",
      "tab_group",
      "view_all_tab",
      "view_all_table",
      "failure_queue_tab",
      "failure_queue_table"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Admin": {
    "allowedControls": [
      "add_new_payment",
      "search",
      "refresh",
      "download",
      "outbound_or_inbound"
    ],
    "allowedGroups": [
      "canvas",
      "transaction_group",
      "tab_group",
      "view_all_tab",
      "view_all_table",
      "failure_queue_tab",
      "failure_queue_table"
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
  const {transaction_groupcc5ac, settransaction_groupcc5ac}= useContext(TotalContext) as TotalContextProps;
  const {transaction_groupcc5acProps, settransaction_groupcc5acProps}= useContext(TotalContext) as TotalContextProps;
  const {tab_group05125, settab_group05125}= useContext(TotalContext) as TotalContextProps;
  const {tab_group05125Props, settab_group05125Props}= useContext(TotalContext) as TotalContextProps;
  const {view_all_tab71a07, setview_all_tab71a07}= useContext(TotalContext) as TotalContextProps;
  const {view_all_table648c4, setview_all_table648c4}= useContext(TotalContext) as TotalContextProps;
  const {view_all_table648c4Props, setview_all_table648c4Props}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_tab11090, setfailure_queue_tab11090}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_table449a9, setfailure_queue_table449a9}= useContext(TotalContext) as TotalContextProps;
  const {failure_queue_table449a9Props, setfailure_queue_table449a9Props}= useContext(TotalContext) as TotalContextProps;
  const {add_new_payment33109, setadd_new_payment33109}= useContext(TotalContext) as TotalContextProps;
  const {searchfdc03, setsearchfdc03}= useContext(TotalContext) as TotalContextProps;
  const {refresh59747, setrefresh59747}= useContext(TotalContext) as TotalContextProps;
  const {download53d76, setdownload53d76}= useContext(TotalContext) as TotalContextProps;
  const {outbound_or_inbound5dfa8, setoutbound_or_inbound5dfa8}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Transaction:AFVK:v1",componentId:"e7a2fc97bd954c2794c6346b05b05125",from:"GroupTabGroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("view_all_tab")){
      setview_all_tab71a07({...view_all_tab71a07,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("failure_queue_tab")){
      setfailure_queue_tab11090({...failure_queue_tab11090,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("add_new_payment")){
      setadd_new_payment33109({...add_new_payment33109,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("search")){
      setsearchfdc03({...searchfdc03,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("refresh")){
      setrefresh59747({...refresh59747,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("download")){
      setdownload53d76({...download53d76,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("outbound_or_inbound")){
      setoutbound_or_inbound5dfa8({...outbound_or_inbound5dfa8,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['transaction_group']  = transaction_groupcc5ac,
      codeStates['settransaction_group'] = settransaction_groupcc5ac,
      codeStates['view_all_table']  = view_all_table648c4,
      codeStates['setview_all_table'] = setview_all_table648c4,
      codeStates['failure_queue_table']  = failure_queue_table449a9,
      codeStates['setfailure_queue_table'] = setfailure_queue_table449a9,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=(id?:string)=>{
    settab_group05125((pre:any)=>({...pre,tab_group:id}));
      let tempMemoryKeyandValue:any={};
      tempMemoryKeyandValue={
        "tabgroup":id,     
      }
      setMemoryVariables((pre:any)=>({...pre,...tempMemoryKeyandValue}));

  }
  const tab_group05125Ref = useRef<any>(null);
  const handleClearSearch = () => {
    tab_group05125Ref.current?.setSearchParams();
    tab_group05125Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(tab_group05125) && Object.keys(tab_group05125)?.length>0)
      {
        settab_group05125({})
      }
    }else 
      prevRefreshRef.current= true
  }, [tab_group05125Props?.refresh])

let tabHeaderItems : any =[
  {
    id: '0',
    title: 'add_new_payment',
    content: (
      <Buttonadd_new_payment
        lockedData={lockedData}
        setLockedData={setLockedData}
        primaryTableData={primaryTableData}
        setPrimaryTableData={setPrimaryTableData}
        checkToAdd={checkToAdd}
        setCheckToAdd={setCheckToAdd}
        refetch={refetch}
        setRefetch={setRefetch}
        encryptionFlagCompData={encryptionFlagCompData}
      />)
  },
  {
    id: '1',
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
      />)
  },
  {
    id: '2',
    title: 'refresh',
    content: (
      <Buttonrefresh
        lockedData={lockedData}
        setLockedData={setLockedData}
        primaryTableData={primaryTableData}
        setPrimaryTableData={setPrimaryTableData}
        checkToAdd={checkToAdd}
        setCheckToAdd={setCheckToAdd}
        refetch={refetch}
        setRefetch={setRefetch}
        encryptionFlagCompData={encryptionFlagCompData}
      />)
  },
  {
    id: '3',
    title: 'download',
    content: (
      <Buttondownload
        lockedData={lockedData}
        setLockedData={setLockedData}
        primaryTableData={primaryTableData}
        setPrimaryTableData={setPrimaryTableData}
        checkToAdd={checkToAdd}
        setCheckToAdd={setCheckToAdd}
        refetch={refetch}
        setRefetch={setRefetch}
        encryptionFlagCompData={encryptionFlagCompData}
      />)
  },
  {
    id: '4',
    title: 'outbound_or_inbound',
    content: (
      <Switchoutbound_or_inbound
        lockedData={lockedData}
        setLockedData={setLockedData}
        primaryTableData={primaryTableData}
        setPrimaryTableData={setPrimaryTableData}
        checkToAdd={checkToAdd}
        setCheckToAdd={setCheckToAdd}
        refetch={refetch}
        setRefetch={setRefetch}
        encryptionFlagCompData={encryptionFlagCompData}
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
      />,
    },
    {
      "id": "failure_queue_tab",
      "title": "Failure Queue",
      "content": <Groupfailure_queue_tab
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
      />,
    },
  ]
  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '1 / 205',
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
      direction='horizontal'
      onChange={handleOnChange}
      defaultActiveId="view_all_tab"
      headerAlignment='left'
      tabHeaders={ tabHeaderItems}
          />
        </div>
 )
}

export default Grouptab_group
