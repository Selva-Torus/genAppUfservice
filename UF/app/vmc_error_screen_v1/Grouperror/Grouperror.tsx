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
import Tableerror  from './Tableerror';  
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Grouperror = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
      "dateandtime",
      "source",
      "message",
      "view"
    ],
    "allowedGroups": [
      "canvas",
      "vmc_error_screen",
      "error"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "EQBOperator": {
    "allowedControls": [
      "view"
    ],
    "allowedGroups": [],
    "blockedControls": [
      "dateandtime",
      "source",
      "message"
    ],
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
  const {vmc_error_screen68a17, setvmc_error_screen68a17}= useContext(TotalContext) as TotalContextProps;
  const {vmc_error_screen68a17Props, setvmc_error_screen68a17Props}= useContext(TotalContext) as TotalContextProps;
  const {error81aed, seterror81aed}= useContext(TotalContext) as TotalContextProps;
  const {error81aedProps, seterror81aedProps}= useContext(TotalContext) as TotalContextProps;
  const {dateandtime1297b, setdateandtime1297b}= useContext(TotalContext) as TotalContextProps;
  const {source654ee, setsource654ee}= useContext(TotalContext) as TotalContextProps;
  const {message53ca9, setmessage53ca9}= useContext(TotalContext) as TotalContextProps;
  const {viewca8bb, setviewca8bb}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT261:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:VMC_Error_Screen:AFVK:v1",componentId:"3398db28967f415f9f2c9cf58ed81aed",from:"GroupError",isTable : true,accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("dateandtime")){
      setdateandtime1297b({...dateandtime1297b,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("source")){
      setsource654ee({...source654ee,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("message")){
      setmessage53ca9({...message53ca9,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("view")){
      setviewca8bb({...viewca8bb,isDisabled:true});
    }
  //////////////
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const error81aedRef = useRef<any>(null);
  const handleClearSearch = () => {
    error81aedRef.current?.setSearchParams();
    error81aedRef.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(error81aed) && Object.keys(error81aed)?.length>0)
      {
        seterror81aed({})
      }
    }else 
      prevRefreshRef.current= true
  }, [error81aedProps?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 13',
        gridRow: '13 / 146',
        height: '100%',
        gridAutoRows: '4px',
        columnGap: '',
        //rowGap: '',
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
      className={clsx("bg-white p-5",
        "rounded-md",
        isDark ? "bg-gray-800 text-white" : "bg-white text-black"
      )}
    >
        {<Tableerror lockedData={lockedData} setLockedData={setLockedData}  primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData}  refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} paginationDetails={paginationDetails} open={open} setOpen={setOpen} ref={error81aedRef}/>}
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
            Error Logs
          </Text>
      </div>
    </div>
 )
}

export default Grouperror
