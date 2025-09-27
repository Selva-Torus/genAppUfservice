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


const TextInputname = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
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
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'name',type:"text"})
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
    setforma62ff((prev: any) => ({ ...prev, name: +e.target.value }))
    }
    else{
    setforma62ff((prev: any) => ({ ...prev, name: e.target.value }))
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
          controlId: "f9e54894ac5741e1954fa180b198eedd",
          isTable: false,
          from:"TextInputname",
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
        let type:any={name:'name',type:'text'}
        type={
          name:'name',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.name.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.name.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.name.type
        }
        setDynamicStateandType(type)
       
      }
      if(Array.isArray(orchestrationData?.data?.dstData))
      {
        return
      }else{
      //  if(Object.keys(orchestrationData?.data?.dstData).length>0) 
       // setforma62ff((pre:any)=>({...pre,name:orchestrationData?.data?.dstData}))
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

    if (name8eedd?.isHidden) {
      return <></>
    }
  return (   
    <div 
      style={{gridColumn: `2 / 5`,gridRow: `2 / 3`,marginTop: `auto`, gap:``}} >
        <TorusTextInput
          className=""
          label={keyset("name")}
          onChange= {handleChange}
          onBlur={()=>handleBlur()}
          type={dynamicStateandType.type}
          value={forma62ff?.name||""}
          readOnly= {name8eedd?.isDisabled ? true : false}
        />
    </div> 
  )
}
export default TextInputname