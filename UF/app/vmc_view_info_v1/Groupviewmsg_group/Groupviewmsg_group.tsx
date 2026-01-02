'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import TextAreasource  from "./TextAreasource";
import TextAreamessage  from "./TextAreamessage";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupviewmsg_group = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
  const {dfd_vmc_error_logs_v1Props, setdfd_vmc_error_logs_v1Props} = useContext(TotalContext) as TotalContextProps;
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
    "allowedControls": [
      "source",
      "message"
    ],
    "allowedGroups": [
      "canvas",
      "vmc_viewmsg_info",
      "viewmsg_group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "EQBOperator": {
    "allowedControls": [
      "source",
      "message"
    ],
    "allowedGroups": [
      "vmc_viewmsg_info",
      "viewmsg_group"
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
  const {vmc_viewmsg_info0ee89, setvmc_viewmsg_info0ee89}= useContext(TotalContext) as TotalContextProps;
  const {vmc_viewmsg_info0ee89Props, setvmc_viewmsg_info0ee89Props}= useContext(TotalContext) as TotalContextProps;
  const {viewmsg_groupf2810, setviewmsg_groupf2810}= useContext(TotalContext) as TotalContextProps;
  const {viewmsg_groupf2810Props, setviewmsg_groupf2810Props}= useContext(TotalContext) as TotalContextProps;
  const {source78073, setsource78073}= useContext(TotalContext) as TotalContextProps;
  const {message47a32, setmessage47a32}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_View_Info:AFVK:v1",componentId:"a3b7e2e4348a4d71813e6eb4d67f2810",from:"GroupViewmsgGroup",accessProfile:accessProfile},{
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
      setsource78073({...source78073,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("message")){
      setmessage47a32({...message47a32,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['vmc_viewmsg_info']  = vmc_viewmsg_info0ee89,
      codeStates['setvmc_viewmsg_info'] = setvmc_viewmsg_info0ee89,
      codeStates['viewmsg_group']  = viewmsg_groupf2810,
      codeStates['setviewmsg_group'] = setviewmsg_groupf2810,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const viewmsg_groupf2810Ref = useRef<any>(null);
  const handleClearSearch = () => {
    viewmsg_groupf2810Ref.current?.setSearchParams();
    viewmsg_groupf2810Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(viewmsg_groupf2810) && Object.keys(viewmsg_groupf2810)?.length>0)
      {
        setviewmsg_groupf2810({})
      }
    }else 
      prevRefreshRef.current= true
  }, [viewmsg_groupf2810Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '2 / 12',
        gridRow: '13 / 133',
        height: '100%',
        gridAutoRows: '4px',
        columnGap: '0px',
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
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
      className={clsx("",
        "rounded-md",
        isDark ? "bg-gray-800 text-white" : "bg-white text-black"
      )}
    >
        {allowedControls.includes("source") ?<TextAreasource   /* 78073 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>}
        {allowedControls.includes("message") ?<TextAreamessage   /* 47a32 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>}
    </div>
 )
}

export default Groupviewmsg_group
