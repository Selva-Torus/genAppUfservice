'use client'

import React,{ useEffect, useState,useContext, useRef } from 'react'
import { Grid } from "@gravity-ui/page-constructor";
import { AxiosService } from '@/app/components/axiosService'
import { uf_authorizationCheckDto } from '@/app/interfaces/interfaces';
import { codeExecution } from '@/app/utils/codeExecution';
import { useRouter } from 'next/navigation'
import { getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import {Modal} from '@gravity-ui/uikit';
import { eventBus } from '@/app/eventBus';


import TextInputclientname  from "./TextInputclientname";
import CheckBoxcheck1  from "./Checkboxcheck1";
import RadioButtonradio1  from "./RadioButtonradio1";
import RadioGroupgroup1  from "./RadioGroupgroup1";
import Cardcard  from "./Cardcard";
import TextAreaareatext  from "./TextAreaareatext";
import TextInputmobile  from "./TextInputmobile";
import CheckBoxcheck2  from "./Checkboxcheck2";
import RadioButtonradio2  from "./RadioButtonradio2";
import RadioGroupgroup2  from "./RadioGroupgroup2";
import Cardcard2  from "./Cardcard2";
import TextAreaareatext2  from "./TextAreaareatext2";
import DatePickerdatePicker  from "./DatePickerdatePicker";
import DatePickerdatepicker2  from "./DatePickerdatepicker2";
import Buttonsave2  from "./Buttonsave2";
import Buttonsave  from "./Buttonsave";
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { getCookie } from "@/app/components/cookieMgment"
import { TotalContext, TotalContextProps } from '@/app/globalContext';


const GroupForm = ({lockedData={},setLockedData,primaryTableData={}, setPrimaryTableData,checkToAdd,setCheckToAdd,refetch,setRefetch,dropdownData,setDropdownData,encryptionFlagPageData, nodeData, setNodeData}:any) => {

  const securityData:any={
  "Employee": {
    "allowedControls": [
      "clientname",
      "check1",
      "radio1",
      "group1",
      "card",
      "areatext",
      "mobile",
      "check2",
      "radio2",
      "group2",
      "card2",
      "areatext2",
      "datepicker",
      "datepicker2",
      "save2",
      "save"
    ],
    "blockedControls": [],
    "readOnlyControls": []
  },
  "userTemplate": {
    "allowedControls": [
      "clientname",
      "mobile",
      "save"
    ],
    "blockedControls": [
      "check1",
      "radio1",
      "group1",
      "card",
      "areatext",
      "check2",
      "radio2",
      "group2",
      "card2",
      "areatext2",
      "datepicker",
      "datepicker2",
      "save2"
    ],
    "readOnlyControls": []
  }
}
  const code:any = ``
  const prevRefreshRef = useRef(false);
  const [allowedComponent,setAllowedComponent]=useState<any>("")
  const toast=useInfoMsg()
  const confirmMsgFlag: boolean = false
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps
  const [allCode,setAllCode]=useState<any>("")
  const token:string = getCookie('token'); 
  const routes = useRouter()
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps
 /////////////
   //another screen
  const {formdaeb3, setformdaeb3}= useContext(TotalContext) as TotalContextProps  
  const {formdaeb3Props, setformdaeb3Props}= useContext(TotalContext) as TotalContextProps  
  const {clientnamed83af, setclientnamed83af}= useContext(TotalContext) as TotalContextProps  
  const {check1238c5, setcheck1238c5}= useContext(TotalContext) as TotalContextProps  
  const {radio12a158, setradio12a158}= useContext(TotalContext) as TotalContextProps  
  const {group1a5574, setgroup1a5574}= useContext(TotalContext) as TotalContextProps  
  const {card90449, setcard90449}= useContext(TotalContext) as TotalContextProps  
  const {areatext565ce, setareatext565ce}= useContext(TotalContext) as TotalContextProps  
  const {mobile5fccb, setmobile5fccb}= useContext(TotalContext) as TotalContextProps  
  const {check2f409e, setcheck2f409e}= useContext(TotalContext) as TotalContextProps  
  const {radio28c1aa, setradio28c1aa}= useContext(TotalContext) as TotalContextProps  
  const {group254618, setgroup254618}= useContext(TotalContext) as TotalContextProps  
  const {card2f1076, setcard2f1076}= useContext(TotalContext) as TotalContextProps  
  const {areatext22664f, setareatext22664f}= useContext(TotalContext) as TotalContextProps  
  const {datepicker947d2, setdatepicker947d2}= useContext(TotalContext) as TotalContextProps  
  const {datepicker24ce5c, setdatepicker24ce5c}= useContext(TotalContext) as TotalContextProps  
  const {save21b74b, setsave21b74b}= useContext(TotalContext) as TotalContextProps  
  const {save4565e, setsave4565e}= useContext(TotalContext) as TotalContextProps  
  const {postgres7f5c4, setpostgres7f5c4}= useContext(TotalContext) as TotalContextProps  
  const {postgres7f5c4Props, setpostgres7f5c4Props}= useContext(TotalContext) as TotalContextProps  
  //////////////
  const encryptionFlagComp: boolean = encryptionFlagPageData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagPageData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagPageData.method
  let encryptionFlagCompData :any ={
    "flag":encryptionFlagComp,
    "dpd":encryptionDpd,
    "method":encryptionMethod
  }
  
  async function securityCheck() {

    
  /////////////
    if(securityData[accessProfile]?.['readOnlyControls'].includes("clientname")){
      setclientnamed83af({...clientnamed83af,isDisabled:true})
    }
    if(securityData[accessProfile]?.['readOnlyControls'].includes("check1")){
      setcheck1238c5({...check1238c5,isDisabled:true})
    }
    if(securityData[accessProfile]?.['readOnlyControls'].includes("radio1")){
      setradio12a158({...radio12a158,isDisabled:true})
    }
    if(securityData[accessProfile]?.['readOnlyControls'].includes("group1")){
      setgroup1a5574({...group1a5574,isDisabled:true})
    }
    if(securityData[accessProfile]?.['readOnlyControls'].includes("card")){
      setcard90449({...card90449,isDisabled:true})
    }
    if(securityData[accessProfile]?.['readOnlyControls'].includes("areatext")){
      setareatext565ce({...areatext565ce,isDisabled:true})
    }
    if(securityData[accessProfile]?.['readOnlyControls'].includes("mobile")){
      setmobile5fccb({...mobile5fccb,isDisabled:true})
    }
    if(securityData[accessProfile]?.['readOnlyControls'].includes("check2")){
      setcheck2f409e({...check2f409e,isDisabled:true})
    }
    if(securityData[accessProfile]?.['readOnlyControls'].includes("radio2")){
      setradio28c1aa({...radio28c1aa,isDisabled:true})
    }
    if(securityData[accessProfile]?.['readOnlyControls'].includes("group2")){
      setgroup254618({...group254618,isDisabled:true})
    }
    if(securityData[accessProfile]?.['readOnlyControls'].includes("card2")){
      setcard2f1076({...card2f1076,isDisabled:true})
    }
    if(securityData[accessProfile]?.['readOnlyControls'].includes("areatext2")){
      setareatext22664f({...areatext22664f,isDisabled:true})
    }
    if(securityData[accessProfile]?.['readOnlyControls'].includes("datepicker")){
      setdatepicker947d2({...datepicker947d2,isDisabled:true})
    }
    if(securityData[accessProfile]?.['readOnlyControls'].includes("datepicker2")){
      setdatepicker24ce5c({...datepicker24ce5c,isDisabled:true})
    }
    if(securityData[accessProfile]?.['readOnlyControls'].includes("save2")){
      setsave21b74b({...save21b74b,isDisabled:true})
    }
    if(securityData[accessProfile]?.['readOnlyControls'].includes("save")){
      setsave4565e({...save4565e,isDisabled:true})
    }
  //////////////
    if (code != '') {
      let codeStates: any = {}      
      codeStates['form']  = formdaeb3,
      codeStates['setform'] = setformdaeb3,

    codeExecution(code,codeStates)
    } 
  }


  const handleOnload=()=>{

  }
  useEffect(() => {    
    securityCheck()   
    handleOnload()
    if (prevRefreshRef.current) {
      if(!Array.isArray(formdaeb3) && Object.keys(formdaeb3)?.length>0)
      {
        setformdaeb3({})
      }
    }else 
      prevRefreshRef.current= true
  }, [formdaeb3Props?.refresh])

  return (
    <div className="col-start-1 col-end-13 row-start-1 row-end-4 gap-10px border border-slate-300 p-2 rounded-md groupStyle">
      <Grid containerClass='grid grid-cols-12 gap-2 '>
        {securityData[accessProfile].allowedControls.includes("clientname") ? <TextInputclientname   /* d83af */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} /> : <div></div>}
        {securityData[accessProfile].allowedControls.includes("check1") ? <CheckBoxcheck1   /* 238c5 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} /> : <div></div>}
        {securityData[accessProfile].allowedControls.includes("radio1")? <RadioButtonradio1  /* 2a158 */  checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  /> : <div></div>}
        {securityData[accessProfile].allowedControls.includes("group1")? <RadioGroupgroup1   /* a5574 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} /> : <div></div>}
        {securityData[accessProfile].allowedControls.includes("card") ? <Cardcard  /* 90449 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  /> : <div></div>}
        {securityData[accessProfile].allowedControls.includes("areatext") ? <TextAreaareatext   /* 565ce */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}/> : <div></div>}
        {securityData[accessProfile].allowedControls.includes("mobile") ? <TextInputmobile   /* 5fccb */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData} /> : <div></div>}
        {securityData[accessProfile].allowedControls.includes("check2") ? <CheckBoxcheck2   /* f409e */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} /> : <div></div>}
        {securityData[accessProfile].allowedControls.includes("radio2")? <RadioButtonradio2  /* 8c1aa */  checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  /> : <div></div>}
        {securityData[accessProfile].allowedControls.includes("group2")? <RadioGroupgroup2   /* 54618 */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} /> : <div></div>}
        {securityData[accessProfile].allowedControls.includes("card2") ? <Cardcard2  /* f1076 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}  /> : <div></div>}
        {securityData[accessProfile].allowedControls.includes("areatext2") ? <TextAreaareatext2   /* 2664f */ checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData}/> : <div></div>}
        {securityData[accessProfile].allowedControls.includes("datepicker") ? <DatePickerdatePicker   /* 947d2 */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} /> : <div></div>}
        {securityData[accessProfile].allowedControls.includes("datepicker2") ? <DatePickerdatepicker2   /* 4ce5c */checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} encryptionFlagCompData={encryptionFlagCompData} /> : <div></div>}
        {securityData[accessProfile].allowedControls.includes("save2")  ? <Buttonsave2 lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/> : <div></div>}          
        {securityData[accessProfile].allowedControls.includes("save")  ? <Buttonsave lockedData={lockedData} setLockedData={setLockedData} primaryTableData={primaryTableData} setPrimaryTableData={setPrimaryTableData} checkToAdd={checkToAdd} setCheckToAdd={setCheckToAdd} refetch={refetch} setRefetch={setRefetch} encryptionFlagCompData={encryptionFlagCompData}/> : <div></div>}          
      </Grid>
    </div>             
  )
}

export default GroupForm