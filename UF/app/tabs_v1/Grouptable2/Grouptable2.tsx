

'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { CommonHeaderAndTooltip } from '@/components/CommonHeaderAndTooltip';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import Tabletable2  from './Tabletable2';  
import Switchtableswitch  from "./Switchtableswitch";
import Buttontablebutton  from "./Buttontablebutton";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Grouptable2 = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
    "allowedControls": [
      "ids",
      "name",
      "tableswitch",
      "tablebutton"
    ],
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
    "allowedControls": [
      "ids",
      "name",
      "tableswitch",
      "tablebutton"
    ],
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
    "allowedControls": [
      "ids",
      "name",
      "tableswitch",
      "tablebutton"
    ],
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
  const {tab_header_12cce3Props, settab_header_12cce3Props}= useContext(TotalContext) as TotalContextProps;
  const {tab_header_214783, settab_header_214783}= useContext(TotalContext) as TotalContextProps;
  const {tab_header_214783Props, settab_header_214783Props}= useContext(TotalContext) as TotalContextProps;
  const {oldtabgroup527ef, setoldtabgroup527ef}= useContext(TotalContext) as TotalContextProps;
  const {oldtabgroup527efProps, setoldtabgroup527efProps}= useContext(TotalContext) as TotalContextProps;
  const {tab29f914, settab29f914}= useContext(TotalContext) as TotalContextProps;
  const {tab29f914Props, settab29f914Props}= useContext(TotalContext) as TotalContextProps;
  const {tabc14e24, settabc14e24}= useContext(TotalContext) as TotalContextProps;
  const {tabc14e24Props, settabc14e24Props}= useContext(TotalContext) as TotalContextProps;
  const {table2c0657, settable2c0657}= useContext(TotalContext) as TotalContextProps;
  const {table2c0657Props, settable2c0657Props}= useContext(TotalContext) as TotalContextProps;
  const {ids24da4, setids24da4}= useContext(TotalContext) as TotalContextProps;
  const {name5545c, setname5545c}= useContext(TotalContext) as TotalContextProps;
  const {tableswitch7580d, settableswitch7580d}= useContext(TotalContext) as TotalContextProps;
  const {tablebutton03e79, settablebutton03e79}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:newTab:AFVK:v1",componentId:"b901da00e7f54fc5b5c8181aee8c0657",from:"GroupTable2",isTable : true,accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("ids")){
      setids24da4({...ids24da4,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("name")){
      setname5545c({...name5545c,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tableswitch")){
      settableswitch7580d({...tableswitch7580d,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("tablebutton")){
      settablebutton03e79({...tablebutton03e79,isDisabled:true});
    }
  //////////////
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const table2c0657Ref = useRef<any>(null);
  const handleClearSearch = () => {
    table2c0657Ref.current?.setSearchParams();
    table2c0657Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(table2c0657) && Object.keys(table2c0657)?.length>0)
      {
        settable2c0657({})
      }
    }else 
      prevRefreshRef.current= true
  }, [table2c0657Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '3 / 52',
      
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
      className={`flex flex-col overflow-auto rounded-md ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
    >
        <CommonHeaderAndTooltip
        >
        <div className='flex flex-col h-full'>
        <div
          className='flex flex-shrink-0 justify-end gap-1 p-2 h-[60px]'>
        {allowedControls.includes("tableswitch")?<Switchtableswitch  /* 7580d */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {        (("tablebutton" in ButtonGoRuleData)?ButtonGoRuleData["tablebutton"]:true) && 
          allowedControls.includes("tablebutton")  ?          <div className="w-[10%]"><Buttontablebutton lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/></div>: <div></div>} 
      </div>
        <div className='flex flex-1 w-full min-h-0'>
       {<Tabletable2 lockedData={lockedData} setLockedData={setLockedData}  primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData}  refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} paginationDetails={paginationDetails} open={open} setOpen={setOpen} ref={table2c0657Ref} ButtonGoRuleData={ButtonGoRuleData} setButtonGoRuleData ={setButtonGoRuleData}/>}
      </div>
        </div>
      </CommonHeaderAndTooltip>
    </div>
 )
}

export default Grouptable2
