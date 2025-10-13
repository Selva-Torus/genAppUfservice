'use client'



    

     
import React, { useState,useContext,useEffect } from 'react'
import { TorusTextInput } from '@/app/TorusComponents/TextInput';
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { Button,Text } from "@gravity-ui/uikit";
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { useRouter } from 'next/navigation'
import {Modal} from '@gravity-ui/uikit';
import { eventBus } from '@/app/eventBus';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';


const TextInputage = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
  const token: string = getCookie('token');
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const actionDetails :any = {}
  const toast:any=useInfoMsg()
  const keyset:any=i18n.keyset("language"); 
  const [allCode,setAllCode]=useState<any>("");
  let schemaArray :any =[];  
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'age',type:"text"})
  const routes = useRouter()
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const encryptionFlagCont: boolean = encryptionFlagCompData?.flag || false;
  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData?.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData?.method;
  /////////////
   //another screen
  const {main6d2c7, setmain6d2c7}= useContext(TotalContext) as TotalContextProps;
  const {main6d2c7Props, setmain6d2c7Props}= useContext(TotalContext) as TotalContextProps;
  const {groupad476b, setgroupad476b}= useContext(TotalContext) as TotalContextProps;
  const {groupad476bProps, setgroupad476bProps}= useContext(TotalContext) as TotalContextProps;
  const {groupb66b0d, setgroupb66b0d}= useContext(TotalContext) as TotalContextProps;
  const {groupb66b0dProps, setgroupb66b0dProps}= useContext(TotalContext) as TotalContextProps;
  const {age9919a, setage9919a}= useContext(TotalContext) as TotalContextProps;
  const {groupc59a19, setgroupc59a19}= useContext(TotalContext) as TotalContextProps;
  const {groupc59a19Props, setgroupc59a19Props}= useContext(TotalContext) as TotalContextProps;
  const {groupde191f, setgroupde191f}= useContext(TotalContext) as TotalContextProps;
  const {groupde191fProps, setgroupde191fProps}= useContext(TotalContext) as TotalContextProps;
  //////////////
  

  // Validation
  schemaArray = [] ;

  const handleChange = async(e: any) => {
    if(dynamicStateandType.type=="number"){
    setgroupb66b0d((prev: any) => ({ ...prev, age: +e.target.value }))
    }
    else{
    setgroupb66b0d((prev: any) => ({ ...prev, age: e.target.value }))
    }
  }
  const handleBlur=async () => {
    let code:any=allCode
     if (code != '') {
      let codeStates: any = {}
      codeStates['main']  = main6d2c7,
      codeStates['setmain'] = setmain6d2c7,
      codeStates['groupa']  = groupad476b,
      codeStates['setgroupa'] = setgroupad476b,
      codeStates['groupb']  = groupb66b0d,
      codeStates['setgroupb'] = setgroupb66b0d,
      codeStates['groupc']  = groupc59a19,
      codeStates['setgroupc'] = setgroupc59a19,
      codeStates['groupd']  = groupde191f,
      codeStates['setgroupd'] = setgroupde191f,
    codeExecution(code,codeStates)
    }
  }
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:TT407:FNGK:AF:FNK:UF-UFW:CATK:CGFA:AFGK:TG4CGFA:AFK:forPFCheckUF:AFVK:v1",
          componentId: "4031f31d86804f2282d6b4b8bec66b0d",
          controlId: "3f5f3360c14d4473b8538d431639919a",
          isTable: false,
          from:"TextInputage",
          accessProfile:accessProfile
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if(orchestrationData?.data?.error == true){
       
        return
      }
      setAllCode(orchestrationData?.data?.code)
      
      if(orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties){
        let type:any={name:'age',type:'text'}
        type={
          name:'age',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.age.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.age.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.age.type
        }
        setDynamicStateandType(type)
       
      }
      if(Array.isArray(orchestrationData?.data?.dstData))
      {
        return
      }else{
      //  if(Object.keys(orchestrationData?.data?.dstData).length>0) 
       // setgroupb66b0d((pre:any)=>({...pre,age:orchestrationData?.data?.dstData}))
      }
    }
    catch(err)
    {
      console.log(err)
    }
  }

  useEffect(()=>{
      handleMapperValue()
      handleBlur()
  },[validateRefetch.value])

  if (age9919a?.isHidden) {
    return <></>
  }
  return (   
    <div 
      style={{gridColumn: `3 / 11`,gridRow: `2 / 3`, gap:``, height: `100%`, overflow: 'auto'}} >
      <TorusTextInput
        className=""
        label={keyset("age")}
        onChange= {handleChange}
        onBlur={()=>handleBlur()}
        type={dynamicStateandType.type}
        value={groupb66b0d?.age||""}
        pin='brick-brick'     
        placeholder='type here....'      
        readOnly= {age9919a?.isDisabled ? true : false}
        size='m'      
        view='normal'
      />
    </div> 
  )
}

export default TextInputage
