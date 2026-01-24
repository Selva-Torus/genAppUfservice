

'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { CommonHeaderAndTooltip } from '@/components/CommonHeaderAndTooltip';
import Groupform  from "../Groupform/Groupform";
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import TextInputsearchvalue  from "./TextInputsearchvalue";
import Documentuploaderhh  from "./Documentuploaderhh";
import DynamicJsonFormselectionapproach  from "./DynamicJsonFormselectionapproach";
import Dropdownoptions  from "./Dropdownoptions";
import DynamicJsonFormtest  from "./DynamicJsonFormtest";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupparent = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
      "searchvalue",
      "hh",
      "selectionapproach",
      "options",
      "test"
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
      "searchvalue",
      "hh",
      "selectionapproach",
      "options",
      "test"
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
      "searchvalue",
      "hh",
      "selectionapproach",
      "options",
      "test"
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
  "Template 4": {
    "allowedControls": [
      "searchvalue",
      "hh",
      "selectionapproach",
      "options",
      "test"
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
  "Test1": {
    "allowedControls": [
      "searchvalue",
      "hh",
      "selectionapproach",
      "options",
      "test"
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
  "Test2": {
    "allowedControls": [
      "searchvalue",
      "hh",
      "selectionapproach",
      "options",
      "test"
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
  const {searchvalue25fa2, setsearchvalue25fa2}= useContext(TotalContext) as TotalContextProps;
  const {hheadd1, sethheadd1}= useContext(TotalContext) as TotalContextProps;
  const {selectionapproach09360, setselectionapproach09360}= useContext(TotalContext) as TotalContextProps;
  const {options850a2, setoptions850a2}= useContext(TotalContext) as TotalContextProps;
  const {test22a10, settest22a10}= useContext(TotalContext) as TotalContextProps;
  const {groupfordynamicbutton143be, setgroupfordynamicbutton143be}= useContext(TotalContext) as TotalContextProps;
  const {groupfordynamicbutton143beProps, setgroupfordynamicbutton143beProps}= useContext(TotalContext) as TotalContextProps;
  const {buttons60ce5, setbuttons60ce5}= useContext(TotalContext) as TotalContextProps;
  const {buttons60ce5Props, setbuttons60ce5Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:dynamicforms:AFVK:v1",componentId:"03e924560c144d3181733fca11c0e5b8",from:"GroupParent",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("form")){
      setform775ce({...form775ce,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("searchvalue")){
      setsearchvalue25fa2({...searchvalue25fa2,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("hh")){
      sethheadd1({...hheadd1,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("selectionapproach")){
      setselectionapproach09360({...selectionapproach09360,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("options")){
      setoptions850a2({...options850a2,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("test")){
      settest22a10({...test22a10,isDisabled:true});
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
  const parent0e5b8Ref = useRef<any>(null);
  const handleClearSearch = () => {
    parent0e5b8Ref.current?.setSearchParams();
    parent0e5b8Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(parent0e5b8) && Object.keys(parent0e5b8)?.length>0)
      {
        setparent0e5b8({})
      }
    }else 
      prevRefreshRef.current= true
  }, [parent0e5b8Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '5 / 135',
      
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
        backgroundAttachment: 'scroll',
        backgroundClip: 'padding-box',
        backgroundBlendMode: 'screen'
      }}
      className={`flex flex-col overflow-auto rounded-md  ${isDark ? 'text-white' : 'text-black'}`}
    >
        {allowedComponent.includes("form")  &&<Groupform  
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
          paginationDetails={paginationDetails}        />}
        {allowedControls.includes("searchvalue") ?<TextInputsearchvalue   /* 25fa2 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("hh") ?<Documentuploaderhh   /* eadd1 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("selectionapproach") ?<DynamicJsonFormselectionapproach   /* 09360 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("options") ?<Dropdownoptions   /* 850a2 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} lockedData ={lockedData} setLockedData={setLockedData} dropdownData={dropdownData} setDropdownData={setDropdownData} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("test") ?<DynamicJsonFormtest   /* 22a10 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>
 )
}

export default Groupparent
