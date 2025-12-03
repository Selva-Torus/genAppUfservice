
'use client'
import React, { useState,useContext,useEffect } from 'react'
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import i18n from '@/app/components/i18n';
import { getCookie } from '@/app/components/cookieMgment';
import { codeExecution } from '@/app/utils/codeExecution';
import { AxiosService } from '@/app/components/axiosService';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { useRouter } from 'next/navigation'
import { DatePicker } from '@/components/DatePicker';
import { Text } from '@/components/Text';
import { Modal } from '@/components/Modal';
import { eventBus } from '@/app/eventBus';
import { getFilterProps, getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import * as v from 'valibot';


const DatePickerTransactionFromDateTime = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {
  const token:string = getCookie('token'); 
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
 
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
  const {get_accounts1a859, setget_accounts1a859}= useContext(TotalContext) as TotalContextProps  
  const {get_accounts1a859Props, setget_accounts1a859Props}= useContext(TotalContext) as TotalContextProps  
  const {type16590, settype16590}= useContext(TotalContext) as TotalContextProps  
  const {baseconsentid56ba8, setbaseconsentid56ba8}= useContext(TotalContext) as TotalContextProps  
  const {expirationdatetime2cbfb, setexpirationdatetime2cbfb}= useContext(TotalContext) as TotalContextProps  
  const {transactionfromdatetimeaa64f, settransactionfromdatetimeaa64f}= useContext(TotalContext) as TotalContextProps  
  const {transactiontodatetime00c33, settransactiontodatetime00c33}= useContext(TotalContext) as TotalContextProps  
  const {accountidb7d92, setaccountidb7d92}= useContext(TotalContext) as TotalContextProps  
  const {accounttypefc49d, setaccounttypefc49d}= useContext(TotalContext) as TotalContextProps  
  const {accountsubtypeb9399, setaccountsubtypeb9399}= useContext(TotalContext) as TotalContextProps  
  const {tradingname22dd3, settradingname22dd3}= useContext(TotalContext) as TotalContextProps  
  const {legalnamebccff, setlegalnamebccff}= useContext(TotalContext) as TotalContextProps  
  const {identifiertype37db2, setidentifiertype37db2}= useContext(TotalContext) as TotalContextProps  
  const {identifiera6abf, setidentifiera6abf}= useContext(TotalContext) as TotalContextProps  
  const {consentida3e0f, setconsentida3e0f}= useContext(TotalContext) as TotalContextProps  
  const {apiname543a3, setapiname543a3}= useContext(TotalContext) as TotalContextProps  
  const {permissionsf74a7, setpermissionsf74a7}= useContext(TotalContext) as TotalContextProps  
  const {usertype218a1, setusertype218a1}= useContext(TotalContext) as TotalContextProps  
  const {purpose3c50a, setpurpose3c50a}= useContext(TotalContext) as TotalContextProps  
  const {urle0b3a, seturle0b3a}= useContext(TotalContext) as TotalContextProps  
  const {call_get_accounts51bce, setcall_get_accounts51bce}= useContext(TotalContext) as TotalContextProps  
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
  setValidate((pre:any)=>({...pre,transactionfromdatetime:undefined}))
  setget_accounts1a859((prev: any) => ({ ...prev, transactionfromdatetime: isoDate }))
}



const handleBlur=async () => {
    let code:any;
    const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT242:FNGK:AF:FNK:UF-UFW:CATK:TPPTEST001:AFGK:TPPTEST002:AFK:VOB_Get_Accounts_Consents:AFVK:v1",  componentId:"e63637758360439db9014a076931a859",controlId:"6b850d08781845d499392de5d73aa64f",isTable:false,accessProfile:accessProfile,from:"datePicker"},{
      headers: {
        Authorization: `Bearer ${token}`
    }})
    code=orchestrationData?.data?.code
    if (code != '') {
    let codeStates: any = {};
      codeStates['get_accounts']  = get_accounts1a859;
      codeStates['setget_accounts'] = setget_accounts1a859;
  codeExecution(code,codeStates);
  }
}

useEffect(()=>{
  setget_accounts1a859Props((pre:any)=>({...pre,validation:true}))
 },[transactionfromdatetimeaa64f?.refresh])

  useEffect(()=>{
      handleBlur()
  },[validateRefetch.value])

if (transactionfromdatetimeaa64f?.isHidden) {
  return <></>
}
return (
  <div 
      className="flex flex-col " 
  style={{gridColumn: `7 / 13`,gridRow: `22 / 42`, gap:``, height: `100%`, overflow: 'auto'}} >
    <div>
    <Text className="pb-2">Transaction From Date Time</Text>
    </div>
    <DatePicker
      className=""
      label={keyset("")}
      value={get_accounts1a859?.transactionfromdatetime}
      onUpdate= {handleUpdate}
      onBlur= {()=>handleBlur()} 
      style={{width:'100%'}}     
      readOnly=  {transactionfromdatetimeaa64f?.isDisabled ? true : false}
      disabled= {transactionfromdatetimeaa64f?.isDisabled ? true : false}
      size='m'
      validationState={validate?.transactionfromdatetime ? "invalid" : undefined}
      errorMessage={error}
      />
  </div>
  )
}

export default DatePickerTransactionFromDateTime
