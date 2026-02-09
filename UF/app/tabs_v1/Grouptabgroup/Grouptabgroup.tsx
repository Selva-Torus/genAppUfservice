
'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { Tabs } from '@/components/Tabs'
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';

import Grouptab_header_1  from "../Grouptab_header_1/Grouptab_header_1";

import Grouptab_header_2  from "../Grouptab_header_2/Grouptab_header_2";
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


const Grouptabgroup = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
  const {dfd_mydfddata_v1Props, setdfd_mydfddata_v1Props} = useContext(TotalContext) as TotalContextProps;
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
  "Template 1": {
    "allowedControls": [],
    "allowedGroups": [
      "canvas",
      "group",
      "tabgroup",
      "tab_header_1",
      "tab_header_2",
      "oldtabgroup",
      "tab2",
      "tabc",
      "table2"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Template 2": {
    "allowedControls": [],
    "allowedGroups": [
      "canvas",
      "group",
      "tabgroup",
      "tab_header_1",
      "tab_header_2",
      "oldtabgroup",
      "tab2",
      "tabc",
      "table2"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Template 3": {
    "allowedControls": [],
    "allowedGroups": [
      "canvas",
      "group",
      "tabgroup",
      "tab_header_1",
      "tab_header_2",
      "oldtabgroup",
      "tab2",
      "tabc",
      "table2"
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
  const {groupeca86, setgroupeca86}= useContext(TotalContext) as TotalContextProps;
  const {groupeca86Props, setgroupeca86Props}= useContext(TotalContext) as TotalContextProps;
  const {tabgroupe7646, settabgroupe7646}= useContext(TotalContext) as TotalContextProps;
  const {tabgroupe7646Props, settabgroupe7646Props}= useContext(TotalContext) as TotalContextProps;
  const {tab_header_12cce3, settab_header_12cce3}= useContext(TotalContext) as TotalContextProps;
  const {tab_header_214783, settab_header_214783}= useContext(TotalContext) as TotalContextProps;
  const {oldtabgroup527ef, setoldtabgroup527ef}= useContext(TotalContext) as TotalContextProps;
  const {oldtabgroup527efProps, setoldtabgroup527efProps}= useContext(TotalContext) as TotalContextProps;
  const {tab29f914, settab29f914}= useContext(TotalContext) as TotalContextProps;
  const {tab29f914Props, settab29f914Props}= useContext(TotalContext) as TotalContextProps;
  const {tabc14e24, settabc14e24}= useContext(TotalContext) as TotalContextProps;
  const {tabc14e24Props, settabc14e24Props}= useContext(TotalContext) as TotalContextProps;
  const {table2c0657, settable2c0657}= useContext(TotalContext) as TotalContextProps;
  const {table2c0657Props, settable2c0657Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:newTab:AFVK:v1",componentId:"0a3c9047b1e745368cecf8bcb11e7646",from:"GroupTabgroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("tab_header_1")){
      settab_header_12cce3({...tab_header_12cce3,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tab_header_2")){
      settab_header_214783({...tab_header_214783,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['group']  = groupeca86,
      codeStates['setgroup'] = setgroupeca86,
      codeStates['oldtabgroup']  = oldtabgroup527ef,
      codeStates['setoldtabgroup'] = setoldtabgroup527ef,
      codeStates['table2']  = table2c0657,
      codeStates['settable2'] = settable2c0657,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const tabgroupe7646Ref = useRef<any>(null);
  const handleClearSearch = () => {
    tabgroupe7646Ref.current?.setSearchParams();
    tabgroupe7646Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(tabgroupe7646) && Object.keys(tabgroupe7646)?.length>0)
      {
        settabgroupe7646({})
      }
    }else 
      prevRefreshRef.current= true
  }, [tabgroupe7646Props?.refresh])


let tabOptions:any=[
  {
    "id": "tab_header_1",
    "title": "tab_header_1",
    "content": <Grouptab_header_1
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
    "id": "tab_header_2",
    "title": "tab_header_2",
    "content": <Grouptab_header_2
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
        gridColumn: '2 / 24',
        gridRow: '9 / 253',
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
      items={tabOptions}
      direction='horizontal'
        defaultActiveId="tab_header_1"
    />
        </div>
 )
}

export default Grouptabgroup
