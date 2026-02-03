
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
import * as v from 'valibot';


const DatePickersettlement_date = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {
  const token:string = getCookie('token'); 
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
 
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
  const {payment_group1c8a5, setpayment_group1c8a5}= useContext(TotalContext) as TotalContextProps  
  const {payment_group1c8a5Props, setpayment_group1c8a5Props}= useContext(TotalContext) as TotalContextProps  
  const {channel_named9a37, setchannel_named9a37}= useContext(TotalContext) as TotalContextProps  
  const {product_code9a692, setproduct_code9a692}= useContext(TotalContext) as TotalContextProps  
  const {directionbf471, setdirectionbf471}= useContext(TotalContext) as TotalContextProps  
  const {charge_type977c5, setcharge_type977c5}= useContext(TotalContext) as TotalContextProps  
  const {debtor_account0655c, setdebtor_account0655c}= useContext(TotalContext) as TotalContextProps  
  const {creditor_accounts82148, setcreditor_accounts82148}= useContext(TotalContext) as TotalContextProps  
  const {amountc2ae9, setamountc2ae9}= useContext(TotalContext) as TotalContextProps  
  const {currency124c5, setcurrency124c5}= useContext(TotalContext) as TotalContextProps  
  const {uuide86ae, setuuide86ae}= useContext(TotalContext) as TotalContextProps  
  const {process_type45fad, setprocess_type45fad}= useContext(TotalContext) as TotalContextProps  
  const {tran_category81c97, settran_category81c97}= useContext(TotalContext) as TotalContextProps  
  const {settlement_datea6baf, setsettlement_datea6baf}= useContext(TotalContext) as TotalContextProps  
  const {remittance_info57b4b, setremittance_info57b4b}= useContext(TotalContext) as TotalContextProps  
  const {product_code_json46315, setproduct_code_json46315}= useContext(TotalContext) as TotalContextProps  
  const {saveb6b99, setsaveb6b99}= useContext(TotalContext) as TotalContextProps  
  const {clearf69d6, setclearf69d6}= useContext(TotalContext) as TotalContextProps  
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
  setValidate((pre:any)=>({...pre,settlement_date:undefined}))
  setpayment_group1c8a5((prev: any) => ({ ...prev, settlement_date: isoDate }))
}



const handleBlur=async () => {
    let code:any;
    const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT005:FNGK:AF:FNK:UF-UFW:CATK:V001:AFGK:VGPH001:AFK:Add_New_Payment:AFVK:v1",  componentId:"4e3a333fdb93472c97f4c7ca2461c8a5",controlId:"42e43de5d0b74fad8829360e654a6baf",isTable:false,accessProfile:accessProfile,from:"datePicker"},{
      headers: {
        Authorization: `Bearer ${token}`
    }})
    code=orchestrationData?.data?.code
    if (code != '') {
    let codeStates: any = {};
      codeStates['payment_group']  = payment_group1c8a5;
      codeStates['setpayment_group'] = setpayment_group1c8a5;
  codeExecution(code,codeStates);
  }
}

useEffect(()=>{
  setpayment_group1c8a5Props((pre:any)=>({...pre,validation:true}))
 },[settlement_datea6baf?.refresh])

  useEffect(()=>{
      handleBlur()
  },[validateRefetch.value])

if (settlement_datea6baf?.isHidden) {
  return <></>
}
return (
  <div 
  style={{gridColumn: `19 / 25`,gridRow: `41 / 60`, gap:``, height: `100%`, overflow: 'auto'}} >
    <DatePicker
      className=""
      //label={keyset("")}
      value={payment_group1c8a5?.settlement_date}
      onUpdate= {handleUpdate}
      onBlur= {()=>handleBlur()} 
      readOnly=  {settlement_datea6baf?.isDisabled ? true : false}
      disabled= {settlement_datea6baf?.isDisabled ? true : false}
      contentAlign={"center"}
      headerPosition='top'
      headerText="Settlement Date"
      validationState={validate?.settlement_date ? "invalid" : undefined}
      errorMessage={error}
      />
  </div>
  )
}

export default DatePickersettlement_date
