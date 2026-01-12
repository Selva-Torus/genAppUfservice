

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
import Tabletexttable  from './Tabletexttable';  
import Buttona  from "./Buttona";
import Buttonb  from "./Buttonb";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Grouptexttable = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
      "id",
      "names",
      "a",
      "b"
    ],
    "allowedGroups": [
      "canvas",
      "usertable",
      "tablegroup",
      "texttable"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Template 2": {
    "allowedControls": [
      "id",
      "names",
      "a",
      "b"
    ],
    "allowedGroups": [
      "canvas",
      "usertable",
      "tablegroup",
      "texttable"
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
  const {usertablee2c3b, setusertablee2c3b}= useContext(TotalContext) as TotalContextProps;
  const {usertablee2c3bProps, setusertablee2c3bProps}= useContext(TotalContext) as TotalContextProps;
  const {tablegroup1fc0b, settablegroup1fc0b}= useContext(TotalContext) as TotalContextProps;
  const {tablegroup1fc0bProps, settablegroup1fc0bProps}= useContext(TotalContext) as TotalContextProps;
  const {texttablebadf1, settexttablebadf1}= useContext(TotalContext) as TotalContextProps;
  const {texttablebadf1Props, settexttablebadf1Props}= useContext(TotalContext) as TotalContextProps;
  const {id2c392, setid2c392}= useContext(TotalContext) as TotalContextProps;
  const {names0c3b9, setnames0c3b9}= useContext(TotalContext) as TotalContextProps;
  const {a00e4d, seta00e4d}= useContext(TotalContext) as TotalContextProps;
  const {b6031c, setb6031c}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:tablecheck:AFVK:v1",componentId:"44373986eabb49a0b5aec6b3864badf1",from:"GroupTexttable",isTable : true,accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("id")){
      setid2c392({...id2c392,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("names")){
      setnames0c3b9({...names0c3b9,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("a")){
      seta00e4d({...a00e4d,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("b")){
      setb6031c({...b6031c,isDisabled:true});
    }
  //////////////
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const texttablebadf1Ref = useRef<any>(null);
  const handleClearSearch = () => {
    texttablebadf1Ref.current?.setSearchParams();
    texttablebadf1Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(texttablebadf1) && Object.keys(texttablebadf1)?.length>0)
      {
        settexttablebadf1({})
      }
    }else 
      prevRefreshRef.current= true
  }, [texttablebadf1Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '3 / 107',
      
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
      className={`flex flex-col overflow-auto rounded-md  ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
    >
        <CommonHeaderAndTooltip
        >
        <div className='flex flex-col h-full'>
        <div
          className='flex flex-shrink-0 justify-end gap-1 p-2 h-[60px]'>
        <div className='flex flex-row w-[10%]'>
          <Button
            view='normal'
            pin={texttablebadf1Ref?.current?.isHaveSearch ? 'circle-clear' : "circle-circle"}
            onClick={() => setOpen(true)}
            icon="FaSearch"
            iconDisplay={texttablebadf1Ref?.current?.isHaveSearch?  "Icon only" : "Start with Icon"}
            className="p-2"
            >
            Search
          </Button>
          {texttablebadf1Ref?.current?.isHaveSearch&&(
            <Button 
              pin='clear-circle' 
              onClick={() => handleClearSearch()}
              view='normal'
              icon="FaTimes"
              iconDisplay="Icon only"
              className="h-8 "
              />
            )}
        </div>
        {        (("a" in ButtonGoRuleData)?ButtonGoRuleData["a"]:true) && 
          allowedControls.includes("a")  ?          <div className="w-[10%]"><Buttona lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/></div>: <div></div>} 
        {        (("b" in ButtonGoRuleData)?ButtonGoRuleData["b"]:true) && 
          allowedControls.includes("b")  ?          <div className="w-[10%]"><Buttonb lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/></div>: <div></div>} 
      </div>
        <div className='flex flex-1 w-full min-h-0'>
       {<Tabletexttable lockedData={lockedData} setLockedData={setLockedData}  primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData}  refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} paginationDetails={paginationDetails} open={open} setOpen={setOpen} ref={texttablebadf1Ref} ButtonGoRuleData={ButtonGoRuleData} setButtonGoRuleData ={setButtonGoRuleData}/>}
      </div>
        </div>
      </CommonHeaderAndTooltip>
    </div>
 )
}

export default Grouptexttable
