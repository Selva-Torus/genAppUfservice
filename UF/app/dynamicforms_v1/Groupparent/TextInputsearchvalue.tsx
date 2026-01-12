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

const TextInputsearchvalue = ({checkToAdd,setCheckToAdd,refetch,setRefetch,encryptionFlagCompData}:any) => {  
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
  const [dynamicStateandType,setDynamicStateandType]=useState<any>({name:'searchvalue',type:"text"})
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
  const {searchvalue25fa2, setsearchvalue25fa2}= useContext(TotalContext) as TotalContextProps;
  const {search2b9e0, setsearch2b9e0}= useContext(TotalContext) as TotalContextProps;
  const {fff4d19f, setfff4d19f}= useContext(TotalContext) as TotalContextProps;
  const {form775ce, setform775ce}= useContext(TotalContext) as TotalContextProps;
  const {form775ceProps, setform775ceProps}= useContext(TotalContext) as TotalContextProps;
  const {child6747b, setchild6747b}= useContext(TotalContext) as TotalContextProps;
  const {child6747bProps, setchild6747bProps}= useContext(TotalContext) as TotalContextProps;
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
      codeStates['parent']  = {...parent0e5b8,searchvalue:newInputValue},
      codeStates['setparent'] = setparent0e5b8,
      codeStates['form']  = {...form775ce,searchvalue:newInputValue},
      codeStates['setform'] = setform775ce,
      codeStates['child']  = {...child6747b,searchvalue:newInputValue},
      codeStates['setchild'] = setchild6747b,
    codeExecution(code,codeStates)
    }  
    setError('')
    setValidate((pre:any)=>({...pre,searchvalue:undefined}))
    if(dynamicStateandType.type=="number"){
    setparent0e5b8((prev: any) => ({ ...prev, searchvalue: +e.target.value }))
    }
    else{
    setparent0e5b8((prev: any) => ({ ...prev, searchvalue: e.target.value }))
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
          componentId: "03e924560c144d3181733fca11c0e5b8",
          controlId: "13ba061b10c6447c97d47a2deac25fa2",
          isTable: false,
          from:"TextInputsearchvalue",
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
        let type:any={name:'searchvalue',type:'text'}
        type={
          name:'searchvalue',
          type: orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.searchvalue.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.searchvalue.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.responses["200"].content["application/json"].schema.items.properties.searchvalue.type
        }
        setDynamicStateandType(type)
      }
      }else if(orchestrationData?.data?.schemaData[0].nodeType=='dbnode'){
        if(orchestrationData?.data?.schemaData[0].schema.properties){
        let type:any={name:'searchvalue',type:'text'}
        type={
          name:'searchvalue',
          type: orchestrationData?.data?.schemaData[0].schema.properties.searchvalue.type == 'string' ? 'text' : orchestrationData?.data?.schemaData[0].schema.properties.searchvalue.type =='integer' ? 'number' : orchestrationData?.data?.schemaData[0].schema.properties.searchvalue.type
        }
        setDynamicStateandType(type)
      }
      }
      if(Array.isArray(orchestrationData?.data?.dstData))
      {
        return
      }else{
      //  if(Object.keys(orchestrationData?.data?.dstData).length>0) 
       // setparent0e5b8((pre:any)=>({...pre,searchvalue:orchestrationData?.data?.dstData}))
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
  if (searchvalue25fa2?.isHidden) {
    return <></>
  }
  return (   
    <div  
      style={{gridColumn: `2 / 11`,gridRow: `12 / 22`, gap:``, height: `100%`, overflow: 'auto'}} >
        {isRequredData && <span style={{ color: 'red' }}>*</span>}
      <TextInput
        require={isRequredData}
        className=""
        label={keyset("searchvalue")}
        onChange= {handleChange}
        onBlur={handleBlur}
        type={dynamicStateandType.type}
        value={parent0e5b8?.searchvalue||""}
         disabled= {searchvalue25fa2?.isDisabled ? true : false}
        pin='brick-brick'     
        placeholder='type here....'      
        view='normal'
        contentAlign={"left"}
        validationState={validate?.searchvalue ? "invalid" : undefined}
        errorMessage={error}
      />
    </div> 
  )
}

export default TextInputsearchvalue
