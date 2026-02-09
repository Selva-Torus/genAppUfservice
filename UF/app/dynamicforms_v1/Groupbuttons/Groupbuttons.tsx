

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
import Buttona  from "./Buttona";
import Buttone  from "./Buttone";
import Buttonb  from "./Buttonb";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupbuttons = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
      "a",
      "e",
      "b"
    ],
    "allowedGroups": [
      "canvas",
      "parent",
      "form",
      "groupfordynamicbutton",
      "buttons"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Template 2": {
    "allowedControls": [
      "a",
      "e",
      "b"
    ],
    "allowedGroups": [
      "canvas",
      "parent",
      "form",
      "groupfordynamicbutton",
      "buttons"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Template 3": {
    "allowedControls": [
      "a",
      "e",
      "b"
    ],
    "allowedGroups": [
      "canvas",
      "parent",
      "form",
      "groupfordynamicbutton",
      "buttons"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "User": {
    "allowedControls": [
      "a",
      "e",
      "b"
    ],
    "allowedGroups": [
      "canvas",
      "parent",
      "form",
      "groupfordynamicbutton",
      "buttons"
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
  const {parent0e5b8, setparent0e5b8}= useContext(TotalContext) as TotalContextProps;
  const {parent0e5b8Props, setparent0e5b8Props}= useContext(TotalContext) as TotalContextProps;
  const {form775ce, setform775ce}= useContext(TotalContext) as TotalContextProps;
  const {form775ceProps, setform775ceProps}= useContext(TotalContext) as TotalContextProps;
  const {groupfordynamicbutton143be, setgroupfordynamicbutton143be}= useContext(TotalContext) as TotalContextProps;
  const {groupfordynamicbutton143beProps, setgroupfordynamicbutton143beProps}= useContext(TotalContext) as TotalContextProps;
  const {buttons60ce5, setbuttons60ce5}= useContext(TotalContext) as TotalContextProps;
  const {buttons60ce5Props, setbuttons60ce5Props}= useContext(TotalContext) as TotalContextProps;
  const {ae5c28, setae5c28}= useContext(TotalContext) as TotalContextProps;
  const {e579ff, sete579ff}= useContext(TotalContext) as TotalContextProps;
  const {b6efab, setb6efab}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:dynamicforms:AFVK:v1",componentId:"5110ad7d874543e59288ef4a54360ce5",from:"GroupButtons",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("a")){
      setae5c28({...ae5c28,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("e")){
      sete579ff({...e579ff,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("b")){
      setb6efab({...b6efab,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['parent']  = parent0e5b8,
      codeStates['setparent'] = setparent0e5b8,
      codeStates['form']  = form775ce,
      codeStates['setform'] = setform775ce,
      codeStates['groupfordynamicbutton']  = groupfordynamicbutton143be,
      codeStates['setgroupfordynamicbutton'] = setgroupfordynamicbutton143be,
      codeStates['buttons']  = buttons60ce5,
      codeStates['setbuttons'] = setbuttons60ce5,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const buttons60ce5Ref = useRef<any>(null);
  const handleClearSearch = () => {
    buttons60ce5Ref.current?.setSearchParams();
    buttons60ce5Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(buttons60ce5) && Object.keys(buttons60ce5)?.length>0)
      {
        setbuttons60ce5({})
      }
    }else 
      prevRefreshRef.current= true
  }, [buttons60ce5Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '2 / 24',
        gridRow: '15 / 159',
      
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(24, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        height: '100%',
        overflow: 'auto',
        gridAutoRows: '4px',
        columnGap: '0px',
        backgroundColor:'',
        backgroundImage:"url('')",
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: ''
      }}
      className={`flex flex-col overflow-auto rounded-md  ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
    >
        {        (("a" in ButtonGoRuleData)?ButtonGoRuleData["a"]:true) && 
          allowedControls.includes("a")  ?            <Buttona lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>} 
        {        (("e" in ButtonGoRuleData)?ButtonGoRuleData["e"]:true) && 
          allowedControls.includes("e")  ?            <Buttone lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>} 
        {        (("b" in ButtonGoRuleData)?ButtonGoRuleData["b"]:true) && 
          allowedControls.includes("b")  ?            <Buttonb lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>} 
    </div>
 )
}

export default Groupbuttons
