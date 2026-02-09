
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


const DatePickerdate = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {
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
  const {maingroup7f4e1, setmaingroup7f4e1}= useContext(TotalContext) as TotalContextProps  
  const {maingroup7f4e1Props, setmaingroup7f4e1Props}= useContext(TotalContext) as TotalContextProps  
  const {save8d5a7, setsave8d5a7}= useContext(TotalContext) as TotalContextProps  
  const {username57f7f, setusername57f7f}= useContext(TotalContext) as TotalContextProps  
  const {checkboxebbe6, setcheckboxebbe6}= useContext(TotalContext) as TotalContextProps  
  const {date419b1, setdate419b1}= useContext(TotalContext) as TotalContextProps  
  const {userable8d616, setuserable8d616}= useContext(TotalContext) as TotalContextProps  
  const {userable8d616Props, setuserable8d616Props}= useContext(TotalContext) as TotalContextProps  
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
  setValidate((pre:any)=>({...pre,date:undefined}))
  setmaingroup7f4e1((prev: any) => ({ ...prev, date: isoDate }))
}



const handleBlur=async () => {
    if(maingroup7f4e1?.date == "" || maingroup7f4e1?.date == undefined){
    maingroup7f4e1.date = "";
    const validate:any = v.safeParse(schema, maingroup7f4e1?.date);
    if(!validate.success){
      setError(validate?.issues[0]?.message);
      setValidate((pre:any)=>({...pre,date:"invalid"}))
    }
    setError('')
    setValidate((pre:any)=>({...pre,date:undefined}))
    }else if(maingroup7f4e1?.date !== ""){
      const validate:any = v.safeParse(schema, new Date(maingroup7f4e1?.date));
      if(!validate.success){
        setError(validate?.issues[0]?.message);
        setValidate((pre:any)=>({...pre,date:"invalid"}))
      }
    }
    let code:any;
    const orchestrationData:any = await AxiosService.post("/UF/Orchestration",{key:"CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:savescreen:AFVK:v1",  componentId:"148827029a474f2db3ba030ecc17f4e1",controlId:"e4c9917b1eaa4a508a0bf5ffbfb419b1",isTable:false,accessProfile:accessProfile,from:"datePickerdate"},{
      headers: {
        Authorization: `Bearer ${token}`
    }})
    code=orchestrationData?.data?.code
    if (code != '') {
    let codeStates: any = {};
      codeStates['maingroup']  = maingroup7f4e1;
      codeStates['setmaingroup'] = setmaingroup7f4e1;
      codeStates['userable']  = userable8d616;
      codeStates['setuserable'] = setuserable8d616;
  codeExecution(code,codeStates);
  }
}

useEffect(()=>{
  setmaingroup7f4e1Props((pre:any)=>({...pre,validation:true,required:true}))
 },[date419b1?.refresh])

  useEffect(()=>{
    if(validateRefetch.init!=0)
      handleBlur()
  },[validateRefetch.value])

if (date419b1?.isHidden) {
  return <></>
}
return (
  <div 
  style={{gridColumn: `5 / 12`,gridRow: `58 / 68`, gap:``, height: `100%`, overflow: 'auto'}} >
    <DatePicker
      className=""
      //label={keyset("date")}
      value={maingroup7f4e1?.date}
      onUpdate= {handleUpdate}
      onBlur= {()=>handleBlur()} 
      readOnly=  {date419b1?.isDisabled ? true : false}
      disabled= {date419b1?.isDisabled ? true : false}
      contentAlign={"center"}
      validationState={validate?.date ? "invalid" : undefined}
      errorMessage={error}
      />
  </div>
  )
}

export default DatePickerdate
