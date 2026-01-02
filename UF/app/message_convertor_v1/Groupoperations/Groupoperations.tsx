'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import Groupwrite_group  from "../Groupwrite_group/Groupwrite_group";
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import TextAreasource  from "./TextAreasource";
import TextAreatarget  from "./TextAreatarget";
import Listnavbar  from "./Listnavbar";
import Listnavbarmx  from "./Listnavbarmx";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupoperations = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
  const {dfd_mongo_navbar_v1Props, setdfd_mongo_navbar_v1Props} = useContext(TotalContext) as TotalContextProps;
  const {dfd_mongo_navbarv2_v1Props, setdfd_mongo_navbarv2_v1Props} = useContext(TotalContext) as TotalContextProps;
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
    "allowedControls": [],
    "allowedGroups": [],
    "blockedControls": [
      "source",
      "target",
      "navbar",
      "navbarmx"
    ],
    "readOnlyControls": []
  },
  "EQBOperator": {
    "allowedControls": [
      "source",
      "target",
      "navbar",
      "navbarmx"
    ],
    "allowedGroups": [
      "canvas",
      "operations",
      "write_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "DTBOperator": {
    "allowedControls": [
      "source",
      "target",
      "navbar",
      "navbarmx"
    ],
    "allowedGroups": [
      "canvas",
      "operations",
      "write_group"
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
 /////////////
   //another screen
  const {operations58572, setoperations58572}= useContext(TotalContext) as TotalContextProps;
  const {operations58572Props, setoperations58572Props}= useContext(TotalContext) as TotalContextProps;
  const {source95c56, setsource95c56}= useContext(TotalContext) as TotalContextProps;
  const {target64438, settarget64438}= useContext(TotalContext) as TotalContextProps;
  const {navbar8dbd9, setnavbar8dbd9}= useContext(TotalContext) as TotalContextProps;
  const {navbarmx67b58, setnavbarmx67b58}= useContext(TotalContext) as TotalContextProps;
  const {write_group55231, setwrite_group55231}= useContext(TotalContext) as TotalContextProps;
  const {write_group55231Props, setwrite_group55231Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Operations_v1:AFVK:v1",componentId:"4ee6168b397247489db709a4a1658572",from:"GroupOperations",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("source")){
      setsource95c56({...source95c56,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("target")){
      settarget64438({...target64438,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("navbar")){
      setnavbar8dbd9({...navbar8dbd9,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("navbarmx")){
      setnavbarmx67b58({...navbarmx67b58,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("write_group")){
      setwrite_group55231({...write_group55231,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['operations']  = operations58572,
      codeStates['setoperations'] = setoperations58572,
      codeStates['write_group']  = write_group55231,
      codeStates['setwrite_group'] = setwrite_group55231,

    codeExecution(code,codeStates);
    } 
  }

  function handleConfirmOnLoad(){
  }

    const handleOnload=()=>{
      // copyFormData for group
        setwrite_group55231((prev:any) => ({ ...prev, ...operations58572 }));
  }
  const handleOnChange=()=>{

  }
  const operations58572Ref = useRef<any>(null);
  const handleClearSearch = () => {
    operations58572Ref.current?.setSearchParams();
    operations58572Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(operations58572) && Object.keys(operations58572)?.length>0)
      {
        setoperations58572({})
      }
    }else 
      prevRefreshRef.current= true
  }, [operations58572Props?.refresh])

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    handleOnChange()
  }, [operations58572])
  return (
    <div 
      style={{          
        gridColumn: '1 / 13',
        gridRow: '1 / 218',
        height: '100%',
        gridAutoRows: '4px',
        columnGap: '12px',
        //rowGap: '0px',
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
        {allowedComponent.includes("write_group")  &&<Groupwrite_group  
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
        {allowedControls.includes("source") ?<TextAreasource   /* 95c56 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>}
        {allowedControls.includes("target") ?<TextAreatarget   /* 64438 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>}
        {allowedControls.includes("navbar") ?<Listnavbar   /* 8dbd9 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("navbarmx") ?<Listnavbarmx   /* 67b58 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>
 )
}

export default Groupoperations
