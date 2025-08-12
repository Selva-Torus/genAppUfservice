'use client'
import React, { useState,useContext,useEffect } from 'react'
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import TorusDatePicker from '@/app/TorusComponents/DatePicker';
import { dateTimeParse } from '@gravity-ui/date-utils';
import i18n from '@/app/components/i18n';
import { getCookie } from '@/app/components/cookieMgment';
import { codeExecution } from '@/app/utils/codeExecution';
import { AxiosService } from '@/app/components/axiosService';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { useRouter } from 'next/navigation'
import {Modal,Text} from '@gravity-ui/uikit';
import { eventBus } from '@/app/eventBus';
import { getFilterProps, getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import * as v from 'valibot';


const DatePickerdatepicker2 = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const token:string = getCookie('token');
  const keyset:any=i18n.keyset("language");
  const toast:any=useInfoMsg();
  const routes = useRouter();
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;

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



  // Validation
  const [error, setError] = useState<string>('');
  let schemaArray :any =[];

const handleUpdate = async(date: any) => {
  const selectedDate = new Date(date);
  const IST_OFFSET = 5.5 * 60 * 60 * 1000; 
  const indiaTime = new Date(selectedDate.getTime() + IST_OFFSET);
  const isoDate = indiaTime.toISOString();
  setError('')
  setValidate((pre:any)=>({...pre,datepicker2:undefined}))
  setformdaeb3((prev: any) => ({ ...prev, datepicker2: isoDate }))
}



const handleBlur=async () => {
    let code:any="";
    if (code != '') {
    let codeStates: any = {};
      codeStates['form']  = formdaeb3;
      codeStates['setform'] = setformdaeb3;
      codeStates['postgres']  = postgres7f5c4;
      codeStates['setpostgres'] = setpostgres7f5c4;
  codeExecution(code,codeStates);
  }
}

useEffect(()=>{
  setformdaeb3Props((pre:any)=>({...pre,validation:true}))
 },[datepicker24ce5c?.refresh])

  useEffect(()=>{
      handleBlur()
  },[validateRefetch.value])

if (datepicker24ce5c?.isHidden) {
  return <></>
}

return (
  <div 
  style={{gridColumn: `3 / 5`,gridRow: `3 / 4`,marginTop: `auto`, gap:`10px`}} >
    <TorusDatePicker
    className=""
      label={keyset("datepicker2")}
      value={formdaeb3?.datepicker2?dateTimeParse(formdaeb3?.datepicker2):null}
      onUpdate= {handleUpdate}
      onBlur= {()=>handleBlur()} 
      style={{width:'100%'}}     
      readOnly=  {datepicker24ce5c?.isDisabled ? true : false}
          disabled= {datepicker24ce5c?.isDisabled ? true : false}
      validationState={validate?.datepicker2 ? "invalid" : undefined}
      errorMessage={error}
      />
  </div>
  )
}
export default DatePickerdatepicker2