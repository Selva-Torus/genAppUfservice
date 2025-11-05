'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { Grid } from "@gravity-ui/page-constructor";
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { Magnifier,Xmark } from '@gravity-ui/icons'
import { Button, Icon, Modal } from '@gravity-ui/uikit'
import { eventBus } from '@/app/eventBus';
import DocumentViewerviewdoc  from "./DocumentViewerviewdoc";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';


const Groupgroup2 = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
  const token:string = getCookie('token'); 
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  let code:any = ``;
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
  "User": {
    "allowedControls": [
      "viewdoc"
    ],
    "allowedGroups": [
      "canvas",
      "group",
      "mytable",
      "group2"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Manager": {
    "allowedControls": [
      "viewdoc"
    ],
    "allowedGroups": [
      "canvas",
      "group",
      "mytable",
      "group2"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Employee": {
    "allowedControls": [
      "viewdoc"
    ],
    "allowedGroups": [
      "canvas",
      "group",
      "mytable",
      "group2"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "user": {
    "allowedControls": [
      "viewdoc"
    ],
    "allowedGroups": [
      "canvas",
      "group",
      "mytable",
      "group2"
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
  const {groupe162d, setgroupe162d}= useContext(TotalContext) as TotalContextProps;
  const {groupe162dProps, setgroupe162dProps}= useContext(TotalContext) as TotalContextProps;
  const {mytabled34a7, setmytabled34a7}= useContext(TotalContext) as TotalContextProps;
  const {mytabled34a7Props, setmytabled34a7Props}= useContext(TotalContext) as TotalContextProps;
  const {group23b6cd, setgroup23b6cd}= useContext(TotalContext) as TotalContextProps;
  const {group23b6cdProps, setgroup23b6cdProps}= useContext(TotalContext) as TotalContextProps;
  const {viewdoc074a4, setviewdoc074a4}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:TT407:FNGK:AF:FNK:UF-UFW:CATK:CGFA:AFGK:TG4CGFA:AFK:myUF:AFVK:v1",componentId:"fa1d1f1bfaa74b459f5bec0b2623b6cd",from:"GroupGroup2",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("viewdoc")){
      setviewdoc074a4({...viewdoc074a4,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['group']  = groupe162d,
      codeStates['setgroup'] = setgroupe162d,
      codeStates['mytable']  = mytabled34a7,
      codeStates['setmytable'] = setmytabled34a7,
      codeStates['group2']  = group23b6cd,
      codeStates['setgroup2'] = setgroup23b6cd,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const group23b6cdRef = useRef<any>(null);
  const handleClearSearch = () => {
    group23b6cdRef.current?.setSearchParams();
    group23b6cdRef.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(group23b6cd) && Object.keys(group23b6cd)?.length>0)
      {
        setgroup23b6cd({})
      }
    }else 
      prevRefreshRef.current= true
  }, [group23b6cdProps?.refresh])

  return (
    <div 
      style={{
        gridAutoRows: '4px',
        columnGap: '0px',
        rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        gridColumn: '2 / 12',
        gridRow: '119 / 233',
        height: '100%',
        overflow: 'auto',
        backgroundColor:'',
        backgroundImage:'',
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: ''
      }}
      className=" rounded-md "
    >
        {allowedControls.includes("viewdoc") ?<DocumentViewerviewdoc   /* 074a4 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>             
  )
}

export default Groupgroup2
