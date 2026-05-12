

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
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import { eventDecisionTable } from '@/app/utils/evaluateDecisionTable';
import decodeToken from '@/app/components/decodeToken';
import { getGroupOrchestrationData, getControlOrchestrationData } from '@/app/utils/Orchestration';
import * as v from 'valibot';


const DatePickertrs_created_date = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData,setIsProcessing,controlData}:any) => {
  const token:string = getCookie('token'); 
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const [isRequiredData,setIsRequiredData]=useState<boolean>(false)
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
  const decodedTokenObj:any = decodeToken(token);
 
  const keyset:any=i18n.keyset("language");
  const toast:any=useInfoMsg();
  const routes = useRouter();
  const encryptionFlagCont: boolean = encryptionFlagCompData.flag || false ;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData.dpd
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData.method;
  //showComponentAsPopup || showArtifactAsModal
    
  /////////////
   //another screen
  const {main_group9066f, setmain_group9066f}= useContext(TotalContext) as TotalContextProps  
  const {main_group9066fProps, setmain_group9066fProps}= useContext(TotalContext) as TotalContextProps  
  const {search_label27572, setsearch_label27572}= useContext(TotalContext) as TotalContextProps  
  const {trs_created_date2cea8, settrs_created_date2cea8}= useContext(TotalContext) as TotalContextProps  
  const {debtor_account_no963e4, setdebtor_account_no963e4}= useContext(TotalContext) as TotalContextProps  
  const {debtor_namee2d9f, setdebtor_namee2d9f}= useContext(TotalContext) as TotalContextProps  
  const {creditor_account_noca692, setcreditor_account_noca692}= useContext(TotalContext) as TotalContextProps  
  const {payment_currency703d2, setpayment_currency703d2}= useContext(TotalContext) as TotalContextProps  
  const {payment_amount042b1, setpayment_amount042b1}= useContext(TotalContext) as TotalContextProps  
  const {uuid29c9f, setuuid29c9f}= useContext(TotalContext) as TotalContextProps  
  const {status4bd75, setstatus4bd75}= useContext(TotalContext) as TotalContextProps  
  const {search0e695, setsearch0e695}= useContext(TotalContext) as TotalContextProps  
  const {cleareddfa, setcleareddfa}= useContext(TotalContext) as TotalContextProps  
  //////////////


  // Validation
  const [error, setError] = useState<string>('');
  let schemaArray :any =[];


const handleUpdate = async(date: any) => {
  try{
  setIsProcessing(true);
  setError('')
  setValidate((pre:any)=>({...pre,transactionSearch_v1:{...pre?.transactionSearch_v1,trs_created_date:undefined}}));
  if (!date) {
    setmain_group9066f((prev: any) => ({ ...prev, trs_created_date: null }));
    return;
  }
  const selectedDate = new Date(date);
  const IST_OFFSET = 5.5 * 60 * 60 * 1000; 
  const indiaTime = new Date(selectedDate.getTime() + IST_OFFSET);
  const isoDate = indiaTime.toISOString();
  setmain_group9066f((prev: any) => ({ ...prev, trs_created_date: isoDate }))
  }catch (err: any) {
    setIsProcessing(false);
    if(typeof err == 'string')
      toast(err, 'danger');
    else
      toast(err?.response?.data?.errorDetails?.message, 'danger');
  }finally{
    setIsProcessing(false);
  }
}



const handleBlur=async () => {
    //validation
    let code:any;
    const orchestrationData : any = getControlOrchestrationData(
        controlData,
        "526f0e58d5454270aca67c481a99066f",
        "acf1d258656b47358f9b6d8a5a12cea8"
      );
    code=orchestrationData?.data?.code
    if (code != '') {
    let codeStates: any = {};
    codeStates['main_group'] = main_group9066f,
    codeStates['setmain_group'] = setmain_group9066f,
    codeStates['main_group9066f'] = main_group9066fProps,
    codeStates['setmain_group9066f'] = setmain_group9066fProps,
    codeStates['search_label'] = search_label27572,
    codeStates['setsearch_label'] = setsearch_label27572,
    codeStates['trs_created_date'] = trs_created_date2cea8,
    codeStates['settrs_created_date'] = settrs_created_date2cea8,
    codeStates['debtor_account_no'] = debtor_account_no963e4,
    codeStates['setdebtor_account_no'] = setdebtor_account_no963e4,
    codeStates['debtor_name'] = debtor_namee2d9f,
    codeStates['setdebtor_name'] = setdebtor_namee2d9f,
    codeStates['creditor_account_no'] = creditor_account_noca692,
    codeStates['setcreditor_account_no'] = setcreditor_account_noca692,
    codeStates['payment_currency'] = payment_currency703d2,
    codeStates['setpayment_currency'] = setpayment_currency703d2,
    codeStates['payment_amount'] = payment_amount042b1,
    codeStates['setpayment_amount'] = setpayment_amount042b1,
    codeStates['uuid'] = uuid29c9f,
    codeStates['setuuid'] = setuuid29c9f,
    codeStates['status'] = status4bd75,
    codeStates['setstatus'] = setstatus4bd75,
    codeStates['search'] = search0e695,
    codeStates['setsearch'] = setsearch0e695,
    codeStates['clear'] = cleareddfa,
    codeStates['setclear'] = setcleareddfa,
    codeStates['toast'] = toast;
    codeExecution(code,codeStates);
  }
}

useEffect(()=>{
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const IST_OFFSET = 5.5 * 60 * 60 * 1000;
  const indiaToday = new Date(today.getTime() + IST_OFFSET);
  setmain_group9066f((pre:any)=>({...pre,trs_created_date:indiaToday.toISOString()}))
  setmain_group9066fProps((pre:any)=>({...pre,validation:true}))
 },[trs_created_date2cea8?.refresh])

useEffect(()=>{
  handleBlur();
},[validateRefetch.value])

if (trs_created_date2cea8?.isHidden) {
  return <></>
}
return (
  <div 
  style={{gridColumn: `1 / 7`,gridRow: `10 / 28`, gap:``, height: `100%`, overflow: 'auto'}} >
    <DatePicker
      className=""
      //label={keyset("")}
      value={main_group9066f?.trs_created_date}
      onUpdate= {handleUpdate}
      onBlur= {()=>handleBlur()} 
      required={ false }
      readOnly=  {trs_created_date2cea8?.isDisabled ? true : false}
      disabled= {trs_created_date2cea8?.isDisabled ? true : false}
      contentAlign={"center"}
      headerPosition='top'
      headerText="Created Date"
      validationState={validate?.transactionSearch_v1?.trs_created_date ? "invalid" : undefined}
      errorMessage={error}
      />
  </div>
  )
}

export default DatePickertrs_created_date
