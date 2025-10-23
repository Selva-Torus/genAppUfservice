'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { Grid } from "@gravity-ui/page-constructor";
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import {Modal} from '@gravity-ui/uikit';
import { eventBus } from '@/app/eventBus';
import Tablemytable  from './Tablemytable';  
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';


const Groupmytable = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails}:any)=> {
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
      "tabledata_id",
      "name",
      "age"
    ],
    "allowedGroups": [
      "canvas",
      "group",
      "mytable"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Manager": {
    "allowedControls": [
      "tabledata_id",
      "name",
      "age"
    ],
    "allowedGroups": [
      "canvas",
      "group",
      "mytable"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Employee": {
    "allowedControls": [
      "tabledata_id",
      "name",
      "age"
    ],
    "allowedGroups": [
      "canvas",
      "group",
      "mytable"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "user": {
    "allowedControls": [
      "tabledata_id",
      "name",
      "age"
    ],
    "allowedGroups": [
      "canvas",
      "group",
      "mytable"
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
  const {tabledata_id59734, settabledata_id59734}= useContext(TotalContext) as TotalContextProps;
  const {name067a9, setname067a9}= useContext(TotalContext) as TotalContextProps;
  const {agec2723, setagec2723}= useContext(TotalContext) as TotalContextProps;
  //////////////
  
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:TT407:FNGK:AF:FNK:UF-UFW:CATK:CGFA:AFGK:TG4CGFA:AFK:myUF:AFVK:v1",componentId:"3e5f865971d84ca689ff416eff8d34a7",from:"GroupMytable",isTable : true,accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("tabledata_id")){
      settabledata_id59734({...tabledata_id59734,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("name")){
      setname067a9({...name067a9,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("age")){
      setagec2723({...agec2723,isDisabled:true});
    }
  //////////////
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(mytabled34a7) && Object.keys(mytabled34a7)?.length>0)
      {
        setmytabled34a7({})
      }
    }else 
      prevRefreshRef.current= true
  }, [mytabled34a7Props?.refresh])

  return (
    <div style={{
          gridAutoRows: '4px',
          columnGap: '0px',
          rowGap: '0px',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
          gridColumn: '1 / 13',
          gridRow: '100 / 179',
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
        className=" rounded-md " >
        {<Tablemytable lockedData={lockedData} setLockedData={setLockedData}  primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData}  refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} paginationDetails={paginationDetails}  />}
    </div>             
  )
}

export default Groupmytable
