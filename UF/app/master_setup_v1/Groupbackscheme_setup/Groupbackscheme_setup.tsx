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
import Tablebackscheme_setup  from './Tablebackscheme_setup';  
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupbackscheme_setup = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
  const {dfd_master_setup_v1Props, setdfd_master_setup_v1Props} = useContext(TotalContext) as TotalContextProps;
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
      "bankcode",
      "countrycode",
      "schemetype",
      "scheme"
    ],
    "allowedGroups": [
      "canvas",
      "add_master_setup",
      "master_setup",
      "backscheme_setup",
      "update_treeviewer"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "EQBOperator": {
    "allowedControls": [
      "bankcode",
      "countrycode",
      "schemetype",
      "scheme"
    ],
    "allowedGroups": [
      "canvas",
      "add_master_setup",
      "master_setup",
      "backscheme_setup",
      "update_treeviewer"
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
  const {add_master_setup46681, setadd_master_setup46681}= useContext(TotalContext) as TotalContextProps;
  const {add_master_setup46681Props, setadd_master_setup46681Props}= useContext(TotalContext) as TotalContextProps;
  const {master_setup8bca5, setmaster_setup8bca5}= useContext(TotalContext) as TotalContextProps;
  const {master_setup8bca5Props, setmaster_setup8bca5Props}= useContext(TotalContext) as TotalContextProps;
  const {backscheme_setupae907, setbackscheme_setupae907}= useContext(TotalContext) as TotalContextProps;
  const {backscheme_setupae907Props, setbackscheme_setupae907Props}= useContext(TotalContext) as TotalContextProps;
  const {bankcodef43ab, setbankcodef43ab}= useContext(TotalContext) as TotalContextProps;
  const {countrycode49ad3, setcountrycode49ad3}= useContext(TotalContext) as TotalContextProps;
  const {schemetype061cd, setschemetype061cd}= useContext(TotalContext) as TotalContextProps;
  const {scheme3daa2, setscheme3daa2}= useContext(TotalContext) as TotalContextProps;
  const {update_treeviewer4efee, setupdate_treeviewer4efee}= useContext(TotalContext) as TotalContextProps;
  const {update_treeviewer4efeeProps, setupdate_treeviewer4efeeProps}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:Add_Master_Setup:AFVK:v1",componentId:"8270e783b99544ffb7a1e35098cae907",from:"GroupBackschemeSetup",isTable : true,accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("bankcode")){
      setbankcodef43ab({...bankcodef43ab,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("countrycode")){
      setcountrycode49ad3({...countrycode49ad3,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("schemetype")){
      setschemetype061cd({...schemetype061cd,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("scheme")){
      setscheme3daa2({...scheme3daa2,isDisabled:true});
    }
  //////////////
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const backscheme_setupae907Ref = useRef<any>(null);
  const handleClearSearch = () => {
    backscheme_setupae907Ref.current?.setSearchParams();
    backscheme_setupae907Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(backscheme_setupae907) && Object.keys(backscheme_setupae907)?.length>0)
      {
        setbackscheme_setupae907({})
      }
    }else 
      prevRefreshRef.current= true
  }, [backscheme_setupae907Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 13',
        gridRow: '1 / 93',
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
        {<Tablebackscheme_setup lockedData={lockedData} setLockedData={setLockedData}  primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData}  refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} paginationDetails={paginationDetails} open={open} setOpen={setOpen} ref={backscheme_setupae907Ref}/>}
        <div
          className='flex justify-end gap-1 p-2'
          style={{
            gridColumn: `1 / 13`,
            gridRow: `1 / 16`,
            gap: ``,
            height: `100%`,
            overflow: 'auto'
          }}
        >
          <Text
            className='mr-auto ml-3'
            variant='display-1'
            wordBreak='break-all'
            color='primary'
          >
            BankScheme Setup
          </Text>
      </div>
    </div>
 )
}

export default Groupbackscheme_setup
