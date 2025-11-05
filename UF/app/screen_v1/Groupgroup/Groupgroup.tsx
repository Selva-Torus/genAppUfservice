'use client'
import React,{ useEffect, useState,useContext, useRef } from 'react';
import { Grid } from "@gravity-ui/page-constructor";
import { AxiosService } from '@/app/components/axiosService';
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation';
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { Magnifier,Xmark } from '@gravity-ui/icons'
import Groupmytable  from "../Groupmytable/Groupmytable";
import Groupgroup2  from "../Groupgroup2/Groupgroup2";
import { Button, Icon, Modal } from '@gravity-ui/uikit'
import { eventBus } from '@/app/eventBus';
import Buttonsave  from "./Buttonsave";
import Documentuploadername  from "./Documentuploadername";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';


const Groupgroup = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails,isFormOpen=false}:any)=> {
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
      "save",
      "name"
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
      "save",
      "name"
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
      "save",
      "name"
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
      "save",
      "name"
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
  const {save1f20e, setsave1f20e}= useContext(TotalContext) as TotalContextProps;
  const {nameed81e, setnameed81e}= useContext(TotalContext) as TotalContextProps;
  const {mytabled34a7, setmytabled34a7}= useContext(TotalContext) as TotalContextProps;
  const {mytabled34a7Props, setmytabled34a7Props}= useContext(TotalContext) as TotalContextProps;
  const {group23b6cd, setgroup23b6cd}= useContext(TotalContext) as TotalContextProps;
  const {group23b6cdProps, setgroup23b6cdProps}= useContext(TotalContext) as TotalContextProps;
  //////////////
  const [open, setOpen] = React.useState(false);
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:TT407:FNGK:AF:FNK:UF-UFW:CATK:CGFA:AFGK:TG4CGFA:AFK:myUF:AFVK:v1",componentId:"606c6996414e44049eebebc39c1e162d",from:"GroupGroup",accessProfile:accessProfile},{
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
    if(orchestrationData?.data?.readableControls.includes("save")){
      setsave1f20e({...save1f20e,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("name")){
      setnameed81e({...nameed81e,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("mytable")){
      setmytabled34a7({...mytabled34a7,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("group2")){
      setgroup23b6cd({...group23b6cd,isDisabled:true});
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
  const groupe162dRef = useRef<any>(null);
  const handleClearSearch = () => {
    groupe162dRef.current?.setSearchParams();
    groupe162dRef.current?.handleSearch({});
  };

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(groupe162d) && Object.keys(groupe162d)?.length>0)
      {
        setgroupe162d({})
      }
    }else 
      prevRefreshRef.current= true
  }, [groupe162dProps?.refresh])

  return (
    <div 
      style={{
        gridAutoRows: '4px',
        columnGap: '0px',
        rowGap: '0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
        gridColumn: '1 / 13',
        gridRow: '1 / 251',
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
        {allowedComponent.includes("mytable")  &&<Groupmytable  
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
        {allowedComponent.includes("group2")  &&<Groupgroup2  
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
        {allowedControls.includes("save")  ?<Buttonsave lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>}          
        {allowedControls.includes("name") ?<Documentuploadername   /* ed81e */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>             
  )
}

export default Groupgroup
