'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import Groupviewmsg_group  from "../Groupviewmsg_group/Groupviewmsg_group";
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import clsx from "clsx";
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import Labelerrormessage_label  from "./Labelerrormessage_label";
import Buttonedit  from "./Buttonedit";
import Buttonretry  from "./Buttonretry";
import Buttoncancel  from "./Buttoncancel";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupvmc_viewmsg_info = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
      "errormessage_label",
      "edit",
      "retry",
      "cancel"
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
      "errormessage_label",
      "edit",
      "retry",
      "cancel"
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
  const {errormessage_label1e59b, seterrormessage_label1e59b}= useContext(TotalContext) as TotalContextProps;
  const {viewmsg_groupf2810, setviewmsg_groupf2810}= useContext(TotalContext) as TotalContextProps;
  const {viewmsg_groupf2810Props, setviewmsg_groupf2810Props}= useContext(TotalContext) as TotalContextProps;
  const {editb2d62, seteditb2d62}= useContext(TotalContext) as TotalContextProps;
  const {retry20f16, setretry20f16}= useContext(TotalContext) as TotalContextProps;
  const {cancel4b018, setcancel4b018}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_View_Info:AFVK:v1",componentId:"b114b7f55fdb49b2bd5f7d168dd0ee89",from:"GroupVmcViewmsgInfo",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("errormessage_label")){
      seterrormessage_label1e59b({...errormessage_label1e59b,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("viewmsg_group")){
      setviewmsg_groupf2810({...viewmsg_groupf2810,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("edit")){
      seteditb2d62({...editb2d62,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("retry")){
      setretry20f16({...retry20f16,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("cancel")){
      setcancel4b018({...cancel4b018,isDisabled:true});
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

  function handleConfirmOnLoad(){
  }

    const handleOnload=()=>{
      // copyFormData for group
        setvmc_viewmsg_info0ee89((prev:any) => ({ ...prev, ...vmc_viewmsg_info0ee89 }));
  }
  const handleOnChange=()=>{

  }
  const vmc_viewmsg_info0ee89Ref = useRef<any>(null);
  const handleClearSearch = () => {
    vmc_viewmsg_info0ee89Ref.current?.setSearchParams();
    vmc_viewmsg_info0ee89Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(vmc_viewmsg_info0ee89) && Object.keys(vmc_viewmsg_info0ee89)?.length>0)
      {
        setvmc_viewmsg_info0ee89({})
      }
    }else 
      prevRefreshRef.current= true
  }, [vmc_viewmsg_info0ee89Props?.refresh])

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    handleOnChange()
  }, [vmc_viewmsg_info0ee89])
  return (
    <div 
      style={{          
        gridColumn: '1 / 13',
        gridRow: '1 / 159',
        height: '100%',
        gridAutoRows: '4px',
        columnGap: '0px',
        //rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        overflow: 'auto',
        backgroundColor:'#ffffff',
        backgroundImage:'',
        backgroundPosition: '',
        backgroundSize: '',
        backgroundRepeat: '',
        backgroundAttachment: '',
        backgroundClip: '',
        backgroundBlendMode: ''
      }}
      className={clsx("p - 2",
        "rounded-md",
        isDark ? "bg-gray-800 text-white" : "bg-white text-black"
      )}
    >
        {allowedComponent.includes("viewmsg_group")  &&<Groupviewmsg_group  
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
        {allowedControls.includes("errormessage_label")?<Labelerrormessage_label   /* 1e59b */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("edit")  ?<Buttonedit lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>}          
        {allowedControls.includes("retry")  ?<Buttonretry lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>}          
        {allowedControls.includes("cancel")  ?<Buttoncancel lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>}          
    </div>
 )
}

export default Groupvmc_viewmsg_info
