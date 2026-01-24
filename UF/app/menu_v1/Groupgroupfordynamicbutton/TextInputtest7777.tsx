'use client'



import React, { useState,useContext,useEffect } from 'react'
import { useInfoMsg } from "@/app/components/infoMsgHandler";
import { TotalContext, TotalContextProps } from '@/app/globalContext';
import { Modal } from "@/components/Modal";
import { Text } from "@/components/Text";
import { TextInput } from '@/components/TextInput';
import i18n from '@/app/components/i18n';
import { codeExecution } from '@/app/utils/codeExecution';
import { AxiosService } from '@/app/components/axiosService';
import { getCookie } from '@/app/components/cookieMgment';
import { useRouter } from 'next/navigation';
import { eventBus } from '@/app/eventBus';
import { getFilterProps,getRouteScreenDetails } from '@/app/utils/assemblerKeys';
import { useHandleDfdRefresh } from '@/context/dfdRefreshContext';
import * as v from 'valibot';

const TextInputtest7777 = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
  const token: string = getCookie('token');
  const {globalState , setGlobalState} = useContext(TotalContext) as TotalContextProps;
  const {validateRefetch , setValidateRefetch} = useContext(TotalContext) as TotalContextProps;
  const {validate , setValidate} = useContext(TotalContext) as TotalContextProps;
  const {accessProfile, setAccessProfile} = useContext(TotalContext) as TotalContextProps;
  const {memoryVariables, setMemoryVariables} = useContext(TotalContext) as TotalContextProps;
  const {refresh, setRefresh} = useContext(TotalContext) as TotalContextProps;
  const handleDfdRefresh = useHandleDfdRefresh();
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
  const [isRequredData,setIsRequredData]=useState(false)
  const toast:any=useInfoMsg()
  const keyset:any=i18n.keyset("language"); 
  const [allCode,setAllCode]=useState<any>("");
  let schemaArray :any =[];  
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'test7777',type:"text"})
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
  const {parent0e5b8, setparent0e5b8}= useContext(TotalContext) as TotalContextProps;
  const {parent0e5b8Props, setparent0e5b8Props}= useContext(TotalContext) as TotalContextProps;
  const {form775ce, setform775ce}= useContext(TotalContext) as TotalContextProps;
  const {form775ceProps, setform775ceProps}= useContext(TotalContext) as TotalContextProps;
  const {groupfordynamicbutton143be, setgroupfordynamicbutton143be}= useContext(TotalContext) as TotalContextProps;
  const {groupfordynamicbutton143beProps, setgroupfordynamicbutton143beProps}= useContext(TotalContext) as TotalContextProps;
  const {test7777ce2cb, settest7777ce2cb}= useContext(TotalContext) as TotalContextProps;
  const {buttons60ce5, setbuttons60ce5}= useContext(TotalContext) as TotalContextProps;
  const {buttons60ce5Props, setbuttons60ce5Props}= useContext(TotalContext) as TotalContextProps;
  //////////////
  

  // Validation  
    const [error, setError] = useState<string>('');
      /// vvv
      /// vvv
      /// vvv
      /// vvv
  schemaArray = [] ;
  const handleChange = async(e: any) => {
    const newInputValue = dynamicStateandType.type=="number" ? +e.target.value : e.target.value;
    let code:any=allCode
     if (code != '') {
      let codeStates: any = {}
      codeStates['parent']  = {...parent0e5b8,test7777:newInputValue},
      codeStates['setparent'] = setparent0e5b8,
      codeStates['form']  = {...form775ce,test7777:newInputValue},
      codeStates['setform'] = setform775ce,
      codeStates['groupfordynamicbutton']  = {...groupfordynamicbutton143be,test7777:newInputValue},
      codeStates['setgroupfordynamicbutton'] = setgroupfordynamicbutton143be,
      codeStates['buttons']  = {...buttons60ce5,test7777:newInputValue},
      codeStates['setbuttons'] = setbuttons60ce5,
    codeExecution(code,codeStates)
    }  
    setError('')
    setValidate((pre:any)=>({...pre,test7777:undefined}))
    if(dynamicStateandType.type=="number"){
    setgroupfordynamicbutton143be((prev: any) => ({ ...prev, test7777: +e.target.value }))
    }
    else{
    setgroupfordynamicbutton143be((prev: any) => ({ ...prev, test7777: e.target.value }))
    }
  }
  const handleBlur=async () => {
    
  }
  const handleMapperValue=async()=>{
    try{
      const orchestrationData: any = await AxiosService.post(
        '/UF/Orchestration',
        {
          key: "CK:CT309:FNGK:AF:FNK:UF-UFW:CATK:AG001:AFGK:A001:AFK:dynamicforms:AFVK:v1",
          componentId: "97c73a889eb44a0f867bcdbb9c6143be",
          controlId: "af82fb2779994f85a845049cfe5ce2cb",
          isTable: false,
          from:"TextInputtest7777",
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
      if(orchestrationData?.data?.schemaData[0].nodeType=='apinode'){
      if(orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties){
        let type:any={name:'test7777',type:'text'}
        type={
          name:'test7777',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.test7777.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.test7777.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.test7777.type
        }
        setDynamicStateandType(type)
      }
      }else if(orchestrationData?.data?.schemaData[0].nodeType=='dbnode'){
        if(orchestrationData?.data?.schemaData[0].schema.properties){
        let type:any={name:'test7777',type:'text'}
        type={
          name:'test7777',
          type: orchestrationData?.data?.schemaData[0].schema.properties.test7777.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.properties.test7777.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.properties.test7777.type
        }
        setDynamicStateandType(type)
      }
      }
      if(Array.isArray(orchestrationData?.data?.dstData))
      {
        return
      }else{
      //  if(Object.keys(orchestrationData?.data?.dstData).length>0) 
       // setgroupfordynamicbutton143be((pre:any)=>({...pre,test7777:orchestrationData?.data?.dstData}))
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
  if (test7777ce2cb?.isHidden) {
    return <></>
  }
  return (   
    <div  
      style={{gridColumn: `7 / 9`,gridRow: `18 / 28`, gap:``, height: `100%`, overflow: 'auto'}} >
        {isRequredData && <span style={{ color: 'red' }}>*</span>}
      <TextInput
        require={isRequredData}
        className=""
        label={keyset("test7777")}
        onChange= {handleChange}
        onBlur={handleBlur}
        type={dynamicStateandType.type}
        value={groupfordynamicbutton143be?.test7777||""}
         disabled= {test7777ce2cb?.isDisabled ? true : false}
        pin='brick-brick'     
        placeholder='type here....'      
        view='normal'
        contentAlign={"left"}
        validationState={validate?.test7777 ? "invalid" : undefined}
        errorMessage={error}
      />
    </div> 
  )
}

export default TextInputtest7777
