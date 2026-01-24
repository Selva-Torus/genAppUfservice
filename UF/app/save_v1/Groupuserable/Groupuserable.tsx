

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
import Tableuserable  from './Tableuserable';  
import Buttoncopy  from "./Buttoncopy";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { useTheme } from '@/hooks/useTheme';


const Groupuserable = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
      "name",
      "copy"
    ],
    "allowedGroups": [
      "canvas",
      "maingroup",
      "userable"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Template 2": {
    "allowedControls": [
      "id",
      "name",
      "copy"
    ],
    "allowedGroups": [
      "canvas",
      "maingroup",
      "userable"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Template 3": {
    "allowedControls": [
      "id",
      "name",
      "copy"
    ],
    "allowedGroups": [
      "canvas",
      "maingroup",
      "userable"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "User": {
    "allowedControls": [
      "id",
      "name",
      "copy"
    ],
    "allowedGroups": [
      "canvas",
      "maingroup",
      "userable"
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
  const {maingroup7f4e1, setmaingroup7f4e1}= useContext(TotalContext) as TotalContextProps;
  const {maingroup7f4e1Props, setmaingroup7f4e1Props}= useContext(TotalContext) as TotalContextProps;
  const {userable8d616, setuserable8d616}= useContext(TotalContext) as TotalContextProps;
  const {userable8d616Props, setuserable8d616Props}= useContext(TotalContext) as TotalContextProps;
  const {idfc377, setidfc377}= useContext(TotalContext) as TotalContextProps;
  const {name28713, setname28713}= useContext(TotalContext) as TotalContextProps;
  const {copyffc78, setcopyffc78}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:savescreen:AFVK:v1",componentId:"756be105166e442fb083156eebe8d616",from:"GroupUserable",isTable : true,accessProfile:accessProfile},{
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
      setidfc377({...idfc377,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("name")){
      setname28713({...name28713,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("copy")){
      setcopyffc78({...copyffc78,isDisabled:true});
    }
  //////////////
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }
  const userable8d616Ref = useRef<any>(null);
  const handleClearSearch = () => {
    userable8d616Ref.current?.setSearchParams();
    userable8d616Ref.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(userable8d616) && Object.keys(userable8d616)?.length>0)
      {
        setuserable8d616({})
      }
    }else 
      prevRefreshRef.current= true
  }, [userable8d616Props?.refresh])

  return (
    <div 
      style={{          
        gridColumn: '1 / 25',
        gridRow: '88 / 288',
      
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
      className={`flex flex-col overflow-auto rounded-md  ${isDark ? 'text-white' : 'text-black'}`}
    >
        <CommonHeaderAndTooltip
        >
        <div className='flex flex-col h-full'>
        <div
          className='flex flex-shrink-0 justify-end gap-1 p-2 h-[60px]'>
        {        (("copy" in ButtonGoRuleData)?ButtonGoRuleData["copy"]:true) && 
          allowedControls.includes("copy")  ?          <div className="w-[10%]"><Buttoncopy lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/></div>: <div></div>} 
      </div>
        <div className='flex flex-1 w-full min-h-0'>
       {<Tableuserable lockedData={lockedData} setLockedData={setLockedData}  primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData}  refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} paginationDetails={paginationDetails} open={open} setOpen={setOpen} ref={userable8d616Ref} ButtonGoRuleData={ButtonGoRuleData} setButtonGoRuleData ={setButtonGoRuleData}/>}
      </div>
        </div>
      </CommonHeaderAndTooltip>
    </div>
 )
}

export default Groupuserable
