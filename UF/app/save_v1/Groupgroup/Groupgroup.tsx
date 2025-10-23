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
import Buttonsave  from "./Buttonsave";
import ButtonButtonReject  from "./ButtonButtonReject";
import Labellabel  from "./Labellabel";
import TextInputname  from "./TextInputname";
import TextInputage  from "./TextInputage";
import TextInputstreet  from "./TextInputstreet";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment";
import { TotalContext, TotalContextProps } from '@/app/globalContext';


const Groupgroup = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData,paginationDetails}:any)=> {
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
      "buttonreject",
      "label",
      "name",
      "age",
      "street"
    ],
    "allowedGroups": [
      "canvas",
      "group"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "Manager": {
    "allowedControls": [
      "save",
      "buttonreject",
      "label",
      "name",
      "age",
      "street"
    ],
    "allowedGroups": [
      "canvas",
      "group"
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
  const {group5384d, setgroup5384d}= useContext(TotalContext) as TotalContextProps;
  const {group5384dProps, setgroup5384dProps}= useContext(TotalContext) as TotalContextProps;
  const {save11c8e, setsave11c8e}= useContext(TotalContext) as TotalContextProps;
  const {buttonreject8b1d9, setbuttonreject8b1d9}= useContext(TotalContext) as TotalContextProps;
  const {label0cb72, setlabel0cb72}= useContext(TotalContext) as TotalContextProps;
  const {name1ef9f, setname1ef9f}= useContext(TotalContext) as TotalContextProps;
  const {age6bba1, setage6bba1}= useContext(TotalContext) as TotalContextProps;
  const {street1e063, setstreet1e063}= useContext(TotalContext) as TotalContextProps;
  //////////////
  
  async function securityCheck() {
  const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:TT407:FNGK:AF:FNK:UF-UFW:CATK:CGFA:AFGK:TG4CGFA:AFK:Testasample:AFVK:v1",componentId:"414718cf9b784538acdbc0a9cb15384d",from:"GroupGroup",accessProfile:accessProfile},{
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
      setsave11c8e({...save11c8e,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("buttonreject")){
      setbuttonreject8b1d9({...buttonreject8b1d9,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("label")){
      setlabel0cb72({...label0cb72,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("name")){
      setname1ef9f({...name1ef9f,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("age")){
      setage6bba1({...age6bba1,isDisabled:true});
    }
    if(orchestrationData?.data?.readableControls.includes("street")){
      setstreet1e063({...street1e063,isDisabled:true});
    }
  //////////////
    if (code != '') {
      let codeStates: any = {};
      codeStates['group']  = group5384d,
      codeStates['setgroup'] = setgroup5384d,

    codeExecution(code,codeStates);
    } 
  }


    const handleOnload=()=>{
  }
  const handleOnChange=()=>{

  }

  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(group5384d) && Object.keys(group5384d)?.length>0)
      {
        setgroup5384d({})
      }
    }else 
      prevRefreshRef.current= true
  }, [group5384dProps?.refresh])

  return (
    <div style={{
          gridAutoRows: '4px',
          columnGap: '0px',
          rowGap: '0px',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(auto-fill, minmax(4px, 1fr))',
          gridColumn: '1 / 13',
          gridRow: '1 / 93',
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
        {allowedControls.includes("save")  ?<Buttonsave lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>}          
        {allowedControls.includes("buttonreject")  ?<ButtonButtonReject lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/>: <div></div>}          
        {allowedControls.includes("label")?<Labellabel   /* 0cb72 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("name") ?<TextInputname   /* 1ef9f */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("age") ?<TextInputage   /* 6bba1 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
        {allowedControls.includes("street") ?<TextInputstreet   /* 1e063 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} />: <div></div>}
    </div>             
  )
}

export default Groupgroup
