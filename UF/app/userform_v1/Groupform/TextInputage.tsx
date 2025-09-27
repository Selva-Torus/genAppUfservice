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
 const actionDetails :any = {
  "action": {
    "lock": {
      "lockMode": "",
      "name": "",
      "ttl": ""
    },
    "stateTransition": {
      "sourceQueue": "",
      "sourceStatus": "",
      "targetQueue": "",
      "targetStatus": ""
    },
    "pagination": {
      "page": "1",
      "count": "10"
    },
    "encryption": {
      "isEnabled": false,
      "selectedDpd": "",
      "encryptionMethod": ""
    },
    "events": {}
  },
  "code": "",
  "rule": {},
  "events": {},
  "mapper": []
}
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const token: string = getCookie('token');
  const toast:any=useInfoMsg()
  const keyset:any=i18n.keyset("language"); 
  const [allCode,setAllCode]=useState<any>("");
  let schemaArray :any =[];  
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'age',type:"text"})
  const routes = useRouter()
  const [showProfileAsModalOpen, setShowProfileAsModalOpen] = React.useState(false);
  const [showElementAsPopupOpen, setShowElementAsPopupOpen] = React.useState(false);
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const encryptionFlagCont: boolean = encryptionFlagCompData?.flag || false;

  let encryptionDpd: string = "";
  encryptionDpd = encryptionDpd !=='' ? encryptionDpd: encryptionFlagCompData?.dpd;
  let encryptionMethod: string = "";
  encryptionMethod  = encryptionMethod !=='' ? encryptionMethod: encryptionFlagCompData?.method;
  /////////////
   //another screen
  const {forma62ff, setforma62ff}= useContext(TotalContext) as TotalContextProps  
  const {forma62ffProps, setforma62ffProps}= useContext(TotalContext) as TotalContextProps  
  const {name8eedd, setname8eedd}= useContext(TotalContext) as TotalContextProps  
  const {age7d25a, setage7d25a}= useContext(TotalContext) as TotalContextProps  
  const {save3d5e3, setsave3d5e3}= useContext(TotalContext) as TotalContextProps  
  //////////////
  

  // Validation
  schemaArray = [] ;

  const handleChange = async(e: any) => {
    if(dynamicStateandType.type=="number"){
    setforma62ff((prev: any) => ({ ...prev, age: +e.target.value }))
    }
    else{
    setforma62ff((prev: any) => ({ ...prev, age: e.target.value }))
    }
  }
  const handleBlur=async () => {
    let code:any=allCode
     if (code != '') {
      let codeStates: any = {}
      codeStates['form']  = forma62ff,
      codeStates['setform'] = setforma62ff,
    codeExecution(code,codeStates)
    }
  }
    const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT266:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:userform:AFVK:v1",
          componentId: "d1ef2bef95ab46a1b105470f5f1a62ff",
          controlId: "446c581c759348d3bd0509ef69b7d25a",
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
       // setforma62ff((pre:any)=>({...pre,age:orchestrationData?.data?.dstData}))
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

    if (age7d25a?.isHidden) {
      return <></>
    }
  return (   
    <div 
      style={{gridColumn: `6 / 9`,gridRow: `2 / 3`,marginTop: `auto`, gap:``}} >
        <TorusTextInput
          className=""
          label={keyset("age")}
          onChange= {handleChange}
          onBlur={()=>handleBlur()}
          type={dynamicStateandType.type}
          value={forma62ff?.age||""}
          readOnly= {age7d25a?.isDisabled ? true : false}
        />
    </div> 
  )
}
export default TextInputage